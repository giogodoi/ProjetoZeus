const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const budgetRoutes = require('./budgets');
const memberRoutes = require('./members');

router.use('/auth', authRoutes);
router.use('/budgets', budgetRoutes);
router.use('/members', memberRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = router;
