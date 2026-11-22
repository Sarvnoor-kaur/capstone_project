import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

const MoodRadarChart = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  // Calculate mood frequencies
  const moodCounts = {
    "😄 Great": 0,
    "😊 Good": 0,
    "😐 Okay": 0,
    "😔 Sad": 0,
    "😢 Very Sad": 0,
  };

  entries.forEach((entry) => {
    if (entry.mood === 5) moodCounts["😄 Great"]++;
    else if (entry.mood === 4) moodCounts["😊 Good"]++;
    else if (entry.mood === 3) moodCounts["😐 Okay"]++;
    else if (entry.mood === 2) moodCounts["😔 Sad"]++;
    else if (entry.mood === 1) moodCounts["😢 Very Sad"]++;
  });

  const data = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    frequency: count,
    fullMark: Math.max(...Object.values(moodCounts)) + 2,
  }));

  return (
    <div className="mood-radar-chart">
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="#DCD6F7" />
          <PolarAngleAxis dataKey="mood" tick={{ fontSize: 12, fill: "#202338" }} />
          <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} tick={{ fontSize: 11 }} />
          <Radar
            name="Mood Frequency"
            dataKey="frequency"
            stroke="#667EEA"
            fill="#667EEA"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodRadarChart;
