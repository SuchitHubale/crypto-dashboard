import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { formatDate, formatPrice, formatPercentage } from '../../utils/formatters.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendChart = ({ data, coinName, days }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const prices = data.map(item => item.price);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = ((priceChange / firstPrice) * 100);
    
    return {
      current: lastPrice,
      high: highPrice,
      low: lowPrice,
      change: priceChange,
      changePercent: priceChangePercent,
      isPositive: priceChange >= 0
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Chart Data Available</h3>
          <p className="text-sm text-gray-500">Please select a cryptocurrency to view its price trend</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => formatDate(item.date)),
    datasets: [
      {
        label: `${coinName} Price`,
        data: data.map(item => item.price),
        borderColor: stats.isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, stats.isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)');
          gradient.addColorStop(1, stats.isPositive ? 'rgba(16, 185, 129, 0)' : 'rgba(239, 68, 68, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: stats.isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 3,
        borderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        borderColor: stats.isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        borderWidth: 2,
        titleColor: 'white',
        bodyColor: 'white',
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 14,
          weight: 'normal'
        },
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `Price: ${formatPrice(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10
          },
          maxRotation: 0,
          autoSkipPadding: 20
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: false,
        position: 'right',
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
            weight: '500'
          },
          padding: 8,
          callback: function(value) {
            return formatPrice(value);
          }
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="bg-[#1E222D] rounded-lg overflow-hidden">
      {/* Chart Header with Stats */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold text-white">{coinName}</h3>
            </div>
            <p className="text-xs text-gray-400">{days} days chart</p>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
            stats.isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {stats.isPositive ? (
              <TrendingUp className={`h-3 w-3 ${
                stats.isPositive ? 'text-green-400' : 'text-red-400'
              }`} />
            ) : (
              <TrendingDown className={`h-3 w-3 ${
                stats.isPositive ? 'text-green-400' : 'text-red-400'
              }`} />
            )}
            <span className={`text-xs font-bold ${
              stats.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(stats.changePercent)}
            </span>
          </div>
        </div>
        
        {/* Price Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <p className="text-[10px] font-medium text-gray-400 mb-1">Current</p>
            <p className="text-sm font-bold text-white">{formatPrice(stats.current)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <p className="text-[10px] font-medium text-gray-400 mb-1">High</p>
            <p className="text-sm font-bold text-green-400">{formatPrice(stats.high)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <p className="text-[10px] font-medium text-gray-400 mb-1">Low</p>
            <p className="text-sm font-bold text-red-400">{formatPrice(stats.low)}</p>
          </div>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="p-4">
        <div className="h-96">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TrendChart;