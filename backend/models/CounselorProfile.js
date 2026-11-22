import mongoose from "mongoose";

const counselorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    specialization: {
      type: [String],
      enum: [
        "anxiety",
        "depression",
        "stress",
        "trauma",
        "relationships",
        "academic",
        "substance_abuse",
        "eating_disorders",
        "grief",
        "general",
      ],
      default: ["general"],
    },
    experience: {
      type: String,
      trim: true,
    },
    availability: {
      schedule: {
        type: Map,
        of: [String],
      },
      maxWeeklyStudents: {
        type: Number,
        default: 20,
      },
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
counselorProfileSchema.index({ userId: 1 });
counselorProfileSchema.index({ verificationStatus: 1 });
counselorProfileSchema.index({ specialization: 1 });

export default mongoose.model("CounselorProfile", counselorProfileSchema);
