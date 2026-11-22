import {
  getConsentDefinitions,
  getRequiredConsents,
  getUserConsents,
  getConsentHistory,
  acceptConsent,
  withdrawConsent,
} from "../services/consentService.js";
import AuditLog from "../models/AuditLog.js";

/**
 * Consent Controller
 * Handles consent management operations
 */

// @desc    Get consent definitions
// @route   GET /api/consents/definitions
// @access  Public
export const getDefinitions = (req, res) => {
  try {
    const definitions = getConsentDefinitions();
    res.json(definitions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch consent definitions" });
  }
};

// @desc    Get required consents
// @route   GET /api/consents/required
// @access  Public
export const getRequired = (req, res) => {
  try {
    const required = getRequiredConsents();
    res.json(required);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch required consents" });
  }
};

// @desc    Get user's current consents
// @route   GET /api/consents
// @access  Private
export const getConsents = async (req, res) => {
  try {
    const userId = req.user._id;
    const consents = await getUserConsents(userId);
    res.json(consents);
  } catch (error) {
    console.error("Get consents error:", error);
    res.status(500).json({ message: "Failed to fetch consents" });
  }
};

// @desc    Get user's consent history
// @route   GET /api/consents/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await getConsentHistory(userId);
    res.json(history);
  } catch (error) {
    console.error("Get consent history error:", error);
    res.status(500).json({ message: "Failed to fetch consent history" });
  }
};

// @desc    Accept a consent
// @route   POST /api/consents
// @access  Private
export const acceptConsentHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { consentType } = req.body;

    if (!consentType) {
      return res.status(400).json({ message: "Consent type is required" });
    }

    const metadata = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    };

    const consent = await acceptConsent(userId, consentType, metadata);

    // Audit log
    await AuditLog.create({
      userId,
      action: "CREATE",
      resourceType: "Consent",
      resourceId: consent._id,
      metadata: {
        consentType,
        ip: metadata.ipAddress,
      },
    });

    res.status(201).json({
      message: "Consent accepted successfully",
      consent,
    });
  } catch (error) {
    console.error("Accept consent error:", error);
    res.status(400).json({ message: error.message || "Failed to accept consent" });
  }
};

// @desc    Withdraw a consent
// @route   PATCH /api/consents/:id/withdraw
// @access  Private
export const withdrawConsentHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const consentId = req.params.id;

    const consent = await withdrawConsent(consentId, userId);

    // Audit log
    await AuditLog.create({
      userId,
      action: "UPDATE",
      resourceType: "Consent",
      resourceId: consent._id,
      metadata: {
        action: "withdraw",
        consentType: consent.consentType,
      },
    });

    res.json({
      message: "Consent withdrawn successfully",
      consent,
    });
  } catch (error) {
    console.error("Withdraw consent error:", error);
    res.status(400).json({ message: error.message || "Failed to withdraw consent" });
  }
};
