import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock, CheckCircle, Bell, Activity, BookOpen,
} from "lucide-react";
import axios from "../../api/axiosClient";
import "./RecentActivity.css";

const parseMoodValue = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 3;
  const num = parseInt(val, 10);
  if (!isNaN(num) && num >= 1 && num <= 5) return num;
  const str = String(val).toLowerCase();
  const map = {
    "very sad": 1,
    sad: 2,
    okay: 3,
    good: 4,
    happy: 4,
    great: 5,
    "very happy": 5,
    calm: 4,
    anxious: 2,
    stressed: 1,
  };
  return map[str] || 3;
};

const getMoodInfo = (val) => {
  const num = parseMoodValue(val);
  const map = {
    1: { emoji: "😢", label: "Very Sad", color: "#FF6B9D" },
    2: { emoji: "😔", label: "Sad", color: "#FFA502" },
    3: { emoji: "😐", label: "Okay", color: "#4FACFE" },
    4: { emoji: "😊", label: "Happy", color: "#43E97B" },
    5: { emoji: "😄", label: "Great", color: "#A99BEA" },
  };
  return map[num] || { emoji: "😊", label: "Good", color: "#43E97B" };
};

const SAMPLE_RECENT_ACTIVITIES = [
  {
    _id: "s1",
    mood: 4,
    note: "Morning check-in: Feeling refreshed and ready for classes",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "s2",
    mood: 5,
    note: "Completed 10 min Sleep Meditation before bed",
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    _id: "s3",
    mood: 3,
    note: "Midday 4-7-8 Breathing session between lectures",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "s4",
    mood: 5,
    note: "Completed weekly wellness assessment with great scores",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const RecentActivity = () => {
  const [recentMoods, setRecentMoods] = useState(SAMPLE_RECENT_ACTIVITIES);

  useEffect(() => {
    let isMounted = true;
    const fetchRecentMoods = async () => {
      try {
        const response = await axios.get("/mood");
        const moods = (Array.isArray(response?.data) ? response.data : []).slice(0, 5);
        if (isMounted) {
          if (moods.length > 0) {
            setRecentMoods(moods);
          } else {
            setRecentMoods(SAMPLE_RECENT_ACTIVITIES);
          }
        }
      } catch (err) {
        console.warn("Could not fetch real moods, showing sample activities", err);
        if (isMounted) {
          setRecentMoods(SAMPLE_RECENT_ACTIVITIES);
        }
      }
    };
    fetchRecentMoods();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Recent";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const reminders = [
    {
      id: 1,
      title: "Evening Check-In",
      description: "Take a moment to reflect on your day",
      time: "8:00 PM",
      icon: Activity,
      color: "#DCD6F7",
    },
    {
      id: 2,
      title: "Weekly Assessment",
      description: "Complete your weekly wellness assessment",
      time: "Sunday",
      icon: BookOpen,
      color: "#B8E6D5",
    },
    {
      id: 3,
      title: "Breathing Exercise",
      description: "5-minute guided breathing session",
      time: "Tomorrow",
      icon: Clock,
      color: "#F4CDBB",
    },
  ];

  return (
    <section className="recent-activity-section">
      <div className="activity-columns">
        {/* Recent Activity */}
        <motion.div
          className="activity-column"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="column-header">
            <div className="column-header-icon">
              <Clock size={20} />
            </div>
            <h3 className="column-title">Recent Activity</h3>
          </div>

          <div className="activity-list">
            {recentMoods.map((entry, index) => {
              const info = getMoodInfo(entry.mood);
              return (
                <motion.div
                  key={entry._id || index}
                  className="activity-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <div className="activity-item-icon">
                    <span className="activity-emoji">{info.emoji}</span>
                  </div>
                  <div className="activity-item-content">
                    <p className="activity-item-title">
                      Mood: <strong>{info.label}</strong>
                    </p>
                    {entry.note && (
                      <p className="activity-item-note">{entry.note}</p>
                    )}
                    <span className="activity-item-time">
                      {formatTimeAgo(entry.createdAt || entry.date)}
                    </span>
                  </div>
                  <CheckCircle size={16} className="activity-check" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Reminders */}
        <motion.div
          className="activity-column"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="column-header">
            <div className="column-header-icon reminder">
              <Bell size={20} />
            </div>
            <h3 className="column-title">Upcoming Reminders</h3>
          </div>

          <div className="reminder-list">
            {reminders.map((reminder, index) => {
              const Icon = reminder.icon;
              return (
                <motion.div
                  key={reminder.id}
                  className="reminder-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <div
                    className="reminder-icon"
                    style={{ background: reminder.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="reminder-content">
                    <p className="reminder-title">{reminder.title}</p>
                    <p className="reminder-description">
                      {reminder.description}
                    </p>
                  </div>
                  <span className="reminder-time">{reminder.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentActivity;
