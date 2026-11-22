import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { format } from "date-fns";

const MoodScatterChart = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const data = entries.map((entry, index) => ({
    x: index + 1,
    y: entry.mood,
    date: format(new Date(entry.date), "MMM dd"),
    mood: entry.mood,
    z: 100, // size of dot
  }));

  const getMoodColor = (mood) => {
    if (mood === 5) return "#A99BEA";
    if (mood === 4) return "#43E97B";
    if (mood === 3) return "#4FACFE";
    if (mood === 2) return "#FFA502";
    return "#FF6B9D";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">Entry #{data.x}</p>
          <p className="tooltip-date">{data.date}</p>
          <p className="tooltip-value">
            <strong>Mood:</strong> {data.mood} / 5.0
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mood-scatter-chart">
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Entry"
            tick={{ fontSize: 11 }}
            label={{ value: "Entry Number", position: "insideBottom", offset: -10, fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Mood"
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11 }}
          />
          <ZAxis range={[100, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter
            name="Mood Entries"
            data={data}
            fill="#667EEA"
            shape={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={getMoodColor(payload.mood)}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodScatterChart;
