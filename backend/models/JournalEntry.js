import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Journal title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Journal content is required"],
    },
    mood: {
      type: String,
      enum: ["Happy", "Calm", "Sad", "Anxious", "Stressed", "Grateful", "Neutral"],
      default: "Calm",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Compound index for efficient user journal timeline queries
journalEntrySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("JournalEntry", journalEntrySchema);
