import WebSocket from "ws";
import { PriceData } from "../../core/types";
import { CEX } from "./cex";

const WS_URL = "wss://api.gateio.ws/ws/v4/";

type ExchangeResponse = {
  time: number;
  time_ms: number;
  conn_id: string;
  trace_id: string;
  channel: string;
  event: string;
  payload: string[];
  error?: {
    code: number;
    message: string;
  };
  result: {
    status: string;
  };
  requestId: string;
};

type TickerUpdate = {
  time: number;
  time_ms: number;
  channel: string;
  event: string;
  result: {
    currency_pair: string;
    last: string;
    lowest_ask: string;
    highest_bid: string;
    change_percentage: string;
    base_volume: string;
    quote_volume: string;
    high_24h: string;
    low_24h: string;
  };
};

export class Gateio extends CEX {
  constructor() {
    super("gateio");
  }

  async connect(): Promise<boolean> {
    if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      return true;
    }

    return new Promise((resolve) => {
      this.ws = new WebSocket(WS_URL);

      this.ws.on("open", () => {
        this.connected = true;
        console.log("Connected to Gateio WebSocket");
        resolve(true);
      });

      this.ws.on("message", (message) => {
        const data = JSON.parse(message.toString()) as
          | TickerUpdate
          | ExchangeResponse;
        if (data.event === "subscribe") {
          return;
        }
        if (data.event === "unsubscribe") {
          return;
        }
        if (data.event === "update") {
          const result = data.result as TickerUpdate["result"];
          const pair = result.currency_pair.replace("_", "");
          const callback = this.subscriptions.get(pair);
          const priceData = {
            exchange: this.name,
            pair,
            price: parseFloat(result.last),
            timestamp: Date.now(),
          };
          this.priceStore.set(pair, priceData);
          if (callback) {
            callback(priceData);
          }
        }
      });

      this.ws.on("error", (error) => {
        console.error("Gateio WebSocket error:", error);
        resolve(false);
      });

      this.ws.on("close", () => {
        console.log("Gateio WebSocket closed");
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
      throw new Error("Not connected to Gateio WebSocket");
    }

    const symbol = `${base}_${quote}`;

    // Store the callback for this trading pair
    this.subscriptions.set(symbol.replace("_", ""), callback);

    const subscribeMsg = {
      time: Date.now(),
      channel: "spot.tickers",
      event: "subscribe",
      payload: [symbol],
    };

    this.ws.send(JSON.stringify(subscribeMsg));
  }

  unsubscribeFromPriceUpdates(base: string, quote: string): void {
    if (!this.connected || !this.ws) {
      return;
    }

    const symbol = `${base}_${quote}`;

    const unsubscribeMsg = {
      time: Date.now(),
      channel: "spot.trades_v2",
      event: "unsubscribe",
      payload: [symbol],
    };

    this.ws.send(JSON.stringify(unsubscribeMsg));
  }
}
