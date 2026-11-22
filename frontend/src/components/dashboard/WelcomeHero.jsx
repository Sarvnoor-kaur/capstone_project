import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import "./WelcomeHero.css";

const WelcomeHero = ({ userName = "Friend" }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.section
      className="welcome-hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Image with Overlay */}
      <div className="hero-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80"
          alt="Students studying together"
          className="hero-bg-image"
          loading="eager"
        />
        <div className="hero-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Sparkles size={16} />
          <span>{getCurrentDate()}</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {getGreeting()}, {userName}! ✨
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Welcome back to your wellness journey. How are you feeling today?
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button className="btn-hero-primary">
            <span>Check In Now</span>
            <ArrowRight size={20} />
          </button>
          <button className="btn-hero-secondary">
            <span>Explore Resources</span>
          </button>
        </motion.div>

        {/* Floating Wellness Message */}
        <motion.div
          className="wellness-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="wellness-icon">💜</div>
          <p className="wellness-text">
            "Taking care of yourself is a form of self-respect."
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WelcomeHero;
