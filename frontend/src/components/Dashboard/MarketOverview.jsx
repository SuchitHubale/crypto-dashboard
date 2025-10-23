import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Sparkles, ArrowUpRight, ArrowDownRight, ArrowUpDown, ChevronUp, ChevronDown, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { formatPrice, formatPercentage } from '../../utils/formatters';
import toast from 'react-hot-toast';

const MarketOverview = ({ coins, onCoinSelect, selectedCoin }) => {
  const { user, setUser } = useAuth();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(null);

  // Get user favorites
  const userFavorites = user?.favorites || [];

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Filter coins based on favorites toggle
  const filteredCoins = useMemo(() => {
    if (showFavoritesOnly) {
      return coins.filter(coin => userFavorites.includes(coin.coinId));
    }
    return coins;
  }, [coins, showFavoritesOnly, userFavorites]);

  const sortedCoins = useMemo(() => {
    if (!sortConfig.key) return filteredCoins;

    const sorted = [...filteredCoins].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'change':
          aValue = a.priceChange24h;
          bValue = b.priceChange24h;
          break;
        case 'changePercent':
          aValue = a.priceChangePercentage24h;
          bValue = b.priceChangePercentage24h;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredCoins, sortConfig]);

  // Toggle favorite
  const handleToggleFavorite = async (e, coinId) => {
    e.stopPropagation(); // Prevent coin selection

    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    setLoadingFavorite(coinId);
    try {
      const isFavorite = userFavorites.includes(coinId);
      
      if (isFavorite) {
        const updatedFavorites = await authService.removeFavorite(coinId);
        setUser({ ...user, favorites: updatedFavorites });
        
      } else {
        const updatedFavorites = await authService.addFavorite(coinId);
        setUser({ ...user, favorites: updatedFavorites });
        
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update favorites');
    } finally {
      setLoadingFavorite(null);
    }
  };

  return (
    <div className="bg-[#0B0E11] rounded-lg overflow-hidden border border-gray-800 shadow-xl h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Market Overview</h3>
          </div>
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all ${
              showFavoritesOnly 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Star className={`h-3 w-3 ${showFavoritesOnly ? 'fill-yellow-400' : ''}`} />
            <span>{showFavoritesOnly ? 'All Coins' : 'Favorites'}</span>
            {userFavorites.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-gray-700 rounded-full text-[10px]">
                {userFavorites.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Column Headers - Sortable */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-900/50 border-b border-gray-800">
        {/* Favorite Icon Column */}
        <div className="col-span-1"></div>
        {/* Symbol */}
        <div 
          className="col-span-4 cursor-pointer hover:bg-gray-800/50 rounded transition-colors"
          onClick={() => handleSort('name')}
        >
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Symbol</span>
            {sortConfig.key === 'name' ? (
              sortConfig.direction === 'asc' ? 
                <ChevronUp className="h-3 w-3 text-blue-400" /> : 
                <ChevronDown className="h-3 w-3 text-blue-400" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-600" />
            )}
          </div>
        </div>
        
        {/* Last Price */}
        <div 
          className="col-span-3 text-right cursor-pointer hover:bg-gray-800/50 rounded transition-colors"
          onClick={() => handleSort('price')}
        >
          <div className="flex items-center justify-end space-x-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Last</span>
            {sortConfig.key === 'price' ? (
              sortConfig.direction === 'asc' ? 
                <ChevronUp className="h-3 w-3 text-blue-400" /> : 
                <ChevronDown className="h-3 w-3 text-blue-400" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-600" />
            )}
          </div>
        </div>
        
        {/* Change */}
        <div 
          className="col-span-2 text-right cursor-pointer hover:bg-gray-800/50 rounded transition-colors"
          onClick={() => handleSort('change')}
        >
          <div className="flex items-center justify-end space-x-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Chg</span>
            {sortConfig.key === 'change' ? (
              sortConfig.direction === 'asc' ? 
                <ChevronUp className="h-3 w-3 text-blue-400" /> : 
                <ChevronDown className="h-3 w-3 text-blue-400" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-600" />
            )}
          </div>
        </div>
        
        {/* Change % */}
        <div 
          className="col-span-2 text-right cursor-pointer hover:bg-gray-800/50 rounded transition-colors"
          onClick={() => handleSort('changePercent')}
        >
          <div className="flex items-center justify-end space-x-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Chg%</span>
            {sortConfig.key === 'changePercent' ? (
              sortConfig.direction === 'asc' ? 
                <ChevronUp className="h-3 w-3 text-blue-400" /> : 
                <ChevronDown className="h-3 w-3 text-blue-400" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* Crypto List */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {sortedCoins.map((coin) => {
          const isPositive = coin.priceChangePercentage24h > 0;
          const isSelected = selectedCoin === coin.coinId;
          
          return (
            <div
              key={coin.coinId}
              onClick={() => onCoinSelect(coin.coinId)}
              className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-800/50 transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-500/10 border-l-2 border-l-blue-500' 
                  : 'hover:bg-gray-800/30'
              }`}
            >
              {/* Favorite Star */}
              <div className="col-span-1 flex items-center justify-center">
                <button
                  onClick={(e) => handleToggleFavorite(e, coin.coinId)}
                  disabled={loadingFavorite === coin.coinId}
                  className="p-1 rounded hover:bg-gray-700/50 transition-colors group"
                >
                  {loadingFavorite === coin.coinId ? (
                    <div className="h-4 w-4 border-2 border-gray-500 border-t-yellow-400 rounded-full animate-spin"></div>
                  ) : (
                    <Star 
                      className={`h-4 w-4 transition-all ${
                        userFavorites.includes(coin.coinId)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600 group-hover:text-yellow-400'
                      }`}
                    />
                  )}
                </button>
              </div>

              {/* Symbol */}
              <div className="col-span-4 flex items-center space-x-2">
                <img 
                  src={coin.image} 
                  alt={coin.name}
                  className="h-5 w-5 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {coin.name}
                  </span>
                </div>
              </div>

              {/* Last Price */}
              <div className="col-span-3 flex items-center justify-end">
                <span className="text-xs font-semibold text-white">
                  {formatPrice(coin.currentPrice)}
                </span>
              </div>

              {/* Change */}
              <div className="col-span-2 flex items-center justify-end">
                <span className={`text-xs font-semibold ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? '+' : ''}{formatPrice(coin.priceChange24h)}
                </span>
              </div>

              {/* Change % */}
              <div className="col-span-2 flex items-center justify-end">
                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded ${
                  isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span className="text-[10px] font-bold">
                    {Math.abs(coin.priceChangePercentage24h).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with Market Status */}
      <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Market open</span>
            </div>
          </div>
          <span className="text-gray-500 text-[10px]">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;