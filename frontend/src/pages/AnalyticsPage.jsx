import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import { motion } from "framer-motion";
import {
  TrendingUp, Calendar, Activity, BarChart2, Zap,
  PieChart, Clock, Flame, Award, RefreshCw,
} from "lucide-react";

// All the existing chart components
import MoodHeatmap        from "../components/MoodHeatmap";
import MoodScatterChart   from "../components/MoodScatterChart";
import MoodTrendChart     from "../components/MoodTrendChart";
import WeeklyComparisonChart from "../components/WeeklyComparisonChart";
import TimeOfDayChart     from "../components/TimeOfDayChart";
import MoodGaugeChart     from "../components/MoodGaugeChart";
import MoodFrequencyChart from "../components/MoodFrequencyChart";
import MonthlySummaryChart from "../components/MonthlySummaryChart";
import MoodDistributionChart from "../components/MoodDistributionChart";
import MoodRadarChart     from "../components/MoodRadarChart";

import "./AnalyticsPage.css";

/* ───── sample fallback data ───── */
const SAMPLE_ENTRIES = Array.from({ length: 30 }, (_, i) => ({
  mood: Math.floor(Math.random() * 3) + 3,
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [usingSample, setUsingSample] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const loadEntries = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/mood");
      const data = res.data || [];
      if (data.length > 0) {
        setEntries(data);
        setUsingSample(false);
      } else {
        setEntries(SAMPLE_ENTRIES);
        setUsingSample(true);
      }
    } catch {
      setEntries(SAMPLE_ENTRIES);
      setUsingSample(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEntries(); }, [user]);

  /* ─── summary stats ─── */
  const stats = (() => {
    if (!entries.length) return { avg: 0, total: 0, streak: 0, best: 0 };
    const avg   = (entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1);
    const best  = Math.max(...entries.map(e => e.mood));
    const total = entries.length;

    // streak
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i].date);
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      if (d.toDateString() === expected.toDateString()) streak++;
      else break;
    }
    return { avg, total, streak, best };
  })();

  const tabs = [
    { id: "overview",   label: "Overview",          icon: Activity },
    { id: "trends",     label: "Trends & Timeline", icon: TrendingUp },
    { id: "breakdown",  label: "Mood Breakdown",    icon: PieChart },
    { id: "patterns",   label: "Time Patterns",     icon: Clock },
    { id: "heatmap",    label: "12-Week Heatmap",   icon: Calendar },
    { id: "monthly",    label: "Monthly Summary",   icon: BarChart2 },
  ];

  const statCards = [
    { label: "Average Mood",   value: `${stats.avg}/5`, icon: TrendingUp, color: "lavender" },
    { label: "Total Entries",  value: stats.total,       icon: Activity,   color: "mint"     },
    { label: "Day Streak",     value: `${stats.streak}d`,icon: Flame,      color: "peach"    },
    { label: "Best Mood",      value: `${stats.best}/5`, icon: Award,      color: "purple"   },
  ];

  if (loading) return (
    <div className="analytics-loading">
      <div className="analytics-loading-spinner" />
      <p>Loading your mood analytics…</p>
    </div>
  );

  return (
    <div className="analytics-page">

      {/* ── Header ── */}
      <motion.div
        className="analytics-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="analytics-page-header-left">
          <div className="analytics-page-badge">
            <Activity size={15} />
            <span>Mood Intelligence</span>
          </div>
          <h1 className="analytics-page-title">Your Wellness Analytics</h1>
          <p className="analytics-page-subtitle">
            Deep insights into your emotional patterns, trends, and wellbeing journey
          </p>
        </div>
        <button className="analytics-refresh-btn" onClick={loadEntries}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* ── Sample data notice ── */}
      {usingSample && (
        <div className="analytics-sample-notice">
          <Zap size={15} />
          Showing demo data — start logging moods to see your real analytics!
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="analytics-stat-grid">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              className="analytics-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className={`analytics-stat-icon ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="analytics-stat-label">{card.label}</p>
                <p className="analytics-stat-value">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Tab Nav ── */}
      <nav className="analytics-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`analytics-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ═══════════════════════════════
              TAB: OVERVIEW
      ═══════════════════════════════ */}
      {activeTab === "overview" && (
        <motion.div
          className="analytics-tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Gauge + Scatter side by side */}
          <div className="analytics-two-col">
            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>Wellness Score</h3>
                <p>Overall mood health gauge</p>
              </div>
              <MoodGaugeChart entries={entries} />
            </div>

            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>Mood Scatter Plot</h3>
                <p>All entries mapped over time</p>
              </div>
              <MoodScatterChart entries={entries} />
            </div>
          </div>

          {/* Distribution + Radar */}
          <div className="analytics-two-col">
            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>Mood Distribution</h3>
                <p>How often each mood appears</p>
              </div>
              <MoodDistributionChart entries={entries} />
            </div>

            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>360° Mood Radar</h3>
                <p>Emotional balance across states</p>
              </div>
              <MoodRadarChart entries={entries} />
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════
              TAB: TRENDS
      ═══════════════════════════════ */}
      {activeTab === "trends" && (
        <motion.div
          className="analytics-tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>30-Day Mood Trend</h3>
              <p>Your daily average mood over the past month</p>
            </div>
            <MoodTrendChart entries={entries} />
          </div>

          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>Weekly Comparison</h3>
              <p>Side-by-side average mood across the last 4 weeks</p>
            </div>
            <WeeklyComparisonChart entries={entries} />
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════
              TAB: BREAKDOWN
      ═══════════════════════════════ */}
      {activeTab === "breakdown" && (
        <motion.div
          className="analytics-tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>Mood Frequency Chart</h3>
              <p>How many times each emotion was recorded</p>
            </div>
            <MoodFrequencyChart entries={entries} />
          </div>

          <div className="analytics-two-col">
            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>Mood Distribution (Donut)</h3>
                <p>Percentage breakdown of moods</p>
              </div>
              <MoodDistributionChart entries={entries} />
            </div>

            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>Mood Scatter</h3>
                <p>Entry-by-entry mood mapping</p>
              </div>
              <MoodScatterChart entries={entries} />
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════
              TAB: TIME PATTERNS
      ═══════════════════════════════ */}
      {activeTab === "patterns" && (
        <motion.div
          className="analytics-tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>Time of Day Analysis</h3>
              <p>When do you feel your best? Morning, afternoon, evening or night?</p>
            </div>
            <TimeOfDayChart entries={entries} />
          </div>

          <div className="analytics-two-col">
            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>Radar Balance</h3>
                <p>Emotional balance visualization</p>
              </div>
              <MoodRadarChart entries={entries} />
            </div>

            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>Wellness Gauge</h3>
                <p>Your current overall wellness score</p>
              </div>
              <MoodGaugeChart entries={entries} />
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════
              TAB: HEATMAP
      ═══════════════════════════════ */}
      {activeTab === "heatmap" && (
        <motion.div
          className="analytics-tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>12-Week Mood Heatmap</h3>
              <p>Like GitHub's contribution graph — your mood logged every day across 12 weeks</p>
            </div>
            <MoodHeatmap entries={entries} />
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════
              TAB: MONTHLY
      ═══════════════════════════════ */}
      {activeTab === "monthly" && (
        <motion.div
          className="analytics-tab-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>6-Month Mood Summary</h3>
              <p>Dual-line chart showing average, highest and lowest mood each month</p>
            </div>
            <MonthlySummaryChart entries={entries} />
          </div>

          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>30-Day Daily Trend</h3>
              <p>Smooth area chart of your daily average mood</p>
            </div>
            <MoodTrendChart entries={entries} />
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default AnalyticsPage;
