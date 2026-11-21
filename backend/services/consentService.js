import Consent from "../models/Consent.js";

/**
 * Consent Service
 * Business logic for consent management
 */

// Consent definitions with descriptions
export const CONSENT_DEFINITIONS = {
  terms_of_service: {
    title: "Terms of Service",
    description: "I agree to the Mentovya Terms of Service and Community Guidelines.",
    required: true,
    version: "1.0",
  },
  privacy_policy: {
    title: "Privacy Policy",
    description: "I acknowledge that I have read and understand the Privacy Policy.",
    required: true,
    version: "1.0",
  },
  data_processing: {
    title: "Data Processing",
    description: "I consent to processing of my mental wellness data for service improvement and personalization.",
    required: false,
    version: "1.0",
  },
  ai_interaction: {
    title: "AI Chat Processing",
    description: "I consent to my chat conversations being processed by AI for mental health support purposes.",
    required: false,
    requiredFor: ["AI Chat"],
    version: "1.0",
  },
  counselor_sharing: {
    title: "Counselor Data Sharing",
    description: "I consent to sharing my assessment results, mood data, and relevant information with assigned counselors.",
    required: false,
    requiredFor: ["Counselor Referrals"],
    version: "1.0",
  },
  research_participation: {
    title: "Research Participation",
    description: "I consent to anonymized use of my data for mental health research and improving mental wellness services.",
    required: false,
    version: "1.0",
  },
};

// Get all consent definitions
export const getConsentDefinitions = () => {
  return Object.entries(CONSENT_DEFINITIONS).map(([type, def]) => ({
    consentType: type,
    ...def,
  }));
};

// Get required consents
export const getRequiredConsents = () => {
  return Object.entries(CONSENT_DEFINITIONS)
    .filter(([_, def]) => def.required)
    .map(([type, def]) => ({
      consentType: type,
      ...def,
    }));
};

// Get user's current consents
export const getUserConsents = async (userId) => {
  try {
    const consents = await Consent.find({ userId }).sort({ createdAt: -1 });
    
    // Get the latest consent for each type
    const latestConsents = {};
    consents.forEach((consent) => {
      const type = consent.consentType;
      if (!latestConsents[type] || consent.createdAt > latestConsents[type].createdAt) {
        latestConsents[type] = consent;
      }
    });

    // Map with definitions
    return Object.entries(CONSENT_DEFINITIONS).map(([type, def]) => {
      const userConsent = latestConsents[type];
      return {
        consentType: type,
        ...def,
        isAccepted: userConsent?.isAccepted || false,
        acceptedAt: userConsent?.acceptedAt,
        withdrawnAt: userConsent?.withdrawnAt,
        consentId: userConsent?._id,
      };
    });
  } catch (error) {
    throw new Error("Failed to fetch user consents");
  }
};

// Get consent history for a user
export const getConsentHistory = async (userId) => {
  try {
    return await Consent.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch consent history");
  }
};

// Accept a consent
export const acceptConsent = async (userId, consentType, metadata = {}) => {
  try {
    const definition = CONSENT_DEFINITIONS[consentType];
    if (!definition) {
      throw new Error("Invalid consent type");
    }

    // Create new consent record
    const consent = await Consent.create({
      userId,
      consentType,
      consentVersion: definition.version,
      isAccepted: true,
      acceptedAt: new Date(),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return consent;
  } catch (error) {
    throw new Error(`Failed to accept consent: ${error.message}`);
  }
};

// Withdraw a consent
export const withdrawConsent = async (consentId, userId) => {
  try {
    const consent = await Consent.findOne({ _id: consentId, userId });
    
    if (!consent) {
      throw new Error("Consent not found");
    }

    const definition = CONSENT_DEFINITIONS[consent.consentType];
    if (definition?.required) {
      throw new Error("Cannot withdraw required consent");
    }

    if (!consent.isAccepted) {
      throw new Error("Consent is already withdrawn");
    }

    await consent.withdraw();
    return consent;
  } catch (error) {
    throw new Error(`Failed to withdraw consent: ${error.message}`);
  }
};

// Check if user has all required consents
export const hasRequiredConsents = async (userId) => {
  try {
    const requiredTypes = Object.entries(CONSENT_DEFINITIONS)
      .filter(([_, def]) => def.required)
      .map(([type, _]) => type);

    const consents = await Consent.find({
      userId,
      consentType: { $in: requiredTypes },
      isAccepted: true,
    });

    return consents.length === requiredTypes.length;
  } catch (error) {
    return false;
  }
};

// Check if user has specific consent
export const hasConsent = async (userId, consentType) => {
  try {
    const consent = await Consent.findOne({
      userId,
      consentType,
      isAccepted: true,
    }).sort({ createdAt: -1 });

    return !!consent;
  } catch (error) {
    return false;
  }
};
