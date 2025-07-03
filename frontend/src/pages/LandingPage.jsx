import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";

export default function LandingPage({ darkMode, toggleDarkMode }) {
  const heroStyle = {
    background: darkMode
      ? "linear-gradient(135deg, #343a40, #495057)"
      : "linear-gradient(135deg, #007bff, #00b4db)"
  };

  const featureCardStyle = darkMode 
    ? "bg-secondary text-light" 
    : "bg-white text-dark";

  return (
    <div className={`landing-page min-vh-100 ${darkMode ? "bg-dark" : "bg-light"}`}>
      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} sticky-top`}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <span className="text-primary">AI</span> Finance Tracker
          </Link>
          <div className="d-flex align-items-center">
            <button 
              className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-dark"} me-3`}
              onClick={toggleDarkMode}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <Link to="/signup" className={`btn ${darkMode ? "btn-light-gradient" : "btn-primary"}`}>
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="hero-section py-5 text-white animate__animated animate__fadeIn" 
        style={heroStyle}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeInDown">
                Smart Finance Management <span className="text-warning">Powered by AI</span>
              </h1>
              <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-1s">
                Take control of your finances with real-time insights, automated budgeting, 
                and predictive analytics powered by artificial intelligence.
              </p>
              <div className="d-flex gap-3 animate__animated animate__fadeIn animate__delay-2s">
                <Link to="/signup" className={`btn btn-lg ${darkMode ? "btn-dark-gradient" : "btn-light-gradient"}`}>
                  Get Started Free
                </Link>
                <Link to="/demo" className="btn btn-lg btn-outline-light">
                  Live Demo
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block animate__animated animate__fadeInRight">
              <img 
                src="https://illustrations.popsy.co/amber/digital-presentation.svg" 
                alt="Finance dashboard illustration" 
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-5 ${darkMode ? "bg-dark" : "bg-light"}`}>
        <div className="container py-5">
          <div className="text-center mb-5 animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-3">Why Choose AI Finance Tracker?</h2>
            <p className="lead text-muted">Revolutionary features designed to transform your financial life</p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: "📊",
                title: "Real-Time Analytics",
                description: "Get instant insights into your spending patterns with beautiful visualizations"
              },
              {
                icon: "🤖",
                title: "AI Predictions",
                description: "Our algorithms forecast future expenses and suggest optimal savings strategies"
              },
              {
                icon: "🔒",
                title: "Bank-Level Security",
                description: "256-bit encryption keeps your financial data completely secure"
              },
              {
                icon: "🔄",
                title: "Auto-Sync",
                description: "Connect all your financial accounts for seamless transaction tracking"
              },
              {
                icon: "🎯",
                title: "Goal Tracking",
                description: "Set and achieve financial goals with personalized recommendations"
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                description: "Full-featured mobile experience so you can manage finances anywhere"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="col-md-6 col-lg-4 animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`feature-card p-4 h-100 rounded-3 shadow-sm ${featureCardStyle}`}>
                  <div className="feature-icon mb-3" style={{ fontSize: "2.5rem" }}>
                    {feature.icon}
                  </div>
                  <h3 className="h5">{feature.title}</h3>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-5 ${darkMode ? "bg-secondary" : "bg-white"}`}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0 animate__animated animate__fadeInLeft">
              <img 
                src="https://illustrations.popsy.co/amber/mobile-login.svg" 
                alt="App screenshot" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
            <div className="col-lg-6 animate__animated animate__fadeInRight">
              <h2 className="fw-bold mb-4">How It Works</h2>
              <div className="d-flex mb-4">
                <div className="me-4">
                  <div className={`rounded-circle ${darkMode ? "bg-dark" : "bg-primary"} text-white d-flex align-items-center justify-content-center`} style={{ width: "50px", height: "50px" }}>
                    <span className="fw-bold">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="h5">Sign Up in Seconds</h3>
                  <p className="text-muted">
                    Create your free account with just your email and password. No credit card required.
                  </p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <div className="me-4">
                  <div className={`rounded-circle ${darkMode ? "bg-dark" : "bg-primary"} text-white d-flex align-items-center justify-content-center`} style={{ width: "50px", height: "50px" }}>
                    <span className="fw-bold">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="h5">Connect Your Accounts</h3>
                  <p className="text-muted">
                    Securely link your bank accounts, credit cards, and investment portfolios.
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-4">
                  <div className={`rounded-circle ${darkMode ? "bg-dark" : "bg-primary"} text-white d-flex align-items-center justify-content-center`} style={{ width: "50px", height: "50px" }}>
                    <span className="fw-bold">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="h5">Gain Financial Insights</h3>
                  <p className="text-muted">
                    Let our AI analyze your finances and provide personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-5 ${darkMode ? "bg-dark" : "bg-light"}`}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Trusted by Thousands</h2>
            <p className="lead text-muted">What our users say about us</p>
          </div>
          <div className="row g-4">
            {[
              {
                name: "Sarah Johnson",
                role: "Freelance Designer",
                quote: "This app completely transformed how I manage my irregular income. The AI predictions are scarily accurate!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                quote: "Finally a finance app that actually understands my spending habits and helps me save more.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Small Business Owner",
                quote: "The automated expense categorization saves me hours every month. Worth every penny!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="col-md-4 animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`p-4 h-100 rounded-3 ${featureCardStyle}`}>
                  <div className="d-flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-warning">★</span>
                    ))}
                  </div>
                  <p className="mb-4 fst-italic">"{testimonial.quote}"</p>
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${darkMode ? "bg-dark" : "bg-light"} me-3`} style={{ width: "50px", height: "50px" }}></div>
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-5 text-center ${darkMode ? "bg-secondary" : "bg-primary"} text-white`}>
        <div className="container py-5">
          <h2 className="display-5 fw-bold mb-4 animate__animated animate__pulse animate__infinite">
            Ready to Transform Your Finances?
          </h2>
          <p className="lead mb-5">
            Join over 100,000 users who trust our AI-powered platform to make smarter financial decisions.
          </p>
          <Link 
            to="/signup" 
            className={`btn btn-lg ${darkMode ? "btn-dark-gradient" : "btn-light-gradient"} animate__animated animate__tada animate__delay-1s`}
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-5 ${darkMode ? "bg-dark" : "bg-light"}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h5 className="fw-bold mb-3">AI Finance Tracker</h5>
              <p className="text-muted">
                The smartest way to manage your money, powered by artificial intelligence.
              </p>
            </div>
            <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
              <h6 className="fw-bold mb-3">Product</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/features" className="text-muted">Features</Link></li>
                <li className="mb-2"><Link to="/pricing" className="text-muted">Pricing</Link></li>
                <li className="mb-2"><Link to="/demo" className="text-muted">Demo</Link></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/about" className="text-muted">About</Link></li>
                <li className="mb-2"><Link to="/blog" className="text-muted">Blog</Link></li>
                <li className="mb-2"><Link to="/careers" className="text-muted">Careers</Link></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
              <h6 className="fw-bold mb-3">Support</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/help" className="text-muted">Help Center</Link></li>
                <li className="mb-2"><Link to="/contact" className="text-muted">Contact</Link></li>
                <li className="mb-2"><Link to="/privacy" className="text-muted">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4">
              <h6 className="fw-bold mb-3">Connect</h6>
              <div className="d-flex gap-3">
                <Link to="#" className="text-muted"><i className="bi bi-twitter"></i></Link>
                <Link to="#" className="text-muted"><i className="bi bi-facebook"></i></Link>
                <Link to="#" className="text-muted"><i className="bi bi-linkedin"></i></Link>
                <Link to="#" className="text-muted"><i className="bi bi-instagram"></i></Link>
              </div>
            </div>
          </div>
          <hr className="my-5" />
          <div className="text-center text-muted">
            <small>© {new Date().getFullYear()} AI Finance Tracker. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}