import { DexPair } from "../../config/types";
import { PriceData } from "../../core/types";

/**
 * Base interface for all exchange implementations
 */
export interface DEX {
  /**
   * Exchange name
   */
  name: string;

  /**
   * Check if the exchange supports fetching prices
   */
  supportFetchingPrices(): boolean;

  /**
   * Fetch current price for a trading pair
   * @param tokenAddress - Token address
   */
  fetchPrice(pair: DexPair): Promise<PriceData>;

  /**
   * Fetch current price for a trading pair
   * @param pairs - Trading pairs
   */
  fetchPrices(pairs: DexPair[]): Promise<PriceData[]>;
}
