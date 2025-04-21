import { PriceData } from "../../core/types";

/**
 * Base interface for all exchange implementations
 */
export interface CEX {
  /**
   * Exchange name
   */
  name: string;

  /**
   * Connect to the exchange
   * Returns true if connection was successful
   */
  connect(): Promise<boolean>;

  /**
   * Fetch current price for a trading pair
   * @param base - Base currency (e.g., 'BTC')
   * @param quote - Quote currency (e.g., 'USDT')
   */
  fetchPrice(base: string, quote: string): Promise<PriceData>;

  /**
   * Subscribe to real-time price updates for a trading pair
   * @param base - Base currency
   * @param quote - Quote currency
   * @param callback - Function to call when price is updated
   */
  subscribeToPriceUpdates(
    base: string,
    quote: string,
    callback: (price: PriceData | null) => void
  ): void;

  /**
   * Unsubscribe from price updates for a trading pair
   * @param base - Base currency
   * @param quote - Quote currency
   */
  unsubscribeFromPriceUpdates(base: string, quote: string): void;

  /**
   * Check if the exchange supports a specific trading pair
   * @param base - Base currency
   * @param quote - Quote currency
   */
  // supportsPair(base: string, quote: string): Promise<boolean>;
}
