import config from "../config";
import { ArbitrageOpportunity } from "../core/types";
import notifier from "./telegram";

const telegramEnabled = config.notification.telegram.enabled;

function formatArbitrageOpportunity(opportunity: ArbitrageOpportunity) {
  return `
    ✨ ${opportunity.pair} has ${opportunity.profitPercent}% profit
    🛒 Buy on ${opportunity.buyExchange} for ${opportunity.buyCost}
    💰 Sell on ${opportunity.sellExchange} for ${opportunity.sellProfit}
  `;
}

export function notifyOpportunity(opportunity: ArbitrageOpportunity) {
  if (telegramEnabled) {
    notifier.sendMessage(formatArbitrageOpportunity(opportunity));
  }
}

export function notify(message: string) {
  if (telegramEnabled) {
    notifier.sendMessage(message);
  }
}
