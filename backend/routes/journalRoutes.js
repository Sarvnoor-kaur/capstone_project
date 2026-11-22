import express from "express";
import JournalEntry from "../models/JournalEntry.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allowed moods
const ALLOWED_MOODS = ["Happy", "Calm", "Sad", "Anxious", "Stressed", "Grateful", "Neutral"];

/**
 * @route   GET /api/journal/stats
 * @desc    Get summary statistics for the logged-in user's journal entries
 * @access  Private
 */
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await JournalEntry.countDocuments({ userId });

    // Start of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonth = await JournalEntry.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth },
    });

    // Latest entry date
    const latestEntry = await JournalEntry.findOne({ userId })
      .sort({ createdAt: -1 })
      .select("createdAt title mood");

    // Mood breakdown aggregation
    const moodBreakdown = await JournalEntry.aggregate([
      { $match: { userId } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
    ]);

    const moodCounts = {};
    moodBreakdown.forEach((item) => {
      if (item._id) moodCounts[item._id] = item.count;
    });

    res.json({
      total,
      thisMonth,
      latestDate: latestEntry ? latestEntry.createdAt : null,
      latestTitle: latestEntry ? latestEntry.title : null,
      moodCounts,
    });
  } catch (err) {
    console.error("Error fetching journal stats:", err);
    res.status(500).json({ message: "Failed to fetch journal statistics" });
  }
});

/**
 * @route   GET /api/journal
 * @desc    Fetch logged-in user's journal entries with optional search, mood filter, tag filter, and sorting
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { search, mood, tag, sort = "latest", limit = 50 } = req.query;

    const query = { userId };

    // Search query matching title or content
    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");
      query.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    // Mood filter
    if (mood && mood !== "All" && ALLOWED_MOODS.includes(mood)) {
      query.mood = mood;
    }

    // Tag filter
    if (tag && tag !== "All" && tag.trim() !== "") {
      query.tags = tag.trim();
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "title") {
      sortOption = { title: 1 };
    }

    const entries = await JournalEntry.find(query)
      .sort(sortOption)
      .limit(parseInt(limit, 10) || 50);

    res.json(entries);
  } catch (err) {
    console.error("Error fetching journal entries:", err);
    res.status(500).json({ message: "Failed to load journal entries" });
  }
});

/**
 * @route   GET /api/journal/:id
 * @desc    Fetch a single journal entry by ID (strictly private to owner)
 * @access  Private
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    res.json(entry);
  } catch (err) {
    console.error("Error fetching single journal entry:", err);
    res.status(500).json({ message: "Failed to fetch journal entry" });
  }
});

/**
 * @route   POST /api/journal
 * @desc    Create a new private journal entry
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Journal content cannot be empty" });
    }

    // Clean and validate mood
    const validMood = ALLOWED_MOODS.includes(mood) ? mood : "Calm";

    // Clean tags
    let cleanTags = [];
    if (Array.isArray(tags)) {
      cleanTags = tags
        .map((t) => (typeof t === "string" ? t.trim() : ""))
        .filter((t) => t.length > 0 && t.length <= 30);
    }

    const entry = await JournalEntry.create({
      userId: req.user._id,
      title: title.trim(),
      content: content.trim(),
      mood: validMood,
      tags: cleanTags,
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error("Error creating journal entry:", err);
    res.status(400).json({ message: err.message || "Failed to create journal entry" });
  }
});

/**
 * @route   PUT /api/journal/:id
 * @desc    Update an existing journal entry (strictly private to owner)
 * @access  Private
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found or unauthorized" });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      entry.title = title.trim();
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({ message: "Journal content cannot be empty" });
      }
      entry.content = content.trim();
    }

    if (mood !== undefined) {
      if (ALLOWED_MOODS.includes(mood)) {
        entry.mood = mood;
      }
    }

    if (tags !== undefined && Array.isArray(tags)) {
      entry.tags = tags
        .map((t) => (typeof t === "string" ? t.trim() : ""))
        .filter((t) => t.length > 0 && t.length <= 30);
    }

    const updated = await entry.save();
    res.json(updated);
  } catch (err) {
    console.error("Error updating journal entry:", err);
    res.status(400).json({ message: err.message || "Failed to update journal entry" });
  }
});

/**
 * @route   DELETE /api/journal/:id
 * @desc    Delete a journal entry (strictly private to owner)
 * @access  Private
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Journal entry not found or unauthorized" });
    }

    res.json({ message: "Journal entry deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("Error deleting journal entry:", err);
    res.status(500).json({ message: "Failed to delete journal entry" });
  }
});

export default router;
