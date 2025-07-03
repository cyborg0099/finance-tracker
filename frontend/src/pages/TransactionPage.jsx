import { useState, useEffect } from "react";
import API_BASE_URL from '../apiConfig';
import { 
  PlusCircle, 
  Filter, 
  Search, 
  Download, 
  Trash2, 
  Edit, 
  ChevronDown,
  ArrowUpDown,
  Wallet,
  Home,
  Utensils,
  Car,
  HeartPulse,
  Plane,
  ShoppingBag,
  GraduationCap,
  PiggyBank
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const categoryIcons = {
  "Housing": <Home size={18} className="me-2" />,
  "Utilities": <Home size={18} className="me-2" />,
  "Groceries": <Utensils size={18} className="me-2" />,
  "Transportation": <Car size={18} className="me-2" />,
  "Health & Insurance": <HeartPulse size={18} className="me-2" />,
  "Debt Repayments": <Wallet size={18} className="me-2" />,
  "Dining Out & Entertainment": <Utensils size={18} className="me-2" />,
  "Shopping": <ShoppingBag size={18} className="me-2" />,
  "Vacations & Travel": <Plane size={18} className="me-2" />,
  "Hobbies & Activities": <ShoppingBag size={18} className="me-2" />,
  "Personal Care": <HeartPulse size={18} className="me-2" />,
  "Savings & Emergency Fund": <PiggyBank size={18} className="me-2" />,
  "Retirement Planning": <PiggyBank size={18} className="me-2" />,
  "Education": <GraduationCap size={18} className="me-2" />,
};

export default function TransactionsPage({ darkMode }) {
  const categories = {
    "Essential Expenses": ["Housing", "Utilities", "Groceries", "Transportation", "Health & Insurance", "Debt Repayments"],
    "Lifestyle & Comfort": ["Dining Out & Entertainment", "Shopping", "Vacations & Travel", "Hobbies & Activities", "Personal Care"],
    "Investments & Future": ["Savings & Emergency Fund", "Retirement Planning", "Education"]
  };

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    budgetId: '',
    type: "expense",
    category: "Essential Expenses",
    subCategory: "Housing",
    amount: "",
    description: "",
    date: new Date()
  });
  // Fetch budgets for budgetId selection
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/budgets`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        setBudgets(data);
        // Set default budgetId if available
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, budgetId: data[0].id }));
        }
      })
      .catch(() => setBudgets([]));
  }, []);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [showForm, setShowForm] = useState(false);

  // Fetch transactions from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/transactions`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(() => setTransactions([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) {
      alert("Please enter amount and date");
      return;
    }
    try {
      if (editIndex !== null) {
        // Update existing transaction
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/transactions/${transactions[editIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const updated = [...transactions];
          updated[editIndex] = await res.json();
          setTransactions(updated);
          setEditIndex(null);
        }
      } else {
        // Add new transaction
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const created = await res.json();
          setTransactions([...transactions, created]);
        }
      }
      setFormData({ 
        budgetId: budgets.length > 0 ? budgets[0].id : '',
        type: "expense",
        category: "Essential Expenses", 
        subCategory: "Housing", 
        amount: "", 
        description: "", 
        date: new Date() 
      });
      setShowForm(false);
    } catch (err) {
      // handle error
    }
  };

  const handleEdit = (index) => {
    setFormData(transactions[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const id = transactions[index].id;
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/transactions/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        if (res.ok) {
          const updatedTransactions = transactions.filter((_, i) => i !== index);
          setTransactions(updatedTransactions);
        }
      } catch (err) {
        // handle error
      }
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredTransactions = sortedTransactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         txn.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || txn.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getTotal = (type) => {
    return filteredTransactions
      .filter(txn => txn.type === type)
      .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0)
      .toFixed(2);
  };

  return (
    <div className={`transactions-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="container py-4">
        {/* Header and Controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">Transaction Manager</h1>
            <p className="text-muted mb-0">Track and analyze your income and expenses</p>
          </div>
          <button 
            className={`btn ${darkMode ? "btn-light-gradient" : "btn-primary"} d-flex align-items-center`}
            onClick={() => setShowForm(!showForm)}
          >
            <PlusCircle size={18} className="me-2" />
            {showForm ? "Cancel" : "Add Transaction"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
              <div className="card-body">
                <h6 className="text-uppercase text-muted mb-2">Total Income</h6>
                <h3 className="text-success">${getTotal("income")}</h3>
                <p className="text-muted mb-0">This month</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
              <div className="card-body">
                <h6 className="text-uppercase text-muted mb-2">Total Expenses</h6>
                <h3 className="text-danger">${getTotal("expense")}</h3>
                <p className="text-muted mb-0">This month</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
              <div className="card-body">
                <h6 className="text-uppercase text-muted mb-2">Net Balance</h6>
                <h3 className={(getTotal("income") - getTotal("expense")) >= 0 ? "text-success" : "text-danger"}>
                  ${(getTotal("income") - getTotal("expense")).toFixed(2)}
                </h3>
                <p className="text-muted mb-0">This month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        {showForm && (
          <div className={`card mb-4 border-0 shadow-sm animate__animated animate__fadeIn ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="card-body">
              <h5 className="card-title">{editIndex !== null ? "Edit Transaction" : "Add New Transaction"}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Budget</label>
                    <select
                      name="budgetId"
                      value={formData.budgetId}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="" disabled>Select Budget</option>
                      {budgets.map(budget => (
                        <option key={budget.id} value={budget.id}>{budget.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Type</label>
                    <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Category</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      {Object.keys(categories).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Subcategory</label>
                    <select 
                      name="subCategory" 
                      value={formData.subCategory} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      {categories[formData.category].map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Amount</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required 
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Description</label>
                    <input 
                      type="text" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Optional description"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Date</label>
                    <DatePicker
                      selected={formData.date}
                      onChange={handleDateChange}
                      className="form-control"
                      dateFormat="MMMM d, yyyy"
                      required
                    />
                  </div>

                  <div className="col-md-3 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100">
                      {editIndex !== null ? "Update" : "Add"} Transaction
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className={`card mb-4 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>
              <div className="col-md-3">
                <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
                  <Download size={18} className="me-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`card border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className={`table table-hover mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                      <div className="d-flex align-items-center">
                        Date
                        <ArrowUpDown size={14} className="ms-2" />
                      </div>
                    </th>
                    <th>Category</th>
                    <th onClick={() => handleSort("description")} style={{ cursor: "pointer" }}>
                      <div className="d-flex align-items-center">
                        Description
                        <ArrowUpDown size={14} className="ms-2" />
                      </div>
                    </th>
                    <th onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>
                      <div className="d-flex align-items-center">
                        Amount
                        <ArrowUpDown size={14} className="ms-2" />
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No transactions found. Add your first transaction!
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((txn, index) => (
                      <tr key={index}>
                        <td>{new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {categoryIcons[txn.subCategory] || <Wallet size={18} className="me-2" />}
                            {txn.subCategory}
                          </div>
                        </td>
                        <td>{txn.description || "-"}</td>
                        <td className={txn.type === "income" ? "text-success" : "text-danger"}>
                          {txn.type === "income" ? "+" : "-"}${parseFloat(txn.amount).toFixed(2)}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary p-1"
                              onClick={() => handleEdit(index)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger p-1"
                              onClick={() => handleDelete(index)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Breakdown (Visualization) */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
              <div className="card-body">
                <h5 className="card-title">Expense Breakdown</h5>
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {Object.entries(
                    filteredTransactions
                      .filter(txn => txn.type === "expense")
                      .reduce((acc, txn) => {
                        acc[txn.subCategory] = (acc[txn.subCategory] || 0) + parseFloat(txn.amount);
                        return acc;
                      }, {})
                  ).map(([category, amount]) => (
                    <div key={category} className="d-flex align-items-center">
                      <div className="me-2">
                        {categoryIcons[category] || <Wallet size={18} />}
                      </div>
                      <div>
                        <div className="fw-bold">{category}</div>
                        <div className="text-danger">${amount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card h-100 border-0 shadow-sm ${darkMode ? "bg-dark" : "bg-white"}`}>
              <div className="card-body">
                <h5 className="card-title">Recent Activity</h5>
                <div className="timeline mt-3">
                  {filteredTransactions
                    .slice(0, 5)
                    .map((txn, index) => (
                      <div key={index} className="timeline-item mb-3">
                        <div className="d-flex">
                          <div className={`timeline-badge ${txn.type === "income" ? "bg-success" : "bg-danger"}`}>
                            {txn.type === "income" ? "+" : "-"}
                          </div>
                          <div className="ms-3">
                            <div className="d-flex justify-content-between">
                              <strong>{txn.subCategory}</strong>
                              <span className={txn.type === "income" ? "text-success" : "text-danger"}>
                                ${parseFloat(txn.amount).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-muted small">
                              {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {txn.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}