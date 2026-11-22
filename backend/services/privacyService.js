import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Consent from "../models/Consent.js";
import MoodEntry from "../models/MoodEntry.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import AssessmentResult from "../models/AssessmentResult.js";
import Referral from "../models/Referral.js";
import SupportRequest from "../models/SupportRequest.js";

/**
 * Privacy Service
 * Handles data export and account deletion
 */

// Generate data export for a user
export const generateDataExport = async (userId) => {
  try {
    // Fetch user data
    const user = await User.findById(userId).select("-passwordHash").lean();
    if (!user) {
      throw new Error("User not found");
    }

    // Fetch all user-related data
    const [
      studentProfile,
      consents,
      moodEntries,
      conversations,
      assessmentAttempts,
      assessmentResults,
      referrals,
      supportRequests,
    ] = await Promise.all([
      StudentProfile.findOne({ userId }).lean(),
      Consent.find({ userId }).lean(),
      MoodEntry.find({ user: userId }).lean(),
      Conversation.find({ userId }).lean(),
      AssessmentAttempt.find({ userId }).lean(),
      AssessmentResult.find({ userId }).lean(),
      Referral.find({ studentId: userId }).lean(),
      SupportRequest.find({ student: userId }).lean(),
    ]);

    // Fetch messages for user's conversations
    const conversationIds = conversations.map((c) => c._id);
    const messages = await Message.find({
      conversationId: { $in: conversationIds },
    }).lean();

    // Build export object
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: userId,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      studentProfile: studentProfile || null,
      consents: consents.map((c) => ({
        consentType: c.consentType,
        consentVersion: c.consentVersion,
        isAccepted: c.isAccepted,
        acceptedAt: c.acceptedAt,
        withdrawnAt: c.withdrawnAt,
        createdAt: c.createdAt,
      })),
      moodEntries: moodEntries.map((m) => ({
        mood: m.mood,
        note: m.note,
        date: m.date,
        createdAt: m.createdAt,
      })),
      conversations: conversations.map((c) => ({
        title: c.title,
        status: c.status,
        messageCount: c.messageCount,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      messages: messages.map((m) => ({
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp,
        conversationId: m.conversationId,
      })),
      assessmentAttempts: assessmentAttempts.map((a) => ({
        assessmentId: a.assessmentId,
        status: a.status,
        startedAt: a.startedAt,
        completedAt: a.completedAt,
        responses: a.responses,
      })),
      assessmentResults: assessmentResults.map((r) => ({
        totalScore: r.totalScore,
        interpretation: r.interpretation,
        completedAt: r.completedAt,
      })),
      referrals: referrals.map((r) => ({
        subject: r.subject,
        description: r.description,
        status: r.status,
        priority: r.priority,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      supportRequests: supportRequests.map((s) => ({
        topic: s.topic,
        description: s.description,
        status: s.status,
        preferredMode: s.preferredMode,
        createdAt: s.createdAt,
      })),
    };

    return exportData;
  } catch (error) {
    throw new Error(`Failed to generate data export: ${error.message}`);
  }
};

// Track data export request
const exportRequests = new Map(); // In-memory storage for demo (use DB in production)

export const createExportRequest = async (userId) => {
  try {
    const requestId = `export-${userId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    exportRequests.set(requestId, {
      userId,
      status: "processing",
      createdAt: new Date(),
      expiresAt,
    });

    // Generate export asynchronously
    setTimeout(async () => {
      try {
        const data = await generateDataExport(userId);
        exportRequests.set(requestId, {
          userId,
          status: "ready",
          data,
          createdAt: new Date(),
          expiresAt,
        });
      } catch (error) {
        exportRequests.set(requestId, {
          userId,
          status: "failed",
          error: error.message,
          createdAt: new Date(),
          expiresAt,
        });
      }
    }, 2000); // Simulate processing delay

    return { requestId, status: "processing", expiresAt };
  } catch (error) {
    throw new Error(`Failed to create export request: ${error.message}`);
  }
};

export const getExportRequest = async (requestId, userId) => {
  const request = exportRequests.get(requestId);
  
  if (!request) {
    return null;
  }

  // Verify ownership
  if (request.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  // Check expiration
  if (new Date() > request.expiresAt) {
    exportRequests.delete(requestId);
    return null;
  }

  return request;
};

// Account deletion request tracking
const deletionRequests = new Map(); // In-memory storage for demo

export const createDeletionRequest = async (userId) => {
  try {
    const requestId = `delete-${userId}-${Date.now()}`;
    
    deletionRequests.set(requestId, {
      userId,
      status: "pending",
      requestedAt: new Date(),
      reason: "User requested account deletion",
    });

    return {
      requestId,
      status: "pending",
      message: "Your account deletion request has been submitted. It will be processed within 30 days.",
    };
  } catch (error) {
    throw new Error(`Failed to create deletion request: ${error.message}`);
  }
};

export const getDeletionRequestStatus = async (userId) => {
  // Find deletion request for user
  for (const [requestId, request] of deletionRequests.entries()) {
    if (request.userId.toString() === userId.toString()) {
      return {
        requestId,
        status: request.status,
        requestedAt: request.requestedAt,
      };
    }
  }
  
  return null;
};

export const cancelDeletionRequest = async (userId) => {
  // Find and remove deletion request
  for (const [requestId, request] of deletionRequests.entries()) {
    if (request.userId.toString() === userId.toString()) {
      deletionRequests.delete(requestId);
      return { message: "Deletion request cancelled" };
    }
  }
  
  throw new Error("No deletion request found");
};
