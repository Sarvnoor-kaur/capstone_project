import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: String,
      enum: ["USER", "AI"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    metadata: {
      model: {
        type: String,
      },
      tokens: {
        type: Number,
      },
      sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative", "unknown"],
      },
      topics: {
        type: [String],
      },
      safetyCheck: {
        status: {
          type: String,
          enum: ["NORMAL", "ELEVATED_CONCERN", "URGENT_CONCERN", "UNAVAILABLE"],
        },
        checkedAt: Date,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });

// Method to soft delete
messageSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.content = "[Message deleted]";
  return this.save();
};

export default mongoose.model("Message", messageSchema);
