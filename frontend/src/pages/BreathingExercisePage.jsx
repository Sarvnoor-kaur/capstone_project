import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Square,
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Sliders,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import "./BreathingExercisePage.css";

// Preset exercise patterns as defined in project specifications
const EXERCISES = [
  {
    id: "box",
    name: "Box Breathing",
    tagline: "Equal Ratio Technique",
    description:
      "A structured breathing pattern used by wellness practitioners and athletes to pause, reset your nervous system, and regain mental clarity.",
    pattern: [
      { phase: "inhale", label: "Breathe In", duration: 4 },
      { phase: "hold-in", label: "Hold", duration: 4 },
      { phase: "exhale", label: "Breathe Out", duration: 4 },
      { phase: "hold-out", label: "Hold", duration: 4 },
    ],
    patternDisplay: "4s Inhale • 4s Hold • 4s Exhale • 4s Hold",
    defaultDuration: 3, // minutes
    color: "#A99BEA",
    gradient: "linear-gradient(135deg, #A99BEA 0%, #DCD6F7 100%)",
    iconColor: "#6B58CD",
    accentBg: "rgba(169, 155, 234, 0.15)",
    benefits: ["Regulates nervous system", "Sharpens mental focus", "Reduces acute stress"],
  },
  {
    id: "deep",
    name: "Deep Breathing",
    tagline: "Extended Exhale",
    description:
      "A gentle rhythm featuring an extended exhalation that activates your parasympathetic nervous system for a deeply relaxing mental break.",
    pattern: [
      { phase: "inhale", label: "Breathe In", duration: 4 },
      { phase: "exhale", label: "Breathe Out", duration: 6 },
    ],
    patternDisplay: "4s Inhale • 6s Exhale",
    defaultDuration: 3, // minutes
    color: "#B8E6D5",
    gradient: "linear-gradient(135deg, #B8E6D5 0%, #8FE3C7 100%)",
    iconColor: "#2D8A68",
    accentBg: "rgba(184, 230, 213, 0.2)",
    benefits: ["Lowers heart rate", "Calms racing thoughts", "Great for study pauses"],
  },
  {
    id: "relaxation",
    name: "Relaxation Breathing",
    tagline: "Gentle Harmony",
    description:
      "A smooth, balanced breathing exercise tailored for beginners to release tension and settle into comfortable, relaxed presence.",
    pattern: [
      { phase: "inhale", label: "Breathe In", duration: 4 },
      { phase: "exhale", label: "Breathe Out", duration: 4 },
    ],
    patternDisplay: "4s Inhale • 4s Exhale",
    defaultDuration: 3, // minutes
    color: "#F4CDBB",
    gradient: "linear-gradient(135deg, #F4CDBB 0%, #FFE5D9 100%)",
    iconColor: "#C96D46",
    accentBg: "rgba(244, 205, 187, 0.25)",
    benefits: ["Beginner friendly", "Eases physical tension", "Promotes emotional peace"],
  },
];

const DURATION_OPTIONS = [
  { value: 1, label: "1 min", seconds: 60 },
  { value: 3, label: "3 min", seconds: 180 },
  { value: 5, label: "5 min", seconds: 300 },
];

