import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Smartphone,
  User,
  Fingerprint,
  Shield,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { auth, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import OTPInput from 'react-otp-input';

export default function LoginPage({ darkMode }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'phone', 'otp'
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Initialize reCAPTCHA
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow login
      }
    });
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, useEffect will redirect
    } catch (err) {
      setError(getFriendlyError(err.code));
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setLoginMethod('otp');
      setLoading(false);
    } catch (err) {
      setError(getFriendlyError(err.code));
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
      // Login successful, useEffect will redirect
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const getFriendlyError = (errorCode) => {
    switch(errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'Account disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number';
      default:
        return 'Login failed. Please try again';
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
    setError('');
  };

  return (
    <div className={`login-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          {/* Form Column */}
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className={`login-card p-4 p-md-5 shadow-lg rounded-3 w-100 animate__animated animate__fadeIn ${darkMode ? 'bg-dark' : 'bg-white'}`} style={{ maxWidth: '450px' }}>
              <div className="text-center mb-4">
                <Link to="/" className="text-decoration-none d-inline-block mb-3">
                  <ArrowLeft size={20} className={darkMode ? 'text-light' : 'text-dark'} />
                </Link>
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to your AI Finance Tracker account</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center animate__animated animate__shakeX">
                  <AlertCircle size={18} className="me-2" />
                  {error}
                </div>
              )}

              {/* Email Login Form */}
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailLogin}>
                  <div className="mb-3">
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

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="remember"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label className="form-check-label" htmlFor="remember">Remember me</label>
                      </div>
                      <Link to="/forgot-password" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-primary'}`}>
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`btn w-100 ${darkMode ? 'btn-light-gradient' : 'btn-primary'} mb-3`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="me-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center mb-3">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={toggleLoginMethod}
                    >
                      <Smartphone size={16} className="me-2" />
                      Or sign in with phone number
                    </button>
                  </div>
                </form>
              )}

              {/* Phone Login Form */}
              {loginMethod === 'phone' && (
                <form onSubmit={handlePhoneLogin}>
                  <div className="mb-3">
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
                    <small className="text-muted">We'll send an OTP to verify your number</small>
                  </div>

                  <button
                    type="submit"
                    className={`btn w-100 ${darkMode ? 'btn-light-gradient' : 'btn-primary'} mb-3`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="me-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Continue with Phone'
                    )}
                  </button>

                  <div className="text-center mb-3">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={toggleLoginMethod}
                    >
                      <Mail size={16} className="me-2" />
                      Or sign in with email
                    </button>
                  </div>
                </form>
              )}

              {/* OTP Verification Form */}
              {loginMethod === 'otp' && (
                <form onSubmit={handleOtpVerification}>
                  <div className="mb-4 text-center">
                    <Fingerprint size={48} className="mb-3 text-primary" />
                    <h5>Verify Your Identity</h5>
                    <p className="text-muted">
                      Enter the 6-digit code sent to {phone}
                    </p>
                  </div>

                  <div className="mb-4 d-flex justify-content-center">
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderInput={(props) => (
                        <input
                          {...props}
                          className={`otp-input ${darkMode ? 'dark' : ''}`}
                        />
                      )}
                      containerStyle="otp-container"
                      inputStyle={{
                        width: '3rem',
                        height: '3rem',
                        margin: '0 0.5rem',
                        fontSize: '1.2rem',
                        borderRadius: '8px',
                        border: `2px solid ${darkMode ? '#495057' : '#dee2e6'}`,
                        backgroundColor: darkMode ? '#343a40' : '#fff',
                        color: darkMode ? '#fff' : '#000'
                      }}
                      focusStyle={{
                        borderColor: '#0d6efd',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`btn w-100 ${darkMode ? 'btn-light-gradient' : 'btn-primary'} mb-3`}
                    disabled={loading || otp.length < 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="me-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        setLoginMethod('phone');
                        setOtp('');
                      }}
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Change phone number
                    </button>
                  </div>
                </form>
              )}

              <div id="recaptcha-container"></div>

              <div className="text-center mt-4">
                <p className="text-muted">Don't have an account?{' '}
                  <Link to="/signup" className={`fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="login-footer mt-4 pt-3 border-top text-center">
                <div className="d-flex justify-content-center gap-3 mb-3">
                  <button className="btn btn-outline-secondary rounded-circle p-2">
                    <i className="bi bi-google"></i>
                  </button>
                  <button className="btn btn-outline-secondary rounded-circle p-2">
                    <i className="bi bi-apple"></i>
                  </button>
                  <button className="btn btn-outline-secondary rounded-circle p-2">
                    <i className="bi bi-facebook"></i>
                  </button>
                </div>
                <small className="text-muted">
                  <Shield size={14} className="me-2" />
                  Your data is securely encrypted
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
              <h1 className="display-4 fw-bold mb-4">Secure Login</h1>
              <p className="lead mb-5">
                Access your financial dashboard with multi-factor authentication
                and bank-level security
              </p>
              <div className="d-flex justify-content-center gap-4">
                <div className="text-center">
                  <div className={`rounded-circle ${darkMode ? 'bg-dark' : 'bg-white'} text-primary d-flex align-items-center justify-content-center mx-auto mb-2`} style={{ width: '60px', height: '60px' }}>
                    <Fingerprint size={24} />
                  </div>
                  <span>Biometric Login</span>
                </div>
                <div className="text-center">
                  <div className={`rounded-circle ${darkMode ? 'bg-dark' : 'bg-white'} text-primary d-flex align-items-center justify-content-center mx-auto mb-2`} style={{ width: '60px', height: '60px' }}>
                    <Shield size={24} />
                  </div>
                  <span>256-bit Encryption</span>
                </div>
                <div className="text-center">
                  <div className={`rounded-circle ${darkMode ? 'bg-dark' : 'bg-white'} text-primary d-flex align-items-center justify-content-center mx-auto mb-2`} style={{ width: '60px', height: '60px' }}>
                    <User size={24} />
                  </div>
                  <span>Personalized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}