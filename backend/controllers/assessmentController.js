import {
  getActiveAssessments,
  getAssessmentById,
  startAssessmentAttempt,
  submitAssessment,
  getUserResults,
  getResultById,
  getAssessmentHistory,
} from "../services/assessmentService.js";

/**
 * Assessment Controller
 * HTTP handlers for assessment endpoints
 */

// @desc    Get all active assessments
// @route   GET /api/assessments
// @access  Private (Student)
export const listAssessments = async (req, res) => {
  try {
    const assessments = await getActiveAssessments();

    // Return minimal information for listing
    const assessmentList = assessments.map((a) => ({
      _id: a._id,
      name: a.name,
      assessmentType: a.assessmentType,
      description: a.description,
      questionCount: a.questions.length,
      estimatedMinutes: Math.ceil(a.questions.length / 2), // Rough estimate
      scoringRange: {
        min: a.scoringConfiguration.minScore,
        max: a.scoringConfiguration.maxScore,
      },
    }));

    res.json(assessmentList);
  } catch (error) {
    console.error("List assessments error:", error);
    res.status(500).json({ message: "Failed to retrieve assessments" });
  }
};

// @desc    Get assessment details
// @route   GET /api/assessments/:id
// @access  Private (Student)
export const getAssessmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await getAssessmentById(id);

    res.json(assessment);
  } catch (error) {
    console.error("Get assessment error:", error);
    if (error.message === "Assessment not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to retrieve assessment" });
  }
};

// @desc    Start a new assessment attempt
// @route   POST /api/assessments/:id/start
// @access  Private (Student)
export const startAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: assessmentId } = req.params;

    console.log("Starting assessment:", { userId, assessmentId });

    const attempt = await startAssessmentAttempt(userId, assessmentId);

    console.log("Assessment attempt created:", attempt);

    res.status(201).json({
      message: "Assessment started successfully",
      attemptId: attempt._id,
      assessmentId: attempt.assessmentId,
      startedAt: attempt.startedAt,
      status: attempt.status,
    });
  } catch (error) {
    console.error("Start assessment error:", error);
    if (error.message === "Assessment not found" || error.message === "Assessment is not currently available") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: "Failed to start assessment",
      error: error.message 
    });
  }
};

// @desc    Submit assessment responses
// @route   POST /api/assessments/attempts/:attemptId/submit
// @access  Private (Student)
export const submitAssessmentResponses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { attemptId } = req.params;
    const { responses } = req.body;

    console.log("Submitting assessment:", { userId, attemptId, responseCount: responses?.length });

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: "Responses are required" });
    }

    // Validate response format
    for (const response of responses) {
      if (typeof response.questionNumber !== "number" || typeof response.value !== "number") {
        return res.status(400).json({
          message: "Each response must have questionNumber and value",
        });
      }
    }

    const result = await submitAssessment(userId, attemptId, responses);

    console.log("Assessment submitted successfully:", { resultId: result._id, score: result.totalScore });

    res.json({
      message: "Assessment submitted successfully",
      resultId: result._id,
      totalScore: result.totalScore,
      interpretation: result.interpretation,
      completedAt: result.completedAt,
    });
  } catch (error) {
    console.error("Submit assessment error:", error);
    if (
      error.message === "Assessment attempt not found" ||
      error.message === "Assessment already completed" ||
      error.message.includes("required but not answered") ||
      error.message.includes("Invalid response") ||
      error.message.includes("Duplicate response")
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ 
      message: "Failed to submit assessment",
      error: error.message 
    });
  }
};

// @desc    Get user's assessment results
// @route   GET /api/assessments/results
// @access  Private (Student)
export const getMyResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await getUserResults(userId, page, limit);

    res.json(data);
  } catch (error) {
    console.error("Get results error:", error);
    res.status(500).json({ message: "Failed to retrieve results" });
  }
};

// @desc    Get specific assessment result
// @route   GET /api/assessments/results/:resultId
// @access  Private (Student)
export const getResultDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resultId } = req.params;

    const result = await getResultById(userId, resultId);

    res.json(result);
  } catch (error) {
    console.error("Get result details error:", error);
    if (error.message === "Result not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to retrieve result" });
  }
};

// @desc    Get assessment history
// @route   GET /api/assessments/history
// @access  Private (Student)
export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const assessmentType = req.query.type || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await getAssessmentHistory(userId, assessmentType, page, limit);

    res.json(data);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ message: "Failed to retrieve history" });
  }
};

