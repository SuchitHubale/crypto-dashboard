// Format price with proper decimals
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '$0.00';
  
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price);
};

// Format large numbers (market cap, volume)
export const formatLargeNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  
  return `$${num.toLocaleString('en-US')}`;
};

// Format percentage change
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0.00%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Get color based on value
export const getChangeColor = (value) => {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};

// Get background color for change
export const getChangeBgColor = (value) => {
  if (value > 0) return 'bg-green-100 text-green-700';
  if (value < 0) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};