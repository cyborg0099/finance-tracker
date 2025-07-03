import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Check, 
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ForgotPasswordPage({ darkMode }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your password reset API here
      // await sendPasswordResetEmail(auth, email);
      // or await sendPasswordResetSms(phone);
      
      setSuccess(true);
    } catch (err) {
      setError(method === 'email' 
        ? 'Failed to send reset email. Please try again.' 
        : 'Failed to send SMS code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMethod = () => {
    setMethod(method === 'email' ? 'phone' : 'email');
    setError('');
  };

  return (
    <div className={`forgot-password-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          {/* Form Column */}
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className={`forgot-card p-4 p-md-5 shadow-lg rounded-3 w-100 animate__animated animate__fadeIn ${darkMode ? 'bg-dark' : 'bg-white'}`} style={{ maxWidth: '450px' }}>
              <div className="text-center mb-4">
                <Link to="/login" className="text-decoration-none d-inline-block mb-3">
                  <ArrowLeft size={20} className={darkMode ? 'text-light' : 'text-dark'} />
                </Link>
                <h2 className="fw-bold">Reset Your Password</h2>
                <p className="text-muted">
                  {method === 'email' 
                    ? "Enter your email to receive a reset link" 
                    : "Enter your phone number to receive a verification code"}
                </p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center animate__animated animate__shakeX">
                  <ShieldCheck size={18} className="me-2" />
                  {error}
                </div>
              )}

              {success ? (
                <div className="text-center animate__animated animate__fadeIn">
                  <div className={`icon-success mb-4 ${darkMode ? 'text-primary' : 'text-success'}`}>
                    <Check size={48} className="bg-success bg-opacity-10 p-2 rounded-circle" />
                  </div>
                  <h4 className="mb-3">Reset {method === 'email' ? 'Email' : 'SMS'} Sent!</h4>
                  <p className="text-muted mb-4">
                    {method === 'email'
                      ? "We've sent a password reset link to your email address. Please check your inbox."
                      : "We've sent a verification code to your phone number. Please check your messages."}
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button 
                      className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                      onClick={() => setSuccess(false)}
                    >
                      Resend {method === 'email' ? 'Email' : 'SMS'}
                    </button>
                    <Link 
                      to="/login" 
                      className={`btn ${darkMode ? 'btn-light-gradient' : 'btn-primary'}`}
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit}>
                    {method === 'email' ? (
                      <div className="mb-4">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Mail size={18} />
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Smartphone size={18} />
                          </span>
                          <PhoneInput
                            international
                            defaultCountry="US"
                            value={phone}
                            onChange={setPhone}
                            className={`form-control ${darkMode ? 'bg-dark text-light' : ''}`}
                            style={{ padding: '0.375rem 0.75rem' }}
                          />
                        </div>
                        <small className="text-muted">We'll send a verification code via SMS</small>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`btn w-100 ${darkMode ? 'btn-light-gradient' : 'btn-primary'} mb-3`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="me-2 animate-spin" />
                          {method === 'email' ? 'Sending Email...' : 'Sending SMS...'}
                        </>
                      ) : (
                        method === 'email' ? 'Send Reset Link' : 'Send Verification Code'
                      )}
                    </button>

                    <div className="text-center mb-4">
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={toggleMethod}
                      >
                        {method === 'email' 
                          ? 'Reset via phone number instead' 
                          : 'Reset via email instead'}
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="text-muted">Remember your password?{' '}
                      <Link to="/login" className={`fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                        Log in
                      </Link>
                    </p>
                  </div>
                </>
              )}

              <div className="forgot-footer mt-4 pt-3 border-top text-center">
                <small className="text-muted">
                  <ShieldCheck size={14} className="me-2" />
                  Your security is our priority. We'll never share your {method === 'email' ? 'email' : 'phone number'}.
                </small>
              </div>
            </div>
          </div>

          {/* Background Column */}
          <div
            className="col-md-6 d-none d-md-flex align-items-center justify-content-center text-white"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, #343a40, #495057)"
                : "linear-gradient(135deg, #007bff, #00b4db)"
            }}
          >
            <div className="text-center p-5">
              <h1 className="display-4 fw-bold mb-4">Account Recovery</h1>
              <p className="lead mb-5">
                Secure password reset process with end-to-end encryption and instant delivery
              </p>
              <div className="d-flex justify-content-center gap-4">
                <div className="text-center">
                  <div className={`rounded-circle ${darkMode ? 'bg-dark' : 'bg-white'} text-primary d-flex align-items-center justify-content-center mx-auto mb-2`} style={{ width: '60px', height: '60px' }}>
                    <Lock size={24} />
                  </div>
                  <span>Bank-Level Security</span>
                </div>
                <div className="text-center">
                  <div className={`rounded-circle ${darkMode ? 'bg-dark' : 'bg-white'} text-primary d-flex align-items-center justify-content-center mx-auto mb-2`} style={{ width: '60px', height: '60px' }}>
                    <Mail size={24} />
                  </div>
                  <span>Instant Delivery</span>
                </div>
                <div className="text-center">
                  <div className={`rounded-circle ${darkMode ? 'bg-dark' : 'bg-white'} text-primary d-flex align-items-center justify-content-center mx-auto mb-2`} style={{ width: '60px', height: '60px' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <span>Zero Knowledge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}