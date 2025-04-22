import config from "../config";
import { ArbitrageOpportunity, PriceData } from "../core/types";
import { cexes, dexes } from "../exchanges";

export class Detector {
  constructor(private readonly minProfitThreshold: number) {}

  detect(pair: string): ArbitrageOpportunity | null {
    const priceList: PriceData[] = [];
    for (const exchange of cexes) {
      const priceData = exchange.getPrice(pair);
      if (priceData) {
        priceList.push(priceData);
      }
    }

    for (const exchange of dexes) {
      const priceData = exchange.getPrice(pair);
      if (priceData) {
        priceList.push(priceData);
      }
    }

    console.log("🚀 ~ Detector ~ detect ~ priceList:", priceList);
    const prices = priceList.filter(
      (p) => p.price !== null && p.price !== 0 && p.price !== undefined
    );

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
