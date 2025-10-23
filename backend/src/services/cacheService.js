const NodeCache = require('node-cache');
const { CACHE } = require('../config/constants');

// Initialize cache with TTL
const cache = new NodeCache({ 
  stdTTL: CACHE.TTL,
  checkperiod: 120 
});

class CacheService {
  // Get value from cache
  get(key) {
    return cache.get(key);
  }

  // Set value in cache
  set(key, value, ttl = CACHE.TTL) {
    return cache.set(key, value, ttl);
  }

  // Delete specific key
  del(key) {
    return cache.del(key);
  }

  // Clear all cache
  flush() {
    return cache.flushAll();
  }

  // Get cache stats
  getStats() {
    return cache.getStats();
  }

  // Check if key exists
  has(key) {
    return cache.has(key);
  }
}

module.exports = new CacheService();