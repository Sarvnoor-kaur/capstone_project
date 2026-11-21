import mongoose from "mongoose";

const assessmentAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentDefinition",
      required: true,
    },
    responses: [
      {
        questionNumber: {
          type: Number,
          required: true,
        },
        response: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        answeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    completedAt: {
      type: Date,
    },
    metadata: {
      duration: {
        type: Number,
      },
      deviceType: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assessmentAttemptSchema.index({ userId: 1, completedAt: -1 });
assessmentAttemptSchema.index({ assessmentId: 1, userId: 1 });
assessmentAttemptSchema.index({ status: 1, createdAt: -1 });

// Method to mark as completed
assessmentAttemptSchema.methods.complete = function () {
  this.status = "completed";
  this.completedAt = new Date();
  if (this.startedAt) {
    this.metadata.duration = Math.floor(
      (this.completedAt - this.startedAt) / 1000
    );
  }
  return this.save();
};

export default mongoose.model("AssessmentAttempt", assessmentAttemptSchema);
