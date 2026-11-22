import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  PenLine,
  Search,
  Filter,
  Calendar,
  Clock,
  Sparkles,
  Lock,
  Trash2,
  Edit3,
  X,
  Check,
  ChevronRight,
  ArrowLeft,
  Tag,
  Smile,
  ShieldCheck,
  Eye,
  FileText,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import axios from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";
import "./JournalPage.css";

const MOOD_OPTIONS = [
  { value: "Calm", label: "Calm", emoji: "🌿", color: "#4FACFE", bg: "#EBF5FF" },
  { value: "Happy", label: "Happy", emoji: "☀️", color: "#FFA502", bg: "#FFF5E6" },
  { value: "Grateful", label: "Grateful", emoji: "💜", color: "#A99BEA", bg: "#F3F0FC" },
  { value: "Sad", label: "Sad", emoji: "💧", color: "#5E81AC", bg: "#EDF2F7" },
  { value: "Anxious", label: "Anxious", emoji: "⚡", color: "#E8A78A", bg: "#FFF0EB" },
  { value: "Stressed", label: "Stressed", emoji: "🌪️", color: "#FF6B9D", bg: "#FFEBF2" },
  { value: "Neutral", label: "Neutral", emoji: "☁️", color: "#8892B0", bg: "#F1F3F9" },
];

const PRESET_TAGS = [
  "Personal",
  "Studies",
  "Relationships",
  "Self-care",
  "Goals",
  "Gratitude",
];

const WRITING_PROMPTS = [
  "What made you smile or feel at peace today?",
  "What is one challenge you faced today, and how did you navigate it?",
  "Write three small things you are genuinely grateful for right now.",
  "What is a thought or worry you'd like to release from your mind?",
  "How did your body and mind feel throughout the day?",
];

