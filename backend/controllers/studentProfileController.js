import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";

/**
 * Student Profile Controller
 * Handles student profile CRUD operations
 */

// @desc    Get student's own profile
// @route   GET /api/students/profile
// @access  Private (Student)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId).select("-passwordHash");
    
    // Get or create student profile
    let profile = await StudentProfile.findOne({ userId });
    
    if (!profile) {
      // Create default profile if doesn't exist
      profile = await StudentProfile.create({ userId });
    }

    // Calculate completion percentage
    const completion = await profile.calculateCompletion();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      },
      profile: {
        _id: profile._id,
        studentId: profile.studentId,
        university: profile.university,
        department: profile.department,
        course: profile.course,
        yearOfStudy: profile.yearOfStudy,
        profilePicture: profile.profilePicture,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: profile.dateOfBirth,
        bio: profile.bio,
        preferences: profile.preferences,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
      completion,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const {
      studentId,
      university,
      department,
      course,
      yearOfStudy,
      phoneNumber,
      dateOfBirth,
      bio,
    } = req.body;

    // Validate bio length
    if (bio && bio.length > 500) {
      return res.status(400).json({ message: "Bio must be 500 characters or less" });
    }

    // Find or create profile
    let profile = await StudentProfile.findOne({ userId });
    
    if (!profile) {
      profile = new StudentProfile({ userId });
    }

    // Update fields
    if (studentId !== undefined) profile.studentId = studentId;
    if (university !== undefined) profile.university = university;
    if (department !== undefined) profile.department = department;
    if (course !== undefined) profile.course = course;
    if (yearOfStudy !== undefined) profile.yearOfStudy = yearOfStudy;
    if (phoneNumber !== undefined) profile.phoneNumber = phoneNumber;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (bio !== undefined) profile.bio = bio;

    await profile.save();

    // Calculate completion
    const completion = await profile.calculateCompletion();

    res.json({
      message: "Profile updated successfully",
      profile,
      completion,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// @desc    Update profile preferences
// @route   PATCH /api/students/profile/preferences
// @access  Private (Student)
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { communicationMode, notificationsEnabled, theme } = req.body;

    let profile = await StudentProfile.findOne({ userId });
    
    if (!profile) {
      profile = await StudentProfile.create({ userId });
    }

    // Update preferences
    if (communicationMode !== undefined) {
      profile.preferences.communicationMode = communicationMode;
    }
    if (notificationsEnabled !== undefined) {
      profile.preferences.notificationsEnabled = notificationsEnabled;
    }
    if (theme !== undefined) {
      profile.preferences.theme = theme;
    }

    await profile.save();

    res.json({
      message: "Preferences updated successfully",
      preferences: profile.preferences,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ message: "Failed to update preferences" });
  }
};

// @desc    Get profile completion percentage
// @route   GET /api/students/profile/completion
// @access  Private (Student)
export const getProfileCompletion = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await StudentProfile.findOne({ userId });
    
    if (!profile) {
      return res.json({ completion: 20 }); // Name and email only
    }

    const completion = await profile.calculateCompletion();

    res.json({ completion });
  } catch (error) {
    console.error("Get completion error:", error);
    res.status(500).json({ message: "Failed to calculate completion" });
  }
};

// @desc    Update profile picture
// @route   PATCH /api/students/profile/picture
// @access  Private (Student)
export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture URL is required" });
    }

    let profile = await StudentProfile.findOne({ userId });
    
    if (!profile) {
      profile = await StudentProfile.create({ userId });
    }

    profile.profilePicture = profilePicture;
    await profile.save();

    res.json({
      message: "Profile picture updated successfully",
      profilePicture: profile.profilePicture,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};
