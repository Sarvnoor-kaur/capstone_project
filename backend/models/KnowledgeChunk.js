import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KnowledgeDocument",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    pageNumber: {
      type: Number,
    },
    embedding: {
      type: [Number],
      default: undefined,
    },
    metadata: {
      source: {
        type: String,
      },
      version: {
        type: String,
      },
      approvalStatus: {
        type: String,
        enum: ["approved", "rejected"],
        default: "approved",
      },
      indexedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
knowledgeChunkSchema.index({ documentId: 1, chunkIndex: 1 });
knowledgeChunkSchema.index({ "metadata.approvalStatus": 1 });

export default mongoose.model("KnowledgeChunk", knowledgeChunkSchema);
