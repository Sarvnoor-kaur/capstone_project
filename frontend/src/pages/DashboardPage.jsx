import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiTrendingUp,
  FiAward,
  FiEdit3,
  FiBarChart2,
  FiCalendar,
  FiBookOpen,
  FiMessageCircle,
  FiSun,
  FiMoon,
  FiCoffee,
  FiHeart,
  FiWind,
  FiArrowRight
} from "react-icons/fi";
import MoodForm from "../components/MoodForm";
import MoodTrendChart from "../components/MoodTrendChart";
import MoodHeatmap from "../components/MoodHeatmap";
import AchievementBadges from "../components/AchievementBadges";
import MoodStats from "../components/MoodStats";
import "../styles/mentovya.css";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();
  const [allMoods, setAllMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Get time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: <FiSun /> };
    if (hour < 18) return { text: "Good afternoon", icon: <FiCoffee /> };
    return { text: "Good evening", icon: <FiMoon /> };
  };

  const greeting = getGreeting();

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await axios.get("/mood");
        setAllMoods(response.data);
      } catch (err) {
        console.error("Failed to fetch mood entries", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMoods();
    }
  }, [user]);

  const refreshMoods = async () => {
    try {
      const response = await axios.get("/mood");
      setAllMoods(response.data);
    } catch (err) {
      console.error("Failed to refresh mood entries", err);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Header */}
      <motion.div className="dashboard-header" {...fadeIn}>
        <div className="greeting-section">
          <div className="greeting-icon">{greeting.icon}</div>
          <div>
            <h1 className="heading-xl">
              {greeting.text}, {user?.name}
            </h1>
            <p className="body-md text-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Daily Check-in Prompt */}
      <motion.div
        className="checkin-prompt glass-card-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="checkin-content">
          <div className="checkin-text">
            <h3 className="heading-md">How are you feeling today?</h3>
            <p className="body-md text-muted">Take a moment to check in with yourself</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab("track")}
          >
            <FiEdit3 /> Check In
          </button>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        className="quick-actions-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link to="/ai-chat" className="action-card glass-card lavender">
          <div className="action-icon">
            <FiMessageCircle size={28} />
          </div>
          <div className="action-content">
            <h4 className="heading-sm">AI Companion</h4>
            <p className="body-sm text-muted">Talk it out. We're listening.</p>
          </div>
          <div className="action-arrow">
            <FiArrowRight />
          </div>
        </Link>

        <Link to="/resources" className="action-card glass-card sage">
          <div className="action-icon">
            <FiBookOpen size={28} />
          </div>
          <div className="action-content">
            <h4 className="heading-sm">Wellness Library</h4>
            <p className="body-sm text-muted">Curated resources for you</p>
          </div>
          <div className="action-arrow">
            <FiArrowRight />
          </div>
        </Link>

        <div className="action-card glass-card peach" style={{ cursor: 'pointer' }}>
          <div className="action-icon">
            <FiWind size={28} />
          </div>
          <div className="action-content">
            <h4 className="heading-sm">Breathing Exercise</h4>
            <p className="body-sm text-muted">Find calm in 3 minutes</p>
          </div>
          <div className="action-arrow">
            <FiArrowRight />
          </div>
        </div>

        <Link to="/support" className="action-card glass-card navy">
          <div className="action-icon">
            <FiHeart size={28} />
          </div>
          <div className="action-content">
            <h4 className="heading-sm">Get Support</h4>
            <p className="body-sm text-muted">We're here to help</p>
          </div>
          <div className="action-arrow">
            <FiArrowRight />
          </div>
        </Link>
      </motion.div>

      {/* Wellness Overview Stats */}
      {!loading && allMoods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MoodStats entries={allMoods} />
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        className="dashboard-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <FiBarChart2 /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <FiTrendingUp /> Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          <FiAward /> Achievements
        </button>
        <button
          className={`tab-btn ${activeTab === "track" ? "active" : ""}`}
          onClick={() => setActiveTab("track")}
        >
          <FiEdit3 /> Track Mood
        </button>
      </motion.div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <motion.div
            className="overview-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card-lg">
              <div className="card-header-section">
                <div>
                  <h3 className="heading-md">
                    <FiTrendingUp /> 30-Day Mood Trend
                  </h3>
                  <p className="body-sm text-muted">
                    Your mood patterns over the last month
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : allMoods.length > 0 ? (
                <MoodTrendChart entries={allMoods} />
              ) : (
                <div className="empty-state">
                  <FiActivity size={48} className="empty-icon" />
                  <p className="body-md text-muted">No mood data yet. Start tracking to see your trends!</p>
                </div>
              )}
            </div>

            {/* Daily Inspiration */}
            <div className="inspiration-card glass-card-lg">
              <div className="inspiration-icon">
                <FiSun />
              </div>
              <blockquote className="inspiration-quote">
                "Taking care of yourself is a form of self-respect. You deserve the time and energy you invest in your wellbeing."
              </blockquote>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            className="analytics-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card-lg">
              <div className="card-header-section">
                <div>
                  <h3 className="heading-md">
                    <FiCalendar /> Mood Heatmap
                  </h3>
                  <p className="body-sm text-muted">12-week mood calendar view</p>
                </div>
              </div>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : allMoods.length > 0 ? (
                <MoodHeatmap entries={allMoods} />
              ) : (
                <div className="empty-state">
                  <FiCalendar size={48} className="empty-icon" />
                  <p className="body-md text-muted">Start tracking to see your mood calendar</p>
                </div>
              )}
            </div>

            <div className="glass-card-lg">
              <div className="card-header-section">
                <div>
                  <h3 className="heading-md">
                    <FiBarChart2 /> Detailed Trends
                  </h3>
                  <p className="body-sm text-muted">Track your emotional journey</p>
                </div>
              </div>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : allMoods.length > 0 ? (
                <MoodTrendChart entries={allMoods} />
              ) : (
                <div className="empty-state">
                  <FiActivity size={48} className="empty-icon" />
                  <p className="body-md text-muted">No mood data available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "achievements" && (
          <motion.div
            className="achievements-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card-lg">
              <div className="card-header-section">
                <div>
                  <h3 className="heading-md">
                    <FiAward /> Your Achievements
                  </h3>
                  <p className="body-sm text-muted">
                    Earn badges by tracking your mood consistently
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <AchievementBadges entries={allMoods} />
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "track" && (
          <motion.div
            className="track-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card-lg">
              <div className="card-header-section">
                <div>
                  <h3 className="heading-md">
                    <FiEdit3 /> How are you feeling today?
                  </h3>
                  <p className="body-sm text-muted">
                    Take a moment to check in with yourself
                  </p>
                </div>
              </div>
              <MoodForm onMoodSubmit={refreshMoods} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
