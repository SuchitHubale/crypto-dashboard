module.exports = {
  // CoinGecko API
  COINGECKO: {
    BASE_URL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    API_KEY: process.env.COINGECKO_API_KEY || 'CG-K7yAVPEUpsTuHB8QeksCrJSb',
    ENDPOINTS: {
      TOP_COINS: '/coins/markets',
      COIN_DETAIL: '/coins',
      MARKET_CHART: '/coins/{id}/market_chart'
    }
  },

  // Cache settings
  CACHE: {
    TTL: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
    KEYS: {
      TOP_COINS: 'top_coins',
      COIN_DETAIL: 'coin_detail_',
      HISTORICAL_DATA: 'historical_data_'
    }
  },

  // Cron settings
  CRON: {
    SCHEDULE: process.env.CRON_SCHEDULE || '*/5 * * * *' // Every 5 minutes
  },

  // Data limits
  LIMITS: {
    TOP_COINS_COUNT: 10,
    HISTORICAL_DAYS: 30,
    MAX_COINS_FETCH: 100
  },

  // Supported cryptocurrencies for chat
  SUPPORTED_COINS: [
    { id: 'bitcoin', symbol: 'btc', name: 'bitcoin' },
    { id: 'ethereum', symbol: 'eth', name: 'ethereum' },
    { id: 'binancecoin', symbol: 'bnb', name: 'binance coin' },
    { id: 'cardano', symbol: 'ada', name: 'cardano' },
    { id: 'solana', symbol: 'sol', name: 'solana' },
    { id: 'ripple', symbol: 'xrp', name: 'ripple' },
    { id: 'polkadot', symbol: 'dot', name: 'polkadot' },
    { id: 'dogecoin', symbol: 'doge', name: 'dogecoin' },
    { id: 'avalanche-2', symbol: 'avax', name: 'avalanche' },
    { id: 'chainlink', symbol: 'link', name: 'chainlink' }
  ]
};