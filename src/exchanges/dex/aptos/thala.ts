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

export class Thala extends DEX {
  endPoint: string;

  constructor() {
    super("thala");
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
      const priceData: PriceData = {
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: parseFloat(price.data[0]) || null,
        timestamp: Date.now(),
      };
      this.priceStore.set(pair.tokenAddress, priceData);
      return priceData;
    } catch (error) {
      console.error("Error fetching price from thala", error);
      const priceData: PriceData = {
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: null,
        timestamp: Date.now(),
      };
      this.priceStore.set(pair.tokenAddress, priceData);
      return priceData;
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
      const priceData: PriceData[] = pairs.map((pair, index) => ({
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: parseFloat(price.data[index]) || null,
        timestamp: Date.now(),
      }));
      pairs.forEach((pair, index) => {
        this.priceStore.set(`${pair.base}${pair.quote}`, priceData[index]);
      });
      return priceData;
    } catch (error) {
      console.error("Error fetching price from thala", error);
      const priceData: PriceData[] = pairs.map((pair) => ({
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: null,
        timestamp: Date.now(),
      }));
      return priceData;
    }
  }
}
