import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiAlertCircle, FiClock } from "react-icons/fi";
import { getUserConsents, acceptConsent, withdrawConsent, getConsentHistory } from "../services/consentService";
import "../styles/mentovya.css";

const ConsentManagementPage = () => {
  const [consents, setConsents] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    try {
      setLoading(true);
      const data = await getUserConsents();
      setConsents(data);
    } catch (err) {
      setError("Failed to load consents");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await getConsentHistory();
      setHistory(data);
      setShowHistory(true);
    } catch (err) {
      setError("Failed to load consent history");
    }
  };

  const handleAccept = async (consentType) => {
    if (processing) return;

    setProcessing(consentType);
    setError("");
    setSuccess("");

    try {
      await acceptConsent(consentType);
      setSuccess("Consent accepted successfully");
      await fetchConsents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept consent");
    } finally {
      setProcessing(null);
    }
  };

  const handleWithdraw = async (consent) => {
    if (processing) return;

    if (!consent.consentId) {
      setError("Cannot withdraw: consent not found");
      return;
    }

    if (consent.required) {
      setError("Cannot withdraw required consent");
      return;
    }

    if (!window.confirm(`Are you sure you want to withdraw consent for "${consent.title}"?\n\nThis may limit access to certain features.`)) {
      return;
    }

    setProcessing(consent.consentType);
    setError("");
    setSuccess("");

    try {
      await withdrawConsent(consent.consentId);
      setSuccess("Consent withdrawn successfully");
      await fetchConsents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to withdraw consent");
    } finally {
      setProcessing(null);
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
            Consent & Permissions
          </h1>
          <p className="body-md text-muted">
            Manage your data processing permissions and consents
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

        {/* Info Banner */}
        <div
          className="glass-card"
          style={{
            padding: "1rem",
            background: "rgba(169, 155, 234, 0.1)",
            border: "1px solid rgba(169, 155, 234, 0.3)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <FiAlertCircle size={20} style={{ color: "var(--lavender-dark)", flexShrink: 0, marginTop: "0.125rem" }} />
            <div>
              <p className="body-sm" style={{ margin: 0 }}>
                <strong>Important:</strong> Required consents are necessary for basic platform functionality.
                Optional consents enhance your experience but can be withdrawn at any time.
              </p>
            </div>
          </div>
        </div>

        {/* History Button */}
        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button
            onClick={fetchHistory}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <FiClock /> View Consent History
          </button>
        </div>

        {/* Consents Grid */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {consents.map((consent) => (
            <motion.div
              key={consent.consentType}
              className="glass-card-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <h3 className="heading-sm">{consent.title}</h3>
                    {consent.required && (
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "var(--lavender-dark)",
                          color: "white",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        REQUIRED
                      </span>
                    )}
                  </div>

                  <p className="body-md" style={{ marginBottom: "0.75rem" }}>
                    {consent.description}
                  </p>

                  {consent.requiredFor && (
                    <p className="body-sm text-muted" style={{ fontStyle: "italic" }}>
                      Required for: {consent.requiredFor.join(", ")}
                    </p>
                  )}

                  <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <div>
                      <span className="body-sm text-muted">Status:</span>
                      <span
                        className="body-sm"
                        style={{
                          marginLeft: "0.5rem",
                          fontWeight: "600",
                          color: consent.isAccepted ? "#10B981" : "#6B7280",
                        }}
                      >
                        {consent.isAccepted ? "Accepted" : "Not Accepted"}
                      </span>
                    </div>

                    <div>
                      <span className="body-sm text-muted">Version:</span>
                      <span className="body-sm" style={{ marginLeft: "0.5rem" }}>
                        {consent.version}
                      </span>
                    </div>

                    {consent.acceptedAt && (
                      <div>
                        <span className="body-sm text-muted">Accepted:</span>
                        <span className="body-sm" style={{ marginLeft: "0.5rem" }}>
                          {new Date(consent.acceptedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {consent.withdrawnAt && (
                      <div>
                        <span className="body-sm text-muted">Withdrawn:</span>
                        <span className="body-sm" style={{ marginLeft: "0.5rem", color: "#EF4444" }}>
                          {new Date(consent.withdrawnAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {!consent.isAccepted ? (
                    <button
                      onClick={() => handleAccept(consent.consentType)}
                      disabled={processing === consent.consentType}
                      className="btn btn-primary"
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "140px", justifyContent: "center" }}
                    >
                      {processing === consent.consentType ? (
                        "Processing..."
                      ) : (
                        <>
                          <FiCheck /> Accept
                        </>
                      )}
                    </button>
                  ) : (
                    !consent.required && (
                      <button
                        onClick={() => handleWithdraw(consent)}
                        disabled={processing === consent.consentType}
                        className="btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          minWidth: "140px",
                          justifyContent: "center",
                          background: "#FEE2E2",
                          color: "#991B1B",
                        }}
                      >
                        {processing === consent.consentType ? (
                          "Processing..."
                        ) : (
                          <>
                            <FiX /> Withdraw
                          </>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Consent History Modal */}
        {showHistory && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "2rem",
            }}
            onClick={() => setShowHistory(false)}
          >
            <div
              className="glass-card-lg"
              style={{ maxWidth: "800px", width: "100%", maxHeight: "80vh", overflow: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 className="heading-md">Consent History</h2>
                <button onClick={() => setShowHistory(false)} className="btn btn-secondary">
                  Close
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {history.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "1rem",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <strong className="body-md">{item.consentType.replace(/_/g, " ").toUpperCase()}</strong>
                      <span
                        className="body-sm"
                        style={{
                          color: item.isAccepted ? "#10B981" : "#EF4444",
                          fontWeight: "600",
                        }}
                      >
                        {item.isAccepted ? "Accepted" : "Withdrawn"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                      <span className="body-sm text-muted">
                        Version: {item.consentVersion}
                      </span>
                      <span className="body-sm text-muted">
                        {item.isAccepted && item.acceptedAt
                          ? `Accepted: ${new Date(item.acceptedAt).toLocaleString()}`
                          : item.withdrawnAt
                            ? `Withdrawn: ${new Date(item.withdrawnAt).toLocaleString()}`
                            : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConsentManagementPage;
