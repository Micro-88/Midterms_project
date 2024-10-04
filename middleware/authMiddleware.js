const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'your_secret_key'; // Ensure this matches the one used in the controller

// Authentication Middleware
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer token"
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find the user by ID from the decoded token
    const users = userModel.getUsers();
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  });
}

// Logging Middleware
function loggingMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

module.exports = {
  authMiddleware,
  loggingMiddleware,
};
