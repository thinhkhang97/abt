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
          priceStore.updatePrice(cex.name, `${base}${quote}`, price);
          console.log(priceStore.getPrice(cex.name, `${base}${quote}`));
        });
      });
    })
  );
}

async function startFetchingPriceFromDEX(): Promise<void> {
  while (true) {
    await Promise.all(
      dexes.map(async (dex) => {
        config.dex[dex.name].pairs.forEach(async (pair) => {
          const { base, quote, tokenAddress } = pair;
          const price = await dex.fetchPrice(`${base}${quote}`, tokenAddress);
          priceStore.updatePrice(dex.name, `${base}${quote}`, price);
          console.log(priceStore.getPrice(dex.name, `${base}${quote}`));
        });
      })
    );
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
