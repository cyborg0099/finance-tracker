import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  CreditCard,
  AlertCircle,
  Bell,
  Settings,
  RefreshCw,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";

// Sample data with more realistic financial patterns
const monthlyData = [
  { month: "Jan", income: 4200, expenses: 2400, savings: 1800 },
  { month: "Feb", income: 3800, expenses: 2900, savings: 900 },
  { month: "Mar", income: 5100, expenses: 2500, savings: 2600 },
  { month: "Apr", income: 4800, expenses: 3200, savings: 1600 },
  { month: "May", income: 5300, expenses: 2100, savings: 3200 },
  { month: "Jun", income: 4900, expenses: 2800, savings: 2100 },
];

const categoryData = [
  { name: "Housing", value: 35, color: "#FF6384" },
  { name: "Food", value: 20, color: "#36A2EB" },
  { name: "Transport", value: 15, color: "#FFCE56" },
  { name: "Entertainment", value: 10, color: "#4BC0C0" },
  { name: "Utilities", value: 12, color: "#9966FF" },
  { name: "Other", value: 8, color: "#FF9F40" },
];

const recentTransactions = [
  { id: 1, name: "Grocery Store", amount: -85.32, date: "2023-06-15", category: "Food" },
  { id: 2, name: "Salary Deposit", amount: 3200.00, date: "2023-06-10", category: "Income" },
  { id: 3, name: "Electric Bill", amount: -120.50, date: "2023-06-08", category: "Utilities" },
  { id: 4, name: "Online Subscription", amount: -14.99, date: "2023-06-05", category: "Entertainment" },
  { id: 5, name: "Gas Station", amount: -45.20, date: "2023-06-03", category: "Transport" },
];

const aiInsights = [
  "You're on track with your savings goal this month!",
  "Your dining out expenses are 15% higher than last month.",
  "Consider refinancing your credit card debt to save on interest.",
  "You could save $200/month by reducing unused subscriptions.",
  "Your emergency fund is 78% funded - keep going!"
];

