const { users, User } = require('../models/User');
const Joi = require('joi');


const signupSchema = Joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string().min(8).required(),
  FirstName: Joi.string().required(),
  LastName: Joi.string().required(),
  ConfirmPassword: Joi.string().valid(Joi.ref('Password')).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.signup = (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  if (users.find(u => u.email === value.Email)) return res.status(409).json({ error: 'Email already registered' });
  const user = new User({
    email: value.Email,
    password: value.Password,
    firstName: value.FirstName,
    lastName: value.LastName
  });
  users.push(user);
  res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

exports.login = (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user = users.find(u => u.email === value.email && u.password === value.password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  // In production, return a JWT token
  res.json({ id: user.id, email: user.email, name: user.name, token: 'mock-token' });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  // In production, send a reset email
  res.json({ message: 'Password reset link sent (mock)' });
};
