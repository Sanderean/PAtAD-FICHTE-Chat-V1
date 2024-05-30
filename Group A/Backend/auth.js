const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Validate username and password
  // Authenticate user
  // Generate JWT token
  const token = jwt.sign({ username }, 'secretKey');
  res.json({ token });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  // Validate username and password
  // Create new user
  const user = new User({ username, password });
  await user.save();
  res.json({ message: 'User registered successfully' });
});

module.exports = router;
