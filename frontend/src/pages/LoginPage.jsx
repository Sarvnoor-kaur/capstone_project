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
  FiHeart,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import "../styles/mentovya.css";
import "./AuthPages.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
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
      const response = await axios.post("/auth/login", formData);
      login(response.data.token, response.data);

      // Navigate based on role
      if (response.data.role === "student") {
        navigate("/dashboard");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
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
            <h2 className="form-heading">Welcome back</h2>
            <p className="form-subtitle">
              Your space is always here when you need it.
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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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
            </motion.div>

            <motion.div
              className="form-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </motion.div>

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
                  Signing in...
                </span>
              ) : (
                <span className="btn-content">
                  Sign In
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
              New to Mentovya?{" "}
              <Link to="/register" className="link-primary">
                Create an account
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

export default LoginPage;
