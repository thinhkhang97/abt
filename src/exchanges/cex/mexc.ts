import axios from "axios";
import WebSocket from "ws";
import { PriceData } from "../../core/types";
import { CEX } from "./cex";

// WebSocket endpoint from official docs
const MEXC_WS_URL = "wss://wbs.mexc.com/ws";
// const MEXC_REST_URL = "https://api.mexc.com";

export class Mexc extends CEX {
  constructor() {
    super("mexc");
  }

  async connect(): Promise<boolean> {
    if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      return true;
    }

    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(MEXC_WS_URL);

        this.ws.on("open", () => {
          this.connected = true;
          console.log("Connected to MEXC WebSocket");
          resolve(true);
        });

        this.ws.on("message", (msg: any) => {
          try {
            const message = JSON.parse(msg.toString());
            // Handle book ticker messages according to MEXC docs
            if (message.c && message.d) {
              // Extract symbol from the channel
              // Expected format: spot@public.deals.v3.api@BTCUSDT
              const channelParts = message.c.split("@");
              if (channelParts.length >= 3) {
                const symbol = channelParts[channelParts.length - 1];

                const pair = `${symbol}`;
                const callback = this.subscriptions.get(pair);
                const tickerData = message.d;
                const priceData: PriceData = {
                  exchange: this.name,
                  pair,
                  price: parseFloat(tickerData.deals[0].p) || null,
                  timestamp: Date.now(),
                };
                this.priceStore.set(pair, priceData);
                if (callback) {
                  callback(priceData);
                }
              }
            }
          } catch (error: unknown) {
            console.error("Error processing MEXC WebSocket message:", error);
          }
        });

        this.ws.on("error", (error: Error) => {
          console.error("MEXC WebSocket error:", error);
          this.connected = false;
          resolve(false);
        });

        this.ws.on("close", () => {
          console.log("MEXC WebSocket connection closed");
          this.connected = false;

          // Try to reconnect after a delay
          setTimeout(() => this.connect(), 5000);
        });
      } catch (error: unknown) {
        console.error("Failed to connect to MEXC WebSocket:", error);
        this.connected = false;
        resolve(false);
      }
    });
  }

  // async fetchPrice(base: string, quote: string): Promise<PriceData> {
  // try {
  //   const symbol = `${base}${quote}`;
  //   const response = await axios.get(
  //     `${MEXC_REST_URL}/api/v3/ticker/bookTicker`,
  //     {
  //       params: { symbol: symbol.toUpperCase() },
  //     }
  //   );
  //   return {
  //     exchange: this.name,
  //     pair: `${base}/${quote}`,
  //     price: parseFloat(response.data.bidPrice),
  //     timestamp: Date.now(),
  //   };
  // } catch (error: unknown) {
  //   console.error(
  //     `Error fetching price for ${base}/${quote} from MEXC:`,
  //     error
  //   );
  //   throw new Error(`Failed to fetch price for ${base}/${quote} from MEXC`);
  // }
  //   return {
  //     exchange: this.name,
  //     pair: `${base}/${quote}`,
  //     price: null,
  //     timestamp: Date.now(),
  //   };
  // }

  subscribeToPriceUpdates(
    base: string,
    quote: string,
    callback: (price: PriceData | null) => void
  ): void {
    if (!this.connected || !this.ws) {
      throw new Error("Not connected to MEXC WebSocket");
    }

    const symbol = `${base}${quote}`;

    // Store the callback for this trading pair
    this.subscriptions.set(symbol, callback);

    // Subscribe to book ticker updates
    // Format according to MEXC docs
    const subscribeMsg = {
      method: "SUBSCRIPTION",
      params: [`spot@public.deals.v3.api@${symbol.toUpperCase()}`],
    };

    this.ws.send(JSON.stringify(subscribeMsg));
  }

  unsubscribeFromPriceUpdates(base: string, quote: string): void {
    if (!this.connected || !this.ws) {
      return;
    }

    const symbol = `${base}${quote}`;
    const pair = `${base}/${quote}`;

    // Unsubscribe from book ticker updates
    // Format according to MEXC docs
    const unsubscribeMsg = {
      method: "UNSUBSCRIPTION",
      params: [`spot@public.deals.v3.api@${symbol.toUpperCase()}`],
    };

    this.ws.send(JSON.stringify(unsubscribeMsg));

    // Remove the callback for this trading pair
    this.subscriptions.delete(pair);
  }
}
