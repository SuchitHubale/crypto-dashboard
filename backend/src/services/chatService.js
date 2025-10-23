const { SUPPORTED_COINS } = require('../config/constants');
const Crypto = require('../models/Crypto');
const HistoricalPrice = require('../models/HistoricalPrice');
const logger = require('../utils/logger');

class ChatService {
  // Main query processing function
  async processQuery(userQuery) {
    try {
      const query = userQuery.toLowerCase().trim();
      logger.info('Processing chat query:', query);

      // Parse the query
      const parsed = this.parseQuery(query);
      
      // Generate response based on intent
      const response = await this.generateResponse(parsed);
      
      return response;
    } catch (error) {
      logger.error('Error processing query:', error.message);
      return {
        answer: "Sorry, I couldn't understand your question. Try asking about cryptocurrency prices, trends, or top coins.",
        intent: 'UNKNOWN',
        error: true
      };
    }
  }

  // Parse user query to extract intent and parameters
  parseQuery(query) {
    // Extract coin
    const coin = this.extractCoin(query);
    
    // Determine intent
    if (this.isPriceQuery(query)) {
      return { intent: 'PRICE', coin };
    }
    
    if (this.isTrendQuery(query)) {
      const days = this.extractDays(query);
      return { intent: 'TREND', coin, days };
    }
    
    if (this.isTopCoinsQuery(query)) {
      const count = this.extractNumber(query);
      return { intent: 'TOP', count };
    }
    
    if (this.isMarketCapQuery(query)) {
      return { intent: 'MARKET_CAP', coin };
    }
    
    if (this.isVolumeQuery(query)) {
      return { intent: 'VOLUME', coin };
    }
    
    if (this.isChangeQuery(query)) {
      return { intent: 'CHANGE', coin };
    }

    return { intent: 'UNKNOWN' };
  }

  // Generate response based on parsed intent
  async generateResponse(parsed) {
    switch (parsed.intent) {
      case 'PRICE':
        return await this.handlePriceQuery(parsed.coin);
      
      case 'TREND':
        return await this.handleTrendQuery(parsed.coin, parsed.days);
      
      case 'TOP':
        return await this.handleTopCoinsQuery(parsed.count);
      
      case 'MARKET_CAP':
        return await this.handleMarketCapQuery(parsed.coin);
      
      case 'VOLUME':
        return await this.handleVolumeQuery(parsed.coin);
      
      case 'CHANGE':
        return await this.handleChangeQuery(parsed.coin);
      
      default:
        return {
          answer: "I can help you with:\n• Cryptocurrency prices (e.g., 'What is the price of Bitcoin?')\n• Price trends (e.g., 'Show me 7-day trend of Ethereum')\n• Top coins (e.g., 'Top 5 cryptocurrencies')\n• Market cap and volume information",
          intent: 'HELP'
        };
    }
  }

  // Handle price query
  async handlePriceQuery(coinId) {
    if (!coinId) {
      return { answer: "Please specify which cryptocurrency you'd like to know about.", intent: 'PRICE' };
    }

    const crypto = await Crypto.findOne({ coinId });
    
    if (!crypto) {
      return { 
        answer: `Sorry, I couldn't find data for ${coinId}. Try one of the top 10 cryptocurrencies.`,
        intent: 'PRICE'
      };
    }

    const priceFormatted = this.formatPrice(crypto.currentPrice);
    const change = crypto.priceChangePercentage24h?.toFixed(2) || 0;
    const changeSymbol = change >= 0 ? '📈' : '📉';

    return {
      answer: `The current price of ${crypto.name} (${crypto.symbol.toUpperCase()}) is ${priceFormatted}. ${changeSymbol} 24h change: ${change}%`,
      intent: 'PRICE',
      coin: coinId,
      data: {
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.currentPrice,
        change24h: crypto.priceChangePercentage24h
      }
    };
  }

  // Handle trend query
  async handleTrendQuery(coinId, days = 7) {
    if (!coinId) {
      return { answer: "Please specify which cryptocurrency trend you'd like to see.", intent: 'TREND' };
    }

    const crypto = await Crypto.findOne({ coinId });
    if (!crypto) {
      return { 
        answer: `Sorry, I couldn't find data for ${coinId}.`,
        intent: 'TREND'
      };
    }

    const historical = await HistoricalPrice.findOne({ coinId });
    
    if (!historical || !historical.prices.length) {
      return {
        answer: `Historical data for ${crypto.name} is not available yet.`,
        intent: 'TREND'
      };
    }

    // Get last N days
    const recentPrices = historical.prices.slice(-days);

    return {
      answer: `Here's the ${days}-day price trend for ${crypto.name} (${crypto.symbol.toUpperCase()})`,
      intent: 'TREND',
      coin: coinId,
      chartData: recentPrices.map(p => ({
        date: p.date,
        price: p.price
      }))
    };
  }

