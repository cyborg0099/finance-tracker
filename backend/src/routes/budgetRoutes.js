const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// GET /api/budgets
router.get('/', budgetController.getBudgets);

// POST /api/budgets
router.post('/', budgetController.createBudget);

// PUT /api/budgets/:id
router.put('/:id', budgetController.updateBudget);

// DELETE /api/budgets/:id
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
