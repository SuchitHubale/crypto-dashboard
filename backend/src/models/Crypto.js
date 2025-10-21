const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
    unique: true
  },
  symbol: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  currentPrice: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number
  },
  marketCapRank: {
    type: Number
  },
  totalVolume: {
    type: Number
  },
  high24h: {
    type: Number
  },
  low24h: {
    type: Number
  },
  priceChange24h: {
    type: Number
  },
  priceChangePercentage24h: {
    type: Number
  },
  circulatingSupply: {
    type: Number
  },
  totalSupply: {
    type: Number
  },
  ath: {
    type: Number
  },
  athDate: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
cryptoSchema.index({ marketCapRank: 1 });
cryptoSchema.index({ coinId: 1 });

module.exports = mongoose.model('Crypto', cryptoSchema);