  // Handle top coins query
  async handleTopCoinsQuery(count = 5) {
    const topCoins = await Crypto.find()
      .sort({ marketCapRank: 1 })
      .limit(count);

    if (!topCoins.length) {
      return { answer: "No cryptocurrency data available.", intent: 'TOP' };
    }

    let answer = `Top ${count} cryptocurrencies by market cap:\n\n`;
    topCoins.forEach((coin, index) => {
      const price = this.formatPrice(coin.currentPrice);
      const change = coin.priceChangePercentage24h?.toFixed(2) || 0;
      const emoji = change >= 0 ? '📈' : '📉';
      answer += `${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) - ${price} ${emoji} ${change}%\n`;
    });

    return {
      answer,
      intent: 'TOP',
      data: topCoins.map(c => ({
        name: c.name,
        symbol: c.symbol,
        price: c.currentPrice,
        change24h: c.priceChangePercentage24h
      }))
    };
  }

  // Handle market cap query
  async handleMarketCapQuery(coinId) {
    if (!coinId) {
      return { answer: "Please specify which cryptocurrency's market cap you'd like to know.", intent: 'MARKET_CAP' };
    }

    const crypto = await Crypto.findOne({ coinId });
    if (!crypto) {
      return { answer: `Sorry, I couldn't find data for ${coinId}.`, intent: 'MARKET_CAP' };
    }

    const marketCap = this.formatLargeNumber(crypto.marketCap);

    return {
      answer: `${crypto.name} (${crypto.symbol.toUpperCase()}) has a market cap of $${marketCap}`,
      intent: 'MARKET_CAP',
      coin: coinId,
      data: { marketCap: crypto.marketCap }
    };
  }

  // Handle volume query
  async handleVolumeQuery(coinId) {
    if (!coinId) {
      return { answer: "Please specify which cryptocurrency's volume you'd like to know.", intent: 'VOLUME' };
    }

    const crypto = await Crypto.findOne({ coinId });
    if (!crypto) {
      return { answer: `Sorry, I couldn't find data for ${coinId}.`, intent: 'VOLUME' };
    }

    const volume = this.formatLargeNumber(crypto.totalVolume);

    return {
      answer: `${crypto.name} (${crypto.symbol.toUpperCase()}) has a 24h trading volume of $${volume}`,
      intent: 'VOLUME',
      coin: coinId,
      data: { volume: crypto.totalVolume }
    };
  }

  // Handle change query
  async handleChangeQuery(coinId) {
    if (!coinId) {
      return { answer: "Please specify which cryptocurrency's change you'd like to know.", intent: 'CHANGE' };
    }

    const crypto = await Crypto.findOne({ coinId });
    if (!crypto) {
      return { answer: `Sorry, I couldn't find data for ${coinId}.`, intent: 'CHANGE' };
    }

    const change = crypto.priceChangePercentage24h?.toFixed(2) || 0;
    const emoji = change >= 0 ? '📈' : '📉';

    return {
      answer: `${crypto.name} (${crypto.symbol.toUpperCase()}) is ${emoji} ${change}% in the last 24 hours`,
      intent: 'CHANGE',
      coin: coinId,
      data: { change24h: crypto.priceChangePercentage24h }
    };
  }

  // Intent detection helpers
  isPriceQuery(query) {
    return /\b(price|cost|worth|value|how much)\b/.test(query);
  }

  isTrendQuery(query) {
    return /\b(trend|chart|graph|history|historical|\d+[\s-]?day)\b/.test(query);
  }

  isTopCoinsQuery(query) {
    return /\b(top|best|leading|highest)\b/.test(query);
  }

  isMarketCapQuery(query) {
    return /\b(market cap|marketcap|cap)\b/.test(query);
  }

  isVolumeQuery(query) {
    return /\b(volume|trading volume)\b/.test(query);
  }

  isChangeQuery(query) {
    return /\b(change|performance|gain|loss|up|down)\b/.test(query) && !/\b(24h|24 hour)\b/.test(query);
  }

  // Extract coin from query
  extractCoin(query) {
    for (const coin of SUPPORTED_COINS) {
      if (query.includes(coin.name) || query.includes(coin.symbol)) {
        return coin.id;
      }
    }
    return null;
  }

  // Extract number of days from query
  extractDays(query) {
    const match = query.match(/(\d+)[\s-]?day/);
    if (match) {
      return parseInt(match[1]);
    }
    
    if (query.includes('week')) return 7;
    if (query.includes('month')) return 30;
    
    return 7; // default
  }

  // Extract generic number from query
  extractNumber(query) {
    const match = query.match(/top\s+(\d+)/i) || query.match(/(\d+)/);
    return match ? parseInt(match[1]) : 5;
  }

  // Format price
  formatPrice(price) {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  }

  // Format large numbers
  formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString('en-US');
  }
}

module.exports = new ChatService();