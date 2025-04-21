import config from "../config";
import { ArbitrageOpportunity, PriceData } from "../core/types";
import priceStore from "../price/store";

export class Detector {
  constructor(private readonly minProfitThreshold: number) {}

  detect(pair: string): ArbitrageOpportunity | null {
    const priceData = priceStore.getPrices(pair);
    console.log("🚀 ~ Detector ~ detect ~ priceData:", priceData);
    const prices = priceData.filter((p) => p.price !== null);

    if (prices.length < 2) {
      return null;
    }

    let highestPriceIndex = 0;
    let lowestPriceIndex = 0;

    for (let i = 0; i < prices.length; i++) {
      if (prices[i].price! > prices[highestPriceIndex].price!) {
        highestPriceIndex = i;
      }
      if (prices[i].price! < prices[lowestPriceIndex].price!) {
        lowestPriceIndex = i;
      }
    }

    const highestPrice = prices[highestPriceIndex];
    const lowestPrice = prices[lowestPriceIndex];
    const profit =
      ((highestPrice.price! - lowestPrice.price!) / lowestPrice.price!) * 100;

    if (profit < this.minProfitThreshold) {
      return null;
    }

    return {
      pair,
      profitPercent: profit,
      buyExchange: lowestPrice.exchange,
      sellExchange: highestPrice.exchange,
      buyCost: lowestPrice.price!,
      sellProfit: highestPrice.price!,
      details: {
        buyPrice: lowestPrice.price!,
        sellPrice: highestPrice.price!,
      },
      timestamp: Date.now(),
    };
  }
}

const detector = new Detector(config.notification.telegram.minProfitToNotify);

export default detector;
