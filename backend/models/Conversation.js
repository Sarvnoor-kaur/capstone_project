import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "New Conversation",
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
    },
    metadata: {
      topics: {
        type: [String],
        default: [],
      },
      sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative", "mixed", "unknown"],
        default: "unknown",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, status: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Virtual for messages
conversationSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversationId",
});

// Method to update message count and timestamp
conversationSchema.methods.updateMessageStats = async function () {
  const Message = mongoose.model("Message");
  this.messageCount = await Message.countDocuments({
    conversationId: this._id,
  });
  this.lastMessageAt = new Date();
  return this.save();
};

export default mongoose.model("Conversation", conversationSchema);
