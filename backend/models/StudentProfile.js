import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    yearOfStudy: {
      type: String,
      trim: true,
    },
    // Additional profile fields
    profilePicture: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    preferences: {
      communicationMode: {
        type: String,
        enum: ["email", "phone", "in_person", "any"],
        default: "any",
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
studentProfileSchema.index({ userId: 1 });
studentProfileSchema.index({ university: 1, yearOfStudy: 1 });

// Method to calculate profile completion percentage
studentProfileSchema.methods.calculateCompletion = async function () {
  const User = mongoose.model("User");
  const user = await User.findById(this.userId);
  
  const fields = [
    user?.name,
    user?.email,
    this.studentId,
    this.university,
    this.department,
    this.course,
    this.yearOfStudy,
    this.profilePicture,
    this.phoneNumber,
    this.bio,
  ];
  
  const completed = fields.filter((f) => f && String(f).trim()).length;
  return Math.round((completed / fields.length) * 100);
};

export default mongoose.model("StudentProfile", studentProfileSchema);
