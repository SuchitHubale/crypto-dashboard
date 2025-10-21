import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatLargeNumber, formatPercentage, getChangeColor } from '../../utils/formatters.js';

const CoinCard = ({ coin }) => {
  if (!coin) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Select a coin from the table</p>
      </div>
    );
  }

  const isPositive = coin.priceChangePercentage24h >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src={coin.image} 
          alt={coin.name}
          className="h-16 w-16 rounded-full"
        />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{coin.name}</h3>
          <p className="text-sm text-gray-500 uppercase">{coin.symbol}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Price */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Current Price</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(coin.currentPrice)}
          </p>
        </div>

        {/* 24h Change */}
        <div>
          <p className="text-sm text-gray-500 mb-1">24h Change</p>
          <div className={`flex items-center space-x-2 ${getChangeColor(coin.priceChangePercentage24h)}`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="text-xl font-semibold">
              {formatPercentage(coin.priceChangePercentage24h)}
            </span>
            <span className="text-lg">
              ({formatPrice(coin.priceChange24h)})
            </span>
          </div>
        </div>

        {/* Market Cap */}
        <div className="flex justify-between items-center py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Market Cap</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatLargeNumber(coin.marketCap)}
          </span>
        </div>

        {/* 24h Volume */}
        <div className="flex justify-between items-center py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">24h Volume</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatLargeNumber(coin.totalVolume)}
          </span>
        </div>

        {/* Market Cap Rank */}
        <div className="flex justify-between items-center py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Market Cap Rank</span>
          <span className="text-sm font-semibold text-gray-900">
            #{coin.marketCapRank}
          </span>
        </div>

        {/* 24h High/Low */}
        {coin.high24h && coin.low24h && (
          <>
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">24h High</span>
              <span className="text-sm font-semibold text-green-600">
                {formatPrice(coin.high24h)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">24h Low</span>
              <span className="text-sm font-semibold text-red-600">
                {formatPrice(coin.low24h)}
              </span>
            </div>
          </>
        )}

        {/* All Time High */}
        {coin.ath && (
          <div className="flex justify-between items-center py-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">All Time High</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(coin.ath)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinCard;