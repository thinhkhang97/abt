import { PriceData } from "../core/types";

export type PriceMap = Map<string, Map<string, PriceData | null>>;

export class PriceStore {
  /**
   * Prices for each exchange and pair
   */
  private prices: PriceMap = new Map();

  constructor() {
    this.prices = new Map();
  }

  updatePrice(pair: string, exchange: string, priceData: PriceData | null) {
    if (!this.prices.has(pair)) {
      this.prices.set(pair, new Map());
    }
    this.prices.get(pair)?.set(exchange, priceData);
  }

  getPrices(pair: string): PriceData[] {
    return Array.from(this.prices.get(pair)?.values() || []).filter(
      (price) => price !== null
    ) as PriceData[];
  }
}

const priceStore = new PriceStore();

export default priceStore;
