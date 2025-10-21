const axios = require('axios');
const { COINGECKO, LIMITS } = require('../config/constants');
const logger = require('../utils/logger');

class CoinGeckoService {
  constructor() {
    this.baseURL = COINGECKO.BASE_URL;
    this.apiKey = COINGECKO.API_KEY;
    
    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: this.apiKey ? {
        'x-cg-demo-api-key': this.apiKey
      } : {}
    });
  }

  // Fetch top N cryptocurrencies
  async getTopCoins(limit = LIMITS.TOP_COINS_COUNT) {
    try {
      const response = await this.client.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });

      logger.info(`Fetched ${response.data.length} coins from CoinGecko`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching top coins:', error.message);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  // Fetch specific coin details
  async getCoinDetails(coinId) {
    try {
      const response = await this.client.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false
        }
      });

      logger.info(`Fetched details for ${coinId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching coin details for ${coinId}:`, error.message);
      throw new Error(`Failed to fetch details for ${coinId}`);
    }
  }

  // Fetch historical market data
  async getMarketChart(coinId, days = LIMITS.HISTORICAL_DAYS) {
    try {
      const response = await this.client.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'daily'
        }
      });

      // Transform data to simpler format
      const prices = response.data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp),
        price: price
      }));

      logger.info(`Fetched ${prices.length} historical data points for ${coinId}`);
      return prices;
    } catch (error) {
      logger.error(`Error fetching market chart for ${coinId}:`, error.message);
      throw new Error(`Failed to fetch historical data for ${coinId}`);
    }
  }

  // Search coins by query
  async searchCoins(query) {
    try {
      const response = await this.client.get('/search', {
        params: { query }
      });

      return response.data.coins;
    } catch (error) {
      logger.error('Error searching coins:', error.message);
      throw new Error('Failed to search coins');
    }
  }
}

module.exports = new CoinGeckoService();