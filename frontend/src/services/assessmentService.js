import axios from "../api/axiosClient";

/**
 * Assessment Service
 * API calls for mental health assessments
 */

// Get all active assessments
export const getAssessments = async () => {
  const response = await axios.get("/assessments");
  return response.data;
};

// Get assessment details by ID
export const getAssessmentById = async (assessmentId) => {
  const response = await axios.get(`/assessments/${assessmentId}`);
  return response.data;
};

// Start a new assessment attempt
export const startAssessment = async (assessmentId) => {
  const response = await axios.post(`/assessments/${assessmentId}/start`);
  return response.data;
};

// Submit assessment responses
export const submitAssessment = async (attemptId, responses) => {
  const response = await axios.post(`/assessments/attempts/${attemptId}/submit`, {
    responses,
  });
  return response.data;
};

// Get user's assessment results
export const getMyResults = async (page = 1, limit = 10) => {
  const response = await axios.get("/assessments/results", {
    params: { page, limit },
  });
  return response.data;
};

// Get specific result details
export const getResultById = async (resultId) => {
  const response = await axios.get(`/assessments/results/${resultId}`);
  return response.data;
};

// Get assessment history
export const getAssessmentHistory = async (assessmentType = null, page = 1, limit = 10) => {
  const response = await axios.get("/assessments/history", {
    params: { type: assessmentType, page, limit },
  });
  return response.data;
};

