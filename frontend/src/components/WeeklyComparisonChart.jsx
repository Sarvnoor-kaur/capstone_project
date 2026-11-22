import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";

const WeeklyComparisonChart = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const getWeeklyData = () => {
    const weeks = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

      const weekEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
      });

      const avgMood =
        weekEntries.length > 0
          ? weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length
          : 0;

      weeks.push({
        week: `Week ${4 - i}`,
        dateRange: `${format(weekStart, "MMM dd")} - ${format(weekEnd, "MMM dd")}`,
        avgMood: parseFloat(avgMood.toFixed(2)),
        entries: weekEntries.length,
      });
    }

    return weeks;
  };

  const data = getWeeklyData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.week}</p>
          <p className="tooltip-date">{data.dateRange}</p>
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
    <div className="weekly-comparison-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#43E97B" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#38F9D7" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avgMood" fill="url(#weeklyGradient)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyComparisonChart;
