import {
  FiMessageCircle,
  FiTrendingUp,
} from "react-icons/fi";
import "./MoodList.css";

const MoodList = ({ entries, showAll = false }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center" style={{ padding: "3rem" }}>
        <FiTrendingUp
          style={{
            fontSize: "3rem",
            color: "var(--text-tertiary)",
            marginBottom: "1rem",
          }}
        />
        <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          No mood entries recorded yet.
        </p>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem" }}>
          Start tracking your emotional wellbeing today!
        </p>
      </div>
    );
  }

  const displayEntries = showAll ? entries : entries.slice(0, 5);

  const getMoodData = (mood) => {
    const moodMap = {
      1: { emoji: "😢", label: "Very Sad", color: "#FF6B9D", bgColor: "#FFE5F0" },
      2: { emoji: "😔", label: "Sad", color: "#FFA502", bgColor: "#FFF4E5" },
      3: { emoji: "😐", label: "Okay", color: "#4FACFE", bgColor: "#E3F2FD" },
      4: { emoji: "😊", label: "Good", color: "#43E97B", bgColor: "#E8F5E9" },
      5: { emoji: "😄", label: "Great", color: "#A99BEA", bgColor: "#F3F0FF" },
    };
    return moodMap[mood] || { emoji: "😐", label: "Unknown", color: "#9CA3AF", bgColor: "#F3F4F6" };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="mood-list-modern">
      {displayEntries.map((entry) => {
        const moodData = getMoodData(entry.mood);
        return (
          <div
            key={entry._id}
            className="mood-entry-card"
            style={{
              '--mood-color': moodData.color,
              '--mood-bg': moodData.bgColor,
            }}
          >
            <div className="mood-entry-header">
              <div className="mood-badge-modern">
                <span className="mood-emoji-display">{moodData.emoji}</span>
                <span className="mood-label-display">{moodData.label}</span>
              </div>
              <span className="mood-date-display">{formatDate(entry.date)}</span>
            </div>
            {entry.note && (
              <div className="mood-note-modern">
                <FiMessageCircle className="note-icon" />
                <p>{entry.note}</p>
              </div>
            )}
          </div>
        );
      })}
      {!showAll && entries.length > 5 && (
        <div className="more-entries-modern">
          <FiTrendingUp />
          <span>
            {entries.length - 5} more {entries.length - 5 === 1 ? "entry" : "entries"} available
          </span>
        </div>
      )}
    </div>
  );
};

export default MoodList;
