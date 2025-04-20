export interface Pair {
  base: string;
  quote: string;
}

export interface DexPair extends Pair {
  tokenAddress: string;
}

export interface CexConfig {
  enabled: boolean;
  pairs: Pair[];
}

export interface DexConfig {
  enabled: boolean;
  pairs: DexPair[];
}

export interface NotificationConfig {
  enabled: boolean;
  minProfitToNotify: number;
}

export interface AppConfig {
  cex: {
    [key: string]: CexConfig;
  };
  dex: {
    [key: string]: DexConfig;
  };
  notification: {
    telegram: NotificationConfig;
  };
}
