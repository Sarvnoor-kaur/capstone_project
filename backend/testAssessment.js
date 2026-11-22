import mongoose from "mongoose";
import dotenv from "dotenv";
import AssessmentDefinition from "./models/AssessmentDefinition.js";

dotenv.config();

const testAssessments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mentalhealth");
    console.log("✅ MongoDB connected");

    // List all assessments
    const assessments = await AssessmentDefinition.find({});
    console.log(`\n📋 Found ${assessments.length} assessments:\n`);
    
    assessments.forEach((assessment, index) => {
      console.log(`${index + 1}. ${assessment.name}`);
      console.log(`   ID: ${assessment._id}`);
      console.log(`   Type: ${assessment.assessmentType}`);
      console.log(`   Active: ${assessment.isActive}`);
      console.log(`   Questions: ${assessment.questions.length}`);
      console.log("");
    });

    // Test getting by ID
    if (assessments.length > 0) {
      const testId = assessments[0]._id;
      console.log(`🧪 Testing fetch by ID: ${testId}`);
      const found = await AssessmentDefinition.findById(testId);
      if (found) {
        console.log(`✅ Successfully found: ${found.name}`);
      } else {
        console.log(`❌ Failed to find assessment`);
      }
    }

    mongoose.connection.close();
    console.log("\n✅ Test completed!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testAssessments();

