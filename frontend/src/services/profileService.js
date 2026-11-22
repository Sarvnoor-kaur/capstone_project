import axios from "../api/axiosClient";

/**
 * Profile Service
 * API calls for student profile management
 */

// Get student profile
export const getProfile = async () => {
  const response = await axios.get("/students/profile");
  return response.data;
};

// Update student profile
export const updateProfile = async (profileData) => {
  const response = await axios.put("/students/profile", profileData);
  return response.data;
};

// Update preferences
export const updatePreferences = async (preferences) => {
  const response = await axios.patch("/students/profile/preferences", preferences);
  return response.data;
};

// Update profile picture
export const updateProfilePicture = async (profilePicture) => {
  const response = await axios.patch("/students/profile/picture", {
    profilePicture,
  });
  return response.data;
};

// Get profile completion percentage
export const getProfileCompletion = async () => {
  const response = await axios.get("/students/profile/completion");
  return response.data;
};
