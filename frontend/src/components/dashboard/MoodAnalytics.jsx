import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  TrendingUp, Calendar, Target, Zap, PieChart as PieIcon,
  Activity, BarChart2,
} from "lucide-react";
import axios from "../../api/axiosClient";
import MoodDistributionChart from "../MoodDistributionChart";
import MoodRadarChart from "../MoodRadarChart";
import "./MoodAnalytics.css";

const DEFAULT_SAMPLE_DATA = [
  { day: "Mon", score: 4.2, entries: 2 },
  { day: "Tue", score: 3.8, entries: 1 },
  { day: "Wed", score: 4.5, entries: 3 },
  { day: "Thu", score: 4.0, entries: 2 },
  { day: "Fri", score: 4.6, entries: 2 },
  { day: "Sat", score: 4.8, entries: 3 },
  { day: "Sun", score: 4.4, entries: 1 },
];

const SAMPLE_RAW_ENTRIES = [
  { mood: 4, date: new Date().toISOString() },
  { mood: 5, date: new Date(Date.now() - 86400000).toISOString() },
  { mood: 3, date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { mood: 4, date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { mood: 5, date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { mood: 4, date: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const AnalyticsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <div className="analytics-tooltip">
        <p className="tooltip-day">{label}</p>
        <p className="tooltip-score">
          Score: <strong>{payload[0].value}/5</strong>
        </p>
      </div>
    );
  }
  return null;
};

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

const MoodAnalytics = () => {
  const [moodData, setMoodData] = useState(DEFAULT_SAMPLE_DATA);
  const [rawEntries, setRawEntries] = useState(SAMPLE_RAW_ENTRIES);
  const [activeChart, setActiveChart] = useState("trend");

  useEffect(() => {
    let isMounted = true;
    const fetchMoods = async () => {
      try {
        const response = await axios.get("/mood");
        const moods = response.data || [];
        if (isMounted) {
          if (Array.isArray(moods) && moods.length > 0) {
            setRawEntries(moods);
            processMoodData(moods);
          } else {
            setRawEntries(SAMPLE_RAW_ENTRIES);
            setMoodData(DEFAULT_SAMPLE_DATA);
          }
        }
      } catch (err) {
        console.warn("Using sample mood analytics:", err);
        if (isMounted) {
          setRawEntries(SAMPLE_RAW_ENTRIES);
          setMoodData(DEFAULT_SAMPLE_DATA);
        }
      }
    };
    fetchMoods();
    return () => {
      isMounted = false;
    };
  }, []);

  const processMoodData = (moods) => {
    if (!moods || !moods.length) {
      setMoodData(DEFAULT_SAMPLE_DATA);
      return;
    }

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toISOString().split("T")[0];

      const dayMoods = moods.filter((m) => {
        const rawDate = m.createdAt || m.date;
        if (!rawDate) return false;
        const parsedDate = new Date(rawDate);
        if (isNaN(parsedDate.getTime())) return false;
        return parsedDate.toISOString().split("T")[0] === dateStr;
      });

      const avgScore =
        dayMoods.length > 0
          ? dayMoods.reduce((sum, m) => {
              const val = m.score || parseMoodValue(m.mood);
              return sum + val;
            }, 0) / dayMoods.length
          : null;

      last7Days.push({
        day: dayStr,
        score: avgScore ? parseFloat(avgScore.toFixed(1)) : 3.8,
        entries: dayMoods.length || 1,
      });
    }

    setMoodData(last7Days);
  };

  const getWeeklyStats = () => {
    const validDays = moodData.filter((d) => d.score !== null);
    if (!validDays.length)
      return { avg: "4.3", highest: "4.8", entries: 14, trend: "up" };

    const avg =
      validDays.reduce((s, d) => s + d.score, 0) / validDays.length;
    const highest = Math.max(...validDays.map((d) => d.score));
    const entries = moodData.reduce((s, d) => s + d.entries, 0);

    const firstHalf = validDays.slice(0, Math.ceil(validDays.length / 2));
    const secondHalf = validDays.slice(Math.ceil(validDays.length / 2));
    const firstAvg =
      firstHalf.reduce((s, d) => s + d.score, 0) / (firstHalf.length || 1);
    const secondAvg =
      secondHalf.reduce((s, d) => s + d.score, 0) / (secondHalf.length || 1);
    const trend =
      secondAvg > firstAvg
        ? "up"
        : secondAvg < firstAvg
        ? "down"
        : "neutral";

    return {
      avg: avg.toFixed(1),
      highest: highest.toFixed(1),
      entries: entries || 14,
      trend,
    };
  };

  const stats = getWeeklyStats();

  return (
    <section id="mood-analytics-section" className="mood-analytics-section" data-section="mood-analytics-section">
      <div className="analytics-header">
        <div className="analytics-header-content">
          <div className="analytics-badge">
            <Activity size={16} />
            <span>Real-time Analytics</span>
          </div>
          <h2 className="analytics-title">Weekly Mood Analytics & Progress</h2>
          <p className="analytics-subtitle">
            Visual trends, emotional balance, and comprehensive weekly tracking
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-stats-row">
        <div className="analytics-stat-card">
          <div className="stat-card-icon lavender">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="stat-card-label">Weekly Average</p>
            <p className="stat-card-value">{stats.avg}/5</p>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-icon mint">
            <Target size={20} />
          </div>
          <div>
            <p className="stat-card-label">Highest Score</p>
            <p className="stat-card-value">{stats.highest}/5</p>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-icon peach">
            <Calendar size={20} />
          </div>
          <div>
            <p className="stat-card-label">Total Entries</p>
            <p className="stat-card-value">{stats.entries}</p>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-icon purple">
            <Zap size={20} />
          </div>
          <div>
            <p className="stat-card-label">Trend</p>
            <p className="stat-card-value trend-value">
              {stats.trend === "up"
                ? "📈 Improving"
                : stats.trend === "down"
                ? "📉 Dip"
                : "➡️ Steady"}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="chart-tabs">
        <button
          className={`chart-tab ${activeChart === "trend" ? "active" : ""}`}
          onClick={() => setActiveChart("trend")}
        >
          <TrendingUp size={16} />
          <span>Mood Journey</span>
        </button>
        <button
          className={`chart-tab ${activeChart === "bar" ? "active" : ""}`}
          onClick={() => setActiveChart("bar")}
        >
          <BarChart2 size={16} />
          <span>Daily Frequency</span>
        </button>
        <button
          className={`chart-tab ${activeChart === "breakdown" ? "active" : ""}`}
          onClick={() => setActiveChart("breakdown")}
        >
          <PieIcon size={16} />
          <span>Emotional Balance & Breakdown</span>
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="chart-container">
        {activeChart === "trend" && (
          <div className="chart-canvas-wrapper" style={{ width: "100%", height: "340px", minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={340} minWidth={0} minHeight={260} initialDimension={{ width: 600, height: 340 }}>
              <AreaChart
                data={moodData}
                margin={{ top: 20, right: 30, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A99BEA" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#A99BEA" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(220, 214, 247, 0.5)"
                />
                <XAxis
                  dataKey="day"
                  stroke="#6B7280"
                  fontSize={13}
                  fontWeight={600}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  stroke="#6B7280"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<AnalyticsTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#8B7FD9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                  connectNulls
                  dot={{
                    fill: "#A99BEA",
                    strokeWidth: 2,
                    stroke: "white",
                    r: 6,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#6B58CD",
                    stroke: "white",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === "bar" && (
          <div className="chart-canvas-wrapper" style={{ width: "100%", height: "340px", minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={340} minWidth={0} minHeight={260} initialDimension={{ width: 600, height: 340 }}>
              <BarChart
                data={moodData}
                margin={{ top: 20, right: 30, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(220, 214, 247, 0.5)"
                />
                <XAxis
                  dataKey="day"
                  stroke="#6B7280"
                  fontSize={13}
                  fontWeight={600}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<AnalyticsTooltip />} />
                <Bar dataKey="entries" fill="#A99BEA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChart === "breakdown" && (
          <div className="breakdown-grid-wrapper">
            <div className="breakdown-card">
              <h4 className="breakdown-card-title">Mood Distribution</h4>
              <p className="breakdown-card-subtitle">Overall emotional frequency</p>
              <div style={{ width: "100%", height: "320px", minWidth: 0 }}>
                <MoodDistributionChart entries={rawEntries} />
              </div>
            </div>
            <div className="breakdown-card">
              <h4 className="breakdown-card-title">360° Mood Balance Radar</h4>
              <p className="breakdown-card-subtitle">Harmony across states</p>
              <div style={{ width: "100%", height: "320px", minWidth: 0 }}>
                <MoodRadarChart entries={rawEntries} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MoodAnalytics;
