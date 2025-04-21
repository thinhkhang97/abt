/**
 * Configuration for a trading pair
 */
// export interface PairConfig {
//   base: string; // e.g., 'BTC'
//   quote: string; // e.g., 'USDT'
//   minProfitPercent: number;
//   enabled: boolean;
//   tradeAmount?: number;
// }

/**
 * Configuration for an exchange
 */
export interface ExchangeConfig {
  name: string;
  type: "cex" | "dex";
  enabled: boolean;
  useWebSocket?: boolean;
  apiKey?: string;
  fees?: {
    taker?: number;
    maker?: number;
    swap?: number;
  };
}

/**
 * Real-time price data from an exchange
 */
export interface PriceData {
  exchange: string;
  pair: string;
  price: number | null; // price per unit of base currency
  timestamp: number;
}

/**
 * Detected arbitrage opportunity
 */
export interface ArbitrageOpportunity {
  buyExchange: string;
  sellExchange: string;
  pair: string;
  profitPercent: number;
  timestamp: number;
  buyCost: number;
  sellProfit: number;
  details: {
    buyPrice: number;
    sellPrice: number;
  };
}

/**
 * Simulation result for an arbitrage opportunity
 */
export interface SimulationResult {
  opportunity: ArbitrageOpportunity;
  success: boolean;
  netProfit: number;
  fees: {
    buy: number;
    sell: number;
    transfer?: number;
  };
  warnings: string[];
  errors: string[];
}

/**
 * System execution mode
 */
// export type ExecutionMode = "monitor" | "simulate" | "execute";

/**
 * Worker task status
 */
// export enum TaskStatus {
//   PENDING = "pending",
//   RUNNING = "running",
//   COMPLETED = "completed",
//   FAILED = "failed",
// }

/**
 * Worker task interface
 */
// export interface Task<T> {
//   id: string;
//   status: TaskStatus;
//   type: string;
//   data: any;
//   result?: T;
//   error?: Error;
//   startTime?: number;
//   endTime?: number;
// }
