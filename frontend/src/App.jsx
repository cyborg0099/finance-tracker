  import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionPage";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Budget"
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import "./App.css";
import BudgetPage from "./pages/Budget";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgottenPage";
import AIChatPage from "./pages/AIinsights";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark-mode bg-dark" : "light-mode bg-light"} min-vh-100 d-flex flex-column`}>
        {/* Enhanced Navbar */}
        <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} sticky-top shadow-sm`}>
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
              <span className={darkMode ? "text-light" : "text-primary"}>AI</span> Finance Tracker
            </Link>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transactions">Transactions</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/budget">Budget</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/features">Features</Link>
                </li>
              </ul>
              
              <div className="d-flex align-items-center">
                {/* Dark Mode Toggle with better styling */}
                <button 
                  className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-dark"} me-3`}
                  onClick={toggleDarkMode}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
                
                {/* Auth Buttons */}
                <div className="d-flex gap-2">
                  <Link 
                    to="/login" 
                    className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-primary"}`}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/signup" 
                    className={`btn btn-sm ${darkMode ? "btn-light-gradient" : "btn-primary"}`}
                  >
                    Sign Up
                  </Link>
                
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <LandingPage 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode} 
                />
              } 
            />
            <Route 
              path="/signup" 
              element={
                <SignUp 
                  darkMode={darkMode} 
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  darkMode={darkMode} 
                />
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <TransactionsPage 
                  darkMode={darkMode} 
                />
              } 
            />
            <Route path="/budget" element={<BudgetPage darkMode={darkMode}/>} /> 
            <Route path="/login" element={<LoginPage darkMode={darkMode}/>} /> 
            <Route path="/forgot-password" element={<ForgotPasswordPage darkMode={darkMode}/>} />
            <Route path="/ai-chat" element= {<AIChatPage darkMode={darkMode}/>}/>
            
          </Routes>
        </main>

        {/* Footer */}
        <footer className={`py-4 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"} border-top`}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="mb-0">
                  © {new Date().getFullYear()} AI Finance Tracker. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <Link to="/privacy" className="text-decoration-none me-3">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-decoration-none me-3">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-decoration-none">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}