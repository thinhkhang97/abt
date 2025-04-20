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
   * Fetch current price for a trading pair
   * @param tokenAddress - Token address
   */
  fetchPrice(name: string, tokenAddress: string): Promise<PriceData | null>;
}
