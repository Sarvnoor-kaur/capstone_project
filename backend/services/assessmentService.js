import AssessmentDefinition from "../models/AssessmentDefinition.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import AssessmentResult from "../models/AssessmentResult.js";
import SafetyEvent from "../models/SafetyEvent.js";

/**
 * Assessment Service
 * Business logic for mental health assessments
 */

// Get all active assessments
export const getActiveAssessments = async () => {
  return await AssessmentDefinition.find({ isActive: true })
    .select("-createdBy")
    .sort({ assessmentType: 1 });
};

// Get assessment by ID
export const getAssessmentById = async (assessmentId) => {
  try {
    console.log("Getting assessment by ID:", assessmentId);
    
    const assessment = await AssessmentDefinition.findById(assessmentId);
    
    if (!assessment) {
      console.error("Assessment not found:", assessmentId);
      throw new Error("Assessment not found");
    }
    
    if (!assessment.isActive) {
      console.error("Assessment is not active:", assessmentId);
      throw new Error("Assessment is not currently available");
    }
    
    console.log("Assessment found:", assessment.name);
    return assessment;
  } catch (error) {
    console.error("Error in getAssessmentById:", error);
    throw error;
  }
};

// Start a new assessment attempt
export const startAssessmentAttempt = async (userId, assessmentId) => {
  try {
    // Verify assessment exists and is active
    const assessment = await getAssessmentById(assessmentId);

    // Check for existing incomplete attempt
    const existingAttempt = await AssessmentAttempt.findOne({
      userId,
      assessmentId,
      status: "in_progress",
    });

    if (existingAttempt) {
      // Return existing attempt with just the IDs
      return {
        _id: existingAttempt._id,
        assessmentId: existingAttempt.assessmentId,
        userId: existingAttempt.userId,
        status: existingAttempt.status,
        startedAt: existingAttempt.startedAt,
      };
    }

    // Create new attempt
    const attempt = await AssessmentAttempt.create({
      userId,
      assessmentId,
      status: "in_progress",
      startedAt: new Date(),
      responses: [],
    });

    return {
      _id: attempt._id,
      assessmentId: attempt.assessmentId,
      userId: attempt.userId,
      status: attempt.status,
      startedAt: attempt.startedAt,
    };
  } catch (error) {
    console.error("Error in startAssessmentAttempt:", error);
    throw error;
  }
};

// Submit assessment responses and calculate score
export const submitAssessment = async (userId, attemptId, responses) => {
  // Get the attempt
  const attempt = await AssessmentAttempt.findOne({
    _id: attemptId,
    userId,
  });

  if (!attempt) {
    throw new Error("Assessment attempt not found");
  }

  if (attempt.status === "completed") {
    throw new Error("Assessment already completed");
  }

  // Get the assessment definition separately
  const assessment = await AssessmentDefinition.findById(attempt.assessmentId);
  
  if (!assessment) {
    throw new Error("Assessment definition not found");
  }

  // Validate responses
  const validationResult = validateResponses(assessment, responses);
  if (!validationResult.isValid) {
    throw new Error(validationResult.error);
  }

  // Check for PHQ-9 question 9 safety concern
  if (assessment.assessmentType === "PHQ-9") {
    await checkPHQ9SafetyConcern(userId, attempt._id, responses);
  }

  // Calculate total score
  const totalScore = calculateScore(responses);

  // Get interpretation
  const interpretation = getInterpretation(assessment, totalScore);

  // Update attempt
  attempt.responses = responses.map((r) => ({
    questionNumber: r.questionNumber,
    response: r.value,
    answeredAt: new Date(),
  }));
  await attempt.complete();

  // Create result
  const result = await AssessmentResult.create({
    attemptId: attempt._id,
    userId,
    totalScore,
    interpretation,
    completedAt: attempt.completedAt,
  });

  // Create safety event if score indicates concern
  if (interpretation.severity === "severe" || interpretation.severity === "moderately_severe") {
    await SafetyEvent.create({
      userId,
      severity: interpretation.severity === "severe" ? "ELEVATED_CONCERN" : "ELEVATED_CONCERN",
      eventType: "assessment_high_risk",
      detectionMethod: "assessment",
      details: {
        assessmentScore: totalScore,
        contextSummary: `${assessment.name} completed with ${interpretation.severity} severity`,
      },
      status: "pending",
      actionTaken: "crisis_resources_shown",
    });
  }

  return result;
};

// Validate responses against assessment definition
const validateResponses = (assessment, responses) => {
  const questionNumbers = new Set();

  // Check all required questions are answered
  for (const question of assessment.questions) {
    if (question.required) {
      const response = responses.find((r) => r.questionNumber === question.questionNumber);
      
      if (!response) {
        return {
          isValid: false,
          error: `Question ${question.questionNumber} is required but not answered`,
        };
      }

      // Check for duplicate responses
      if (questionNumbers.has(response.questionNumber)) {
        return {
          isValid: false,
          error: `Duplicate response for question ${response.questionNumber}`,
        };
      }
      questionNumbers.add(response.questionNumber);

      // Validate response value is within allowed options
      const isValidOption = question.options.some((opt) => opt.value === response.value);
      if (!isValidOption) {
        return {
          isValid: false,
          error: `Invalid response value for question ${response.questionNumber}`,
        };
      }
    }
  }

  return { isValid: true };
};

