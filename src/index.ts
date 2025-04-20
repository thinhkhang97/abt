import dotenv from "dotenv";
import config from "./config/default.json";
import logger from "./core/utils/logger";
import { startPriceFetching } from "./price/fetcher";

// Load environment variables
dotenv.config();

/**
 * Main application bootstrap function
 */
async function bootstrap() {
  try {
    logger.info(`Starting arbitrage system...`);

    // Start price fetching service
    await startPriceFetching();

    logger.info("Arbitrage system running successfully");

    // Handle graceful shutdown
    setupShutdownHandlers();
  } catch (error) {
    logger.error("Failed to start arbitrage system:", { error });
    process.exit(1);
  }
}

/**
 * Set up handlers for graceful shutdown
 */
function setupShutdownHandlers() {
  // Handle SIGINT (Ctrl+C)
  process.on("SIGINT", gracefulShutdown);

  // Handle SIGTERM (Termination)
  process.on("SIGTERM", gracefulShutdown);

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception:", { error });
    gracefulShutdown();
  });
}

/**
 * Perform graceful shutdown of services
 */
async function gracefulShutdown() {
  logger.info("Shutting down arbitrage system...");

  try {
    // Clean up resources and connections here
    // e.g., close database connections, websockets, etc.

    logger.info("Arbitrage system shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", { error });
    process.exit(1);
  }
}

// Start the application
bootstrap();
