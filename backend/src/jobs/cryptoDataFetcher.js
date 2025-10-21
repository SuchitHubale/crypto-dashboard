const cron = require('node-cron');
const Crypto = require('../models/Crypto');
const HistoricalPrice = require('../models/HistoricalPrice');
const coinGeckoService = require('../services/coinGeckoService');
const cacheService = require('../services/cacheService');
const { CRON, LIMITS } = require('../config/constants');
const logger = require('../utils/logger');

// Fetch and update cryptocurrency data
async function fetchAndUpdateCryptoData() {
  try {
    logger.info('🔄 Starting scheduled crypto data fetch...');

    // Fetch top coins from CoinGecko
    const coinsData = await coinGeckoService.getTopCoins(LIMITS.TOP_COINS_COUNT);

    // Update database
    for (const coinData of coinsData) {
      await Crypto.findOneAndUpdate(
        { coinId: coinData.id },
        {
          coinId: coinData.id,
          symbol: coinData.symbol,
          name: coinData.name,
          image: coinData.image,
          currentPrice: coinData.current_price,
          marketCap: coinData.market_cap,
          marketCapRank: coinData.market_cap_rank,
          totalVolume: coinData.total_volume,
          high24h: coinData.high_24h,
          low24h: coinData.low_24h,
          priceChange24h: coinData.price_change_24h,
          priceChangePercentage24h: coinData.price_change_percentage_24h,
          circulatingSupply: coinData.circulating_supply,
          totalSupply: coinData.total_supply,
          ath: coinData.ath,
          athDate: coinData.ath_date,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    }

    // Clear cache to force fresh data on next request
    cacheService.flush();

    logger.success(`✅ Updated ${coinsData.length} cryptocurrencies`);
  } catch (error) {
    logger.error('❌ Error fetching crypto data:', error.message);
  }
}

// Fetch and update historical price data (runs once daily)
async function fetchAndUpdateHistoricalData() {
  try {
    logger.info('📊 Starting historical data fetch...');

    // Get all tracked coins
    const coins = await Crypto.find().select('coinId');

    for (const coin of coins) {
      try {
        // Fetch historical data
        const prices = await coinGeckoService.getMarketChart(
          coin.coinId,
          LIMITS.HISTORICAL_DAYS
        );

        // Update or create historical data
        await HistoricalPrice.findOneAndUpdate(
          { coinId: coin.coinId },
          {
            coinId: coin.coinId,
            prices: prices,
            lastFetched: new Date()
          },
          { upsert: true, new: true }
        );

        logger.info(`Updated historical data for ${coin.coinId}`);

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.error(`Error fetching historical data for ${coin.coinId}:`, error.message);
      }
    }

    logger.success('✅ Historical data update completed');
  } catch (error) {
    logger.error('❌ Error in historical data fetch:', error.message);
  }
}

// Start cron jobs
function startCronJobs() {
  // Fetch crypto data every 5 minutes (or as per config)
  cron.schedule(CRON.SCHEDULE, () => {
    logger.info('⏰ Cron job triggered: Fetching crypto data');
    fetchAndUpdateCryptoData();
  });

  // Fetch historical data once daily at 2 AM
  cron.schedule('0 2 * * *', () => {
    logger.info('⏰ Cron job triggered: Fetching historical data');
    fetchAndUpdateHistoricalData();
  });

  // Initial fetch on startup
  logger.info('🚀 Running initial data fetch...');
  fetchAndUpdateCryptoData();
  
  // Fetch historical data on startup (with delay)
  setTimeout(() => {
    fetchAndUpdateHistoricalData();
  }, 5000);

  logger.success('✅ Cron jobs started successfully');
}

module.exports = { startCronJobs, fetchAndUpdateCryptoData, fetchAndUpdateHistoricalData };