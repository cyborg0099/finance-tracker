const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions
router.get('/', transactionController.getTransactions);

// POST /api/transactions
router.post('/', transactionController.createTransaction);

// PUT /api/transactions/:id
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
