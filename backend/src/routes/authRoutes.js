const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  addFavorite,
  removeFavorite
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:coinId', protect, removeFavorite);

module.exports = router;