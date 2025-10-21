import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react';
import { cryptoService } from '../services/cryptoService';
import CryptoTable from '../components/Dashboard/CryptoTable';
import TrendChart from '../components/Dashboard/TrendChart';
import MarketOverview from '../components/Dashboard/MarketOverview';
import ChatAssistantButton from '../components/Chat/ChatAssistantButton';
import Loader from '../components/Common/Loader';
import ErrorMessage from '../components/Common/ErrorMessage';
import { DEFAULT_COIN, CHART_DAYS_OPTIONS } from '../utils/constants';
import { formatPrice, formatLargeNumber } from '../utils/formatters';
import toast, { Toaster } from 'react-hot-toast';

const DashboardPage = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(DEFAULT_COIN);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch top coins
  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cryptoService.getTopCoins(10);
      setCoins(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async (coinId, days) => {
    try {
      setChartLoading(true);
      const response = await cryptoService.getHistoricalData(coinId, days);
      setHistoricalData(response.prices);
    } catch (err) {
      toast.error('Failed to fetch historical data');
      setHistoricalData([]);
    } finally {
      setChartLoading(false);
    }
  };

  // Handle coin selection
  const handleCoinSelect = (coinId) => {
    setSelectedCoin(coinId);
    fetchHistoricalData(coinId, selectedDays);
  };

  // Handle days change
  const handleDaysChange = (days) => {
    setSelectedDays(days);
    if (selectedCoin) {
      fetchHistoricalData(selectedCoin, days);
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await cryptoService.refreshData();
      await fetchCoins();
      if (selectedCoin) {
        await fetchHistoricalData(selectedCoin, selectedDays);
      }
      toast.success('Data refreshed successfully!');
    } catch (err) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCoins();
    fetchHistoricalData(DEFAULT_COIN, selectedDays);
  }, []);

  const selectedCoinData = coins.find(coin => coin.coinId === selectedCoin);

  // Calculate market stats
  const marketStats = useMemo(() => {
    if (coins.length === 0) return null;
    
    const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.marketCap || 0), 0);
    const totalVolume = coins.reduce((sum, coin) => sum + (coin.totalVolume || 0), 0);
    const gainers = coins.filter(coin => coin.priceChangePercentage24h > 0).length;
    const losers = coins.filter(coin => coin.priceChangePercentage24h < 0).length;
    
    return { totalMarketCap, totalVolume, gainers, losers };
  }, [coins]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131722]">
        <Loader size="lg" text="Loading cryptocurrency data..." />
      </div>
    );
  }

  if (error && coins.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#131722]">
        <ErrorMessage message={error} onRetry={fetchCoins} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131722]">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'shadow-xl',
          style: {
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {selectedCoinData?.name || 'Bitcoin'} / U.S. Dollar - $ - Bitstamp
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {selectedCoinData && formatPrice(selectedCoinData.currentPrice)}
              </span>
              <div className={`flex items-center gap-1.5 ${
                selectedCoinData?.priceChangePercentage24h > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedCoinData?.priceChangePercentage24h > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-semibold">
                  {selectedCoinData && (
                    <>
                      {selectedCoinData.priceChangePercentage24h > 0 ? '+' : ''}
                      {formatPrice(selectedCoinData.priceChange24h)} ({selectedCoinData.priceChangePercentage24h.toFixed(2)}%)
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Main Layout: Chart + Market Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-5">
          {/* Left Side - Chart Section */}
          <div className="lg:col-span-8 space-y-4">
            {/* Days Selector */}
            <div className="bg-[#1E222D] rounded-lg border border-gray-800 p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                {CHART_DAYS_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleDaysChange(option.value)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      selectedDays === option.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trend Chart */}
            {chartLoading ? (
              <div className="bg-[#1E222D] rounded-lg border border-gray-800 p-8">
                <Loader text="Loading chart data..." />
              </div>
            ) : (
              <TrendChart 
                data={historicalData}
                coinName={selectedCoinData?.name || 'Cryptocurrency'}
                days={selectedDays}
              />
            )}
          </div>

          {/* Right Side - Market Overview */}
          <div className="lg:col-span-4">
            <MarketOverview 
              coins={coins}
              onCoinSelect={handleCoinSelect}
              selectedCoin={selectedCoin}
            />
          </div>
        </div>
      </div>

      {/* Floating Chat Assistant Button */}
      <ChatAssistantButton />
    </div>
  );
};

export default DashboardPage;