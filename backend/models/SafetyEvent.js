import mongoose from "mongoose";

const safetyEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    severity: {
      type: String,
      enum: ["NORMAL", "ELEVATED_CONCERN", "URGENT_CONCERN", "UNAVAILABLE"],
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "self_harm_mention",
        "suicide_ideation",
        "severe_crisis",
        "assessment_high_risk",
        "multiple_concerns",
        "system_alert",
      ],
      required: true,
    },
    detectionMethod: {
      type: String,
      enum: ["keyword", "ml_classifier", "assessment", "manual_report"],
    },
    details: {
      triggerText: {
        type: String,
      },
      keywords: {
        type: [String],
      },
      assessmentScore: {
        type: Number,
      },
      contextSummary: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "false_positive"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
    },
    actionTaken: {
      type: String,
      enum: [
        "crisis_resources_shown",
        "counselor_notified",
        "emergency_contact_made",
        "no_action_needed",
        "follow_up_scheduled",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
safetyEventSchema.index({ userId: 1, createdAt: -1 });
safetyEventSchema.index({ severity: 1, status: 1 });
safetyEventSchema.index({ status: 1, createdAt: -1 });
safetyEventSchema.index({ conversationId: 1 });

export default mongoose.model("SafetyEvent", safetyEventSchema);
