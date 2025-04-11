const express = require('express');
const { body, validationResult } = require('express-validator');
const { Budget, User } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all budgets
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      include: [{
        model: User,
        as: 'responsible',
        attributes: ['id', 'fullName', 'email']
      }]
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

// Get budget by id
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'responsible',
        attributes: ['id', 'fullName', 'email']
      }]
    });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budget' });
  }
});

// Create budget
router.post('/', [
  auth,
  isAdmin,
  body('projectDescription').notEmpty(),
  body('clientName').notEmpty(),
  body('responsibleId').notEmpty(),
  body('estimatedValue').isNumeric(),
  body('expectedCosts').isNumeric(),
  body('status').isIn(['under_review', 'approved', 'rejected'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const responsible = await User.findByPk(req.body.responsibleId);
    if (!responsible) {
      return res.status(400).json({ error: 'Responsible member not found' });
    }

    const budget = await Budget.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error creating budget' });
  }
});

// Update budget
router.put('/:id', [
  auth,
  isAdmin,
  body('projectDescription').optional().notEmpty(),
  body('clientName').optional().notEmpty(),
  body('responsibleId').optional().notEmpty(),
  body('estimatedValue').optional().isNumeric(),
  body('expectedCosts').optional().isNumeric(),
  body('status').optional().isIn(['under_review', 'approved', 'rejected'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const budget = await Budget.findByPk(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (req.body.responsibleId) {
      const responsible = await User.findByPk(req.body.responsibleId);
      if (!responsible) {
        return res.status(400).json({ error: 'Responsible member not found' });
      }
    }

    await budget.update(req.body);
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error updating budget' });
  }
});

// Delete budget
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const budget = await Budget.findByPk(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await budget.destroy();
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting budget' });
  }
});

module.exports = router;
