import axios from "axios";
import { PriceData } from "../../../core/types";
import { DEX } from "../dex";
import { DexPair } from "../../../config/types";

export class Panora extends DEX {
  endPoint: string;
  apiKey: string;

  constructor() {
    super("panora");
    this.endPoint = process.env.PANORA_API_ENDPOINT || "";
    this.apiKey = process.env.PANORA_API_KEY || "";
    console.log(this.endPoint, this.apiKey);
  }

  supportFetchingPrices(): boolean {
    return true;
  }

  async fetchPrice(pair: DexPair): Promise<PriceData> {
    try {
      const response = await axios.get(this.endPoint, {
        headers: {
          "x-api-key": this.apiKey,
        },
        params: {
          tokenAddress: pair.tokenAddress,
        },
      });
      const price = response.data[0];
      const priceData: PriceData = {
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: parseFloat(price.usdPrice) || null,
        timestamp: Date.now(),
      };
      this.priceStore.set(pair.tokenAddress, priceData);
      return priceData;
    } catch (error) {
      console.error("Error fetching price from panora", error);
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
      const response = await axios.get(this.endPoint, {
        headers: {
          "x-api-key": this.apiKey,
        },
        params: {
          tokenAddress: pairs.map((pair) => pair.tokenAddress).join(","),
        },
      });
      const prices = response.data;
      const priceData: PriceData[] = prices.map(
        (price: any, index: number) => ({
          exchange: this.name,
          pair: `${pairs[index].base}${pairs[index].quote}`,
          price: parseFloat(price.usdPrice) || null,
          timestamp: Date.now(),
        })
      );
      pairs.forEach((pair, index) => {
        this.priceStore.set(`${pair.base}${pair.quote}`, priceData[index]);
      });
      return priceData;
    } catch (error) {
      console.error("Error fetching price from panora", error);
      const priceData: PriceData[] = pairs.map((pair) => ({
        exchange: this.name,
        pair: `${pair.base}${pair.quote}`,
        price: null,
        timestamp: Date.now(),
      }));
      pairs.forEach((pair, index) => {
        this.priceStore.set(pair.tokenAddress, priceData[index]);
      });
      return priceData;
    }
  }
}
