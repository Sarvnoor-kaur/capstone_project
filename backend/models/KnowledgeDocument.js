import mongoose from "mongoose";

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    version: {
      type: String,
      default: "1.0",
    },
    documentType: {
      type: String,
      enum: ["article", "guide", "resource", "policy", "other"],
      default: "resource",
    },
    category: {
      type: String,
      enum: [
        "mental_health",
        "coping_strategies",
        "crisis_resources",
        "self_care",
        "academic_support",
        "general_wellness",
      ],
    },
    metadata: {
      author: {
        type: String,
      },
      source: {
        type: String,
      },
      publicationDate: {
        type: Date,
      },
      language: {
        type: String,
        default: "en",
      },
      tags: {
        type: [String],
      },
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
knowledgeDocumentSchema.index({ approvalStatus: 1, isActive: 1 });
knowledgeDocumentSchema.index({ category: 1, approvalStatus: 1 });
knowledgeDocumentSchema.index({ uploadedBy: 1 });

// Virtual for chunks
knowledgeDocumentSchema.virtual("chunks", {
  ref: "KnowledgeChunk",
  localField: "_id",
  foreignField: "documentId",
});

export default mongoose.model("KnowledgeDocument", knowledgeDocumentSchema);
