import { useMemo } from "react";

const MoodGaugeChart = ({ entries }) => {
  const score = useMemo(() => {
    if (!entries || entries.length === 0) return 0;

    const avgMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
    return ((avgMood / 5) * 100).toFixed(1);
  }, [entries]);

  const getScoreColor = (score) => {
    if (score >= 80) return { color: "#43E97B", label: "Excellent" };
    if (score >= 60) return { color: "#4FACFE", label: "Good" };
    if (score >= 40) return { color: "#FFA502", label: "Fair" };
    return { color: "#FF6B9D", label: "Needs Care" };
  };

  const scoreData = getScoreColor(score);

  return (
    <div className="mood-gauge-chart">
      <div className="gauge-container">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={scoreData.color}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
            style={{
              transition: "stroke-dasharray 1s ease-out",
            }}
          />
        </svg>

        <div className="gauge-content">
          <div className="gauge-value" style={{ color: scoreData.color }}>
            {score}%
          </div>
          <div className="gauge-label">{scoreData.label}</div>
        </div>
      </div>

      <div className="gauge-indicators">
        <div className="indicator">
          <div className="indicator-dot" style={{ backgroundColor: "#FF6B9D" }}></div>
          <span>0-40%</span>
        </div>
        <div className="indicator">
          <div className="indicator-dot" style={{ backgroundColor: "#FFA502" }}></div>
          <span>40-60%</span>
        </div>
        <div className="indicator">
          <div className="indicator-dot" style={{ backgroundColor: "#4FACFE" }}></div>
          <span>60-80%</span>
        </div>
        <div className="indicator">
          <div className="indicator-dot" style={{ backgroundColor: "#43E97B" }}></div>
          <span>80-100%</span>
        </div>
      </div>
    </div>
  );
};

export default MoodGaugeChart;
