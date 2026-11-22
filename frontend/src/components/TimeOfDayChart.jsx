import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TimeOfDayChart = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const timeSlots = {
    "🌅 Morning\n(6-12)": { start: 6, end: 12, moods: [], color: "#FFD93D" },
    "☀️ Afternoon\n(12-18)": { start: 12, end: 18, moods: [], color: "#FFA502" },
    "🌆 Evening\n(18-22)": { start: 18, end: 22, moods: [], color: "#667EEA" },
    "🌙 Night\n(22-6)": { start: 22, end: 24, moods: [], color: "#764BA2" },
  };

  entries.forEach((entry) => {
    const hour = new Date(entry.date).getHours();

    Object.entries(timeSlots).forEach(([label, slot]) => {
      if (
        (slot.start <= slot.end && hour >= slot.start && hour < slot.end) ||
        (slot.start > slot.end && (hour >= slot.start || hour < slot.end))
      ) {
        slot.moods.push(entry.mood);
      }
    });
  });

  const data = Object.entries(timeSlots).map(([label, slot]) => ({
    time: label,
    avgMood: slot.moods.length > 0
      ? parseFloat((slot.moods.reduce((sum, m) => sum + m, 0) / slot.moods.length).toFixed(2))
      : 0,
    entries: slot.moods.length,
    color: slot.color,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.time.replace('\n', ' ')}</p>
          <p className="tooltip-value">
            <strong>Avg Mood:</strong> {data.avgMood.toFixed(1)} / 5.0
          </p>
          <p className="tooltip-entries">{data.entries} entries</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="time-of-day-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avgMood" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="avgMood" fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeOfDayChart;
