import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Wind, Moon, BookOpen, Heart, Brain, Music,
  ChevronRight, Clock, Star,
} from "lucide-react";
import "./WellnessActivities.css";

const WellnessActivities = () => {
  const navigate = useNavigate();

  const activities = [
    {
      id: 1,
      title: "4-7-8 Breathing",
      description:
        "Calm your nervous system with this simple yet powerful breathing technique",
      duration: "3 min",
      difficulty: "Easy",
      icon: Wind,
      color: "#B8E6D5",
      bgColor: "rgba(184, 230, 213, 0.15)",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    },
    {
      id: 2,
      title: "Sleep Meditation",
      description:
        "Guided visualization to help you drift off into peaceful sleep",
      duration: "10 min",
      difficulty: "Easy",
      icon: Moon,
      color: "#DCD6F7",
      bgColor: "rgba(220, 214, 247, 0.15)",
      image:
        "https://images.unsplash.com/photo-1541480551145-2370a440d585?w=400&q=80",
    },
    {
      id: 3,
      title: "Gratitude Journal",
      description:
        "Write down three things you're grateful for to boost positive thinking",
      duration: "5 min",
      difficulty: "Easy",
      icon: BookOpen,
      color: "#F4CDBB",
      bgColor: "rgba(244, 205, 187, 0.15)",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
    },
    {
      id: 4,
      title: "Self-Compassion Practice",
      description:
        "Learn to treat yourself with the same kindness you'd offer a friend",
      duration: "7 min",
      difficulty: "Medium",
      icon: Heart,
      color: "#FFE5D9",
      bgColor: "rgba(255, 229, 217, 0.15)",
      image:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80",
    },
    {
      id: 5,
      title: "Focus Meditation",
      description:
        "Sharpen your concentration with mindfulness exercises for students",
      duration: "8 min",
      difficulty: "Medium",
      icon: Brain,
      color: "#A99BEA",
      bgColor: "rgba(169, 155, 234, 0.15)",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    },
    {
      id: 6,
      title: "Calming Sounds",
      description:
        "Listen to curated nature sounds and ambient music for relaxation",
      duration: "15 min",
      difficulty: "Easy",
      icon: Music,
      color: "#B8E6D5",
      bgColor: "rgba(184, 230, 213, 0.15)",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    },
  ];

  return (
    <section className="wellness-activities-section">
      <motion.div
        className="activities-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="activities-title">Recommended For You</h2>
          <p className="activities-subtitle">
            Personalized wellness activities based on your mood patterns
          </p>
        </div>
        <button
          className="activities-view-all"
          onClick={() => navigate("/resources")}
        >
          <span>View All</span>
          <ChevronRight size={20} />
        </button>
      </motion.div>

      <div className="activities-grid">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              className="activity-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => {
                if (activity.title.toLowerCase().includes("breathing")) {
                  navigate("/breathing");
                } else {
                  navigate("/resources");
                }
              }}
            >
              <div className="activity-image-section">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="activity-image"
                  loading="lazy"
                />
                <div
                  className="activity-image-overlay"
                  style={{
                    background: `linear-gradient(180deg, transparent 30%, ${activity.color}CC 100%)`,
                  }}
                />
                <div className="activity-duration-badge">
                  <Clock size={14} />
                  <span>{activity.duration}</span>
                </div>
              </div>

              <div className="activity-content">
                <div
                  className="activity-icon-wrapper"
                  style={{ background: activity.bgColor }}
                >
                  <Icon size={20} style={{ color: activity.color }} />
                </div>
                <h3 className="activity-title">{activity.title}</h3>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-footer">
                  <span className="activity-difficulty">
                    <Star size={14} />
                    {activity.difficulty}
                  </span>
                  <button className="activity-start-btn">
                    Start
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WellnessActivities;
