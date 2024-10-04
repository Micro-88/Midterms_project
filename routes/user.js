const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, loggingMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(loggingMiddleware); // Apply logging middleware to all routes

// User Registration
router.post('/register', userController.registerUser);

// User Login
router.post('/login', userController.loginUser);

// Get Profile (protected route)
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
