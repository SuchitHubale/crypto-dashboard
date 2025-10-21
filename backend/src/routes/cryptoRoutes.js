const express = require('express');
const router = express.Router();
const {
  getTopCoins,
  getCoinById,
  getHistoricalData,
  refreshCryptoData,
  getAllCoins
} = require('../controllers/cryptoController');

// Public routes
router.get('/top/:count', getTopCoins);
router.get('/top', getTopCoins);
router.get('/all', getAllCoins);
router.get('/:coinId', getCoinById);
router.get('/:coinId/history', getHistoricalData);
router.post('/refresh', refreshCryptoData);

module.exports = router;