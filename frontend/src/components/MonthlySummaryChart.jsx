import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";

const MonthlySummaryChart = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const getMonthlyData = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return isWithinInterval(entryDate, { start: monthStart, end: monthEnd });
      });

      const avgMood =
        monthEntries.length > 0
          ? monthEntries.reduce((sum, entry) => sum + entry.mood, 0) / monthEntries.length
          : null;

      const highestMood = monthEntries.length > 0 ? Math.max(...monthEntries.map(e => e.mood)) : null;
      const lowestMood = monthEntries.length > 0 ? Math.min(...monthEntries.map(e => e.mood)) : null;

      months.push({
        month: format(monthDate, "MMM yyyy"),
        avgMood: avgMood ? parseFloat(avgMood.toFixed(2)) : null,
        highest: highestMood,
        lowest: lowestMood,
        entries: monthEntries.length,
      });
    }

    return months;
  };

  const data = getMonthlyData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.month}</p>
          <p className="tooltip-value">
            <strong>Average:</strong> {data.avgMood?.toFixed(1) || "N/A"} / 5.0
          </p>
          {data.highest && (
            <p className="tooltip-high">
              <strong>Highest:</strong> {data.highest} / 5.0
            </p>
          )}
          {data.lowest && (
            <p className="tooltip-low">
              <strong>Lowest:</strong> {data.lowest} / 5.0
            </p>
          )}
          <p className="tooltip-entries">{data.entries} entries</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="monthly-summary-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#667EEA" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#764BA2" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgMood"
            stroke="url(#avgGradient)"
            strokeWidth={3}
            dot={{ fill: "#667EEA", r: 5 }}
            activeDot={{ r: 7 }}
            name="Average Mood"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="highest"
            stroke="#43E97B"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#43E97B", r: 4 }}
            name="Highest"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="lowest"
            stroke="#FF6B9D"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#FF6B9D", r: 4 }}
            name="Lowest"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySummaryChart;
