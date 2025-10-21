export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Crypto Dashboard';

export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const DEFAULT_COIN = 'bitcoin';

export const CHART_DAYS_OPTIONS = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '30 Days', value: 30 }
];

export const SAMPLE_QUERIES = [
  'What is the price of Bitcoin?',
  'Show me 7-day trend of Ethereum',
  'Top 5 cryptocurrencies',
  'Market cap of Bitcoin',
  'Volume of Ethereum'
];