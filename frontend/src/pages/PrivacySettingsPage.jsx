import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import {
  requestDataExport,
  getDataExport,
  requestAccountDeletion,
  getAccountDeletionStatus,
  cancelAccountDeletion,
} from "../services/privacyService";
import "../styles/mentovya.css";

const PrivacySettingsPage = () => {
  const [exportStatus, setExportStatus] = useState(null);
  const [exportRequestId, setExportRequestId] = useState(null);
  const [deletionStatus, setDeletionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkDeletionStatus();
  }, []);

  const checkDeletionStatus = async () => {
    try {
      setLoading(true);
      const status = await getAccountDeletionStatus();
      setDeletionStatus(status);
    } catch (err) {
      console.error("Failed to check deletion status");
    } finally {
      setLoading(false);
    }
  };

  const handleExportRequest = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await requestDataExport();
      setExportRequestId(response.requestId);
      setExportStatus("processing");
      setSuccess("Data export requested successfully. Processing...");

      // Poll for status
      const pollInterval = setInterval(async () => {
        try {
          const exportData = await getDataExport(response.requestId);

          if (exportData.status === "ready") {
            clearInterval(pollInterval);
            setExportStatus("ready");

            // Download the file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `mentovya-data-export-${Date.now()}.json`;
            a.click();
            window.URL.revokeObjectURL(url);

            setSuccess("Data exported successfully!");
            setTimeout(() => {
              setExportStatus(null);
              setExportRequestId(null);
            }, 3000);
          } else if (exportData.status === "failed") {
            clearInterval(pollInterval);
            setError("Data export failed. Please try again.");
            setExportStatus(null);
          }
        } catch (err) {
          clearInterval(pollInterval);
          setError("Failed to retrieve export data");
          setExportStatus(null);
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request data export");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletionRequest = async () => {
    if (!window.confirm(
      "⚠️ WARNING: Account Deletion\n\n" +
      "This action will permanently delete your account and associated data after 30 days.\n\n" +
      "What will be deleted:\n" +
      "• Your profile and personal information\n" +
      "• Chat history and AI conversations\n" +
      "• Mood entries\n" +
      "• Assessment results\n\n" +
      "What will be preserved:\n" +
      "• Audit logs (required by law)\n" +
      "• Safety event records\n" +
      "• Anonymized research data (if consented)\n\n" +
      "Are you absolutely sure you want to proceed?"
    )) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await requestAccountDeletion();
      setDeletionStatus({
        hasPendingRequest: true,
        status: response.status,
        requestId: response.requestId,
      });
      setSuccess(response.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request account deletion");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (!window.confirm("Are you sure you want to cancel your account deletion request?")) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await cancelAccountDeletion();
      setDeletionStatus(null);
      setSuccess(response.message);
      await checkDeletionStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel deletion request");
    } finally {
      setProcessing(false);
    }
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
            Privacy & Data Management
          </h1>
          <p className="body-md text-muted">
            Control your data and manage your privacy settings
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

        {/* Data Privacy Information */}
        <div className="glass-card-lg" style={{ marginBottom: "1.5rem" }}>
          <h2 className="heading-md" style={{ marginBottom: "1rem" }}>
            How We Protect Your Data
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h4 className="body-md" style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                🔒 Data Encryption
              </h4>
              <p className="body-sm text-muted">
                All your data is encrypted in transit and at rest using industry-standard encryption protocols.
              </p>
            </div>
            <div>
              <h4 className="body-md" style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                🤖 AI Processing
              </h4>
              <p className="body-sm text-muted">
                Your conversations with the AI are processed securely and used only to provide mental health support.
                We do not share your chat history with third parties.
              </p>
            </div>
            <div>
              <h4 className="body-md" style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                👥 Counselor Sharing
              </h4>
              <p className="body-sm text-muted">
                Your information is shared with counselors only when you explicitly consent and request a referral.
                You control what information is shared.
              </p>
            </div>
            <div>
              <h4 className="body-md" style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                📊 Assessment Data
              </h4>
              <p className="body-sm text-muted">
                Your mental health assessment results are stored securely and accessible only to you unless you
                consent to share them with a counselor.
              </p>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="glass-card-lg" style={{ marginBottom: "1.5rem" }}>
          <h2 className="heading-md" style={{ marginBottom: "1rem" }}>
            Download Your Data
          </h2>
          <p className="body-md" style={{ marginBottom: "1.5rem" }}>
            Request a complete export of all your personal data stored in Mentovya. This includes your profile,
            mood entries, conversations, assessments, and consent history.
          </p>

          {exportStatus === "processing" && (
            <div
              style={{
                padding: "1rem",
                background: "rgba(169, 155, 234, 0.1)",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <p className="body-md">
                ⏳ Processing your data export request... This may take a few moments.
              </p>
            </div>
          )}

          <button
            onClick={handleExportRequest}
            disabled={processing || exportStatus === "processing"}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {exportStatus === "processing" ? (
              "Processing..."
            ) : (
              <>
                <FiDownload /> Download My Data
              </>
            )}
          </button>

          <p className="body-sm text-muted" style={{ marginTop: "0.75rem" }}>
            Your data will be exported in JSON format. The download link will expire after 1 hour for security.
          </p>
        </div>

        {/* Account Deletion */}
        <div
          className="glass-card-lg"
          style={{
            borderLeft: "3px solid #EF4444",
            background: "rgba(239, 68, 68, 0.05)",
          }}
        >
          <h2
            className="heading-md"
            style={{
              marginBottom: "1rem",
              color: "#991B1B",
            }}
          >
            Danger Zone: Delete Account
          </h2>

          {deletionStatus?.hasPendingRequest ? (
            <div
              style={{
                padding: "1.5rem",
                background: "#FEF3C7",
                border: "1px solid #F59E0B",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <FiAlertTriangle size={24} style={{ color: "#B45309", flexShrink: 0 }} />
                <div>
                  <h4 className="body-md" style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#92400E" }}>
                    Account Deletion Pending
                  </h4>
                  <p className="body-sm" style={{ color: "#78350F", marginBottom: "1rem" }}>
                    Your account deletion request is pending. Your account will be permanently deleted within 30 days.
                    You can cancel this request before the deletion is processed.
                  </p>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="body-sm">
                      <strong>Status:</strong> <span style={{ textTransform: "capitalize" }}>{deletionStatus.status}</span>
                    </div>
                    {deletionStatus.requestedAt && (
                      <div className="body-sm">
                        <strong>Requested:</strong> {new Date(deletionStatus.requestedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCancelDeletion}
                disabled={processing}
                className="btn btn-secondary"
                style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FiX /> Cancel Deletion Request
              </button>
            </div>
          ) : (
            <>
              <p className="body-md" style={{ marginBottom: "1rem" }}>
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <div style={{ marginBottom: "1.5rem" }}>
                <p className="body-sm text-muted" style={{ marginBottom: "0.5rem" }}>
                  <strong>What will happen:</strong>
                </p>
                <ul className="body-sm text-muted" style={{ marginLeft: "1.5rem" }}>
                  <li>Your profile and personal information will be permanently deleted</li>
                  <li>All your conversations, mood entries, and assessments will be removed</li>
                  <li>You will lose access to all Mentovya features</li>
                  <li>Audit logs and safety records will be retained as required by law</li>
                  <li>The deletion process takes up to 30 days to complete</li>
                </ul>
              </div>

              <button
                onClick={handleDeletionRequest}
                disabled={processing}
                className="btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#EF4444",
                  color: "white",
                }}
              >
                <FiTrash2 /> Delete My Account
              </button>
            </>
          )}
        </div>

        {/* Legal Documents */}
        <div className="glass-card-lg" style={{ marginTop: "1.5rem" }}>
          <h2 className="heading-md" style={{ marginBottom: "1rem" }}>
            Legal Documents
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="#"
              className="btn btn-secondary"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                alert("Privacy Policy will be displayed here");
              }}
            >
              View Privacy Policy
            </a>
            <a
              href="#"
              className="btn btn-secondary"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                alert("Terms of Service will be displayed here");
              }}
            >
              View Terms of Service
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacySettingsPage;
