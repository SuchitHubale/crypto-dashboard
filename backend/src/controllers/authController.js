const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name
    });

    // Generate token
    const token = generateToken(user._id);

    logger.success(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    logger.error('Error in register:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists (select password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    logger.success(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        favorites: user.favorites
      }
    });
  } catch (error) {
    logger.error('Error in login:', error);
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error in getMe:', error);
    next(error);
  }
};

// @desc    Add coin to favorites
// @route   POST /api/auth/favorites
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const { coinId } = req.body;

    if (!coinId) {
      return res.status(400).json({
        success: false,
        message: 'Coin ID is required'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already in favorites
    if (user.favorites.includes(coinId)) {
      return res.status(400).json({
        success: false,
        message: 'Coin already in favorites'
      });
    }

    user.favorites.push(coinId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Coin added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    logger.error('Error in addFavorite:', error);
    next(error);
  }
};

// @desc    Remove coin from favorites
// @route   DELETE /api/auth/favorites/:coinId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const { coinId } = req.params;

    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(fav => fav !== coinId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Coin removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    logger.error('Error in removeFavorite:', error);
    next(error);
  }
};