const JournalPage = () => {
  const { user } = useAuth();

  // State
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    latestDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMoodFilter, setSelectedMoodFilter] = useState("All");
  const [selectedTagFilter, setSelectedTagFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");

  // Mode: "dashboard" | "write"
  const [viewMode, setViewMode] = useState("dashboard");
  const [editingEntry, setEditingEntry] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formMood, setFormMood] = useState("Calm");
  const [formTags, setFormTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [saveSuccessNotification, setSaveSuccessNotification] = useState("");

  // Modals
  const [readingEntry, setReadingEntry] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch entries & stats
  const fetchJournalData = async () => {
    try {
      setLoading(true);
      const [entriesRes, statsRes] = await Promise.allSettled([
        axios.get("/journal"),
        axios.get("/journal/stats"),
      ]);

      if (entriesRes.status === "fulfilled" && Array.isArray(entriesRes.value?.data)) {
        setEntries(entriesRes.value.data);
      } else {
        setEntries([]);
      }

      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setStats(statsRes.value.data);
      } else {
        setStats({
          total: 0,
          thisMonth: 0,
          latestDate: null,
        });
      }
    } catch (err) {
      console.error("Failed to load journal data:", err);
      setEntries([]);
      setStats({
        total: 0,
        thisMonth: 0,
        latestDate: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalData();
  }, []);

  // Filtered & Sorted Entries
  const filteredEntries = useMemo(() => {
    if (!Array.isArray(entries)) return [];
    return entries
      .filter((entry) => {
        if (!entry) return false;
        const title = typeof entry.title === "string" ? entry.title : "";
        const content = typeof entry.content === "string" ? entry.content : "";
        const entryMood = entry.mood || "";
        const entryTags = Array.isArray(entry.tags) ? entry.tags : [];

        // Search filter
        const matchesSearch =
          !searchQuery.trim() ||
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.toLowerCase().includes(searchQuery.toLowerCase());

        // Mood filter
        const matchesMood =
          selectedMoodFilter === "All" || entryMood === selectedMoodFilter;

        // Tag filter
        const matchesTag =
          selectedTagFilter === "All" || entryTags.includes(selectedTagFilter);

        return matchesSearch && matchesMood && matchesTag;
      })
      .sort((a, b) => {
        if (sortOrder === "oldest") {
          return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
        }
        if (sortOrder === "title") {
          return (a?.title || "").localeCompare(b?.title || "");
        }
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      });
  }, [entries, searchQuery, selectedMoodFilter, selectedTagFilter, sortOrder]);

  // Open Writer for New Entry
  const handleOpenNewEntry = () => {
    setEditingEntry(null);
    setFormTitle("");
    setFormContent("");
    setFormMood("Calm");
    setFormTags(["Personal"]);
    setFormError("");
    setViewMode("write");
  };

  // Open Writer for Editing Existing Entry
  const handleOpenEditEntry = (entry) => {
    if (!entry) return;
    setEditingEntry(entry);
    setFormTitle(entry.title || "");
    setFormContent(entry.content || "");
    setFormMood(entry.mood || "Calm");
    setFormTags(Array.isArray(entry.tags) ? entry.tags : []);
    setFormError("");
    setReadingEntry(null);
    setViewMode("write");
  };

  // Tag Toggling
  const handleToggleTag = (tag) => {
    const currentTags = Array.isArray(formTags) ? formTags : [];
    if (currentTags.includes(tag)) {
      setFormTags(currentTags.filter((t) => t !== tag));
    } else {
      if (currentTags.length >= 6) return;
      setFormTags([...currentTags, tag]);
    }
  };

  const handleAddCustomTag = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const currentTags = Array.isArray(formTags) ? formTags : [];
      const trimmed = (customTagInput || "").trim().replace(/^#/, "");
      if (trimmed && !currentTags.includes(trimmed) && currentTags.length < 6) {
        setFormTags([...currentTags, trimmed]);
        setCustomTagInput("");
      }
    }
  };

  // Save / Submit Entry
  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError("Please provide a title for your entry.");
      return;
    }
    if (!formContent || !formContent.trim()) {
      setFormError("Your journal entry cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const payload = {
        title: formTitle.trim(),
        content: formContent.trim(),
        mood: formMood,
        tags: formTags,
      };

      if (editingEntry) {
        // Update existing entry
        const res = await axios.put(`/journal/${editingEntry._id}`, payload);
        if (res?.data) {
          setEntries((prev) =>
            (Array.isArray(prev) ? prev : []).map((item) =>
              item._id === editingEntry._id ? res.data : item
            )
          );
        }
        showNotification("Journal entry updated successfully ✨");
      } else {
        // Create new entry
        const res = await axios.post("/journal", payload);
        if (res?.data) {
          setEntries((prev) => [res.data, ...(Array.isArray(prev) ? prev : [])]);
          setStats((prev) => ({
            ...prev,
            total: (prev?.total || 0) + 1,
            thisMonth: (prev?.thisMonth || 0) + 1,
            latestDate: res.data.createdAt,
          }));
        }
        showNotification("Your thought has been safely saved 💜");
      }

      setViewMode("dashboard");
    } catch (err) {
      console.error("Save error:", err);
      if (err.response?.status === 404) {
        setFormError(
          "Backend journal route not found (404). Please restart the backend server so the newly added /api/journal route takes effect."
        );
      } else {
        setFormError(
          err.response?.data?.message || "Failed to save journal entry. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Entry
  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/journal/${entryToDelete._id}`);
      setEntries((prev) =>
        (Array.isArray(prev) ? prev : []).filter((item) => item._id !== entryToDelete._id)
      );
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, (prev?.total || 0) - 1),
      }));
      setEntryToDelete(null);
      if (readingEntry?._id === entryToDelete._id) {
        setReadingEntry(null);
      }
      showNotification("Journal entry deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      showNotification("Failed to delete journal entry.");
    } finally {
      setIsDeleting(false);
    }
  };

  const showNotification = (msg) => {
    setSaveSuccessNotification(msg);
    setTimeout(() => {
      setSaveSuccessNotification("");
    }, 4000);
  };

  // Word & Character count
  const wordCount = useMemo(() => {
    if (!formContent || typeof formContent !== "string" || !formContent.trim()) return 0;
    return formContent.trim().split(/\s+/).filter(Boolean).length;
  }, [formContent]);

  const charCount = typeof formContent === "string" ? formContent.length : 0;

  const getMoodInfo = (moodName) => {
    return (
      MOOD_OPTIONS.find((m) => m.value === moodName) || {
        value: moodName || "Calm",
        label: moodName || "Calm",
        emoji: "🌿",
        color: "#4FACFE",
        bg: "#EBF5FF",
      }
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="journal-page-root">
      {/* ── Success Notification Toast ── */}
      <AnimatePresence>
        {saveSuccessNotification && (
          <motion.div
            className="journal-toast-notification"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <Check size={18} />
            <span>{saveSuccessNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          VIEW 1: WRITING INTERFACE (CREATE / EDIT)
         ══════════════════════════════════════════════════════════════ */}
      {viewMode === "write" ? (
        <motion.div
          className="journal-writer-container"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.3 }}
        >
          {/* Writer Top Bar */}
          <div className="writer-top-bar">
            <button
              className="writer-back-btn"
              onClick={() => setViewMode("dashboard")}
              type="button"
            >
              <ArrowLeft size={18} />
              <span>Back to Journal</span>
            </button>

            <div className="writer-security-indicator">
              <Lock size={14} />
              <span>Private & Encrypted to You</span>
            </div>

            <div className="writer-action-buttons">
              <button
                className="writer-cancel-btn"
                onClick={() => setViewMode("dashboard")}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="writer-save-btn"
                onClick={handleSaveEntry}
                type="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="writer-spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>{editingEntry ? "Update Entry" : "Save Entry"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="writer-error-banner">
              <span>{formError}</span>
            </div>
          )}

          {/* The Paper Canvas */}
          <div className="writer-canvas-card">
            {/* Title Input */}
            <input
              type="text"
              className="writer-title-input"
              placeholder="Title of your thoughts today..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              maxLength={150}
              autoFocus
            />

            {/* Mood Selector Row */}
            <div className="writer-mood-section">
              <label className="writer-section-label">
                How are you feeling right now?
              </label>
              <div className="writer-mood-pill-group">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = formMood === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      className={`writer-mood-pill ${isSelected ? "selected" : ""}`}
                      onClick={() => setFormMood(m.value)}
                      style={{
                        borderColor: isSelected ? m.color : undefined,
                        backgroundColor: isSelected ? m.bg : undefined,
                        color: isSelected ? m.color : undefined,
                      }}
                    >
                      <span className="mood-pill-emoji">{m.emoji}</span>
                      <span className="mood-pill-text">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags Selector Row */}
            <div className="writer-tags-section">
              <label className="writer-section-label">
                Add reflection tags (optional):
              </label>
              <div className="writer-tags-wrapper">
                {PRESET_TAGS.map((tag) => {
                  const isSelected = formTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`writer-tag-chip ${isSelected ? "selected" : ""}`}
                      onClick={() => handleToggleTag(tag)}
                    >
                      #{tag}
                    </button>
                  );
                })}

                {/* Custom tags entered by user */}
                {formTags
                  .filter((t) => !PRESET_TAGS.includes(t))
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="writer-tag-chip selected custom"
                      onClick={() => handleToggleTag(tag)}
                    >
                      #{tag} &times;
                    </button>
                  ))}

                {/* Custom Tag Input */}
                <div className="custom-tag-input-box">
                  <input
                    type="text"
                    placeholder="+ Add tag"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={handleAddCustomTag}
                    maxLength={25}
                  />
                  {customTagInput && (
                    <button type="button" onClick={handleAddCustomTag}>
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inspiration Prompt Chips */}
            <div className="writer-prompts-tray">
              <div className="prompts-tray-header">
                <HelpCircle size={14} />
                <span>Need inspiration? Click a prompt to get started:</span>
              </div>
              <div className="prompts-chips-scroll">
                {WRITING_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => {
                      setFormContent((prev) =>
                        prev ? `${prev}\n\n*${prompt}*\n` : `*${prompt}*\n`
                      );
                    }}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Text Editor Area */}
            <div className="writer-textarea-wrapper">
              <textarea
                className="writer-textarea"
                placeholder="Pour your heart out, breathe freely, and reflect without judgment. Everything you write here is strictly private and stored securely..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={14}
              />
            </div>

            {/* Writer Footer Metrics */}
            <div className="writer-metrics-bar">
              <div className="metrics-left">
                <span>
                  <strong>{wordCount}</strong> {wordCount === 1 ? "word" : "words"}
                </span>
                <span className="dot-divider">•</span>
                <span>
                  <strong>{charCount}</strong> characters
                </span>
                <span className="dot-divider">•</span>
                <span>
                  ~{Math.max(1, Math.ceil(wordCount / 180))} min read
                </span>
              </div>
              <div className="metrics-right">
                <span>Reflecting as {user?.name || "Student"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            VIEW 2: JOURNAL DASHBOARD & ENTRIES BROWSER
           ══════════════════════════════════════════════════════════════ */
        <div className="journal-dashboard-view">
          {/* ── Page Hero / Header ── */}
          <div className="journal-header-section">
            <div className="journal-header-left">
              <div className="journal-privacy-badge">
                <ShieldCheck size={14} />
                <span>100% Confidential & Encrypted</span>
              </div>
              <h1 className="journal-title">Your Private Journal</h1>
              <p className="journal-subtitle">
                A safe space to express your thoughts, process emotions, and nurture self-awareness.
              </p>
            </div>

            <button className="btn-write-entry" onClick={handleOpenNewEntry}>
              <PenLine size={18} />
              <span>Write New Entry</span>
            </button>
          </div>

          {/* ── Summary Stats Row ── */}
          <div className="journal-stats-grid">
            <div className="journal-stat-card">
              <div className="stat-icon-circle lavender">
                <BookOpen size={22} />
              </div>
              <div>
                <p className="stat-label">Total Journal Entries</p>
                <p className="stat-number">{stats.total}</p>
                <span className="stat-hint">Reflections preserved</span>
              </div>
            </div>

            <div className="journal-stat-card">
              <div className="stat-icon-circle mint">
                <Calendar size={22} />
              </div>
              <div>
                <p className="stat-label">Entries This Month</p>
                <p className="stat-number">{stats.thisMonth}</p>
                <span className="stat-hint">
                  {new Date().toLocaleString("en-US", { month: "long" })} activity
                </span>
              </div>
            </div>

            <div className="journal-stat-card">
              <div className="stat-icon-circle peach">
                <Clock size={22} />
              </div>
              <div>
                <p className="stat-label">Latest Reflection</p>
                <p className="stat-date-text">
                  {stats.latestDate ? formatDate(stats.latestDate) : "No entries yet"}
                </p>
                <span className="stat-hint">
                  {stats.latestDate ? "Keep your momentum going" : "Start today"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Search, Filters, and Controls Toolbar ── */}
          <div className="journal-toolbar">
            {/* Search Box */}
            <div className="journal-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search reflections by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter Controls Group */}
            <div className="journal-filter-group">
              {/* Mood Filter */}
              <div className="select-wrapper">
                <label>Mood:</label>
                <select
                  value={selectedMoodFilter}
                  onChange={(e) => setSelectedMoodFilter(e.target.value)}
                >
                  <option value="All">All Moods</option>
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.emoji} {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div className="select-wrapper">
                <label>Tag:</label>
                <select
                  value={selectedTagFilter}
                  onChange={(e) => setSelectedTagFilter(e.target.value)}
                >
                  <option value="All">All Tags</option>
                  {PRESET_TAGS.map((t) => (
                    <option key={t} value={t}>
                      #{t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="select-wrapper">
                <label>Sort:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="latest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">By Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Journal Entries Content Area ── */}
          {loading ? (
            <div className="journal-loading-state">
              <div className="journal-spinner" />
              <p>Loading your private reflections...</p>
            </div>
          ) : !filteredEntries || filteredEntries.length === 0 ? (
            /* Empty State */
            <div className="journal-empty-card">
              <div className="empty-icon-wrapper">
                <BookOpen size={48} />
              </div>
              <h3>
                {searchQuery || selectedMoodFilter !== "All" || selectedTagFilter !== "All"
                  ? "No matching entries found"
                  : "Your journal is ready for your thoughts"}
              </h3>
              <p>
                {searchQuery || selectedMoodFilter !== "All" || selectedTagFilter !== "All"
                  ? "Try resetting your search query or filters to see all your reflections."
                  : "Writing is a powerful tool to untangle stress, recognize joy, and stay present. Start your very first entry whenever you feel ready."}
              </p>
              {searchQuery || selectedMoodFilter !== "All" || selectedTagFilter !== "All" ? (
                <button
                  className="btn-reset-filters"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMoodFilter("All");
                    setSelectedTagFilter("All");
                  }}
                >
                  Clear Filters
                </button>
              ) : (
                <button className="btn-empty-write" onClick={handleOpenNewEntry}>
                  <PenLine size={16} />
                  <span>Write Your First Entry</span>
                </button>
              )}
            </div>
          ) : (
            /* Journal Cards Grid */
            <div className="journal-entries-grid">
              {filteredEntries.map((entry) => {
                const moodInfo = getMoodInfo(entry?.mood);
                const contentStr = typeof entry?.content === "string" ? entry.content : "";
                const entryWordCount = contentStr.trim()
                  ? contentStr.trim().split(/\s+/).filter(Boolean).length
                  : 0;

                return (
                  <motion.div
                    key={entry._id}
                    className="journal-entry-card"
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setReadingEntry(entry)}
                  >
                    {/* Card Top: Mood badge + Date */}
                    <div className="entry-card-header">
                      <span
                        className="entry-mood-badge"
                        style={{
                          backgroundColor: moodInfo.bg,
                          color: moodInfo.color,
                        }}
                      >
                        <span className="mood-badge-emoji">{moodInfo.emoji}</span>
                        <span>{moodInfo.label}</span>
                      </span>

                      <span className="entry-date-badge">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="entry-card-title">{entry?.title || "Untitled Entry"}</h3>

                    {/* Card Preview Text */}
                    <p className="entry-card-preview">{contentStr}</p>

                    {/* Tags List */}
                    {Array.isArray(entry?.tags) && entry.tags.length > 0 && (
                      <div className="entry-card-tags">
                        {entry.tags.map((tag) => (
                          <span key={tag} className="entry-tag-pill">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="entry-card-footer">
                      <span className="entry-meta-count">
                        {entryWordCount} words • ~{Math.max(1, Math.ceil(entryWordCount / 180))} min read
                      </span>

                      <div
                        className="entry-actions-row"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="card-action-btn edit"
                          onClick={() => handleOpenEditEntry(entry)}
                          title="Edit Entry"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="card-action-btn delete"
                          onClick={() => setEntryToDelete(entry)}
                          title="Delete Entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 1: FULL READER VIEW
         ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {readingEntry && (
          <div
            className="journal-modal-overlay"
            onClick={() => setReadingEntry(null)}
          >
            <motion.div
              className="journal-reader-modal"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="reader-modal-header">
                <div className="reader-meta-group">
                  {(() => {
                    const mood = getMoodInfo(readingEntry.mood);
                    return (
                      <span
                        className="entry-mood-badge"
                        style={{
                          backgroundColor: mood.bg,
                          color: mood.color,
                        }}
                      >
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </span>
                    );
                  })()}
                  <span className="reader-date-label">
                    {formatFullDate(readingEntry.createdAt)}
                  </span>
                </div>

                <div className="reader-header-actions">
                  <button
                    className="reader-btn edit"
                    onClick={() => handleOpenEditEntry(readingEntry)}
                  >
                    <Edit3 size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="reader-btn delete"
                    onClick={() => setEntryToDelete(readingEntry)}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    className="reader-close-btn"
                    onClick={() => setReadingEntry(null)}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="reader-modal-body">
                <h2 className="reader-entry-title">{readingEntry?.title || "Untitled Entry"}</h2>

                {Array.isArray(readingEntry?.tags) && readingEntry.tags.length > 0 && (
                  <div className="reader-tags-tray">
                    {readingEntry.tags.map((t) => (
                      <span key={t} className="entry-tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="reader-content-text">
                  {(readingEntry?.content || "").split("\n").map((para, i) => (
                    <p key={i}>{para || "\u00A0"}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 2: DELETE CONFIRMATION DIALOG
         ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {entryToDelete && (
          <div
            className="journal-modal-overlay"
            onClick={() => !isDeleting && setEntryToDelete(null)}
          >
            <motion.div
              className="journal-delete-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="delete-modal-icon">
                <Trash2 size={24} />
              </div>
              <h3>Delete Journal Entry?</h3>
              <p>
                Are you sure you want to delete <strong>"{entryToDelete?.title || "this entry"}"</strong>?
                This action is permanent and your entry cannot be recovered.
              </p>

              <div className="delete-modal-actions">
                <button
                  className="btn-modal-cancel"
                  onClick={() => setEntryToDelete(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="btn-modal-confirm-delete"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Entry"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalPage;
