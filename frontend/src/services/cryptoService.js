import api from './api';

export const cryptoService = {
  // Get top N cryptocurrencies
  getTopCoins: async (count = 10) => {
    try {
      const response = await api.get(`/crypto/top/${count}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all coins
  getAllCoins: async () => {
    try {
      const response = await api.get('/crypto/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get specific coin details
  getCoinById: async (coinId) => {
    try {
      const response = await api.get(`/crypto/${coinId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get historical price data
  getHistoricalData: async (coinId, days = 30) => {
    try {
      const response = await api.get(`/crypto/${coinId}/history?days=${days}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh crypto data
  refreshData: async () => {
    try {
      const response = await api.post('/crypto/refresh');
      return response;
    } catch (error) {
      throw error;
    }
  }
};