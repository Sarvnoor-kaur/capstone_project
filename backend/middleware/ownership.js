/**
 * Ownership Verification Middleware
 * Ensures users can only access their own resources
 */

// Verify resource ownership for profile, consent, and privacy operations
export const verifyOwnership = (resourceGetter) => async (req, res, next) => {
  try {
    const resource = await resourceGetter(req);
    
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const resourceOwnerId = resource.userId || resource.user || resource._id;
    const authenticatedUserId = req.user._id;

    if (resourceOwnerId.toString() !== authenticatedUserId.toString()) {
      return res.status(403).json({ 
        message: "Forbidden: You can only access your own resources" 
      });
    }

    req.resource = resource;
    next();
  } catch (error) {
    res.status(500).json({ message: "Ownership verification failed" });
  }
};

// Verify student profile ownership
export const verifyProfileOwnership = async (req, res, next) => {
  try {
    // Student can only access their own profile
    // Profile is identified by authenticated user ID
    const authenticatedUserId = req.user._id.toString();
    
    // If there's a profileId in params, verify it matches
    if (req.params.id && req.params.id !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden: You can only access your own profile" 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Profile ownership verification failed" });
  }
};

// Verify consent ownership
export const verifyConsentOwnership = async (req, res, next) => {
  try {
    const Consent = (await import("../models/Consent.js")).default;
    const consent = await Consent.findById(req.params.id);
    
    if (!consent) {
      return res.status(404).json({ message: "Consent not found" });
    }

    if (consent.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Forbidden: You can only manage your own consents" 
      });
    }

    req.consent = consent;
    next();
  } catch (error) {
    res.status(500).json({ message: "Consent ownership verification failed" });
  }
};
