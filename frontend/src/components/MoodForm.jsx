import { useState } from "react";
import axios from "../api/axiosClient";
import { FiCheckCircle, FiSave } from "react-icons/fi";
import "./MoodForm.css";

const MoodForm = ({ onMoodSubmit }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const moodOptions = [
    {
      value: 1,
      emoji: "😢",
      label: "Very Sad",
      color: "#FF6B9D",
      bgColor: "#FFE5F0",
      description: "Feeling really down"
    },
    {
      value: 2,
      emoji: "😔",
      label: "Sad",
      color: "#FFA502",
      bgColor: "#FFF4E5",
      description: "Not feeling great"
    },
    {
      value: 3,
      emoji: "😐",
      label: "Okay",
      color: "#4FACFE",
      bgColor: "#E3F2FD",
      description: "Just neutral"
    },
    {
      value: 4,
      emoji: "😊",
      label: "Good",
      color: "#43E97B",
      bgColor: "#E8F5E9",
      description: "Feeling positive"
    },
    {
      value: 5,
      emoji: "😄",
      label: "Great",
      color: "#A99BEA",
      bgColor: "#F3F0FF",
      description: "Feeling amazing!"
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post("/mood", { mood: Number(mood), note });
      setNote("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onMoodSubmit) onMoodSubmit();
    } catch (err) {
      console.error("Failed to save mood entry", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMood = moodOptions.find(m => m.value === Number(mood));

  return (
    <form onSubmit={handleSubmit} className="modern-mood-form">
      {success && (
        <div className="success-alert">
          <FiCheckCircle />
          <span>Mood entry saved successfully! 🎉</span>
        </div>
      )}

      <div className="mood-selector-container">
        <label className="mood-question">How are you feeling today?</label>
        <p className="mood-helper">Select the emoji that best describes your mood</p>

        <div className="mood-options-grid">
          {moodOptions.map((option) => (
            <label
              key={option.value}
              className={`mood-option-card ${Number(mood) === option.value ? 'selected' : ''}`}
              style={{
                '--mood-color': option.color,
                '--mood-bg': option.bgColor,
              }}
            >
              <input
                type="radio"
                name="mood"
                value={option.value}
                checked={Number(mood) === option.value}
                onChange={() => setMood(option.value)}
              />
              <div className="mood-emoji-large">{option.emoji}</div>
              <div className="mood-label-text">{option.label}</div>
              <div className="mood-description">{option.description}</div>
            </label>
          ))}
        </div>

        {selectedMood && (
          <div className="selected-mood-preview" style={{ backgroundColor: selectedMood.bgColor }}>
            <span className="preview-emoji">{selectedMood.emoji}</span>
            <div className="preview-text">
              <strong>You're feeling {selectedMood.label.toLowerCase()}</strong>
              <span>{selectedMood.description}</span>
            </div>
          </div>
        )}
      </div>

      <div className="notes-container">
        <label htmlFor="note" className="notes-label">
          💭 What's on your mind? <span className="optional-tag">(optional)</span>
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Share your thoughts, feelings, or what made you feel this way today... Writing helps! ✨"
          rows="5"
          className="notes-textarea"
        />
        <div className="character-count">{note.length} characters</div>
      </div>

      <button
        type="submit"
        className="save-mood-button"
        disabled={loading}
      >
        <FiSave />
        <span>{loading ? "Saving your mood..." : "Save Mood Entry"}</span>
        {!loading && <span className="button-emoji">💾</span>}
      </button>
    </form>
  );
};

export default MoodForm;
