import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "READ",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "REGISTER",
        "APPROVE",
        "REJECT",
        "ASSIGN",
        "ACCESS_SENSITIVE_DATA",
      ],
    },
    resourceType: {
      type: String,
      required: true,
      enum: [
        "User",
        "Conversation",
        "Message",
        "Assessment",
        "Referral",
        "Resource",
        "SafetyEvent",
        "StudentProfile",
        "CounselorProfile",
        "Consent",
        "System",
      ],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    metadata: {
      ip: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      previousValue: {
        type: mongoose.Schema.Types.Mixed,
      },
      newValue: {
        type: mongoose.Schema.Types.Mixed,
      },
      reason: {
        type: String,
      },
    },
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, action: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ resourceId: 1 });

// Prevent updates and deletes
auditLogSchema.pre("save", function (next) {
  if (!this.isNew) {
    throw new Error("Audit logs cannot be modified");
  }
  next();
});

export default mongoose.model("AuditLog", auditLogSchema);
