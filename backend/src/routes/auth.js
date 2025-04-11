const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, user: { 
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }});
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Password Reset Request
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Implement email sending functionality
    // For now, just return the token (in production, this should be sent via email)
    res.json({ message: 'Se o email inserido for válido, as instruções para recuperar seu acesso foram enviadas! :)', resetToken });
  } catch (error) {
    res.status(500).json({ error: 'Error processing password reset request' });
  }
});

// Reset Password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = password;
    await user.save();

    res.json({ message: 'Senha salva com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao acessar os dados do usuário! :(' });
  }
});

module.exports = router;
