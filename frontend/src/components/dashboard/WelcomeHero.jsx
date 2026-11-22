import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Wind, Brain, Heart, Sun,
  TrendingUp, Smile, Calendar, BookHeart,
} from "lucide-react";
import "./WelcomeHero.css";

const QUOTES = [
  { text: "You are stronger than you know, braver than you believe.", emoji: "🌸" },
  { text: "Small steps every day lead to big changes over time.", emoji: "🌿" },
  { text: "Your mental health is a priority. Always.", emoji: "💜" },
  { text: "It's okay to not be okay — but keep going.", emoji: "✨" },
  { text: "Rest is not a reward. It is a necessity.", emoji: "🌙" },
];

const WelcomeHero = ({ userName = "Friend" }) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 5)  return { text: "Good night",    emoji: "🌙" };
    if (h < 12) return { text: "Good morning",   emoji: "☀️" };
    if (h < 17) return { text: "Good afternoon", emoji: "🌤️" };
    if (h < 21) return { text: "Good evening",   emoji: "🌆" };
    return          { text: "Good night",        emoji: "🌙" };
  };

  const getCurrentDate = () =>
    new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });

  const greeting = getGreeting();
  const quote    = QUOTES[new Date().getDay() % QUOTES.length];

  /* quick-action buttons */
  const quickActions = [
    { label: "Journal",    icon: BookHeart, route: "/journal",    color: "mint"     },
    { label: "Check In",   icon: Smile,  route: "/mood",       color: "lavender" },
    { label: "Breathe",    icon: Wind,   route: "/breathing",  color: "peach"    },
    { label: "AI Chat",    icon: Brain,  route: "/ai-chat",    color: "purple"   },
  ];

  /* floating stat pills */
  const stats = [
    { icon: "🔥", label: "7-day streak", sub: "Keep it up!" },
    { icon: "😊", label: "Mood today",   sub: "Feeling good" },
  ];

  return (
    <section className="wh-root">

      {/* ══════════════ DECORATIVE ORBS ══════════════ */}
      <div className="wh-orb wh-orb-1" />
      <div className="wh-orb wh-orb-2" />
      <div className="wh-orb wh-orb-3" />

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="wh-left">

        {/* Date pill */}
        <motion.div
          className="wh-date-pill"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Calendar size={13} />
          <span>{getCurrentDate()}</span>
        </motion.div>

        {/* Greeting */}
        <motion.div
          className="wh-greeting-block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="wh-greeting-emoji">{greeting.emoji}</span>
          <h1 className="wh-heading">
            {greeting.text},<br />
            <span className="wh-name">{userName}!</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="wh-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Welcome back to your wellness journey. Take a moment to check in
          with yourself — every step counts. 💫
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="wh-cta-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <button className="wh-btn-primary" onClick={() => navigate("/mood")}>
            <Sparkles size={17} />
            <span>Check In Now</span>
            <ArrowRight size={16} />
          </button>
          <button className="wh-btn-ghost" onClick={() => navigate("/resources")}>
            Explore Resources
          </button>
        </motion.div>

        {/* Quick Action Cards */}
        <motion.div
          className="wh-quick-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                className={`wh-qa-card wh-qa-${a.color}`}
                onClick={() => navigate(a.route)}
              >
                <Icon size={18} />
                <span>{a.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Quote */}
        <motion.div
          className="wh-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span className="wh-quote-emoji">{quote.emoji}</span>
          <p className="wh-quote-text">"{quote.text}"</p>
        </motion.div>
      </div>

      {/* ══════════════ RIGHT PANEL — Photo ══════════════ */}
      <motion.div
        className="wh-right"
        initial={{ opacity: 0, scale: 0.95, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Photo card */}
        <div className="wh-photo-card">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=85"
            alt="Students in a calm wellness environment"
            className="wh-photo"
            loading="eager"
          />
          <div className="wh-photo-gradient" />

          {/* Floating badge on photo */}
          <div className="wh-photo-badge">
            <Heart size={14} className="wh-heart-icon" />
            <span>Your wellness matters</span>
          </div>
        </div>

        {/* Floating Stat Pills */}
        <div className="wh-stats-col">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="wh-stat-pill"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
            >
              <span className="wh-stat-icon">{s.icon}</span>
              <div>
                <p className="wh-stat-label">{s.label}</p>
                <p className="wh-stat-sub">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sun decoration */}
        <motion.div
          className="wh-sun-decoration"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sun size={28} />
        </motion.div>
      </motion.div>

    </section>
  );
};

export default WelcomeHero;
