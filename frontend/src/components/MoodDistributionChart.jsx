import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const MoodDistributionChart = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const moodCounts = {
    1: { count: 0, label: "😢 Very Sad", color: "#FF6B9D" },
    2: { count: 0, label: "😔 Sad", color: "#FFA502" },
    3: { count: 0, label: "😐 Okay", color: "#4FACFE" },
    4: { count: 0, label: "😊 Good", color: "#43E97B" },
    5: { count: 0, label: "😄 Great", color: "#A99BEA" },
  };

  entries.forEach((entry) => {
    if (moodCounts[entry.mood]) {
      moodCounts[entry.mood].count++;
    }
  });

  const data = Object.entries(moodCounts)
    .filter(([_, value]) => value.count > 0)
    .map(([mood, value]) => ({
      name: value.label,
      value: value.count,
      percentage: ((value.count / entries.length) * 100).toFixed(1),
      color: value.color,
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">
            <strong>{payload[0].value}</strong> entries ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="pie-legend">
        {payload.map((entry, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="legend-text">
              {entry.value} <strong>({entry.payload.percentage}%)</strong>
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mood-distribution-chart">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodDistributionChart;
