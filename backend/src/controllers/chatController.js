const chatService = require('../services/chatService');
const logger = require('../utils/logger');

// @desc    Process chat query
// @route   POST /api/chat/query
// @access  Public
exports.processQuery = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    logger.info(`Processing chat query: ${query}`);

    // Process the query
    const response = await chatService.processQuery(query);

    res.status(200).json({
      success: true,
      query: query,
      response: response
    });
  } catch (error) {
    logger.error('Error in processQuery:', error);
    next(error);
  }
};