import axios from "../api/axiosClient";

/**
 * Privacy Service
 * API calls for privacy and data management
 */

// Request data export
export const requestDataExport = async () => {
  const response = await axios.post("/privacy/export");
  return response.data;
};

// Get data export by request ID
export const getDataExport = async (requestId) => {
  const response = await axios.get(`/privacy/export/${requestId}`);
  return response.data;
};

// Request account deletion
export const requestAccountDeletion = async () => {
  const response = await axios.post("/privacy/delete-request");
  return response.data;
};

// Get account deletion status
export const getAccountDeletionStatus = async () => {
  const response = await axios.get("/privacy/delete-request/status");
  return response.data;
};

// Cancel account deletion
export const cancelAccountDeletion = async () => {
  const response = await axios.delete("/privacy/delete-request");
  return response.data;
};
