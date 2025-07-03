const { budgets, Budget } = require('../models/Budget');
const Joi = require('joi');

const budgetSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  amount: Joi.number().required(),
  period: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().allow(null),
  rollover: Joi.boolean(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  notifications: Joi.object({
    threshold: Joi.number().min(50).max(100),
    frequency: Joi.string().valid('daily', 'weekly', 'bi-weekly', 'monthly')
  })
});

exports.getBudgets = (req, res) => {
  res.json(budgets);
};

exports.createBudget = (req, res, next) => {
  const { error, value } = budgetSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const budget = new Budget(value);
  budgets.push(budget);
  res.status(201).json(budget);
};

exports.updateBudget = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = budgets.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Budget not found' });
  const { error, value } = budgetSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  budgets[idx] = { ...budgets[idx], ...value, id };
  res.json(budgets[idx]);
};

exports.deleteBudget = (req, res, next) => {
  const id = parseInt(req.params.id);
  const idx = budgets.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Budget not found' });
  budgets.splice(idx, 1);
  res.status(204).send();
};
