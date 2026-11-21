import express from "express";
import {
  getDefinitions,
  getRequired,
  getConsents,
  getHistory,
  acceptConsentHandler,
  withdrawConsentHandler,
} from "../controllers/consentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/definitions", getDefinitions);
router.get("/required", getRequired);

// Protected routes
router.use(protect);

// @route   GET /api/consents
router.get("/", getConsents);

// @route   GET /api/consents/history
router.get("/history", getHistory);

// @route   POST /api/consents
router.post("/", acceptConsentHandler);

// @route   PATCH /api/consents/:id/withdraw
router.patch("/:id/withdraw", withdrawConsentHandler);

export default router;
