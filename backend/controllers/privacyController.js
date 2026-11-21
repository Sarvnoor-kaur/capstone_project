import {
  createExportRequest,
  getExportRequest,
  createDeletionRequest,
  getDeletionRequestStatus,
  cancelDeletionRequest,
} from "../services/privacyService.js";
import AuditLog from "../models/AuditLog.js";

/**
 * Privacy Controller
 * Handles data export and account deletion
 */

// @desc    Request data export
// @route   POST /api/privacy/export
// @access  Private
export const requestDataExport = async (req, res) => {
  try {
    const userId = req.user._id;

    const request = await createExportRequest(userId);

    // Audit log
    await AuditLog.create({
      userId,
      action: "ACCESS_SENSITIVE_DATA",
      resourceType: "System",
      metadata: {
        action: "data_export_requested",
        requestId: request.requestId,
      },
    });

    res.json({
      message: "Data export request created successfully",
      requestId: request.requestId,
      status: request.status,
      expiresAt: request.expiresAt,
    });
  } catch (error) {
    console.error("Data export request error:", error);
    res.status(500).json({ message: "Failed to create data export request" });
  }
};

// @desc    Get data export
// @route   GET /api/privacy/export/:requestId
// @access  Private
export const getDataExport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const request = await getExportRequest(requestId, userId);

    if (!request) {
      return res.status(404).json({ message: "Export request not found or expired" });
    }

    if (request.status === "processing") {
      return res.json({
        status: "processing",
        message: "Your data export is being prepared. Please check back in a moment.",
      });
    }

    if (request.status === "failed") {
      return res.status(500).json({
        status: "failed",
        message: "Data export failed. Please try again.",
      });
    }

    if (request.status === "ready") {
      // Set headers for download
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="mentovya-data-export-${Date.now()}.json"`
      );

      // Audit log
      await AuditLog.create({
        userId,
        action: "ACCESS_SENSITIVE_DATA",
        resourceType: "System",
        metadata: {
          action: "data_export_downloaded",
          requestId,
        },
      });

      return res.json(request.data);
    }
  } catch (error) {
    console.error("Get data export error:", error);
    if (error.message === "Unauthorized") {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(500).json({ message: "Failed to retrieve data export" });
  }
};

// @desc    Request account deletion
// @route   POST /api/privacy/delete-request
// @access  Private
export const requestAccountDeletion = async (req, res) => {
  try {
    const userId = req.user._id;

    const request = await createDeletionRequest(userId);

    // Audit log
    await AuditLog.create({
      userId,
      action: "DELETE",
      resourceType: "User",
      resourceId: userId,
      metadata: {
        action: "deletion_requested",
        requestId: request.requestId,
      },
    });

    res.json({
      message: request.message,
      requestId: request.requestId,
      status: request.status,
    });
  } catch (error) {
    console.error("Account deletion request error:", error);
    res.status(500).json({ message: "Failed to create deletion request" });
  }
};

// @desc    Get account deletion status
// @route   GET /api/privacy/delete-request/status
// @access  Private
export const getAccountDeletionStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const status = await getDeletionRequestStatus(userId);

    if (!status) {
      return res.json({
        hasPendingRequest: false,
        message: "No pending deletion request",
      });
    }

    res.json({
      hasPendingRequest: true,
      ...status,
    });
  } catch (error) {
    console.error("Get deletion status error:", error);
    res.status(500).json({ message: "Failed to get deletion status" });
  }
};

// @desc    Cancel account deletion
// @route   DELETE /api/privacy/delete-request
// @access  Private
export const cancelAccountDeletion = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await cancelDeletionRequest(userId);

    // Audit log
    await AuditLog.create({
      userId,
      action: "UPDATE",
      resourceType: "User",
      resourceId: userId,
      metadata: {
        action: "deletion_cancelled",
      },
    });

    res.json(result);
  } catch (error) {
    console.error("Cancel deletion error:", error);
    res.status(404).json({ message: error.message || "Failed to cancel deletion" });
  }
};
