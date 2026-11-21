import mongoose from "mongoose";

const consentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    consentType: {
      type: String,
      enum: [
        "terms_of_service",
        "privacy_policy",
        "data_processing",
        "ai_interaction",
        "counselor_sharing",
        "research_participation",
      ],
      required: true,
    },
    consentVersion: {
      type: String,
      required: true,
      default: "1.0",
    },
    isAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    acceptedAt: {
      type: Date,
    },
    withdrawnAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
consentSchema.index({ userId: 1, consentType: 1 });
consentSchema.index({ userId: 1, isAccepted: 1 });
consentSchema.index({ createdAt: -1 });

// Method to withdraw consent
consentSchema.methods.withdraw = function () {
  this.isAccepted = false;
  this.withdrawnAt = new Date();
  return this.save();
};

export default mongoose.model("Consent", consentSchema);
