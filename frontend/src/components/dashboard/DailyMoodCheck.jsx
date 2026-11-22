import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Calendar } from "lucide-react";
import "./DailyMoodCheck.css";

const DailyMoodCheck = ({ onMoodSubmit }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { id: 1, emoji: "😢", label: "Very Sad", color: "#FF6B9D", value: 1 },
    { id: 2, emoji: "😔", label: "Sad", color: "#FFA502", value: 2 },
    { id: 3, emoji: "😐", label: "Okay", color: "#4FACFE", value: 3 },
    { id: 4, emoji: "😊", label: "Happy", color: "#43E97B", value: 4 },
    { id: 5, emoji: "😄", label: "Very Happy", color: "#A99BEA", value: 5 },
  ];

  const handleMoodClick = async (mood) => {
    setSelectedMood(mood);
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onMoodSubmit) {
        onMoodSubmit(mood);
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const weeklyStats = {
    avgMood: 4.2,
    streak: 7,
    totalEntries: 45,
  };

  return (
    <div className="daily-mood-check">
      {/* Main Check-in Card */}
      <motion.div
        className="mood-check-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mood-card-header">
          <div className="mood-header-icon">
            <Heart size={24} />
          </div>
          <div>
            <h2 className="mood-card-title">Daily Check-In</h2>
            <p className="mood-card-subtitle">How are you feeling today?</p>
          </div>
        </div>

        {/* Mood Options */}
        <div className="mood-options-grid">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              className={`mood-option ${selectedMood?.id === mood.id ? "selected" : ""}`}
              onClick={() => handleMoodClick(mood)}
              disabled={isSubmitting}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                "--mood-color": mood.color,
              }}
            >
              <div className="mood-emoji">{mood.emoji}</div>
              <div className="mood-label">{mood.label}</div>
              {selectedMood?.id === mood.id && (
                <motion.div
                  className="mood-selected-ring"
                  layoutId="selectedMood"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Mood Feedback */}
        {selectedMood && (
          <motion.div
            className="mood-feedback"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="feedback-text">
              Great! You're feeling <strong>{selectedMood.label.toLowerCase()}</strong> today.
            </p>
            {isSubmitting && (
              <div className="feedback-loader">
                <div className="loader-spinner" />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Weekly Summary Cards */}
      <div className="mood-stats-grid">
        <motion.div
          className="mood-stat-card lavender"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Weekly Average</p>
            <p className="stat-value">{weeklyStats.avgMood.toFixed(1)}/5</p>
          </div>
        </motion.div>

        <motion.div
          className="mood-stat-card peach"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="stat-icon">
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Current Streak</p>
            <p className="stat-value">{weeklyStats.streak} days</p>
          </div>
        </motion.div>

        <motion.div
          className="mood-stat-card mint"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="stat-icon">
            <Heart size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Entries</p>
            <p className="stat-value">{weeklyStats.totalEntries}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DailyMoodCheck;
