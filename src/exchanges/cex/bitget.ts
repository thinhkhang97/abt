import WebSocket from "ws";
import { PriceData } from "../../core/types";
import { CEX } from "./cex";
import { isArray } from "ccxt/js/src/base/functions";
import logger from "../../core/utils/logger";

const BITGET_WS_URL = "wss://ws.bitget.com/v2/ws/public";

export interface BitgetTickerData {
  action: string;
  data: {
    instId: string;
    lastPr: string;
    open24h: string;
    high24h: string;
    low24h: string;
    change24h: string;
    bidPr: string;
    askPr: string;
    bidSz: string;
    askSz: string;
    baseVolume: string;
    quoteVolume: string;
    openUtc: string;
    changeUtc24h: string;
    ts: string;
  }[];
}

export class Bitget extends CEX {
  constructor() {
    super("bitget");
  }

  async connect(): Promise<boolean> {
    if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      return true;
    }

    return new Promise((resolve) => {
      this.ws = new WebSocket(BITGET_WS_URL);

      this.ws.on("open", () => {
        this.connected = true;
        console.log("Connected to Bitget WebSocket");
        resolve(true);
      });

      this.ws.on("message", (message) => {
        const data = JSON.parse(message.toString()) as BitgetTickerData;
        if (data.action !== "snapshot") {
          return;
        }
        for (const ticker of data.data) {
          const callback = this.subscriptions.get(ticker.instId);
          const priceData = {
            exchange: this.name,
            pair: ticker.instId,
            price: parseFloat(ticker.lastPr),
            timestamp: Date.now(),
          };
          if (priceData.price !== this.priceStore.get(ticker.instId)?.price) {
            this.priceStore.set(ticker.instId, priceData);
            if (callback) {
              callback(priceData);
            }
          }
        }
      });

      this.ws.on("error", (error) => {
        console.error("Bitget WebSocket error:", error);
        resolve(false);
      });

      this.ws.on("close", () => {
        console.log("Bitget WebSocket closed");
        resolve(false);
      });
    });
  }

  subscribeToPriceUpdates(
    base: string,
    quote: string,
    callback: (price: PriceData | null) => void
  ): void {
    if (!this.connected || !this.ws) {
      throw new Error("Not connected to Bitget WebSocket");
    }

    const symbol = `${base}${quote}`;

    // Store the callback for this trading pair
    this.subscriptions.set(symbol, callback);

    const subscribeMsg = {
      op: "subscribe",
      args: [
        {
          instType: "SPOT",
          channel: "ticker",
          instId: symbol,
        },
      ],
    };

    this.ws.send(JSON.stringify(subscribeMsg));
  }

  unsubscribeFromPriceUpdates(base: string, quote: string): void {
    if (!this.connected || !this.ws) {
      return;
    }

    const symbol = `${base}${quote}`;

    const unsubscribeMsg = {
      op: "unsubscribe",
      args: [{ instType: "SPOT", channel: "ticker", instId: symbol }],
    };

    this.ws.send(JSON.stringify(unsubscribeMsg));
  }
}
