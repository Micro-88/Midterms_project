const userModel = require('../models/userModel');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'your_secret_key'; // Change this to a secure key in production

// Validation schemas
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

// Register a new user
async function registerUser(req, res) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password, email } = req.body;
  const users = userModel.getUsers();

  // Check if user already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Add new user
  const newUser = {
    id: users.length + 1,
    username,
    password, // In production, hash the password before saving
    email,
  };
  users.push(newUser);
  userModel.saveUsers(users);
  res.status(201).json({ message: 'User registered successfully', user: newUser });
}

// Login user
async function loginUser(req, res) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password } = req.body;
  const users = userModel.getUsers();

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ message: 'Login successful', token });
}

// Get user profile (protected route)
async function getUserProfile(req, res) {
  const { user } = req; // `req.user` is set by the auth middleware
  res.json({ profile: user });
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
