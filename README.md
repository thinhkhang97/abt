# Crypto Arbitrage System

A high-performance cryptocurrency arbitrage detection and execution system designed to identify and capitalize on price discrepancies across multiple exchanges.

## Features

- **Multi-Exchange Support**: Monitor both CEX and DEX platforms simultaneously
- **Real-Time Price Tracking**: Connect to exchange APIs and websockets for immediate price updates
- **Arbitrage Detection**: Identify profitable trading opportunities across exchanges
- **Trade Simulation**: Validate opportunities before execution
- **Notifications**: Receive alerts via Telegram when opportunities arise
- **Configurable**: Easily adjust trading pairs, exchanges, and strategy parameters
- **Parallel Processing**: Handle multiple markets simultaneously for maximum efficiency

## Requirements

- Node.js v16.x or higher
- npm v8.x or higher
- Internet connection with reasonable latency to exchanges
- Exchange API keys (for private endpoints)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crypto-arbitrage.git
cd crypto-arbitrage

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your specific settings:

   - Exchange API credentials
   - Notification service details
   - Application parameters

3. Configure trading pairs and exchanges in `config/` directory files.

## Usage

### Starting the System

```bash
# Development mode with hot reloading
npm run dev

# Production mode
npm run build
npm start
```

### System Modes

- **Monitor Only**: Detects opportunities without executing trades
- **Simulate**: Simulates trades but doesn't execute them
- **Full Execution**: Automatically executes profitable arbitrage opportunities

Set the mode in your configuration or use command-line arguments:

```bash
npm start -- --mode=monitor
npm start -- --mode=simulate
npm start -- --mode=execute
```

## Project Structure

```
arbitrage/
├── src/
│   ├── core/                  # Core functionality
│   │   ├── config/            # Configuration management
│   │   ├── types.ts           # Shared type definitions
│   │   └── utils.ts           # Common utilities
│   ├── exchanges/             # Exchange integrations
│   │   ├── cex/               # Centralized exchanges
│   │   ├── dex/               # Decentralized exchanges
│   │   └── exchange.ts        # Base exchange interface
│   ├── price/                 # Price data management
│   │   ├── fetcher.ts         # Price fetching service
│   │   ├── store.ts           # Real-time price storage
│   │   └── workers/           # Parallel fetching workers
│   ├── arbitrage/             # Arbitrage logic
│   │   ├── detector.ts        # Opportunity detection
│   │   ├── simulator.ts       # Trade simulation
│   │   └── executor.ts        # Trade execution
│   ├── notification/          # Alert system
│   │   ├── telegram.ts        # Telegram notifications
│   │   └── notifier.ts        # Notification interface
│   └── workers/               # Parallel processing
│       └── worker-pool.ts     # Worker management
├── tests/                     # Testing
└── config/                    # Configuration files
```

## Extending the System

### Adding New Exchanges

1. Create a new exchange adapter in `src/exchanges/cex/` or `src/exchanges/dex/`
2. Implement the `Exchange` interface
3. Register the exchange in the configuration

### Adding New Notification Channels

1. Create a new notification adapter in `src/notification/`
2. Implement the notification interface
3. Update the configuration to use the new channel

## Performance Considerations

- Enable only the pairs and exchanges you're actively trading
- Adjust update frequencies based on market volatility
- Consider running on a VPS with low latency to major exchanges
- Monitor system resource usage and adjust worker counts accordingly

## License

MIT

## Disclaimer

This software is for educational purposes only. Use at your own risk. Cryptocurrency trading involves significant risk. Always test thoroughly with small amounts before deploying with substantial capital.
