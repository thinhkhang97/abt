import { DexPair } from "../../config/types";
import { PriceData } from "../../core/types";

/**
 * Base interface for all exchange implementations
 */
export abstract class DEX {
  /**
   * Exchange name
   */
  protected name: string;

  /**
   * Price store
   */
  protected priceStore: Map<string, PriceData>;

  constructor(name: string) {
    this.name = name;
    this.priceStore = new Map();
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(pair: string): PriceData | null {
    return this.priceStore.get(pair) || null;
  }

  /**
   * Check if the exchange supports fetching prices
   */
  abstract supportFetchingPrices(): boolean;

  /**
   * Fetch current price for a trading pair
   * @param tokenAddress - Token address
   */
  abstract fetchPrice(pair: DexPair): Promise<PriceData>;

  /**
   * Fetch current price for a trading pair
   * @param pairs - Trading pairs
   */
  abstract fetchPrices(pairs: DexPair[]): Promise<PriceData[]>;
}
