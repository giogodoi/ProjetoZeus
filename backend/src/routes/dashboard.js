const express = require('express');
const { User, Budget } = require('../models');
const router = express.Router();

// Endpoint para Gestão de Funcionários
router.get('/employee-management', async (req, res) => {
  try {
    const adminCount = await User.count({ where: { role: 'admin' } });
    res.json({ adminCount });
  } catch (error) {
    console.error('Error fetching admin count:', error);
    res.status(500).json({ error: 'Error fetching admin count' });
  }
});

// Endpoint para Gestão de Projetos
router.get('/project-management', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // Mês atual
    const currentYear = new Date().getFullYear(); // Ano atual

    const budgets = await Budget.findAll({
      where: sequelize.where(
        sequelize.fn('date_part', 'month', sequelize.col('createdAt')),
        currentMonth
      ),
    });

    const totalEstimatedValue = budgets.reduce((sum, budget) => sum + parseFloat(budget.estimatedValue || 0), 0);
    const totalExpectedCosts = budgets.reduce((sum, budget) => sum + parseFloat(budget.expectedCosts || 0), 0);

    res.json({
      totalEstimatedValue,
      totalExpectedCosts,
    });
  } catch (error) {
    console.error('Error fetching project data:', error);
    res.status(500).json({ error: 'Error fetching project data' });
  }
});

module.exports = router;