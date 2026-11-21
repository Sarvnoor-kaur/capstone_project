import axios from "../api/axiosClient";

/**
 * Consent Service
 * API calls for consent management
 */

// Get consent definitions
export const getConsentDefinitions = async () => {
  const response = await axios.get("/consents/definitions");
  return response.data;
};

// Get required consents
export const getRequiredConsents = async () => {
  const response = await axios.get("/consents/required");
  return response.data;
};

// Get user's current consents
export const getUserConsents = async () => {
  const response = await axios.get("/consents");
  return response.data;
};

// Get consent history
export const getConsentHistory = async () => {
  const response = await axios.get("/consents/history");
  return response.data;
};

// Accept a consent
export const acceptConsent = async (consentType) => {
  const response = await axios.post("/consents", { consentType });
  return response.data;
};

// Withdraw a consent
export const withdrawConsent = async (consentId) => {
  const response = await axios.patch(`/consents/${consentId}/withdraw`);
  return response.data;
};
