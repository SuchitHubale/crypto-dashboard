const express = require('express');
const router = express.Router();
const { processQuery } = require('../controllers/chatController');

// Public routes
router.post('/query', processQuery);

module.exports = router;