import express from "express";
import {
  listAssessments,
  getAssessmentDetails,
  startAssessment,
  submitAssessmentResponses,
  getMyResults,
  getResultDetails,
  getHistory,
} from "../controllers/assessmentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication and student role
router.use(protect);
router.use(requireRole(["student"]));

// @route   GET /api/assessments
// @desc    Get list of all active assessments
// @access  Private (Student)
router.get("/", listAssessments);

// @route   GET /api/assessments/history
// @desc    Get assessment history
// @access  Private (Student)
router.get("/history", getHistory);

// @route   GET /api/assessments/results
// @desc    Get user's assessment results
// @access  Private (Student)
router.get("/results", getMyResults);

// @route   GET /api/assessments/results/:resultId
// @desc    Get specific result details
// @access  Private (Student)
router.get("/results/:resultId", getResultDetails);

// @route   GET /api/assessments/:id
// @desc    Get assessment details
// @access  Private (Student)
router.get("/:id", getAssessmentDetails);

// @route   POST /api/assessments/:id/start
// @desc    Start a new assessment attempt
// @access  Private (Student)
router.post("/:id/start", startAssessment);

// @route   POST /api/assessments/attempts/:attemptId/submit
// @desc    Submit assessment responses
// @access  Private (Student)
router.post("/attempts/:attemptId/submit", submitAssessmentResponses);

export default router;

