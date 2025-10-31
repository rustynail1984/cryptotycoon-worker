# CryptoTycoon Price Worker

[![Fetch Crypto Prices](https://github.com/rustynail1984/cryptotycoon-worker/actions/workflows/fetch-prices.yml/badge.svg)](https://github.com/rustynail1984/cryptotycoon-worker/actions/workflows/fetch-prices.yml)

Automated cryptocurrency price fetcher that runs every 5 minutes via GitHub Actions.

## Overview

This repository automatically fetches current prices for 26 cryptocurrencies from the Coinlore API and stores them in `prices.json`. The data is used by [CryptoTycoon](https://github.com/rustynail1984/cryptotycoon).

## Supported Coins

BTC, ETH, USDT, BNB, XRP, SOL, USDC, DOGE, TRX, ADA, HYPE, LINK, BCH, AVAX, LTC, ZEC, XMR, SHIB, PEPE, ETC, PI, XAUT, KAS, VTC, DASH, RVN

## Usage

Current prices can be fetched via the `prices.json` file:

```
[https://raw.githubusercontent.com/rustynail1984/cryptotycoon/main/prices.json](https://raw.githubusercontent.com/rustynail1984/cryptotycoon-worker/refs/heads/main/prices.json)
```

### Data Structure

```json
{
  "last_updated": "2025-10-31T16:36:28.443Z",
  "source": "coinlore",
  "version": "1.0.0",
  "coins": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "price_usd": 110085.79,
      "percent_change_24h": 1.86,
      "percent_change_1h": -0.38,
      "percent_change_7d": -0.83,
      "rank": 1,
      "market_cap_usd": 2195367529221.2,
      "volume_24h": 56018673515.08288
    }
  ]
}
```

## Manual Execution

```bash
yarn install
yarn fetch-prices
```

## GitHub Actions

The workflow runs automatically every 5 minutes and can also be triggered manually via the Actions page.

## Technology

- Node.js 22.18
- TypeScript
- GitHub Actions
- Coinlore API