// Calculate total score
const calculateScore = (responses) => {
  return responses.reduce((total, response) => total + response.value, 0);
};

// Get interpretation based on score
const getInterpretation = (assessment, score) => {
  const range = assessment.scoringConfiguration.interpretationRanges.find(
    (r) => score >= r.minScore && score <= r.maxScore
  );

  if (!range) {
    throw new Error("Unable to interpret score");
  }

  return {
    severity: range.severity,
    label: range.label,
    description: range.description,
    recommendations: getRecommendations(range.severity),
  };
};

// Get recommendations based on severity
const getRecommendations = (severity) => {
  switch (severity) {
    case "none":
      return [
        "Continue practicing healthy habits and self-care",
        "Stay connected with friends and family",
        "Consider mindfulness or relaxation techniques",
      ];
    case "mild":
      return [
        "Monitor your symptoms over time",
        "Consider lifestyle changes like exercise and healthy sleep",
        "Talk to someone you trust about how you're feeling",
        "Consider speaking with a counselor if symptoms persist",
      ];
    case "moderate":
      return [
        "We recommend speaking with a mental health professional",
        "Consider reaching out to your campus counseling center",
        "Maintain regular sleep, exercise, and social connections",
        "Track your symptoms and notice what helps or worsens them",
      ];
    case "moderately_severe":
      return [
        "We strongly recommend speaking with a mental health professional soon",
        "Contact your campus counseling center to schedule an appointment",
        "Let someone you trust know how you're feeling",
        "If symptoms worsen, don't hesitate to seek immediate help",
      ];
    case "severe":
      return [
        "We strongly recommend speaking with a mental health professional as soon as possible",
        "Please contact your campus counseling center immediately",
        "Consider calling a crisis helpline if you need immediate support",
        "Let someone you trust know how you're feeling right away",
      ];
    default:
      return [];
  }
};

// Check PHQ-9 Question 9 for safety concern
const checkPHQ9SafetyConcern = async (userId, attemptId, responses) => {
  const question9 = responses.find((r) => r.questionNumber === 9);

  // If question 9 has any value other than 0 (Not at all), create safety event
  if (question9 && question9.value > 0) {
    await SafetyEvent.create({
      userId,
      severity: "URGENT_CONCERN",
      eventType: "self_harm_mention",
      detectionMethod: "assessment",
      details: {
        assessmentScore: question9.value,
        contextSummary: "PHQ-9 Question 9: Endorsed thoughts of self-harm",
      },
      status: "pending",
      actionTaken: "crisis_resources_shown",
    });

    // Return true to indicate safety concern detected
    return true;
  }

  return false;
};

// Get user's assessment results with pagination
export const getUserResults = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const results = await AssessmentResult.find({ userId })
    .populate({
      path: "attemptId",
      populate: {
        path: "assessmentId",
        select: "name assessmentType",
      },
    })
    .sort({ completedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await AssessmentResult.countDocuments({ userId });

  return {
    results,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      hasMore: skip + results.length < total,
    },
  };
};

// Get specific result by ID
export const getResultById = async (userId, resultId) => {
  const result = await AssessmentResult.findOne({
    _id: resultId,
    userId,
  }).populate({
    path: "attemptId",
    populate: {
      path: "assessmentId",
      select: "name assessmentType description questions",
    },
  });

  if (!result) {
    throw new Error("Result not found");
  }

  return result;
};

// Get assessment history (attempts and results)
export const getAssessmentHistory = async (userId, assessmentType = null, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  let query = { userId };
  
  if (assessmentType) {
    // Find assessment definition IDs for this type
    const assessments = await AssessmentDefinition.find({ assessmentType });
    const assessmentIds = assessments.map((a) => a._id);
    query.assessmentId = { $in: assessmentIds };
  }

  const attempts = await AssessmentAttempt.find(query)
    .populate("assessmentId", "name assessmentType")
    .sort({ completedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get results for completed attempts
  const completedAttemptIds = attempts
    .filter((a) => a.status === "completed")
    .map((a) => a._id);

  const results = await AssessmentResult.find({
    attemptId: { $in: completedAttemptIds },
  });

  // Map results to attempts
  const history = attempts.map((attempt) => {
    const result = results.find((r) => r.attemptId.toString() === attempt._id.toString());
    return {
      attemptId: attempt._id,
      assessmentName: attempt.assessmentId.name,
      assessmentType: attempt.assessmentId.assessmentType,
      status: attempt.status,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      score: result ? result.totalScore : null,
      severity: result ? result.interpretation.severity : null,
      label: result ? result.interpretation.label : null,
      resultId: result ? result._id : null,
    };
  });

  const total = await AssessmentAttempt.countDocuments(query);

  return {
    history,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      hasMore: skip + history.length < total,
    },
  };
};

