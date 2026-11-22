import express from "express";
import {
  requestDataExport,
  getDataExport,
  requestAccountDeletion,
  getAccountDeletionStatus,
  cancelAccountDeletion,
} from "../controllers/privacyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/privacy/export
router.post("/export", requestDataExport);

// @route   GET /api/privacy/export/:requestId
router.get("/export/:requestId", getDataExport);

// @route   POST /api/privacy/delete-request
router.post("/delete-request", requestAccountDeletion);

// @route   GET /api/privacy/delete-request/status
router.get("/delete-request/status", getAccountDeletionStatus);

// @route   DELETE /api/privacy/delete-request
router.delete("/delete-request", cancelAccountDeletion);

export default router;
