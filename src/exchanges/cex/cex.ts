import { PriceData } from "../../core/types";
import WebSocket from "ws";

/**
 * Base interface for all exchange implementations
 */
export abstract class CEX {
  /**
   * Exchange name
   */
  protected name: string;

  /**
   * Price store
   */
  protected priceStore: Map<string, PriceData>;

  /**
   * WebSocket connection
   */
  protected ws: WebSocket | null = null;

  /**
   * Connected
   */
  protected connected = false;

  /**
   * Subscriptions
   */
  protected subscriptions: Map<string, (price: PriceData | null) => void> =
    new Map();

  constructor(name: string) {
    this.name = name;
    this.priceStore = new Map();
  }

  public getName(): string {
    return this.name;
  }

  /**
   * Connect to the exchange
   * Returns true if connection was successful
   */
  abstract connect(): Promise<boolean>;

  /**
   * Fetch current price for a trading pair
   * @param base - Base currency (e.g., 'BTC')
   * @param quote - Quote currency (e.g., 'USDT')
   */
  // fetchPrice(base: string, quote: string): Promise<PriceData>;

  /**
   * Subscribe to real-time price updates for a trading pair
   * @param base - Base currency
   * @param quote - Quote currency
   * @param callback - Function to call when price is updated
   */
  abstract subscribeToPriceUpdates(
    base: string,
    quote: string,
    callback: (price: PriceData | null) => void
  ): void;

  /**
   * Unsubscribe from price updates for a trading pair
   * @param base - Base currency
   * @param quote - Quote currency
   */
  abstract unsubscribeFromPriceUpdates(base: string, quote: string): void;

  /**
   * Get the price for a trading pair
   * @param pair - Trading pair
   */
  getPrice(pair: string): PriceData | null {
    return this.priceStore.get(pair) || null;
  }

  /**
   * Check if the exchange supports a specific trading pair
   * @param base - Base currency
   * @param quote - Quote currency
   */
  // supportsPair(base: string, quote: string): Promise<boolean>;
}
