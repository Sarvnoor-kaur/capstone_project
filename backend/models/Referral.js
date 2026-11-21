import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedCounselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "on_hold", "completed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    preferredMode: {
      type: String,
      enum: ["email", "phone", "video_call", "in_person", "any"],
      default: "any",
    },
    consentForSharing: {
      assessmentResults: {
        type: Boolean,
        default: false,
      },
      conversationHistory: {
        type: Boolean,
        default: false,
      },
      moodEntries: {
        type: Boolean,
        default: false,
      },
    },
    metadata: {
      source: {
        type: String,
        enum: ["student_request", "assessment_result", "safety_event", "admin_referral"],
        default: "student_request",
      },
      relatedAssessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssessmentAttempt",
      },
      relatedSafetyEventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SafetyEvent",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
referralSchema.index({ studentId: 1, createdAt: -1 });
referralSchema.index({ assignedCounselorId: 1, status: 1 });
referralSchema.index({ status: 1, priority: 1, createdAt: -1 });
referralSchema.index({ status: 1 });

// Virtual for updates
referralSchema.virtual("updates", {
  ref: "ReferralUpdate",
  localField: "_id",
  foreignField: "referralId",
});

export default mongoose.model("Referral", referralSchema);
