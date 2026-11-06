import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import axios from "../api/axiosClient";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiHeart,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
  FiBookOpen,
  FiCalendar,
} from "react-icons/fi";
import "../styles/mentovya.css";
import "./AuthPages.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
    program: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    if (formData.email.length < 3) {
      setError("Email must be at least 3 characters long");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/auth/register", formData);
      login(response.data.token, response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "#ef4444";
    if (passwordStrength <= 50) return "#f59e0b";
    if (passwordStrength <= 75) return "#3b82f6";
    return "#10b981";
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="auth-page-container">
      {/* Left Hero Section */}
      <motion.div
        className="auth-hero"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-hero-content">
          {/* Logo */}
          <div className="auth-logo">
            <FiHeart className="logo-icon" />
            <div>
              <h1 className="logo-text">MENTOVYA</h1>
              <p className="logo-tagline">A little space for a better you.</p>
            </div>
          </div>

          {/* Main Headline */}
          <div className="hero-text">
            <h2 className="hero-headline">
              Your mind deserves
              <br />a space to breathe.
            </h2>
            <p className="hero-description">
              Find clarity, express your feelings and take small steps towards a
              healthier, more balanced student life.
            </p>
          </div>

          {/* Floating Feature Cards */}
          <div className="floating-cards">
            <motion.div
              className="floating-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FiShield className="card-icon" />
              <div>
                <h4>Your safe space</h4>
                <p>Talk freely, without judgment.</p>
              </div>
            </motion.div>

            <motion.div
              className="floating-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FiCheckCircle className="card-icon" />
              <div>
                <h4>Understand yourself</h4>
                <p>Reflect on your everyday feelings.</p>
              </div>
            </motion.div>

            <motion.div
              className="floating-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <FiHeart className="card-icon" />
              <div>
                <h4>Small steps matter</h4>
                <p>Build healthier daily habits.</p>
              </div>
            </motion.div>
          </div>

          {/* Trust Message */}
          <div className="trust-message">
            <FiShield size={14} />
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        className="auth-form-section"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-form-container">
          <motion.div {...fadeIn}>
            <h2 className="form-heading">Create your safe space</h2>
            <p className="form-subtitle">
              Start your journey towards better everyday wellbeing.
            </p>
          </motion.div>

          {error && (
            <motion.div
              className="form-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </div>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthLabel()}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Optional Fields */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="institution" className="form-label">
                Institution <span className="label-optional">(Optional)</span>
              </label>
              <div className="input-wrapper">
                <FiBookOpen className="input-icon" />
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your university or college"
                  autoComplete="organization"
                />
              </div>
            </motion.div>

            <div className="form-row">
              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="program" className="form-label">
                  Program <span className="label-optional">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Computer Science"
                />
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label htmlFor="year" className="form-label">
                  Year <span className="label-optional">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 2nd Year"
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary btn-large w-full"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Creating account...
                </span>
              ) : (
                <span className="btn-content">
                  Create Account
                  <FiArrowRight />
                </span>
              )}
            </motion.button>
          </form>

          <motion.div
            className="form-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link-primary">
                Sign In
              </Link>
            </p>
          </motion.div>

          <div className="form-footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <span className="footer-divider">•</span>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
