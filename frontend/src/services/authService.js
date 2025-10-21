import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Backend returns: { success, message, token, user }
      if (response.success && response.token) {
        return {
          user: response.user,
          token: response.token
        };
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Register new user
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      
      // Backend returns: { success, message, token, user }
      if (response.success && response.token) {
        return {
          user: response.user,
          token: response.token
        };
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await api.get('/auth/me');
      
      // Backend returns: { success, data }
      if (response.success && response.data) {
        return {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          favorites: response.data.favorites || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Add coin to favorites
  addFavorite: async (coinId) => {
    try {
      const response = await api.post('/auth/favorites', { coinId });
      
      if (response.success) {
        return response.favorites;
      }
      
      throw new Error(response.message || 'Failed to add favorite');
    } catch (error) {
      throw new Error(error.message || 'Failed to add favorite');
    }
  },

  // Remove coin from favorites
  removeFavorite: async (coinId) => {
    try {
      const response = await api.delete(`/auth/favorites/${coinId}`);
      
      if (response.success) {
        return response.favorites;
      }
      
      throw new Error(response.message || 'Failed to remove favorite');
    } catch (error) {
      throw new Error(error.message || 'Failed to remove favorite');
    }
  }
};