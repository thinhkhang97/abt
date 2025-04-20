import { PriceData } from "../core/types";

class PriceStore {
  /**
   * Prices for each exchange and pair
   */
  private prices: Map<string, Map<string, PriceData | null>> = new Map();

  constructor() {
    this.prices = new Map();
  }

  updatePrice(exchange: string, pair: string, priceData: PriceData | null) {
    if (!this.prices.has(exchange)) {
      this.prices.set(exchange, new Map());
    }
    this.prices.get(exchange)?.set(pair, priceData);
  }

  getPrice(exchange: string, pair: string): PriceData | null {
    return this.prices.get(exchange)?.get(pair) || null;
  }
}

const priceStore = new PriceStore();

export default priceStore;
