import mongoose from "mongoose";

const referralUpdateSchema = new mongoose.Schema(
  {
    referralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    previousStatus: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "on_hold", "completed", "cancelled"],
    },
    newStatus: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "on_hold", "completed", "cancelled"],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    updateType: {
      type: String,
      enum: ["status_change", "assignment", "note_added", "priority_change"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
referralUpdateSchema.index({ referralId: 1, createdAt: -1 });
referralUpdateSchema.index({ updatedBy: 1, createdAt: -1 });

export default mongoose.model("ReferralUpdate", referralUpdateSchema);
