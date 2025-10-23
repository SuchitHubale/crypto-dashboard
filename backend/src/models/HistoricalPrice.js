const mongoose = require('mongoose');

const historicalPriceSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
    unique: true
  },
  prices: [{
    date: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  lastFetched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
historicalPriceSchema.index({ coinId: 1 });

module.exports = mongoose.model('HistoricalPrice', historicalPriceSchema);