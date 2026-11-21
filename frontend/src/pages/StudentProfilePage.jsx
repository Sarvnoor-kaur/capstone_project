import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit3, FiCheck, FiX, FiAward } from "react-icons/fi";
import { getProfile, updateProfile, updateProfilePicture } from "../services/profileService";
import "../styles/mentovya.css";

const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    university: "",
    department: "",
    course: "",
    yearOfStudy: "",
    phoneNumber: "",
    dateOfBirth: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setUser(data.user);
      setProfile(data.profile);
      setCompletion(data.completion);

      // Set form data
      setFormData({
        studentId: data.profile.studentId || "",
        university: data.profile.university || "",
        department: data.profile.department || "",
        course: data.profile.course || "",
        yearOfStudy: data.profile.yearOfStudy || "",
        phoneNumber: data.profile.phoneNumber || "",
        dateOfBirth: data.profile.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : "",
        bio: data.profile.bio || "",
      });
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await updateProfile(formData);
      setProfile(response.profile);
      setCompletion(response.completion);
      setSuccess("Profile updated successfully!");
      setEditing(false);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    // Reset form data
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="heading-xl" style={{ marginBottom: "0.5rem" }}>
            My Profile
          </h1>
          <p className="body-md text-muted">
            Manage your personal information and academic details
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div
            style={{
              padding: "1rem",
              background: "#FEE2E2",
              borderLeft: "3px solid #EF4444",
              borderRadius: "8px",
              color: "#991B1B",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "1rem",
              background: "#D1FAE5",
              borderLeft: "3px solid #10B981",
              borderRadius: "8px",
              color: "#065F46",
              marginBottom: "1.5rem",
            }}
          >
            {success}
          </div>
        )}

        {/* Profile Completion */}
        <div className="glass-card-lg" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 className="heading-sm">Profile Completion</h3>
              <p className="body-sm text-muted">Complete your profile to get the most out of Mentovya</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: "600", color: "var(--lavender-dark)" }}>
                {completion}%
              </div>
              <FiAward size={32} style={{ color: completion === 100 ? "var(--lavender-dark)" : "#D1D5DB" }} />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "#E5E7EB",
              borderRadius: "4px",
              marginTop: "1rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${completion}%`,
                height: "100%",
                background: "linear-gradient(90deg, #A99BEA 0%, #DDD7F7 100%)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="glass-card-lg">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 className="heading-md">Personal Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FiEdit3 /> Edit Profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={saving}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <FiX /> Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  {saving ? "Saving..." : <><FiCheck /> Save Changes</>}
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 className="heading-sm" style={{ marginBottom: "1rem" }}>Basic Information</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <label className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="form-input"
                    style={{ background: "#F9FAFB", cursor: "not-allowed" }}
                  />
                  <p className="body-sm text-muted" style={{ marginTop: "0.25rem" }}>
                    Contact support to change your name
                  </p>
                </div>

                <div>
                  <label className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="form-input"
                    style={{ background: "#F9FAFB", cursor: "not-allowed" }}
                  />
                </div>

                <div>
                  <label className="form-label">
                    Phone Number <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Date of Birth <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 className="heading-sm" style={{ marginBottom: "1rem" }}>Academic Information</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <label className="form-label">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-input"
                    placeholder="e.g., STU123456"
                  />
                </div>

                <div>
                  <label className="form-label">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-input"
                    placeholder="Your university name"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-input"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Course/Program
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-input"
                    placeholder="e.g., BSc Computer Science"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Year of Study
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-input"
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="form-label">
                About Me <span className="text-muted">(Optional, max 500 characters)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!editing}
                className="form-input"
                rows="4"
                maxLength="500"
                placeholder="Tell us a bit about yourself..."
                style={{ resize: "vertical" }}
              />
              <p className="body-sm text-muted" style={{ marginTop: "0.25rem", textAlign: "right" }}>
                {formData.bio.length} / 500 characters
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfilePage;
