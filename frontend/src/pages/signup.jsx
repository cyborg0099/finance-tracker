import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css"; // Ensure animate.css is installed or linked via CDN

function SignUp({ darkMode }) {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Enhanced validation
  const validateField = (name, value) => {
    let errorMsg = "";
    if (!value.trim()) {
      errorMsg = `${formatFieldName(name)} is required.`;
    } else {
      switch (name.toLowerCase()) {
        case "email":
          if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "Invalid email address.";
          break;
        case "password":
          if (value.length < 8) errorMsg = "Password must be at least 8 characters.";
          break;
        case "confirmpassword":
          if (value !== formData.Password) errorMsg = "Passwords do not match.";
          break;
        default:
          break;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (password.length < 8) return "weak";
    if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) return "strong";
    return "medium";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(formData).forEach((field) => validateField(field, formData[field]));
    if (!termsAccepted) newErrors.terms = "You must accept the terms.";

    const hasErrors = Object.values({ ...errors, ...newErrors }).some((err) => err);
    if (hasErrors) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Email: formData.Email,
          Password: formData.Password,
          ConfirmPassword: formData.ConfirmPassword
        })
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setErrors((prev) => ({ ...prev, api: data.error || "Signup failed" }));
      }
    } catch (err) {
      setLoading(false);
      setErrors((prev) => ({ ...prev, api: "Network error. Please try again." }));
    }
  };

  const formatFieldName = (field) => field.replace(/([A-Z])/g, " $1").trim();

  const backgroundStyle = {
    background: darkMode
      ? "linear-gradient(135deg, #343a40, #495057)"
      : "linear-gradient(135deg, #007bff, #00b4db)",
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Form Column */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className={`signup-card p-4 p-md-5 shadow-lg rounded-3 w-100 animate__animated animate__zoomIn ${
              darkMode ? "bg-secondary text-light" : "bg-white text-dark"
            }`}
            style={{ maxWidth: "450px" }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">Create an Account</h2>
              <p className="text-muted">Join the AI Finance Tracker today!</p>
            </div>

            {submitted ? (
              <div className="text-center mt-4">
                <p className="alert alert-success d-flex align-items-center justify-content-center animate__animated animate__fadeIn">
                  <i className="bi bi-check-circle me-2"></i> Signup Successful! 🎉 Redirecting...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {Object.keys(formData).map((field, index) => (
                  <div
                    className="form-floating mb-3 position-relative animate__animated animate__fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    key={field}
                  >
                    <input
                      type={field.toLowerCase().includes("password") && !showPassword ? "password" : "text"}
                      className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                      id={field}
                      placeholder={formatFieldName(field)}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      aria-describedby={`${field}-error`}
                    />
                    <label htmlFor={field}>{formatFieldName(field)}</label>
                    {field.toLowerCase().includes("password") && (
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ zIndex: 1 }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    )}
                    {field === "Password" && formData.Password && (
                      <div className="password-strength mt-1">
                        <div
                          className={`strength-bar ${getPasswordStrength(formData.Password)}`}
                          style={{
                            width: "100%",
                            height: "5px",
                            backgroundColor:
                              getPasswordStrength(formData.Password) === "weak"
                                ? "red"
                                : getPasswordStrength(formData.Password) === "medium"
                                ? "yellow"
                                : "green",
                          }}
                        />
                        <small>{getPasswordStrength(formData.Password).toUpperCase()}</small>
                      </div>
                    )}
                    {errors[field] && (
                      <div id={`${field}-error`} className="invalid-feedback animate__animated animate__shakeX">
                        {errors[field]}
                      </div>
                    )}
                  </div>
                ))}

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    required
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree to the{" "}
                    <a href="/terms" className={darkMode ? "text-light" : "text-primary"}>
                      Terms and Conditions
                    </a>
                  </label>
                  {errors.terms && <div className="text-danger small">{errors.terms}</div>}
                </div>

                {errors.api && (
                  <div className="alert alert-danger animate__animated animate__shakeX">{errors.api}</div>
                )}
                <button
                  type="submit"
                  className={`btn w-100 ${darkMode ? "btn-dark-gradient" : "btn-light-gradient"}`}
                  disabled={loading || !termsAccepted}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    "🚀"
                  )}
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-muted">Or sign up with</p>
                  <button type="button" className="btn btn-outline-danger me-2">
                    <i className="bi bi-google"></i> Google
                  </button>
                  <button type="button" className="btn btn-outline-primary">
                    <i className="bi bi-facebook"></i> Facebook
                  </button>
                </div>

                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <a href="/login" className={darkMode ? "text-light" : "text-primary"}>
                    Log In
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Background Column */}
        <div
          className="col-md-6 d-flex align-items-center justify-content-center text-white animate__animated animate__fadeIn"
          style={backgroundStyle}
        >
          <div className="text-center">
            <h1 className="display-4 fw-bold">Welcome!</h1>
            <p className="lead">Join the future of finance management.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;