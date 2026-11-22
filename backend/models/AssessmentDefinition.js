import mongoose from "mongoose";

const assessmentDefinitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    assessmentType: {
      type: String,
      enum: ["PHQ-9", "GAD-7", "PSS-10", "CUSTOM"],
      required: true,
    },
    version: {
      type: String,
      required: true,
      default: "1.0",
    },
    description: {
      type: String,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
    },
    questions: [
      {
        questionNumber: {
          type: Number,
          required: true,
        },
        questionText: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          enum: ["multiple_choice", "scale", "text", "yes_no"],
          default: "scale",
        },
        options: [
          {
            value: Number,
            label: String,
          },
        ],
        required: {
          type: Boolean,
          default: true,
        },
      },
    ],
    scoringConfiguration: {
      minScore: {
        type: Number,
        required: true,
      },
      maxScore: {
        type: Number,
        required: true,
      },
      interpretationRanges: [
        {
          label: String,
          minScore: Number,
          maxScore: Number,
          description: String,
          severity: {
            type: String,
            enum: ["none", "mild", "moderate", "moderately_severe", "severe"],
          },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assessmentDefinitionSchema.index({ assessmentType: 1, version: 1 });
assessmentDefinitionSchema.index({ isActive: 1 });

export default mongoose.model("AssessmentDefinition", assessmentDefinitionSchema);
