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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Error fetching budget' });
  }
});

// Create budget
router.post('/', [
  auth,
  isAdmin,
  body('projectDescription').notEmpty().withMessage('Project description is required'),
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('responsibleId').notEmpty().withMessage('Responsible ID is required'),
  body('estimatedValue').isNumeric().withMessage('Estimated value must be a number'),
  body('expectedCosts').isNumeric().withMessage('Expected costs must be a number'),
  body('status').isIn(['under_review', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the responsible user exists
    const responsible = await User.findByPk(req.body.responsibleId);
    if (!responsible) {
      return res.status(400).json({ error: 'Responsible member not found' });
    }

    // Create the budget
    const budget = await Budget.create({
      ...req.body,
      createdBy: req.user.id // Assuming the user ID is available in the token
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating budget' });
  }
});

// Update budget
router.put('/:id', [
  auth,
  isAdmin,
  body('projectDescription').optional().notEmpty().withMessage('Project description cannot be empty'),
  body('clientName').optional().notEmpty().withMessage('Client name cannot be empty'),
  body('responsibleId').optional().notEmpty().withMessage('Responsible ID cannot be empty'),
  body('estimatedValue').optional().isNumeric().withMessage('Estimated value must be a number'),
  body('expectedCosts').optional().isNumeric().withMessage('Expected costs must be a number'),
  body('status').optional().isIn(['under_review', 'approved', 'rejected']).withMessage('Invalid status')
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Error deleting budget' });
  }
});

module.exports = router;