export default function Dashboard({ darkMode }) {
  const [aiInsight, setAiInsight] = useState(aiInsights[0]);
  const [timeRange, setTimeRange] = useState("6M");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Calculate summary metrics
  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavings = monthlyData.reduce((sum, item) => sum + item.savings, 0);
  const savingsRate = ((totalSavings / totalIncome) * 100).toFixed(1);

  // Simulate fetching new insight
  const updateInsight = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * aiInsights.length);
      setAiInsight(aiInsights[randomIndex]);
      setLoading(false);
    }, 800);
  };

  // Filter data based on selected time range
  const getFilteredData = () => {
    switch(timeRange) {
      case "3M": return monthlyData.slice(-3);
      case "6M": return monthlyData;
      case "1Y": return [...monthlyData, ...Array(6).fill().map((_, i) => ({
        month: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        income: Math.floor(4500 + Math.random() * 1000),
        expenses: Math.floor(2000 + Math.random() * 1000),
        savings: Math.floor(1500 + Math.random() * 800)
      }))];
      default: return monthlyData;
    }
  };

  const filteredData = getFilteredData();

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`custom-tooltip p-3 rounded shadow-sm ${darkMode ? "bg-dark" : "bg-light"}`}>
          <p className="fw-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-1" style={{ color: entry.color }}>
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back! Here's your financial overview</p>
        </div>
        <div className="d-flex gap-3">
          <button className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}>
            <RefreshCw size={16} className="me-1" />
            Refresh
          </button>
          <div className="position-relative">
            <button className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}>
              <Bell size={16} />
              {notifications > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications}
                </span>
              )}
            </button>
          </div>
          <button className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="d-flex justify-content-end mb-4">
        <div className="btn-group" role="group">
          {["3M", "6M", "1Y"].map((range) => (
            <button
              key={range}
              type="button"
              className={`btn btn-sm ${timeRange === range ? 
                darkMode ? "btn-light" : "btn-primary" : 
                darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Total Income</h6>
                  <h3 className="mb-0">${totalIncome.toLocaleString()}</h3>
                  <p className={`mb-0 ${darkMode ? "text-light" : "text-dark"}`}>
                    <ArrowUpRight size={16} className="text-success me-1" />
                    <span className="text-success">12.5%</span> vs last period
                  </p>
                </div>
                <div className={`icon-shape rounded p-3 ${darkMode ? "bg-dark-light" : "bg-light"}`}>
                  <DollarSign size={20} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Total Expenses</h6>
                  <h3 className="mb-0">${totalExpenses.toLocaleString()}</h3>
                  <p className={`mb-0 ${darkMode ? "text-light" : "text-dark"}`}>
                    <ArrowDownRight size={16} className="text-danger me-1" />
                    <span className="text-danger">5.2%</span> vs last period
                  </p>
                </div>
                <div className={`icon-shape rounded p-3 ${darkMode ? "bg-dark-light" : "bg-light"}`}>
                  <CreditCard size={20} className="text-danger" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Total Savings</h6>
                  <h3 className="mb-0">${totalSavings.toLocaleString()}</h3>
                  <p className={`mb-0 ${darkMode ? "text-light" : "text-dark"}`}>
                    Savings rate: <span className="text-primary">{savingsRate}%</span>
                  </p>
                </div>
                <div className={`icon-shape rounded p-3 ${darkMode ? "bg-dark-light" : "bg-light"}`}>
                  <PiggyBank size={20} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Tabs Navigation */}
          <ul className="nav nav-tabs mb-4">
            {["overview", "income", "expenses", "investments"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {/* Income vs Expenses Chart */}
          <div className={`card mb-4 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Income vs Expenses</h5>
                <div className="dropdown">
                  <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    View <ChevronDown size={16} />
                  </button>
                  <ul className={`dropdown-menu ${darkMode ? "dropdown-menu-dark" : ""}`}>
                    <li><button className="dropdown-item">Monthly</button></li>
                    <li><button className="dropdown-item">Quarterly</button></li>
                    <li><button className="dropdown-item">Yearly</button></li>
                  </ul>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
                    <XAxis dataKey="month" stroke={darkMode ? "#aaa" : "#666"} />
                    <YAxis stroke={darkMode ? "#aaa" : "#666"} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="income" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="expenses" stroke="#F44336" fill="#F44336" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className={`card border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Recent Transactions</h5>
                <button className="btn btn-sm btn-link">View All</button>
              </div>
              <div className="table-responsive">
                <table className={`table ${darkMode ? "table-dark" : ""}`}>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Category</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.name}</td>
                        <td className={transaction.amount < 0 ? "text-danger" : "text-success"}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td>{transaction.date}</td>
                        <td>
                          <span className="badge bg-secondary">{transaction.category}</span>
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm p-0">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* AI Insights */}
          <div className={`card mb-4 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <span className="text-primary">AI</span> Insights
                </h5>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-link p-0"
                    onClick={updateInsight}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <RefreshCw size={16} />
                    )}
                  </button>
                  <Link 
                    to="/ai-chat" 
                    className="btn btn-sm btn-link p-0"
                    title="Open AI Chat"
                  >
                    <Sparkles size={16} />
                  </Link>
                </div>
              </div>
              <div className={`alert ${darkMode ? 'alert-dark' : 'alert-info'} mb-3`}>
                <p className="mb-0">
                  <strong>💡 Insight:</strong> {aiInsight}
                </p>
              </div>
              <div className="d-grid gap-2">
                <Link 
                  to="/ai-chat" 
                  className={`btn btn-sm ${darkMode ? 'btn-light-gradient' : 'btn-primary'}`}
                >
                  <Sparkles size={16} className="me-2" />
                  Chat with AI Assistant
                </Link>
                <button 
                  className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                  onClick={updateInsight}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Get New Insight'}
                </button>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className={`card mb-4 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <h5 className="card-title mb-3">Expense Breakdown</h5>
              <div style={{ height: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={(data) => setSelectedCategory(data.name)}
                      activeIndex={categoryData.findIndex(c => c.name === selectedCategory)}
                      activeShape={{
                        outerRadius: 90,
                        innerRadius: 70
                      }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {selectedCategory && (
                <div className="mt-3">
                  <h6>Details for {selectedCategory}</h6>
                  <p className="small text-muted mb-2">
                    {categoryData.find(c => c.name === selectedCategory).value}% of total expenses
                  </p>
                  <div className="progress" style={{ height: "6px" }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ 
                        width: `${categoryData.find(c => c.name === selectedCategory).value}%`,
                        backgroundColor: categoryData.find(c => c.name === selectedCategory).color
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Savings Goals */}
          <div className={`card border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <h5 className="card-title mb-3">Savings Goals</h5>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Emergency Fund</span>
                  <span>78%</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Vacation Fund</span>
                  <span>45%</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar bg-info" 
                    role="progressbar" 
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Retirement</span>
                  <span>32%</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar bg-warning" 
                    role="progressbar" 
                    style={{ width: "32%" }}
                  ></div>
                </div>
              </div>
              <button className="btn btn-sm btn-outline-primary w-100 mt-3">
                Set New Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 