const BreathingExercisePage = () => {
  const navigate = useNavigate();

  // Navigation states: 'select' | 'session' | 'completed'
  const [viewState, setViewState] = useState("select");
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES[0]);
  const [selectedDuration, setSelectedDuration] = useState(3); // in minutes
  const [skipHolds, setSkipHolds] = useState(false); // Gentle mode: skip breath retention
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Active Session Engine state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [phaseProgress, setPhaseProgress] = useState(0); // 0 to 1
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(180);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Audio tone context (optional gentle ambient chime for inhale/exhale)
  const audioContextRef = useRef(null);

  const playChime = useCallback((frequency = 440) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio playback silently disabled if not allowed
    }
  }, [soundEnabled]);

  // Determine active pattern based on skipHolds toggle
  const getActivePattern = useCallback(() => {
    if (!selectedExercise) return [];
    if (skipHolds) {
      return selectedExercise.pattern.filter(
        (p) => p.phase === "inhale" || p.phase === "exhale"
      );
    }
    return selectedExercise.pattern;
  }, [selectedExercise, skipHolds]);

  // Start chosen exercise
  const handleStartExercise = (exercise, durationMin = selectedDuration) => {
    setSelectedExercise(exercise);
    setSelectedDuration(durationMin);
    const pattern = skipHolds
      ? exercise.pattern.filter((p) => p.phase === "inhale" || p.phase === "exhale")
      : exercise.pattern;
    const initialPhaseDuration = pattern[0]?.duration || 4;
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(initialPhaseDuration);
    setPhaseProgress(0);
    setTotalSecondsLeft(durationMin * 60);
    setCompletedCycles(0);
    setIsActive(true);
    setIsPaused(false);
    setViewState("session");
    playChime(520); // Friendly start chime
  };

  // Pause session
  const handlePause = () => {
    setIsPaused(true);
  };

  // Resume session
  const handleResume = () => {
    setIsPaused(false);
  };

  // Restart session
  const handleRestart = () => {
    const pattern = getActivePattern();
    const initialPhaseDuration = pattern[0]?.duration || 4;
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(initialPhaseDuration);
    setPhaseProgress(0);
    setTotalSecondsLeft(selectedDuration * 60);
    setCompletedCycles(0);
    setIsPaused(false);
    setIsActive(true);
    playChime(520);
  };

  // End session early
  const handleEndSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setViewState("select");
  };

  // Main high-resolution timer loop (100ms ticks for fluid animation and accurate timer)
  useEffect(() => {
    if (viewState !== "session" || !isActive || isPaused) return;

    const pattern = getActivePattern();
    if (!pattern.length) return;

    const tickIntervalMs = 100;
    const interval = setInterval(() => {
      // 1. Decrement overall session time
      setTotalSecondsLeft((prev) => {
        const next = Math.max(0, prev - tickIntervalMs / 1000);
        if (next <= 0) {
          // Session Completed!
          setIsActive(false);
          setViewState("completed");
          playChime(587);
          return 0;
        }
        return next;
      });

      // 2. Advance phase progress and countdown
      setPhaseSecondsLeft((prevSec) => {
        const currentPhaseObj = pattern[currentPhaseIndex];
        const fullDuration = currentPhaseObj ? currentPhaseObj.duration : 4;
        const newSec = prevSec - tickIntervalMs / 1000;

        if (newSec <= 0.05) {
          // Switch to next phase
          const nextIndex = (currentPhaseIndex + 1) % pattern.length;
          if (nextIndex === 0) {
            setCompletedCycles((c) => c + 1);
          }
          const nextDuration = pattern[nextIndex].duration;
          setCurrentPhaseIndex(nextIndex);
          setPhaseProgress(0);

          // Phase sound feedback
          if (pattern[nextIndex].phase === "inhale") {
            playChime(440);
          } else if (pattern[nextIndex].phase === "exhale") {
            playChime(370);
          } else {
            playChime(415);
          }

          return nextDuration;
        } else {
          // Calculate progress fraction [0, 1] within current phase
          const elapsed = fullDuration - newSec;
          setPhaseProgress(Math.min(1, Math.max(0, elapsed / fullDuration)));
          return newSec;
        }
      });
    }, tickIntervalMs);

    return () => clearInterval(interval);
  }, [viewState, isActive, isPaused, currentPhaseIndex, getActivePattern, playChime]);

  // Compute visual circle scale and state
  const pattern = getActivePattern();
  const currentPhase = pattern[currentPhaseIndex] || {
    phase: "inhale",
    label: "Breathe In",
    duration: 4,
  };

  let circleScale = 1;
  let phaseColor = selectedExercise.color;

  if (currentPhase.phase === "inhale") {
    // Expands smoothly from 1 to 1.45
    circleScale = 1 + phaseProgress * 0.45;
    phaseColor = "#A99BEA";
  } else if (currentPhase.phase === "exhale") {
    // Shrinks smoothly from 1.45 to 1.0
    circleScale = 1.45 - phaseProgress * 0.45;
    phaseColor = "#B8E6D5";
  } else {
    // Hold phase: stays steady at expanded (or relaxed) size with slight gentle pulse
    circleScale = currentPhase.phase === "hold-in" ? 1.45 : 1.0;
    phaseColor = "#F4CDBB";
  }

  // Format seconds to mm:ss
  const formatTime = (totalSec) => {
    const sec = Math.ceil(totalSec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const totalSessionSec = selectedDuration * 60;
  const sessionProgressPercent = Math.min(
    100,
    Math.max(0, ((totalSessionSec - totalSecondsLeft) / totalSessionSec) * 100)
  );

  return (
    <div className="guided-breathing-page">
      {/* 1. MAIN SCREEN: EXERCISE SELECTION */}
      {viewState === "select" && (
        <motion.div
          className="breathing-select-container"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header section with calming illustration */}
          <header className="breathing-header">
            <button
              className="back-nav-btn"
              onClick={() => navigate("/dashboard")}
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
              <span>Dashboard</span>
            </button>

            <div className="header-badge">
              <Sparkles size={16} />
              <span>Guided Mindfulness</span>
            </div>

            <h1 className="header-title">Find Your Moment of Calm</h1>
            <p className="header-subtitle">
              Take a few minutes to slow down, breathe, and reconnect with yourself.
            </p>

            {/* Decorative Calming Ambient Breathing Illustration */}
            <div className="calming-hero-visual" aria-hidden="true">
              <div className="hero-orb aura-1" />
              <div className="hero-orb aura-2" />
              <div className="hero-orb aura-center">
                <Wind size={36} className="hero-wind-icon" />
              </div>
            </div>
          </header>

          {/* Duration Selector Pre-session */}
          <div className="global-duration-picker">
            <span className="picker-label">
              <Clock size={16} />
              <span>Session Duration:</span>
            </span>
            <div className="duration-pills">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`duration-pill ${selectedDuration === opt.value ? "active" : ""}`}
                  onClick={() => setSelectedDuration(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Skip Hold (Gentle Mode) toggle */}
            <label className="gentle-mode-toggle" title="Skip breath retention phases">
              <input
                type="checkbox"
                checked={skipHolds}
                onChange={(e) => setSkipHolds(e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-text">Gentle Mode (Skip breath holding)</span>
            </label>
          </div>

          {/* Exercise Selection Cards Grid */}
          <div className="exercises-cards-grid">
            {EXERCISES.map((exercise, idx) => (
              <motion.article
                key={exercise.id}
                className="exercise-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="card-top-accent" style={{ background: exercise.gradient }} />
                
                <div className="card-body">
                  <div className="card-header-row">
                    <div
                      className="exercise-icon-bubble"
                      style={{ background: exercise.accentBg, color: exercise.iconColor }}
                    >
                      <Wind size={22} />
                    </div>
                    <span className="exercise-tagline">{exercise.tagline}</span>
                  </div>

                  <h2 className="exercise-name">{exercise.name}</h2>
                  <p className="exercise-desc">{exercise.description}</p>

                  {/* Pattern Breakdown */}
                  <div className="pattern-breakdown-box">
                    <span className="pattern-label">Breathing Rhythm</span>
                    <span className="pattern-values">{exercise.patternDisplay}</span>
                  </div>

                  {/* Benefits pills */}
                  <ul className="exercise-benefits-list">
                    {exercise.benefits.map((b, i) => (
                      <li key={i} className="benefit-item">
                        <CheckCircle2 size={13} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="start-exercise-btn"
                    style={{ background: exercise.gradient }}
                    onClick={() => handleStartExercise(exercise)}
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Start {exercise.name}</span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Gentle wellness safety advice */}
          <div className="wellness-comfort-notice">
            <ShieldAlert size={18} className="notice-icon" />
            <p>
              <strong>Gentle Reminder:</strong> Breathing exercises should always feel comfortable and calming.
              If you feel any lightheadedness or dizziness, stop and resume your normal breathing rhythm.
            </p>
          </div>
        </motion.div>
      )}

      {/* 2. ACTIVE BREATHING EXPERIENCE */}
      {viewState === "session" && (
        <motion.div
          className="active-session-container"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top Session Navigation & Stats */}
          <div className="session-topbar">
            <button
              className="session-exit-btn"
              onClick={handleEndSession}
              aria-label="End session and return"
            >
              <ArrowLeft size={18} />
              <span>End Session</span>
            </button>

            <div className="session-meta">
              <span className="session-exercise-pill" style={{ borderColor: selectedExercise.color }}>
                <span className="dot" style={{ background: selectedExercise.color }} />
                {selectedExercise.name}
              </span>
              <span className="session-cycle-counter">Cycle {completedCycles + 1}</span>
            </div>

            <button
              className={`sound-toggle-btn ${soundEnabled ? "on" : "off"}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute audio cues" : "Enable gentle audio chimes"}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Session Progress Bar */}
          <div className="session-progress-wrapper">
            <div className="progress-label-row">
              <span className="time-remaining">
                <Clock size={14} /> Time Left: <strong>{formatTime(totalSecondsLeft)}</strong>
              </span>
              <span className="progress-percentage">{Math.round(sessionProgressPercent)}% Complete</span>
            </div>
            <div className="session-progress-track">
              <div
                className="session-progress-fill"
                style={{ width: `${sessionProgressPercent}%`, background: selectedExercise.gradient }}
              />
            </div>
          </div>

          {/* Central Interactive Breathing Circle */}
          <div className="breathing-centerpiece">
            {/* Ambient Background Aura Rings */}
            <div
              className={`ambient-aura-layer outer ${isPaused ? "paused" : ""}`}
              style={{
                borderColor: phaseColor,
                transform: `scale(${circleScale * 1.15})`,
                opacity: isPaused ? 0.25 : 0.4,
              }}
            />
            <div
              className={`ambient-aura-layer inner ${isPaused ? "paused" : ""}`}
              style={{
                borderColor: phaseColor,
                transform: `scale(${circleScale * 1.05})`,
                opacity: isPaused ? 0.35 : 0.6,
              }}
            />

            {/* Core Interactive Scalable Circle */}
            <div
              className={`main-breathing-circle ${isPaused ? "is-paused" : ""}`}
              style={{
                transform: `scale(${circleScale})`,
                borderColor: phaseColor,
                boxShadow: `0 0 50px ${phaseColor}44, inset 0 0 30px ${phaseColor}33`,
              }}
            >
              {/* Inner content: Phase Label & Countdown */}
              <div className="circle-inner-content">
                <span className="breathing-phase-tag">{selectedExercise.name}</span>
                <span className="breathing-instruction-text" style={{ color: "var(--premium-navy)" }}>
                  {currentPhase.label}
                </span>
                <span className="breathing-countdown-number" style={{ color: phaseColor }}>
                  {Math.max(1, Math.ceil(phaseSecondsLeft))}
                </span>
                <span className="breathing-phase-unit">seconds</span>
              </div>
            </div>
          </div>

          {/* Pause Status Indicator */}
          {isPaused && (
            <motion.div
              className="paused-status-badge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>Session Paused • Take a natural breath</span>
            </motion.div>
          )}

          {/* Controls Bar */}
          <div className="session-controls-bar">
            {/* Pause / Resume Button */}
            {!isPaused ? (
              <button className="ctrl-btn main pause" onClick={handlePause} aria-label="Pause session">
                <Pause size={20} />
                <span>Pause</span>
              </button>
            ) : (
              <button className="ctrl-btn main resume" onClick={handleResume} aria-label="Resume session">
                <Play size={20} fill="currentColor" />
                <span>Resume</span>
              </button>
            )}

            {/* Restart Button */}
            <button className="ctrl-btn secondary" onClick={handleRestart} aria-label="Restart exercise">
              <RotateCcw size={18} />
              <span>Restart</span>
            </button>

            {/* End / Stop Button */}
            <button className="ctrl-btn secondary danger" onClick={handleEndSession} aria-label="Stop session">
              <Square size={18} />
              <span>End</span>
            </button>
          </div>

          {/* Discomfort Warning Notice */}
          <p className="session-comfort-note">
            Feel free to pause or stop at any time if you experience discomfort or lightheadedness.
          </p>
        </motion.div>
      )}

      {/* 3. COMPLETION SCREEN */}
      {viewState === "completed" && (
        <motion.div
          className="breathing-completed-container"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.5 }}
        >
          <div className="completed-card">
            {/* Celebration Icon */}
            <div className="completed-badge-icon">
              <CheckCircle2 size={48} className="check-icon" />
            </div>

            <h1 className="completed-title">Well Done! You Made Time for Yourself.</h1>
            <p className="completed-subtitle">
              Taking a moment to pause and breathe is a meaningful step toward self-care and mental balance.
            </p>

            {/* Summary Metrics */}
            <div className="completed-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Exercise</span>
                <span className="metric-value">{selectedExercise.name}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Total Duration</span>
                <span className="metric-value">{selectedDuration} Minutes</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Cycles Completed</span>
                <span className="metric-value">{completedCycles || 1} Mindful Cycles</span>
              </div>
            </div>

            {/* Actions */}
            <div className="completed-actions">
              <button
                className="completed-btn primary"
                onClick={() => handleStartExercise(selectedExercise)}
              >
                <RotateCcw size={18} />
                <span>Practice Again</span>
              </button>

              <button
                className="completed-btn secondary"
                onClick={() => setViewState("select")}
              >
                <span>Choose Another Rhythm</span>
                <ChevronRight size={18} />
              </button>

              <button
                className="completed-btn outline"
                onClick={() => navigate("/dashboard")}
              >
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BreathingExercisePage;
