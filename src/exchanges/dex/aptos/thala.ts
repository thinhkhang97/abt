import axios from "axios";
import { DexPair } from "../../../config/types";
import { PriceData } from "../../../core/types";
import { DEX } from "../dex";

const nameToTokenName: Record<string, string> = {
  THL: "thala-coin",
  LSD: "pontem-liquidswap",
  CELLA: "cellar-coin",
  AMI: "amity-coin",
  USDT: "tether",
};

export class Thala implements DEX {
  name: string;
  endPoint: string;

  constructor() {
    this.name = "thala";
    this.endPoint = "https://app.thala.fi/api/coin-prices";
  }

  supportFetchingPrices(): boolean {
    return true;
  }

  async fetchPrice(pair: DexPair): Promise<PriceData> {
    try {
      const response = await axios.get(
        `https://app.thala.fi/api/panora-prices?coins=${pair.tokenAddress}`
      );
      const price = response.data;
      return {
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: price.data[0],
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error fetching price from thala", error);
      return {
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: null,
        timestamp: Date.now(),
      };
    }
  }

  async fetchPrices(pairs: DexPair[]): Promise<PriceData[]> {
    try {
      const response = await axios.get(
        `https://app.thala.fi/api/panora-prices?coins=${pairs
          .map((pair) => pair.tokenAddress)
          .join(",")}`
      );
      const price = response.data;
      return pairs.map((pair, index) => ({
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: price.data[index],
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error("Error fetching price from thala", error);
      return [];
    }
  }
}
