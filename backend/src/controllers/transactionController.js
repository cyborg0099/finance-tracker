const { transactions, Transaction } = require('../models/Transaction');
const Joi = require('joi');

const transactionSchema = Joi.object({
  budgetId: Joi.number().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  date: Joi.date().required(),
  description: Joi.string().allow('')
});

exports.getTransactions = (req, res) => {
  res.json(transactions);
};

exports.createTransaction = (req, res) => {
  const { error, value } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const transaction = new Transaction(value);
  transactions.push(transaction);
  res.status(201).json(transaction);
};

exports.updateTransaction = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = transactions.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });
  const { error, value } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  transactions[idx] = { ...transactions[idx], ...value, id };
  res.json(transactions[idx]);
};

exports.deleteTransaction = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = transactions.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });
  transactions.splice(idx, 1);
  res.status(204).send();
};
