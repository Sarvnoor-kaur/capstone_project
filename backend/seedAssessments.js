import mongoose from "mongoose";
import dotenv from "dotenv";
import AssessmentDefinition from "./models/AssessmentDefinition.js";

dotenv.config();

/**
 * Assessment Seed Data
 * Creates PHQ-9 and GAD-7 assessment definitions
 * 
 * NOTE: PHQ-9 and GAD-7 are standardized, validated screening tools.
 * Questions are based on publicly available versions.
 * Consult with qualified professionals before clinical use.
 */

const assessmentDefinitions = [
  {
    name: "Patient Health Questionnaire-9 (PHQ-9)",
    assessmentType: "PHQ-9",
    version: "1.0",
    description: "A brief screening tool to assess symptoms of depression over the past two weeks.",
    instructions: "Over the last 2 weeks, how often have you been bothered by any of the following problems? Please select the answer that best describes your experience.",
    questions: [
      {
        questionNumber: 1,
        questionText: "Little interest or pleasure in doing things",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 2,
        questionText: "Feeling down, depressed, or hopeless",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 3,
        questionText: "Trouble falling or staying asleep, or sleeping too much",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 4,
        questionText: "Feeling tired or having little energy",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 5,
        questionText: "Poor appetite or overeating",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 6,
        questionText: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 7,
        questionText: "Trouble concentrating on things, such as reading or watching television",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 8,
        questionText: "Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 9,
        questionText: "Thoughts that you would be better off dead, or of hurting yourself in some way",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
    ],
    scoringConfiguration: {
      minScore: 0,
      maxScore: 27,
      interpretationRanges: [
        {
          label: "Minimal or None",
          minScore: 0,
          maxScore: 4,
          description: "Your responses suggest minimal or no depression symptoms.",
          severity: "none",
        },
        {
          label: "Mild",
          minScore: 5,
          maxScore: 9,
          description: "Your responses suggest mild depression symptoms.",
          severity: "mild",
        },
        {
          label: "Moderate",
          minScore: 10,
          maxScore: 14,
          description: "Your responses suggest moderate depression symptoms.",
          severity: "moderate",
        },
        {
          label: "Moderately Severe",
          minScore: 15,
          maxScore: 19,
          description: "Your responses suggest moderately severe depression symptoms.",
          severity: "moderately_severe",
        },
        {
          label: "Severe",
          minScore: 20,
          maxScore: 27,
          description: "Your responses suggest severe depression symptoms.",
          severity: "severe",
        },
      ],
    },
    isActive: true,
  },
  {
    name: "Generalized Anxiety Disorder-7 (GAD-7)",
    assessmentType: "GAD-7",
    version: "1.0",
    description: "A brief screening tool to assess symptoms of anxiety over the past two weeks.",
    instructions: "Over the last 2 weeks, how often have you been bothered by the following problems? Please select the answer that best describes your experience.",
    questions: [
      {
        questionNumber: 1,
        questionText: "Feeling nervous, anxious, or on edge",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 2,
        questionText: "Not being able to stop or control worrying",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 3,
        questionText: "Worrying too much about different things",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 4,
        questionText: "Trouble relaxing",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 5,
        questionText: "Being so restless that it's hard to sit still",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 6,
        questionText: "Becoming easily annoyed or irritable",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
      {
        questionNumber: 7,
        questionText: "Feeling afraid as if something awful might happen",
        questionType: "scale",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
        required: true,
      },
    ],
    scoringConfiguration: {
      minScore: 0,
      maxScore: 21,
      interpretationRanges: [
        {
          label: "Minimal",
          minScore: 0,
          maxScore: 4,
          description: "Your responses suggest minimal anxiety symptoms.",
          severity: "none",
        },
        {
          label: "Mild",
          minScore: 5,
          maxScore: 9,
          description: "Your responses suggest mild anxiety symptoms.",
          severity: "mild",
        },
        {
          label: "Moderate",
          minScore: 10,
          maxScore: 14,
          description: "Your responses suggest moderate anxiety symptoms.",
          severity: "moderate",
        },
        {
          label: "Severe",
          minScore: 15,
          maxScore: 21,
          description: "Your responses suggest severe anxiety symptoms.",
          severity: "severe",
        },
      ],
    },
    isActive: true,
  },
];

const seedAssessments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mentalhealth");
    console.log("✅ MongoDB connected");

    // Check if assessments already exist
    const existingCount = await AssessmentDefinition.countDocuments({});
    
    if (existingCount > 0) {
      console.log(`\n📋 Found ${existingCount} existing assessments. Skipping seed.`);
      console.log("✅ Assessments already seeded!");
      mongoose.connection.close();
      return;
    }

    console.log("📋 No existing assessments found. Seeding data...\n");

    // Insert new assessments
    const inserted = await AssessmentDefinition.insertMany(assessmentDefinitions);
    console.log(`✅ Inserted ${inserted.length} assessment definitions`);

    console.log("\n📋 Assessment Summary:");
    inserted.forEach((assessment) => {
      console.log(`   - ${assessment.name} (${assessment.assessmentType})`);
      console.log(`     Questions: ${assessment.questions.length}`);
      console.log(`     Score Range: ${assessment.scoringConfiguration.minScore}-${assessment.scoringConfiguration.maxScore}`);
    });

    mongoose.connection.close();
    console.log("\n✅ Assessment seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding assessments:", error);
    process.exit(1);
  }
};

seedAssessments();

