const Crypto = require('../models/Crypto');
const HistoricalPrice = require('../models/HistoricalPrice');
const coinGeckoService = require('../services/coinGeckoService');
const cacheService = require('../services/cacheService');
const { CACHE, LIMITS } = require('../config/constants');
const logger = require('../utils/logger');

// @desc    Get top N cryptocurrencies
// @route   GET /api/crypto/top/:count
// @access  Public
exports.getTopCoins = async (req, res, next) => {
  try {
    const count = parseInt(req.params.count) || LIMITS.TOP_COINS_COUNT;

    // Check cache first
    const cacheKey = `${CACHE.KEYS.TOP_COINS}_${count}`;
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      logger.info('Returning cached top coins data');
      return res.status(200).json({
        success: true,
        cached: true,
        count: cachedData.length,
        data: cachedData
      });
    }

    // Fetch from database
    const cryptos = await Crypto.find()
      .sort({ marketCapRank: 1 })
      .limit(count);

    if (!cryptos.length) {
      return res.status(404).json({
        success: false,
        message: 'No cryptocurrency data available'
      });
    }

    // Cache the result
    cacheService.set(cacheKey, cryptos);

    res.status(200).json({
      success: true,
      cached: false,
      count: cryptos.length,
      data: cryptos
    });
  } catch (error) {
    logger.error('Error in getTopCoins:', error);
    next(error);
  }
};

// @desc    Get specific coin details
// @route   GET /api/crypto/:coinId
// @access  Public
exports.getCoinById = async (req, res, next) => {
  try {
    const { coinId } = req.params;

    // Check cache
    const cacheKey = `${CACHE.KEYS.COIN_DETAIL}${coinId}`;
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      logger.info(`Returning cached data for ${coinId}`);
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedData
      });
    }

    // Fetch from database
    const crypto = await Crypto.findOne({ coinId });

    if (!crypto) {
      return res.status(404).json({
        success: false,
        message: `Cryptocurrency ${coinId} not found`
      });
    }

    // Cache the result
    cacheService.set(cacheKey, crypto);

    res.status(200).json({
      success: true,
      cached: false,
      data: crypto
    });
  } catch (error) {
    logger.error('Error in getCoinById:', error);
    next(error);
  }
};

// @desc    Get historical price data for a coin
// @route   GET /api/crypto/:coinId/history
// @access  Public
exports.getHistoricalData = async (req, res, next) => {
  try {
    const { coinId } = req.params;
    const days = parseInt(req.query.days) || LIMITS.HISTORICAL_DAYS;

    // Check cache
    const cacheKey = `${CACHE.KEYS.HISTORICAL_DATA}${coinId}_${days}`;
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      logger.info(`Returning cached historical data for ${coinId}`);
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedData
      });
    }

    // Fetch from database
    const historical = await HistoricalPrice.findOne({ coinId });

    if (!historical) {
      return res.status(404).json({
        success: false,
        message: `Historical data for ${coinId} not found`
      });
    }

    // Get last N days
    const recentPrices = historical.prices.slice(-days);

    const result = {
      coinId: historical.coinId,
      prices: recentPrices,
      lastFetched: historical.lastFetched
    };

    // Cache the result
    cacheService.set(cacheKey, result);

    res.status(200).json({
      success: true,
      cached: false,
      data: result
    });
  } catch (error) {
    logger.error('Error in getHistoricalData:', error);
    next(error);
  }
};

// @desc    Manually refresh crypto data
// @route   POST /api/crypto/refresh
// @access  Public
exports.refreshCryptoData = async (req, res, next) => {
  try {
    logger.info('Manual refresh triggered');

    // Fetch fresh data from CoinGecko
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

    // Clear cache
    cacheService.flush();

    logger.success('Crypto data refreshed successfully');

    res.status(200).json({
      success: true,
      message: 'Cryptocurrency data refreshed successfully',
      count: coinsData.length
    });
  } catch (error) {
    logger.error('Error in refreshCryptoData:', error);
    next(error);
  }
};

// @desc    Get all coins (for search/autocomplete)
// @route   GET /api/crypto/all
// @access  Public
exports.getAllCoins = async (req, res, next) => {
  try {
    const cryptos = await Crypto.find()
      .select('coinId name symbol image currentPrice')
      .sort({ marketCapRank: 1 });

    res.status(200).json({
      success: true,
      count: cryptos.length,
      data: cryptos
    });
  } catch (error) {
    logger.error('Error in getAllCoins:', error);
    next(error);
  }
};