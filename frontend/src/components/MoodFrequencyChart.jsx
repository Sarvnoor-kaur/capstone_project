import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MoodFrequencyChart = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const moodData = {
    1: { label: "😢 Very Sad", count: 0, color: "#FF6B9D" },
    2: { label: "😔 Sad", count: 0, color: "#FFA502" },
    3: { label: "😐 Okay", count: 0, color: "#4FACFE" },
    4: { label: "😊 Good", count: 0, color: "#43E97B" },
    5: { label: "😄 Great", count: 0, color: "#A99BEA" },
  };

  entries.forEach((entry) => {
    if (moodData[entry.mood]) {
      moodData[entry.mood].count++;
    }
  });

  const data = Object.entries(moodData).map(([mood, info]) => ({
    mood: info.label,
    count: info.count,
    percentage: ((info.count / entries.length) * 100).toFixed(1),
    color: info.color,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.mood}</p>
          <p className="tooltip-value">
            <strong>{data.count}</strong> times ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mood-frequency-chart">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="category" dataKey="mood" tick={{ fontSize: 11 }} />
          <YAxis type="number" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="frequency-summary">
        <div className="summary-title">Most Common Mood</div>
        <div className="summary-cards">
          {data
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map((item, index) => (
              <div
                key={index}
                className="summary-card"
                style={{ borderLeft: `4px solid ${item.color}` }}
              >
                <div className="summary-emoji">{item.mood.split(' ')[0]}</div>
                <div className="summary-info">
                  <div className="summary-label">{item.mood.split(' ').slice(1).join(' ')}</div>
                  <div className="summary-value">
                    {item.count} times <span>({item.percentage}%)</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MoodFrequencyChart;
