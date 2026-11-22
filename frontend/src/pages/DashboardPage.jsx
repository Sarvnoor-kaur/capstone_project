import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import WelcomeHero from "../components/dashboard/WelcomeHero";
import DailyMoodCheck from "../components/dashboard/DailyMoodCheck";
import AICompanionPromo from "../components/dashboard/AICompanionPromo";
import WellnessCarousel from "../components/dashboard/WellnessCarousel";
import WellnessGallery from "../components/dashboard/WellnessGallery";
import MoodAnalytics from "../components/dashboard/MoodAnalytics";
import WellnessActivities from "../components/dashboard/WellnessActivities";
import WellnessResources from "../components/dashboard/WellnessResources";
import RecentActivity from "../components/dashboard/RecentActivity";
import {
  TrendingUp,
  Wind,
  Sparkles,
  Compass,
  Image,
  BookOpen,
  Bell,
  BookHeart,
} from "lucide-react";
import "../styles/premium-base.css";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [moodRefreshKey, setMoodRefreshKey] = useState(0);

  const handleMoodSubmit = async (mood) => {
    try {
      // Backend Mongoose schema requires `mood` to be a Number (1 to 5)
      await axios.post("/mood", {
        mood: Number(mood.value) || 3,
        note: `Checked in feeling ${mood.label}`,
      });
      // Trigger refresh for analytics & recent activities
      setMoodRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to submit mood", err);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const quickJumpTabs = [
    { label: "Private Journal", icon: BookHeart, route: "/journal" },
    { label: "Mood Analytics", icon: TrendingUp, targetId: "mood-analytics-section" },
    { label: "Breathing Exercise", icon: Wind, route: "/breathing" },
    { label: "AI Companion", icon: Sparkles, targetId: "ai-companion-section" },
    { label: "Recommended Activities", icon: Compass, targetId: "activities-section" },
    { label: "Inspiration Gallery", icon: Image, targetId: "gallery-section" },
    { label: "Wellness Resources", icon: BookOpen, targetId: "resources-section" },
    { label: "Recent & Reminders", icon: Bell, targetId: "recent-activity-section" },
  ];

  return (
    <div className="premium-dashboard">
      {/* 1. Large Welcome Hero Section with Lifestyle Photography */}
      <WelcomeHero userName={user?.name || "Friend"} />

      {/* Quick Jump Section Pills */}
      <nav className="dashboard-quick-nav" aria-label="Dashboard quick navigation">
        <div className="quick-nav-track">
          {quickJumpTabs.map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <button
                key={idx}
                className="quick-nav-pill"
                onClick={() => {
                  if (tab.route) {
                    navigate(tab.route);
                  } else if (tab.targetId) {
                    scrollToSection(tab.targetId);
                  }
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Interactive Daily Mood Check-in */}
      <div id="mood-checkin-section">
        <DailyMoodCheck onMoodSubmit={handleMoodSubmit} />
      </div>

      {/* 3. PROMINENT: Weekly Mood Analytics & Progress Charts (Moved right after Check-in!) */}
      <div id="mood-analytics-section">
        <MoodAnalytics key={`analytics-${moodRefreshKey}`} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.25rem", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/analytics")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.85rem 2rem",
              background: "linear-gradient(135deg, #A99BEA 0%, #8B7FD9 100%)",
              color: "white", border: "none", borderRadius: "9999px",
              fontFamily: "var(--font-primary)", fontSize: "0.9375rem", fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(169,155,234,0.4)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(169,155,234,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 20px rgba(169,155,234,0.4)"; }}
          >
            <TrendingUp size={18} />
            View Full Analytics Dashboard →
          </button>
        </div>
      </div>

      {/* 4. AI Companion Promotional Section with 3D Illustration & CTA */}
      <div id="ai-companion-section">
        <AICompanionPromo />
      </div>

      {/* 5. Personalized Wellness Activity Recommendations */}
      <div id="activities-section">
        <WellnessActivities />
      </div>

      {/* 6. Explore Wellness Horizontal Swiper Carousel */}
      <div id="explore-carousel-section">
        <WellnessCarousel />
      </div>

      {/* 7. Masonry-style Wellness Image Gallery with Interactive Lightbox */}
      <div id="gallery-section">
        <WellnessGallery />
      </div>

      {/* 8. Educational Wellness Resources Section */}
      <div id="resources-section">
        <WellnessResources />
      </div>

      {/* 9. Recent Activity Timeline & Upcoming Wellness Reminders */}
      <div id="recent-activity-section">
        <RecentActivity key={`activity-${moodRefreshKey}`} />
      </div>
    </div>
  );
};

export default DashboardPage;
