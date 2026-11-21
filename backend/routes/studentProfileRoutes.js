import express from "express";
import {
  getProfile,
  updateProfile,
  updatePreferences,
  getProfileCompletion,
  updateProfilePicture,
} from "../controllers/studentProfileController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { verifyProfileOwnership } from "../middleware/ownership.js";

const router = express.Router();

// All routes require authentication and student role
router.use(protect);
router.use(requireRole(["student"]));
router.use(verifyProfileOwnership);

// @route   GET /api/students/profile
router.get("/profile", getProfile);

// @route   PUT /api/students/profile
router.put("/profile", updateProfile);

// @route   PATCH /api/students/profile/preferences
router.patch("/profile/preferences", updatePreferences);

// @route   PATCH /api/students/profile/picture
router.patch("/profile/picture", updateProfilePicture);

// @route   GET /api/students/profile/completion
router.get("/profile/completion", getProfileCompletion);

export default router;
