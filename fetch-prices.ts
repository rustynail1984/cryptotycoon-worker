/**
 * Fetch crypto prices and save to prices.json
 * Used by GitHub Actions to automatically update prices
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

interface CoinloreResponse {
	id: string;
	symbol: string;
	name: string;
	nameid: string;
	rank: number;
	price_usd: string;
	percent_change_24h: string;
	percent_change_1h: string;
	percent_change_7d: string;
	market_cap_usd: string;
	volume24: string;
	volume24_native: string;
	csupply: string;
	price_btc: string;
	tsupply: string;
	msupply: string;
}

interface CoinPrice {
	symbol: string;
	name: string;
	price_usd: number;
	percent_change_24h: number | null;
	percent_change_1h: number | null;
	percent_change_7d: number | null;
	rank: number;
	market_cap_usd: number | null;
	volume_24h: number | null;
}

interface PricesResponse {
	last_updated: string;
	source: string;
	version: string;
	coins: CoinPrice[];
}

async function fetchPrices(): Promise<void> {
	// Coin IDs from coinlist.md
	const COIN_IDS = [
		90,     // BTC - Bitcoin
		80,     // ETH - Ethereum
		518,    // USDT - Tether
		2710,   // BNB - Binance Coin
		58,     // XRP - Ripple
		48543,  // SOL - Solana
		33285,  // USDC - USD Coin
		2,      // DOGE - Dogecoin
		2713,   // TRX - TRON
		257,    // ADA - Cardano
		148109, // HYPE - Hyperliquid
		2751,   // LINK - Chainlink
		2321,   // BCH - Bitcoin Cash
		44883,  // AVAX - Avalanche
		1,      // LTC - Litecoin
		134,    // ZEC - Zcash
		28,     // XMR - Monero
		45088,  // SHIB - Shiba Inu
		93841,  // PEPE - Pepe
		118,    // ETC - Ethereum Classic
		151099, // PI - Pi
		42855,  // XAUT - Tether Gold
		70485,  // KAS - Kaspa
		3,      // VTC - Vertcoin
		8,      // DASH - Dash
		32386,  // RVN - Ravencoin
	].join(',');

	const API_URL = `https://api.coinlore.net/api/ticker/?id=${COIN_IDS}`;

	try {
		console.log('📡 Fetching prices from Coinlore API...');

		const response = await fetch(API_URL, {
			headers: {
				'User-Agent': 'CryptoTycoon/1.0',
			},
		});

		if (!response.ok) {
			throw new Error(`Coinlore API error: ${response.status} ${response.statusText}`);
		}

		const data = (await response.json()) as CoinloreResponse[];

		if (!Array.isArray(data) || data.length === 0) {
			throw new Error('Invalid response from Coinlore API');
		}

		// Transform data to our format
		const coins: CoinPrice[] = data.map((coin) => ({
			symbol: coin.symbol,
			name: coin.name,
			price_usd: parseFloat(coin.price_usd) || 0,
			percent_change_24h: coin.percent_change_24h ? parseFloat(coin.percent_change_24h) : null,
			percent_change_1h: coin.percent_change_1h ? parseFloat(coin.percent_change_1h) : null,
			percent_change_7d: coin.percent_change_7d ? parseFloat(coin.percent_change_7d) : null,
			rank: coin.rank || 9999,
			market_cap_usd: coin.market_cap_usd ? parseFloat(coin.market_cap_usd) : null,
			volume_24h: coin.volume24 ? parseFloat(coin.volume24) : null,
		}));

		// Sort by rank (BTC first, etc.)
		coins.sort((a, b) => a.rank - b.rank);

		const pricesResponse: PricesResponse = {
			last_updated: new Date().toISOString(),
			source: 'coinlore',
			version: '1.0.0',
			coins,
		};

		// Write to prices.json
		const outputPath = join(process.cwd(), 'prices.json');
		writeFileSync(outputPath, JSON.stringify(pricesResponse, null, 2), 'utf-8');

		console.log(`✅ Updated ${coins.length} coin prices at ${pricesResponse.last_updated}`);
		console.log(`📝 Written to ${outputPath}`);
	} catch (error) {
		console.error('❌ Failed to fetch prices:', error);
		process.exit(1);
	}
}

// Run the script
fetchPrices();
