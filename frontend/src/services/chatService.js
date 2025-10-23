import api from './api';

export const chatService = {
  // Send chat query
  sendQuery: async (query) => {
    try {
      const response = await api.post('/chat/query', { query });
      return response;
    } catch (error) {
      throw error;
    }
  }
};