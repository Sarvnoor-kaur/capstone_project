import { useState } from "react";
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
import "../styles/premium-base.css";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();
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

  return (
    <div className="premium-dashboard">
      {/* 1. Large Welcome Hero Section with Lifestyle Photography */}
      <WelcomeHero userName={user?.name || "Friend"} />

      {/* 2. Interactive Daily Mood Check-in & Weekly Mood Summary */}
      <DailyMoodCheck onMoodSubmit={handleMoodSubmit} />

      {/* 3. AI Companion Promotional Section with 3D Illustration & CTA */}
      <AICompanionPromo />

      {/* 4. Explore Wellness Horizontal Swiper Carousel */}
      <WellnessCarousel />

      {/* 5. Masonry-style Wellness Image Gallery with Interactive Lightbox */}
      <WellnessGallery />

      {/* 6. Personalized Wellness Activity Recommendations */}
      <WellnessActivities />

      {/* 7. Weekly Mood Analytics & Progress Charts (Real Data) */}
      <MoodAnalytics key={`analytics-${moodRefreshKey}`} />

      {/* 8. Educational Wellness Resources Section */}
      <WellnessResources />

      {/* 9. Recent Activity Timeline & Upcoming Wellness Reminders */}
      <RecentActivity key={`activity-${moodRefreshKey}`} />
    </div>
  );
};

export default DashboardPage;
