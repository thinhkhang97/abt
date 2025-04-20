import axios from "axios";
import { PriceData } from "../../../core/types";
import { DEX } from "../dex";

export class Panora implements DEX {
  name: string;
  endPoint: string;
  apiKey: string;

  constructor() {
    this.name = "panora";
    this.endPoint = process.env.PANORA_API_ENDPOINT || "";
    this.apiKey = process.env.PANORA_API_KEY || "";
    console.log(this.endPoint, this.apiKey);
  }
  async connect(): Promise<boolean> {
    return true;
  }

  async fetchPrice(
    name: string,
    tokenAddress: string
  ): Promise<PriceData | null> {
    try {
      const response = await axios.get(this.endPoint, {
        headers: {
          "x-api-key": this.apiKey,
        },
        params: {
          tokenAddress,
        },
      });
      const price = response.data[0];
      return {
        exchange: this.name,
        pair: `${name}`,
        price: price.usdPrice,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error fetching price from panora", error);
      return null;
    }
  }
}
