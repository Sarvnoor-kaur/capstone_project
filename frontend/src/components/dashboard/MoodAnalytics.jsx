import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { TrendingUp, Calendar, Target, Zap } from "lucide-react";
import axios from "../../api/axiosClient";
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
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("trend");

  useEffect(() => {
    let isMounted = true;
    const fetchMoods = async () => {
      try {
        const response = await axios.get("/mood");
        const moods = response.data || [];
        if (isMounted) {
          processMoodData(moods);
        }
      } catch (err) {
        console.warn("Failed to fetch mood data, displaying sample data", err);
        if (isMounted) {
          setMoodData(DEFAULT_SAMPLE_DATA);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
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
        const mDate = new Date(m.createdAt || m.date)
          .toISOString()
          .split("T")[0];
        return mDate === dateStr;
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
        score: avgScore ? parseFloat(avgScore.toFixed(1)) : 3.5,
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

  const CustomTooltip = ({ active, payload, label }) => {
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

  return (
    <section className="mood-analytics-section">
      <motion.div
        className="analytics-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="analytics-title">Weekly Mood Insights</h2>
          <p className="analytics-subtitle">
            Track your emotional patterns and progress
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="analytics-stats-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
      </motion.div>

      {/* Chart Tabs */}
      <motion.div
        className="chart-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          className={`chart-tab ${activeChart === "trend" ? "active" : ""}`}
          onClick={() => setActiveChart("trend")}
        >
          Mood Trend
        </button>
        <button
          className={`chart-tab ${activeChart === "bar" ? "active" : ""}`}
          onClick={() => setActiveChart("bar")}
        >
          Daily Entries
        </button>
      </motion.div>

      {/* Chart Area */}
      <motion.div
        className="chart-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {activeChart === "trend" ? (
          <ResponsiveContainer width="100%" height={320} minWidth={100} minHeight={200}>
            <AreaChart
              data={moodData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A99BEA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A99BEA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(220, 214, 247, 0.3)"
              />
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                fontSize={13}
                fontWeight={500}
                tickLine={false}
              />
              <YAxis
                domain={[0, 5]}
                stroke="#9CA3AF"
                fontSize={13}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#A99BEA"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#moodGradient)"
                connectNulls
                dot={{
                  fill: "#A99BEA",
                  strokeWidth: 2,
                  stroke: "white",
                  r: 5,
                }}
                activeDot={{
                  r: 7,
                  fill: "#8B7FD9",
                  stroke: "white",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={320} minWidth={100} minHeight={200}>
            <BarChart
              data={moodData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(220, 214, 247, 0.3)"
              />
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                fontSize={13}
                fontWeight={500}
                tickLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={13}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="entries" fill="#DCD6F7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </section>
  );
};

export default MoodAnalytics;
