import detector from "../arbitrage/detector";
import config from "../config";
import logger from "../core/utils/logger";
import cexes from "../exchanges/cex";
import dexes from "../exchanges/dex";
import { notifyOpportunity } from "../notification/notifier";
import priceStore from "./store";

/**
 * Start the price fetching service
 */
export async function startPriceFetching(): Promise<void> {
  logger.info("Starting price fetching service");

  startFetchingPriceFromCEX();
  startFetchingPriceFromDEX();

  logger.info("Price fetching service started");
}

async function startFetchingPriceFromCEX(): Promise<void> {
  await Promise.all(
    cexes.map(async (cex) => {
      await cex.connect();
      config.cex[cex.name].pairs.forEach(async (pair) => {
        const { base, quote } = pair;
        cex.subscribeToPriceUpdates(base, quote, (price) => {
          priceStore.updatePrice(`${base}${quote}`, cex.name, price);
          const opportunity = detector.detect(`${base}${quote}`);
          if (opportunity) {
            console.log(
              `${base}${quote} has ${JSON.stringify(opportunity)}% profit`
            );
            notifyOpportunity(opportunity);
          }
        });
      });
    })
  );
}

async function startFetchingPriceFromDEX(): Promise<void> {
  while (true) {
    try {
      await Promise.all(
        dexes.map(async (dex) => {
          const pairs = config.dex[dex.name].pairs;
          if (!dex.supportFetchingPrices()) {
            for (const pair of pairs) {
              const price = await dex.fetchPrice(pair);
              priceStore.updatePrice(price.pair, dex.name, price);
            }
            return;
          }
          const prices = await dex.fetchPrices(pairs);
          prices.forEach((price) => {
            priceStore.updatePrice(price.pair, dex.name, price);
            const opportunity = detector.detect(price.pair);
            if (opportunity) {
              console.log(
                `${price.pair} has ${JSON.stringify(opportunity)}% profit`
              );
              notifyOpportunity(opportunity);
            }
          });
        })
      );
    } catch (error) {
      logger.error("Error fetching price from DEX", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
