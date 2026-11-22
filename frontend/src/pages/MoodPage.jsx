import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiActivity,
  FiPlusCircle,
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiBarChart2,
  FiSmile,
  FiMeh,
  FiFrown,
  FiZap,
} from "react-icons/fi";
import MoodForm from "../components/MoodForm";
import MoodList from "../components/MoodList";
import "./MoodPage.css";

const MoodPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    avgMood: 0,
    streak: 0,
  });

  const loadEntries = async () => {
    try {
      const response = await axios.get("/mood");
      setEntries(response.data);
      calculateStats(response.data);
    } catch (err) {
      console.error("Failed to fetch mood entries", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ total: 0, thisWeek: 0, avgMood: 0, streak: 0 });
      return;
    }

    const total = data.length;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = data.filter(
      (entry) => new Date(entry.date) >= oneWeekAgo
    ).length;

    const avgMood = (
      data.reduce((sum, entry) => sum + entry.mood, 0) / data.length
    ).toFixed(1);

    // Calculate streak
    let streak = 0;
    const sortedEntries = [...data].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const expectedDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    setStats({ total, thisWeek, avgMood, streak });
  };

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const handleMoodSubmit = () => {
    loadEntries();
    setShowForm(false);
  };

  if (!user) {
    return (
      <div className="alert alert-warning">
        Please log in to track your mood.
      </div>
    );
  }

  const getMoodEmoji = (avg) => {
    if (avg >= 4) return { icon: FiSmile, color: "#43e97b", label: "Great" };
    if (avg >= 3) return { icon: FiMeh, color: "#4facfe", label: "Good" };
    return { icon: FiFrown, color: "#ffa502", label: "Needs Care" };
  };

  const moodStatus = getMoodEmoji(parseFloat(stats.avgMood));
  const MoodIcon = moodStatus.icon;

  return (
    <div className="mood-page-container">
      {/* Page Header */}
      <motion.div
        className="mood-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-title-section">
            <div className="header-icon">
              <FiActivity />
            </div>
            <div>
              <h1 className="page-title">Mood Tracking</h1>
              <p className="page-subtitle">
                Monitor your emotional wellbeing over time
              </p>
            </div>
          </div>
          <motion.button
            className="btn-add-mood"
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlusCircle />
            {showForm ? "Cancel" : "Log Mood"}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="mood-stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ backgroundColor: moodStatus.color + "20" }}>
            <MoodIcon style={{ color: moodStatus.color }} size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.avgMood || "0.0"}</div>
            <div className="stat-label">Average Mood</div>
            <div className="stat-badge" style={{ color: moodStatus.color }}>
              {moodStatus.label}
            </div>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ backgroundColor: "#DCD6F720" }}>
            <FiBarChart2 style={{ color: "#ADA3DC" }} size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Entries</div>
            <div className="stat-badge" style={{ color: "#ADA3DC" }}>
              All time
            </div>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ backgroundColor: "#B8C9B320" }}>
            <FiCalendar style={{ color: "#8FA888" }} size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisWeek}</div>
            <div className="stat-label">This Week</div>
            <div className="stat-badge" style={{ color: "#8FA888" }}>
              Last 7 days
            </div>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ backgroundColor: "#F4CDBB20" }}>
            <FiZap style={{ color: "#E8A78A" }} size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.streak}</div>
            <div className="stat-label">Day Streak</div>
            <div className="stat-badge" style={{ color: "#E8A78A" }}>
              {stats.streak > 0 ? "Keep going!" : "Start today"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mood Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="mood-form-container glass-card-lg"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-header">
              <div className="form-header-icon">
                <FiPlusCircle />
              </div>
              <div>
                <h3 className="form-title">How are you feeling?</h3>
                <p className="form-subtitle">
                  Take a moment to check in with yourself
                </p>
              </div>
            </div>
            <MoodForm onMoodSubmit={handleMoodSubmit} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood History */}
      <motion.div
        className="mood-history-container glass-card-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="history-header">
          <div className="history-header-content">
            <div className="history-icon">
              <FiClock />
            </div>
            <div>
              <h3 className="history-title">Your Mood Journey</h3>
              <p className="history-subtitle">
                {entries.length > 0
                  ? `${entries.length} ${entries.length === 1 ? "entry" : "entries"} recorded`
                  : "No entries yet"}
              </p>
            </div>
          </div>
          {entries.length > 0 && (
            <div className="view-insights-badge">
              <FiTrendingUp />
              <span>Track Progress</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your mood history...</p>
          </div>
        ) : entries.length > 0 ? (
          <MoodList entries={entries} showAll={true} />
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="empty-icon">
              <FiActivity />
            </div>
            <h4>Start Your Mood Journey</h4>
            <p>
              Track your emotional wellbeing and discover patterns over time.
              <br />
              Click "Log Mood" above to record your first entry!
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              <FiPlusCircle />
              Create First Entry
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodPage;
