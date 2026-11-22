import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Activity,
  Move,
  Heart,
  RefreshCw,
  Award,
  Lightbulb,
  Check,
  Flame,
  Layers,
} from "lucide-react";
import {
  WELLNESS_CATEGORIES,
  BREATHING_EXERCISES,
  GUIDED_WELLNESS_EXERCISES,
} from "../data/wellnessExercises";
import PostureVisual from "../components/PostureVisual";
import "./BreathingExercisePage.css";

const DURATION_OPTIONS = [
  { value: 1, label: "1 min", seconds: 60 },
  { value: 3, label: "3 min", seconds: 180 },
  { value: 5, label: "5 min", seconds: 300 },
];

// Fallback visual illustration icon for each category/exercise
const ExerciseVisualFallback = ({ category, name }) => {
  return (
    <div className="exercise-svg-fallback" aria-hidden="true">
      <div className="fallback-aura-circle" />
      {category === "yoga" ? (
        <svg viewBox="0 0 100 100" className="fallback-pose-svg" fill="none" stroke="currentColor">
          <circle cx="50" cy="24" r="8" strokeWidth="4" />
          <path d="M50 32v24M35 44l15-6 15 6M40 76l10-20 10 20M32 76h36" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : category === "stretching" ? (
        <svg viewBox="0 0 100 100" className="fallback-pose-svg" fill="none" stroke="currentColor">
          <circle cx="50" cy="22" r="8" strokeWidth="4" />
          <path d="M50 30v28M28 36l22-6 22-6M40 82l10-24 10 24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : category === "meditation" ? (
        <svg viewBox="0 0 100 100" className="fallback-pose-svg" fill="none" stroke="currentColor">
          <circle cx="50" cy="26" r="8" strokeWidth="4" />
          <path d="M50 34v22M32 52l18-8 18 8M30 74c6-6 14-8 20-8s14 2 20 8M24 74h52" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 100 100" className="fallback-pose-svg" fill="none" stroke="currentColor">
          <circle cx="50" cy="25" r="8" strokeWidth="4" />
          <path d="M50 33v26M34 46l16-6 16 6M38 80l12-21 12 21" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span className="fallback-tagline">{name}</span>
    </div>
  );
};

const BreathingExercisePage = () => {
  const navigate = useNavigate();

  // Active Category: 'breathing' | 'yoga' | 'stretching' | 'meditation' | 'relaxation'
  const [activeCategory, setActiveCategory] = useState("breathing");

  // Navigation states: 'select' | 'breathing-session' | 'guided-session' | 'completed'
  const [viewState, setViewState] = useState("select");

  // Selection state for breathing
  const [selectedBreathing, setSelectedBreathing] = useState(BREATHING_EXERCISES[0]);
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [skipHolds, setSkipHolds] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Active Breathing Session Engine state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [isBreathingPaused, setIsBreathingPaused] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(180);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Active Guided Activity State (Yoga, Stretching, Meditation, PMR)
  const [selectedGuided, setSelectedGuided] = useState(GUIDED_WELLNESS_EXERCISES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(45);
  const [isStepTimerRunning, setIsStepTimerRunning] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalGuidedDurationPracticed, setTotalGuidedDurationPracticed] = useState(0);

  // Completed item memory for celebration screen
  const [lastCompletedExercise, setLastCompletedExercise] = useState(null);

  // Audio tone context (optional gentle ambient chime)
  const audioContextRef = useRef(null);

  const playChime = useCallback(
    (frequency = 440) => {
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
    },
    [soundEnabled]
  );

  // ══════════════════════════════════════════════════════════════
  // BREATHING ENGINE (100% PRESERVED)
  // ══════════════════════════════════════════════════════════════
  const getActivePattern = useCallback(() => {
    if (!selectedBreathing) return [];
    if (skipHolds) {
      return selectedBreathing.pattern.filter(
        (p) => p.phase === "inhale" || p.phase === "exhale"
      );
    }
    return selectedBreathing.pattern;
  }, [selectedBreathing, skipHolds]);

  const handleStartBreathing = (exercise, durationMin = selectedDuration) => {
    setSelectedBreathing(exercise);
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
    setIsBreathingActive(true);
    setIsBreathingPaused(false);
    setViewState("breathing-session");
    playChime(520);
  };

  const handlePauseBreathing = () => setIsBreathingPaused(true);
  const handleResumeBreathing = () => setIsBreathingPaused(false);

  const handleRestartBreathing = () => {
    const pattern = getActivePattern();
    const initialPhaseDuration = pattern[0]?.duration || 4;
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(initialPhaseDuration);
    setPhaseProgress(0);
    setTotalSecondsLeft(selectedDuration * 60);
    setCompletedCycles(0);
    setIsBreathingPaused(false);
    setIsBreathingActive(true);
    playChime(520);
  };

  const handleEndBreathing = () => {
    setIsBreathingActive(false);
    setIsBreathingPaused(false);
    setViewState("select");
  };

  useEffect(() => {
    if (viewState !== "breathing-session" || !isBreathingActive || isBreathingPaused)
      return;

    const pattern = getActivePattern();
    if (!pattern.length) return;

    const tickIntervalMs = 100;
    const interval = setInterval(() => {
      setTotalSecondsLeft((prev) => {
        const next = Math.max(0, prev - tickIntervalMs / 1000);
        if (next <= 0) {
          setIsBreathingActive(false);
          setLastCompletedExercise({
            name: selectedBreathing.name,
            category: "breathing",
            duration: `${selectedDuration} Minutes`,
            detail: `${completedCycles + 1} Mindful Cycles Completed`,
            tagline: selectedBreathing.tagline,
          });
          setViewState("completed");
          playChime(587);
          return 0;
        }
        return next;
      });

      setPhaseSecondsLeft((prevSec) => {
        const currentPhaseObj = pattern[currentPhaseIndex];
        const fullDuration = currentPhaseObj ? currentPhaseObj.duration : 4;
        const newSec = prevSec - tickIntervalMs / 1000;

        if (newSec <= 0.05) {
          const nextIndex = (currentPhaseIndex + 1) % pattern.length;
          if (nextIndex === 0) {
            setCompletedCycles((c) => c + 1);
          }
          const nextDuration = pattern[nextIndex].duration;
          setCurrentPhaseIndex(nextIndex);
          setPhaseProgress(0);

          if (pattern[nextIndex].phase === "inhale") {
            playChime(440);
          } else if (pattern[nextIndex].phase === "exhale") {
            playChime(370);
          } else {
            playChime(415);
          }

          return nextDuration;
        } else {
          const elapsed = fullDuration - newSec;
          setPhaseProgress(Math.min(1, Math.max(0, elapsed / fullDuration)));
          return newSec;
        }
      });
    }, tickIntervalMs);

    return () => clearInterval(interval);
  }, [
    viewState,
    isBreathingActive,
    isBreathingPaused,
    currentPhaseIndex,
    getActivePattern,
    playChime,
    selectedBreathing,
    selectedDuration,
    completedCycles,
  ]);

  // Breathing circle calculations
  const breathingPattern = getActivePattern();
  const currentBreathingPhase = breathingPattern[currentPhaseIndex] || {
    phase: "inhale",
    label: "Breathe In",
    duration: 4,
  };

  let circleScale = 1;
  let phaseColor = selectedBreathing.color;
  if (currentBreathingPhase.phase === "inhale") {
    circleScale = 1 + phaseProgress * 0.45;
    phaseColor = "#A99BEA";
  } else if (currentBreathingPhase.phase === "exhale") {
    circleScale = 1.45 - phaseProgress * 0.45;
    phaseColor = "#B8E6D5";
  } else {
    circleScale = currentBreathingPhase.phase === "hold-in" ? 1.45 : 1.0;
    phaseColor = "#F4CDBB";
  }

  // ══════════════════════════════════════════════════════════════
  // STEP-BY-STEP GUIDED EXERCISES ENGINE (YOGA, STRETCHING, ETC.)
  // ══════════════════════════════════════════════════════════════
  const handleStartGuided = (exercise) => {
    setSelectedGuided(exercise);
    setCurrentStepIndex(0);
    const initialDuration = exercise.steps[0]?.durationSec || 45;
    setStepSecondsLeft(initialDuration);
    setIsStepTimerRunning(true);
    setCompletedSteps(new Set());
    setSessionStartTime(Date.now());
    setViewState("guided-session");
    playChime(520);
  };

  const currentStep = useMemo(() => {
    if (!selectedGuided || !selectedGuided.steps) return null;
    return selectedGuided.steps[currentStepIndex] || selectedGuided.steps[0];
  }, [selectedGuided, currentStepIndex]);

  // Step countdown timer tick (1 second)
  useEffect(() => {
    if (viewState !== "guided-session" || !isStepTimerRunning) return;

    const timer = setInterval(() => {
      setStepSecondsLeft((prev) => {
        if (prev <= 1) {
          playChime(480);
          setCompletedSteps((prevSet) => new Set(prevSet).add(currentStepIndex));

          if (autoAdvance) {
            if (currentStepIndex < selectedGuided.steps.length - 1) {
              const nextIdx = currentStepIndex + 1;
              setCurrentStepIndex(nextIdx);
              return selectedGuided.steps[nextIdx]?.durationSec || 45;
            } else {
              handleCompleteGuidedExercise();
              return 0;
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewState, isStepTimerRunning, currentStepIndex, selectedGuided, autoAdvance, playChime]);

  const handleNextStep = () => {
    if (!selectedGuided) return;
    setCompletedSteps((prev) => new Set(prev).add(currentStepIndex));
    if (currentStepIndex < selectedGuided.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setStepSecondsLeft(selectedGuided.steps[nextIdx]?.durationSec || 45);
      setIsStepTimerRunning(true);
      playChime(440);
    } else {
      handleCompleteGuidedExercise();
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setStepSecondsLeft(selectedGuided.steps[prevIdx]?.durationSec || 45);
      setIsStepTimerRunning(true);
    }
  };

  const handleJumpToStep = (index) => {
    if (!selectedGuided || index < 0 || index >= selectedGuided.steps.length) return;
    setCurrentStepIndex(index);
    setStepSecondsLeft(selectedGuided.steps[index]?.durationSec || 45);
    setIsStepTimerRunning(true);
  };

  const handleRestartStep = () => {
    if (!currentStep) return;
    setStepSecondsLeft(currentStep.durationSec || 45);
    setIsStepTimerRunning(true);
    playChime(520);
  };

  const handleRestartFullExercise = () => {
    setCurrentStepIndex(0);
    setStepSecondsLeft(selectedGuided.steps[0]?.durationSec || 45);
    setIsStepTimerRunning(true);
    setCompletedSteps(new Set());
    playChime(520);
  };

  const handleExitGuided = () => {
    setIsStepTimerRunning(false);
    setViewState("select");
  };

  const handleCompleteGuidedExercise = () => {
    setIsStepTimerRunning(false);
    const durationSpentSec = sessionStartTime
      ? Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000))
      : 180;
    const durationMinFormatted = Math.max(1, Math.round(durationSpentSec / 60));
    setTotalGuidedDurationPracticed(durationMinFormatted);

    setLastCompletedExercise({
      name: selectedGuided.name,
      category: selectedGuided.category,
      duration: `${durationMinFormatted} Minutes Practiced`,
      detail: `All ${selectedGuided.steps.length} Steps Mastered`,
      tagline: selectedGuided.tagline,
    });
    setViewState("completed");
    playChime(587);
  };

  // Format seconds to mm:ss
  const formatTime = (totalSec) => {
    const sec = Math.ceil(totalSec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const totalBreathingSessionSec = selectedDuration * 60;
  const breathingProgressPercent = Math.min(
    100,
    Math.max(
      0,
      ((totalBreathingSessionSec - totalSecondsLeft) / totalBreathingSessionSec) * 100
    )
  );

  // Filter guided exercises by selected category
  const activeGuidedList = useMemo(() => {
    return GUIDED_WELLNESS_EXERCISES.filter((ex) => ex.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="guided-breathing-page">
      {/* ══════════════════════════════════════════════════════════════
          1. MAIN SCREEN: CATEGORY TABS & EXERCISE CATALOG
         ══════════════════════════════════════════════════════════════ */}
      {viewState === "select" && (
        <motion.div
          className="breathing-select-container"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
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
              <span>Mindful Body & Breath Studio</span>
            </div>

            <h1 className="header-title">Find Your Moment of Calm</h1>
            <p className="header-subtitle">
              Explore science-backed breathwork, gentle yoga postures, and somatic relief
              designed for student wellness and mental reset.
            </p>

            {/* Decorative Calming Hero Orb */}
            <div className="calming-hero-visual" aria-hidden="true">
              <div className="hero-orb aura-1" />
              <div className="hero-orb aura-2" />
              <div className="hero-orb aura-center">
                <Wind size={36} className="hero-wind-icon" />
              </div>
            </div>
          </header>

          {/* ── Category Navigation Tabs ── */}
          <div className="wellness-categories-bar">
            <div className="categories-scroll-wrapper">
              {WELLNESS_CATEGORIES.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`wellness-category-pill ${isCatActive ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span className="category-emoji">{cat.emoji}</span>
                    <span className="category-pill-label">{cat.label}</span>
                    <span className="category-pill-count">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ════ CATEGORY 1: BREATHING EXERCISES (PRESERVED) ════ */}
          {activeCategory === "breathing" && (
            <motion.div
              key="cat-breathing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="breathing-tab-content"
            >
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
                      className={`duration-pill ${
                        selectedDuration === opt.value ? "active" : ""
                      }`}
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

              {/* Breathing Exercise Cards */}
              <div className="exercises-cards-grid">
                {BREATHING_EXERCISES.map((exercise, idx) => (
                  <motion.article
                    key={exercise.id}
                    className="exercise-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                    whileHover={{ y: -6 }}
                  >
                    <div
                      className="card-top-accent"
                      style={{ background: exercise.gradient }}
                    />
                    <div className="card-body">
                      <div className="card-header-row">
                        <div
                          className="exercise-icon-bubble"
                          style={{
                            background: exercise.accentBg,
                            color: exercise.iconColor,
                          }}
                        >
                          <Wind size={22} />
                        </div>
                        <span className="exercise-tagline">{exercise.tagline}</span>
                      </div>

                      <h2 className="exercise-name">{exercise.name}</h2>
                      <p className="exercise-desc">{exercise.description}</p>

                      <div className="pattern-breakdown-box">
                        <span className="pattern-label">Breathing Rhythm</span>
                        <span className="pattern-values">{exercise.patternDisplay}</span>
                      </div>

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
                        onClick={() => handleStartBreathing(exercise)}
                      >
                        <Play size={18} fill="currentColor" />
                        <span>Start {exercise.name}</span>
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════ CATEGORIES 2-5: YOGA, STRETCHING, MEDITATION, PMR ════ */}
          {activeCategory !== "breathing" && (
            <motion.div
              key={`cat-${activeCategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="guided-tab-content"
            >
              <div className="category-intro-banner">
                <span className="intro-badge">
                  {WELLNESS_CATEGORIES.find((c) => c.id === activeCategory)?.badge}
                </span>
                <p className="intro-text">
                  {WELLNESS_CATEGORIES.find((c) => c.id === activeCategory)?.description}
                </p>
              </div>

              <div className="exercises-cards-grid guided-grid">
                {activeGuidedList.map((exercise, idx) => (
                  <motion.article
                    key={exercise.id}
                    className="exercise-card guided-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                    whileHover={{ y: -6 }}
                  >
                    {/* Visual Card Posture Showcase */}
                    <div className="guided-card-image-wrapper">
                      <PostureVisual
                        exerciseId={exercise.id}
                        stepNumber={1}
                        color={exercise.iconColor}
                      />
                      <div className="guided-card-badges">
                        <span className="difficulty-badge">{exercise.difficulty}</span>
                        <span className="duration-badge">
                          <Clock size={12} />
                          {exercise.estimatedDuration}
                        </span>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="card-header-row">
                        <span className="exercise-tagline">{exercise.tagline}</span>
                        <span className="steps-badge">
                          <Layers size={13} /> {exercise.steps.length} Steps
                        </span>
                      </div>

                      <h2 className="exercise-name">{exercise.name}</h2>
                      <p className="exercise-desc">{exercise.description}</p>

                      <ul className="exercise-benefits-list">
                        {exercise.benefits.slice(0, 3).map((b, i) => (
                          <li key={i} className="benefit-item">
                            <CheckCircle2 size={13} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className="start-exercise-btn"
                        style={{ background: exercise.gradient }}
                        onClick={() => handleStartGuided(exercise)}
                      >
                        <Play size={18} fill="currentColor" />
                        <span>Start Exercise</span>
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gentle wellness safety advice */}
          <div className="wellness-comfort-notice">
            <ShieldAlert size={18} className="notice-icon" />
            <p>
              <strong>Gentle Reminder:</strong> Wellness practices should always feel
              comfortable, soothing, and supportive. If you feel any physical discomfort
              or strain, stop and return to a natural resting posture.
            </p>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          2. ACTIVE BREATHING EXPERIENCE (100% PRESERVED)
         ══════════════════════════════════════════════════════════════ */}
      {viewState === "breathing-session" && (
        <motion.div
          className="active-session-container"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35 }}
        >
          {/* Top Session Navigation & Stats */}
          <div className="session-topbar">
            <button
              className="session-exit-btn"
              onClick={handleEndBreathing}
              aria-label="End session and return"
            >
              <ArrowLeft size={18} />
              <span>End Session</span>
            </button>

            <div className="session-meta">
              <span
                className="session-exercise-pill"
                style={{ borderColor: selectedBreathing.color }}
              >
                <span
                  className="dot"
                  style={{ background: selectedBreathing.color }}
                />
                {selectedBreathing.name}
              </span>
              <span className="session-cycle-counter">
                Cycle {completedCycles + 1}
              </span>
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
                <Clock size={14} /> Time Left:{" "}
                <strong>{formatTime(totalSecondsLeft)}</strong>
              </span>
              <span className="progress-percentage">
                {Math.round(breathingProgressPercent)}% Complete
              </span>
            </div>
            <div className="session-progress-track">
              <div
                className="session-progress-fill"
                style={{
                  width: `${breathingProgressPercent}%`,
                  background: selectedBreathing.gradient,
                }}
              />
            </div>
          </div>

          {/* Central Interactive Breathing Circle */}
          <div className="breathing-centerpiece">
            <div
              className={`ambient-aura-layer outer ${
                isBreathingPaused ? "paused" : ""
              }`}
              style={{
                borderColor: phaseColor,
                transform: `scale(${circleScale * 1.15})`,
                opacity: isBreathingPaused ? 0.25 : 0.4,
              }}
            />
            <div
              className={`ambient-aura-layer inner ${
                isBreathingPaused ? "paused" : ""
              }`}
              style={{
                borderColor: phaseColor,
                transform: `scale(${circleScale * 1.05})`,
                opacity: isBreathingPaused ? 0.35 : 0.6,
              }}
            />

            <div
              className={`main-breathing-circle ${
                isBreathingPaused ? "is-paused" : ""
              }`}
              style={{
                transform: `scale(${circleScale})`,
                borderColor: phaseColor,
                boxShadow: `0 0 50px ${phaseColor}44, inset 0 0 30px ${phaseColor}33`,
              }}
            >
              <div className="circle-inner-content">
                <span className="breathing-phase-tag">{selectedBreathing.name}</span>
                <span
                  className="breathing-instruction-text"
                  style={{ color: "var(--premium-navy)" }}
                >
                  {currentBreathingPhase.label}
                </span>
                <span
                  className="breathing-countdown-number"
                  style={{ color: phaseColor }}
                >
                  {Math.max(1, Math.ceil(phaseSecondsLeft))}
                </span>
                <span className="breathing-phase-unit">seconds</span>
              </div>
            </div>
          </div>

          {isBreathingPaused && (
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
            {!isBreathingPaused ? (
              <button
                className="ctrl-btn main pause"
                onClick={handlePauseBreathing}
                aria-label="Pause session"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>
            ) : (
              <button
                className="ctrl-btn main resume"
                onClick={handleResumeBreathing}
                aria-label="Resume session"
              >
                <Play size={20} fill="currentColor" />
                <span>Resume</span>
              </button>
            )}

            <button
              className="ctrl-btn secondary"
              onClick={handleRestartBreathing}
              aria-label="Restart exercise"
            >
              <RotateCcw size={18} />
              <span>Restart</span>
            </button>

            <button
              className="ctrl-btn secondary danger"
              onClick={handleEndBreathing}
              aria-label="Stop session"
            >
              <Square size={18} />
              <span>End</span>
            </button>
          </div>

          <p className="session-comfort-note">
            Feel free to pause or stop at any time if you experience discomfort or
            lightheadedness.
          </p>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          3. INTERACTIVE STEP-BY-STEP GUIDED EXERCISES PLAYER
         ══════════════════════════════════════════════════════════════ */}
      {viewState === "guided-session" && currentStep && (
        <motion.div
          className="active-guided-container"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35 }}
        >
          {/* Top Guided Bar */}
          <div className="guided-topbar">
            <button
              className="session-exit-btn"
              onClick={handleExitGuided}
              aria-label="Exit guided exercise"
            >
              <ArrowLeft size={18} />
              <span>Exit</span>
            </button>

            <div className="guided-top-info">
              <span className="guided-category-badge">{selectedGuided.tagline}</span>
              <h2 className="guided-active-title">{selectedGuided.name}</h2>
            </div>

            <div className="guided-top-actions">
              <button
                className={`sound-toggle-btn ${soundEnabled ? "on" : "off"}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute audio cues" : "Enable gentle audio chimes"}
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>
          </div>

          {/* Stepper Dots & Progress Track */}
          <div className="guided-stepper-wrapper">
            <div className="stepper-dots-row">
              {selectedGuided.steps.map((st, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isDone = completedSteps.has(idx) || idx < currentStepIndex;
                return (
                  <button
                    key={st.stepNumber}
                    className={`stepper-dot-btn ${isCurrent ? "active" : ""} ${
                      isDone ? "done" : ""
                    }`}
                    onClick={() => handleJumpToStep(idx)}
                    title={`Step ${idx + 1}: ${st.title}`}
                  >
                    <span className="dot-circle">
                      {isDone ? <Check size={12} /> : idx + 1}
                    </span>
                    <span className="dot-step-label">Step {idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="guided-progress-track">
              <div
                className="guided-progress-fill"
                style={{
                  width: `${
                    ((currentStepIndex + 1) / selectedGuided.steps.length) * 100
                  }%`,
                  background: selectedGuided.gradient,
                }}
              />
            </div>
          </div>

          {/* Main Stage: Large Visual + Posture Instruction */}
          <div className="guided-stage-card">
            <div className="stage-grid">
              {/* Left Column: Posture Visual Area */}
              <div className="stage-visual-column">
                <div className="posture-display-box">
                  {/* Dynamic posture illustration customized for each exercise & step */}
                  <PostureVisual
                    exerciseId={selectedGuided.id}
                    stepNumber={currentStep.stepNumber}
                    color={selectedGuided.iconColor}
                  />

                  {/* Step Timer Badge Overlay */}
                  <div className="posture-timer-overlay">
                    <span className="timer-countdown-clock">
                      <Clock size={16} />
                      <strong>{formatTime(stepSecondsLeft)}</strong>
                    </span>
                    <button
                      className="timer-pause-toggle"
                      onClick={() => setIsStepTimerRunning(!isStepTimerRunning)}
                      title={isStepTimerRunning ? "Pause Timer" : "Resume Timer"}
                    >
                      {isStepTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Step Details & Breathing Guidance */}
              <div className="stage-content-column">
                <div className="step-count-pill">
                  <span>
                    Step {currentStepIndex + 1} of {selectedGuided.steps.length}
                  </span>
                  <span className="step-subtitle-tag">{currentStep.subtitle}</span>
                </div>

                <h1 className="step-main-title">{currentStep.title}</h1>

                <div className="step-instruction-box">
                  <p className="instruction-lead">{currentStep.instruction}</p>
                </div>

                {/* Breathing Guidance Box */}
                <div className="breathing-guidance-card">
                  <div className="guidance-icon-wrap">
                    <Wind size={20} className="wind-pulse-icon" />
                  </div>
                  <div className="guidance-text-wrap">
                    <span className="guidance-label">Breathing Guidance</span>
                    <p className="guidance-cue">{currentStep.breathingCue}</p>
                  </div>
                </div>

                {/* Helpful Tip */}
                {currentStep.tip && (
                  <div className="step-pro-tip">
                    <Lightbulb size={16} className="tip-icon" />
                    <span>
                      <strong>Tip:</strong> {currentStep.tip}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Guided Navigation & Controls Bar */}
          <div className="guided-bottom-controls-bar">
            {/* Previous Step */}
            <button
              className="guided-nav-btn prev"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
              aria-label="Previous posture step"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            {/* Central Controls: Play/Pause, Restart Step, Restart All */}
            <div className="guided-center-actions">
              <button
                className={`guided-play-btn ${isStepTimerRunning ? "running" : "paused"}`}
                onClick={() => setIsStepTimerRunning(!isStepTimerRunning)}
                aria-label={isStepTimerRunning ? "Pause Step Timer" : "Resume Step Timer"}
              >
                {isStepTimerRunning ? (
                  <>
                    <Pause size={18} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                className="guided-restart-step-btn"
                onClick={handleRestartStep}
                title="Restart current step timer"
                aria-label="Restart current step"
              >
                <RotateCcw size={17} />
                <span>Restart Step</span>
              </button>

              <button
                className="guided-restart-step-btn restart-all"
                onClick={handleRestartFullExercise}
                title="Restart full routine from Step 1"
                aria-label="Restart whole routine"
              >
                <RefreshCw size={15} />
                <span>Restart All</span>
              </button>
            </div>

            {/* Next / Finish Step Button */}
            {currentStepIndex < selectedGuided.steps.length - 1 ? (
              <button
                className="guided-nav-btn next"
                onClick={handleNextStep}
                aria-label="Next posture step"
              >
                <span>Next Step</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                className="guided-nav-btn finish"
                onClick={handleCompleteGuidedExercise}
                aria-label="Complete exercise"
              >
                <span>Finish & Celebrate</span>
                <CheckCircle2 size={20} />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          4. BEAUTIFUL CELEBRATION / COMPLETION SCREEN
         ══════════════════════════════════════════════════════════════ */}
      {viewState === "completed" && (
        <motion.div
          className="breathing-completed-container"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.45 }}
        >
          <div className="completed-card">
            {/* Celebration Icon */}
            <div className="completed-badge-icon">
              <CheckCircle2 size={48} className="check-icon" />
            </div>

            <h1 className="completed-title">
              Well Done! You Honored Your Mind & Body.
            </h1>
            <p className="completed-subtitle">
              Taking intentional time out of your busy study routine creates immediate
              nervous system resilience and renewed focus.
            </p>

            {/* Summary Metrics */}
            <div className="completed-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Exercise</span>
                <span className="metric-value">
                  {lastCompletedExercise?.name || selectedGuided?.name || selectedBreathing?.name}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Duration</span>
                <span className="metric-value">
                  {lastCompletedExercise?.duration || "3 Minutes Practiced"}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Achievement</span>
                <span className="metric-value">
                  {lastCompletedExercise?.detail || "Full Mindful Practice Completed"}
                </span>
              </div>
            </div>

            {/* Affirmation Card */}
            <div className="completed-affirmation-card">
              <Sparkles size={18} className="affirmation-sparkle" />
              <p>
                "Peace does not mean being in a place where there is no noise or trouble.
                It means being in the midst of those things and still being calm in your heart."
              </p>
            </div>

            {/* Actions */}
            <div className="completed-actions">
              <button
                className="completed-btn primary"
                onClick={() => {
                  if (lastCompletedExercise?.category === "breathing") {
                    handleStartBreathing(selectedBreathing);
                  } else if (selectedGuided) {
                    handleStartGuided(selectedGuided);
                  }
                }}
              >
                <RotateCcw size={18} />
                <span>Practice Again</span>
              </button>

              <button
                className="completed-btn secondary"
                onClick={() => setViewState("select")}
              >
                <span>Explore Other Exercises</span>
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
