const express = require('express');
const router = express.Router();
const User = require('../User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Setup nodemailer transport for sending confirmation emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your preferred email service
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

const secretKey = 'yourSecretKey'; // Use a more secure secret in a real application

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  if (!user.isActive) {
    return res.status(400).json({ message: 'Account is not activated. Please check your email for the activation link.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// Register Route
router.post('/register', async (req, res) => {
  const { username, password, name, surname, email } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = new User({ username, password, name, surname, email, isActive: false });
  await user.save();

  // Generate confirmation token
  const confirmationToken = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1d' });
  const confirmationUrl = `http://your-frontend-url/confirm/${confirmationToken}`;

  // Send confirmation email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Account Confirmation',
    text: `Please confirm your account by clicking the following link: ${confirmationUrl}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
      return res.status(500).json({ message: 'Error sending confirmation email' });
    }
    res.json({ message: 'User registered successfully. Please check your email to activate your account.' });
  });
});

// Account Confirmation Route
router.get('/confirm/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    user.isActive = true;
    await user.save();
    res.json({ message: 'Account activated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
