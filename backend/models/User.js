import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "counselor", "admin"],
      default: "student",
    },
    // Account status fields
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    // Security fields
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    // Legacy fields (keep for backward compatibility)
    institution: String,
    program: String,
    year: String,
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual for account locked status
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Instance method to check if account is locked
userSchema.methods.checkAccountLock = function () {
  if (this.lockUntil && this.lockUntil > Date.now()) {
    return { locked: true, lockUntil: this.lockUntil };
  }
  
  // Reset failed attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.failedLoginAttempts = 0;
    this.lockUntil = undefined;
  }
  
  return { locked: false };
};

// Instance method to increment failed login attempts
userSchema.methods.incLoginAttempts = function (callback) {
  // If previous lock expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne(
      {
        $set: { failedLoginAttempts: 1 },
        $unset: { lockUntil: 1 },
      },
      callback
    );
  }

  const updates = { $inc: { failedLoginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 30 * 60 * 1000; // 30 minutes

  // Lock account after max attempts
  if (this.failedLoginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates, callback);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function (callback) {
  return this.updateOne(
    {
      $set: { failedLoginAttempts: 0 },
      $unset: { lockUntil: 1 },
    },
    callback
  );
};

export default mongoose.model("User", userSchema);
