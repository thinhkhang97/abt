import detector from "../arbitrage/detector";
import config from "../config";
import logger from "../core/utils/logger";
import cexes from "../exchanges/cex";
import dexes from "../exchanges/dex";
import { notifyOpportunity } from "../notification/notifier";

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
  Promise.allSettled(
    cexes.map(async (cex) => {
      await cex.connect();
      config.cex[cex.getName()].pairs.forEach(async (pair) => {
        const { base, quote } = pair;
        cex.subscribeToPriceUpdates(base, quote, () => {
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
  ).catch((error) => {
    logger.error("Error fetching price from CEX", error);
  });
}

async function startFetchingPriceFromDEX(): Promise<void> {
  while (true) {
    try {
      await Promise.all(
        dexes.map(async (dex) => {
          const pairs = config.dex[dex.getName()].pairs;
          const prices = await dex.fetchPrices(pairs);
          prices.forEach((price) => {
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
