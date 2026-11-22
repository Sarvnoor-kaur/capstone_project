import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema(
  {
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentAttempt",
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    interpretation: {
      severity: {
        type: String,
        enum: ["none", "mild", "moderate", "moderately_severe", "severe"],
      },
      label: {
        type: String,
      },
      description: {
        type: String,
      },
      recommendations: {
        type: [String],
      },
    },
    completedAt: {
      type: Date,
      required: true,
    },
    sharedWith: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
        permission: {
          type: String,
          enum: ["view", "view_and_comment"],
          default: "view",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
assessmentResultSchema.index({ userId: 1, completedAt: -1 });
assessmentResultSchema.index({ attemptId: 1 });
assessmentResultSchema.index({ "interpretation.severity": 1 });

export default mongoose.model("AssessmentResult", assessmentResultSchema);
