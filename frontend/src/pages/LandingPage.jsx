import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiArrowRight,
  FiActivity,
  FiMessageCircle,
  FiBook,
  FiSun,
} from "react-icons/fi";
import Scene3D from "../components/3d/Scene3D";
import WellnessOrb from "../components/3d/WellnessOrb";
import FloatingParticles from "../components/3d/FloatingParticles";
import "../styles/mentovya.css";
import "./LandingPage.css";

const LandingPage = () => {
  const { user } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container">
          <div className="nav-content">
            <motion.div
              className="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FiHeart className="logo-icon" />
              <span className="logo-text">Mentovya</span>
            </motion.div>

            <motion.div
              className="nav-actions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {!user ? (
                <>
                  <Link to="/login" className="btn btn-ghost">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Get Started
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <motion.div
              className="hero-content"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div className="hero-badge" variants={fadeIn}>
                <FiSun size={16} />
                <span>Welcome to Mentovya</span>
              </motion.div>

              <motion.h1 className="hero-title" variants={fadeIn}>
                Your mind deserves
                <br />
                <span className="hero-highlight">a little more care.</span>
              </motion.h1>

              <motion.p className="hero-subtitle" variants={fadeIn}>
                A safe space to pause, reflect and find your balance. Join
                thousands of students building healthier minds.
              </motion.p>

              <motion.div className="hero-actions" variants={fadeIn}>
                {!user ? (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Start Your Journey <FiArrowRight />
                    </Link>
                    <Link to="/login" className="btn btn-outline btn-lg">
                      Explore Wellness
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    Go to Dashboard <FiArrowRight />
                  </Link>
                )}
              </motion.div>

              {/* Floating Insight Cards */}
              <motion.div
                className="insight-cards"
                variants={fadeIn}
                transition={{ delay: 0.8 }}
              >
                <div className="insight-card glass-card">
                  <div className="insight-icon">
                    <FiActivity />
                  </div>
                  <div>
                    <div className="insight-value">1,234</div>
                    <div className="insight-label">Mood entries tracked</div>
                  </div>
                </div>

                <div className="insight-card glass-card">
                  <div className="insight-icon calm">
                    <FiHeart />
                  </div>
                  <div>
                    <div className="insight-value">87%</div>
                    <div className="insight-label">Feel more balanced</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* 3D Wellness Orb */}
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="orb-container">
                <Scene3D autoRotate={true}>
                  <WellnessOrb />
                  <FloatingParticles count={30} />
                </Scene3D>
              </div>
              <div className="orb-glow"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-xl">Everything you need to thrive</h2>
            <p className="body-lg text-muted">
              Thoughtfully designed tools for your mental wellness journey
            </p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              className="feature-card glass-card-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="feature-icon lavender">
                <FiMessageCircle size={28} />
              </div>
              <h3 className="heading-sm">AI Wellness Companion</h3>
              <p className="body-md text-muted">
                Talk it out with our empathetic AI assistant. Available 24/7 to
                listen, support, and guide you through challenges.
              </p>
              <div className="feature-link">
                <span>Learn more</span>
                <FiArrowRight />
              </div>
            </motion.div>

            <motion.div
              className="feature-card glass-card-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="feature-icon sage">
                <FiActivity size={28} />
              </div>
              <h3 className="heading-sm">Mood Tracking</h3>
              <p className="body-md text-muted">
                Understand your emotional patterns with beautiful visualizations
                and insights. One check-in at a time.
              </p>
              <div className="feature-link">
                <span>Learn more</span>
                <FiArrowRight />
              </div>
            </motion.div>

            <motion.div
              className="feature-card glass-card-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="feature-icon peach">
                <FiSun size={28} />
              </div>
              <h3 className="heading-sm">Breathing Exercises</h3>
              <p className="body-md text-muted">
                Find calm in moments of stress. Guided breathing exercises with
                immersive 3D visualizations.
              </p>
              <div className="feature-link">
                <span>Learn more</span>
                <FiArrowRight />
              </div>
            </motion.div>

            <motion.div
              className="feature-card glass-card-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="feature-icon navy">
                <FiBook size={28} />
              </div>
              <h3 className="heading-sm">Wellness Library</h3>
              <p className="body-md text-muted">
                Curated resources on stress management, anxiety, relationships,
                and more. Knowledge that empowers.
              </p>
              <div className="feature-link">
                <span>Learn more</span>
                <FiArrowRight />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-card glass-card-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-xl">Ready to start your wellness journey?</h2>
            <p className="body-lg text-muted">
              Join a community of students prioritizing their mental health
            </p>
            {!user ? (
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free <FiArrowRight />
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <FiArrowRight />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <FiHeart className="logo-icon" />
              <span className="logo-text">Mentovya</span>
            </div>
            <p className="body-sm text-muted">
              &copy; 2024 Mentovya. Your mental health matters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
