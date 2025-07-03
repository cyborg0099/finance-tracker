import { useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Plus, Settings, Bell, TrendingUp, TrendingDown, Wallet, Home, Utensils,
  Car, HeartPulse, Plane, ShoppingBag, GraduationCap, PiggyBank, DollarSign,
  CreditCard, Zap, Calendar, Repeat, AlertCircle, ChevronDown, MoreHorizontal,
  Download, Filter, Search, Edit, Trash2, ArrowUpDown
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#D0ED57'];

export default function BudgetPage({ darkMode }) {
  // State for budgets
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    name: '',
    category: 'Essential',
    subCategory: 'Housing',
    amount: '',
    period: 'monthly',
    startDate: new Date(),
    endDate: null,
    rollover: false,
    priority: 'medium',
    notifications: {
      threshold: 80,
      frequency: 'weekly'
    },
    spent: 0 // Ensure spent is always sent for backend compatibility
  });

  // State for UI
  const [activeTab, setActiveTab] = useState('current');
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [timeRange, setTimeRange] = useState('3M');

  // Fetch budgets from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/budgets`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setBudgets(data))
      .catch(() => setBudgets([]));
  }, []);

  // Calculate budget metrics
  const calculateBudgetMetrics = () => {
    return budgets.reduce((acc, budget) => {
      const allocated = Number(budget.allocated ?? budget.amount ?? 0);
      const spent = Number(budget.spent ?? 0);
      acc.totalAllocated += allocated;
      acc.totalSpent += spent;
      acc.remaining += Math.max(0, allocated - spent);
      acc.overspent += Math.max(0, spent - allocated);
      return acc;
    }, { totalAllocated: 0, totalSpent: 0, remaining: 0, overspent: 0 });
  };

  const metrics = calculateBudgetMetrics();

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBudget(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date, field) => {
    setNewBudget(prev => ({ ...prev, [field]: date }));
  };

  // Submit budget
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        // Update existing budget
        const updatedBudget = { ...newBudget };
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/budgets/${budgets[editIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(updatedBudget)
        });
        if (res.ok) {
          const updated = [...budgets];
          updated[editIndex] = await res.json();
          setBudgets(updated);
        }
      } else {
        // Add new budget
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/budgets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(newBudget)
        });
        if (res.ok) {
          const created = await res.json();
          setBudgets([...budgets, created]);
        }
      }
      resetForm();
    } catch (err) {
      // handle error
    }
  };

  const resetForm = () => {
    setNewBudget({
      name: '',
      category: 'Essential',
      subCategory: 'Housing',
      amount: '',
      period: 'monthly',
      startDate: new Date(),
      endDate: null,
      rollover: false,
      priority: 'medium',
      notifications: { threshold: 80, frequency: 'weekly' }
    });
    setEditIndex(null);
    setShowForm(false);
  };

  // Budget categories
  const budgetCategories = {
    Essential: ['Housing', 'Utilities', 'Groceries', 'Transportation', 'Healthcare', 'Debt'],
    Lifestyle: ['Dining', 'Entertainment', 'Travel', 'Hobbies', 'Personal Care'],
    Future: ['Savings', 'Investments', 'Retirement', 'Education'],
    Irregular: ['Gifts', 'Home Maintenance', 'Car Maintenance', 'Medical']
  };

  return (
    <div className={`budget-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">Budget Planner</h1>
            <p className="text-muted mb-0">Plan, track, and optimize your finances</p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className={`btn ${darkMode ? 'btn-light-gradient' : 'btn-primary'} d-flex align-items-center`}
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} className="me-2" />
              Create Budget
            </button>
            <div className="dropdown">
              <button className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'} d-flex align-items-center`}>
                <Download size={18} className="me-2" />
                Export
                <ChevronDown size={16} className="ms-2" />
              </button>
              <ul className={`dropdown-menu ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                <li><button className="dropdown-item">PDF Report</button></li>
                <li><button className="dropdown-item">CSV Data</button></li>
                <li><button className="dropdown-item">Excel</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Budget Creation Modal */}
        {showForm && (
          <div className={`modal-backdrop ${darkMode ? 'dark' : 'light'}`}>
            <div className={`modal-content ${darkMode ? 'bg-dark' : 'bg-white'} shadow-lg animate__animated animate__fadeInUp`}>
              <div className="modal-header">
                <h5 className="modal-title">{editIndex !== null ? 'Edit Budget' : 'Create New Budget'}</h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Budget Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newBudget.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category Type</label>
                      <select
                        className="form-select"
                        name="category"
                        value={newBudget.category}
                        onChange={handleChange}
                        required
                      >
                        {Object.keys(budgetCategories).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Subcategory</label>
                      <select
                        className="form-select"
                        name="subCategory"
                        value={newBudget.subCategory}
                        onChange={handleChange}
                        required
                      >
                        {budgetCategories[newBudget.category].map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          name="amount"
                          value={newBudget.amount}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Budget Period</label>
                      <select
                        className="form-select"
                        name="period"
                        value={newBudget.period}
                        onChange={handleChange}
                        required
                      >
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Start Date</label>
                      <DatePicker
                        selected={newBudget.startDate}
                        onChange={(date) => handleDateChange(date, 'startDate')}
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">End Date (optional)</label>
                      <DatePicker
                        selected={newBudget.endDate}
                        onChange={(date) => handleDateChange(date, 'endDate')}
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        isClearable
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        name="priority"
                        value={newBudget.priority}
                        onChange={handleChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check form-switch pt-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="rollover"
                          checked={newBudget.rollover}
                          onChange={handleChange}
                          id="rolloverSwitch"
                        />
                        <label className="form-check-label" htmlFor="rolloverSwitch">
                          Allow Rollover
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check form-switch pt-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={true}
                          onChange={() => {}}
                          id="notificationsSwitch"
                        />
                        <label className="form-check-label" htmlFor="notificationsSwitch">
                          Enable Notifications
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Alert Threshold (%)</label>
                      <input
                        type="range"
                        className="form-range"
                        min="50"
                        max="100"
                        step="5"
                        name="notifications.threshold"
                        value={newBudget.notifications.threshold}
                        onChange={(e) => setNewBudget({
                          ...newBudget,
                          notifications: {
                            ...newBudget.notifications,
                            threshold: e.target.value
                          }
                        })}
                      />
                      <div className="text-center">{newBudget.notifications.threshold}%</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Notification Frequency</label>
                      <select
                        className="form-select"
                        name="notifications.frequency"
                        value={newBudget.notifications.frequency}
                        onChange={(e) => setNewBudget({
                          ...newBudget,
                          notifications: {
                            ...newBudget.notifications,
                            frequency: e.target.value
                          }
                        })}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer mt-4">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editIndex !== null ? 'Update Budget' : 'Create Budget'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-uppercase text-muted mb-2">Total Budget</h6>
                    <h3 className="mb-0">${metrics.totalAllocated.toLocaleString()}</h3>
                    <p className="text-muted mb-0">Allocated</p>
                  </div>
                  <div className={`icon-shape rounded p-3 ${darkMode ? 'bg-dark-light' : 'bg-light'}`}>
                    <Wallet size={20} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-uppercase text-muted mb-2">Amount Spent</h6>
                    <h3 className="mb-0">${metrics.totalSpent.toLocaleString()}</h3>
                    <p className="text-muted mb-0">{(metrics.totalSpent / metrics.totalAllocated * 100).toFixed(1)}% of budget</p>
                  </div>
                  <div className={`icon-shape rounded p-3 ${darkMode ? 'bg-dark-light' : 'bg-light'}`}>
                    <CreditCard size={20} className="text-danger" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-uppercase text-muted mb-2">Remaining</h6>
                    <h3 className="mb-0 text-success">${metrics.remaining.toLocaleString()}</h3>
                    <p className="text-muted mb-0">Available</p>
                  </div>
                  <div className={`icon-shape rounded p-3 ${darkMode ? 'bg-dark-light' : 'bg-light'}`}>
                    <PiggyBank size={20} className="text-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-uppercase text-muted mb-2">Overspent</h6>
                    <h3 className="mb-0 text-danger">${metrics.overspent.toLocaleString()}</h3>
                    <p className="text-muted mb-0">Over budget</p>
                  </div>
                  <div className={`icon-shape rounded p-3 ${darkMode ? 'bg-dark-light' : 'bg-light'}`}>
                    <AlertCircle size={20} className="text-danger" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range and Filter Controls */}
        <div className="d-flex justify-content-between mb-4">
          <ul className="nav nav-tabs">
            {['current', 'upcoming', 'past', 'all'].map(tab => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ width: '250px' }}>
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search budgets..."
              />
            </div>
            <select
              className={`form-select ${darkMode ? 'bg-dark text-light' : ''}`}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="row g-4">
          {/* Left Column - Budget List */}
          <div className="col-lg-8">
            <div className={`card border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                          <div className="d-flex align-items-center">
                            Budget Name
                            <ArrowUpDown size={14} className="ms-2" />
                          </div>
                        </th>
                        <th>Category</th>
                        <th>Allocated</th>
                        <th>Spent</th>
                        <th>Progress</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgets.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">No budgets found. Create your first budget!</div>
                            <button 
                              className="btn btn-primary mt-3"
                              onClick={() => setShowForm(true)}
                            >
                              <Plus size={16} className="me-2" />
                              Create Budget
                            </button>
                          </td>
                        </tr>
                      ) : (
                        budgets.map((budget, index) => {
                          const allocated = Number(budget.allocated ?? budget.amount ?? 0);
                          const spent = Number(budget.spent ?? 0);
                          const progress = allocated > 0 ? (spent / allocated) * 100 : 0;
                          const remaining = allocated - spent;
                          return (
                            <tr key={budget.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {budget.priority === 'high' && <Zap size={16} className="text-warning me-2" />}
                                  {budget.priority === 'critical' && <AlertCircle size={16} className="text-danger me-2" />}
                                  {budget.name}
                                </div>
                                <small className="text-muted">
                                  {budget.period} • {budget.startDate ? new Date(budget.startDate).toLocaleDateString() : ''}
                                  {budget.endDate ? ` - ${new Date(budget.endDate).toLocaleDateString()}` : ''}
                                </small>
                              </td>
                              <td>
                                <span className={`badge ${darkMode ? 'bg-secondary' : 'bg-light'} text-dark`}>
                                  {budget.category}: {budget.subCategory}
                                </span>
                              </td>
                              <td>${allocated.toLocaleString()}</td>
                              <td className={spent > allocated ? 'text-danger' : 'text-success'}>
                                ${spent.toLocaleString()}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                    <div
                                      className={`progress-bar ${progress > 100 ? 'bg-danger' : progress > 80 ? 'bg-warning' : 'bg-success'}`}
                                      role="progressbar"
                                      style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                  </div>
                                  <small>{Math.min(progress, 100).toFixed(0)}%</small>
                                </div>
                                <small className={`${remaining < 0 ? 'text-danger' : 'text-muted'}`}>
                                  {remaining >= 0 ? `$${remaining.toLocaleString()} left` : `$${Math.abs(remaining).toLocaleString()} over`}
                                </small>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      setNewBudget(budget);
                                      setEditIndex(index);
                                      setShowForm(true);
                                    }}
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this budget?')) {
                                        const updated = [...budgets];
                                        updated.splice(index, 1);
                                        setBudgets(updated);
                                      }
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visualizations */}
          <div className="col-lg-4">
            {/* Budget Allocation Pie Chart */}
            <div className={`card mb-4 border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body">
                <h5 className="card-title">Budget Allocation</h5>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgets}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="allocated"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {budgets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Allocated']}
                        labelFormatter={(label) => `Category: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Spending vs Budget Radar Chart */}
            <div className={`card mb-4 border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body">
                <h5 className="card-title">Spending vs Budget</h5>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={budgets.slice(0, 6)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subCategory" />
                      <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
                      <Radar
                        name="Budgeted"
                        dataKey="allocated"
                        stroke="#4CAF50"
                        fill="#4CAF50"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Actual"
                        dataKey="spent"
                        stroke="#F44336"
                        fill="#F44336"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Budget Alerts */}
            <div className={`card border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Budget Alerts</h5>
                  <span className="badge bg-danger">3 New</span>
                </div>
                <div className="list-group">
                  {budgets.filter(b => {
                    const progress = ((b.spent || 0) / b.allocated) * 100;
                    return progress > (b.notifications?.threshold || 80);
                  }).slice(0, 3).map((budget, index) => (
                    <div key={index} className="list-group-item list-group-item-action">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{budget.name}</h6>
                        <small className="text-danger">
                          {Math.round(((budget.spent || 0) / budget.allocated) * 100)}%
                        </small>
                      </div>
                      <p className="mb-1">You've exceeded {budget.notifications?.threshold || 80}% of your budget</p>
                      <small>Category: {budget.subCategory}</small>
                    </div>
                  ))}
                  {budgets.filter(b => ((b.spent || 0) / b.allocated) * 100 > (b.notifications?.threshold || 80)).length === 0 && (
                    <div className="text-center text-muted py-3">
                      No critical alerts at this time
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}