import React, { useState } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { formatPrice, formatLargeNumber, formatPercentage, getChangeColor } from '../../utils/formatters.js';

const CryptoTable = ({ coins, onCoinSelect, selectedCoin }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'marketCapRank', direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedCoins = [...coins].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Top 10 Cryptocurrencies</h2>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Live Data
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rank
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors rounded-lg"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Name</span>
                  {sortConfig.key === 'name' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors rounded-lg"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Price</span>
                  {sortConfig.key === 'currentPrice' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors rounded-lg"
                onClick={() => handleSort('priceChangePercentage24h')}
              >
                <div className="flex items-center justify-end space-x-1.5">
                  <span>24h Change</span>
                  {sortConfig.key === 'priceChangePercentage24h' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors rounded-lg"
                onClick={() => handleSort('marketCap')}
              >
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Market Cap</span>
                  {sortConfig.key === 'marketCap' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors rounded-lg"
                onClick={() => handleSort('totalVolume')}
              >
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Volume (24h)</span>
                  {sortConfig.key === 'totalVolume' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedCoins.map((coin, index) => (
              <tr 
                key={coin.coinId}
                onClick={() => onCoinSelect(coin.coinId)}
                className={`hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-50 cursor-pointer transition-all duration-200 group ${
                  selectedCoin === coin.coinId ? 'bg-gradient-to-r from-primary/10 to-purple-100 border-l-4 border-primary' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <span className={`text-sm font-bold ${
                      index < 3 ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {coin.marketCapRank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="h-10 w-10 rounded-full ring-2 ring-gray-100 group-hover:ring-primary/30 transition-all duration-200 group-hover:scale-110"
                      />
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{coin.name}</div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {formatPrice(coin.currentPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full ${
                    coin.priceChangePercentage24h > 0 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {coin.priceChangePercentage24h > 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    <span className="text-xs font-bold">
                      {formatPercentage(coin.priceChangePercentage24h)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 text-right">
                  {formatLargeNumber(coin.marketCap)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 text-right">
                  {formatLargeNumber(coin.totalVolume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;