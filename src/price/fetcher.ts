import detector from "../arbitrage/detector";
import config from "../config";
import logger from "../core/utils/logger";
import cexes from "../exchanges/cex";
import dexes from "../exchanges/dex";
import priceStore from "./store";

/**
 * Start the price fetching service
 */
export async function startPriceFetching(): Promise<void> {
  logger.info("Starting price fetching service");

  await startFetchingPriceFromCEX();
  await startFetchingPriceFromDEX();

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
          const opportunities = detector.detect(`${base}${quote}`);
          if (opportunities) {
            console.log(`${base}${quote} has ${opportunities}% profit`);
          }
        });
      });
    })
  );
}

async function startFetchingPriceFromDEX(): Promise<void> {
  while (true) {
    await Promise.all(
      dexes.map(async (dex) => {
        const pairs = config.dex[dex.name].pairs;
        const prices = await dex.fetchPrices(pairs);
        prices.forEach((price) => {
          priceStore.updatePrice(price.pair, dex.name, price);
          const opportunities = detector.detect(price.pair);
          if (opportunities) {
            console.log(`${price.pair} has ${opportunities}% profit`);
          }
        });
      })
    );
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
