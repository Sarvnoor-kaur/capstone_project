import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClipboard, FiClock, FiActivity, FiArrowRight } from "react-icons/fi";
import { getAssessments, getAssessmentHistory } from "../services/assessmentService";
import "../styles/mentovya.css";

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assessmentsData, historyData] = await Promise.all([
        getAssessments(),
        getAssessmentHistory(null, 1, 3), // Get last 3 attempts
      ]);
      setAssessments(assessmentsData);
      setRecentHistory(historyData.history);
    } catch (err) {
      setError("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (assessmentId) => {
    navigate(`/assessments/${assessmentId}/instructions`);
  };

  const handleViewHistory = () => {
    navigate("/assessments/history");
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
            Mental Wellness Assessments
          </h1>
          <p className="body-md text-muted">
            Brief screening tools to help you understand your mental well-being
          </p>
        </div>

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

        {/* Info Banner */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            background: "rgba(169, 155, 234, 0.1)",
            border: "1px solid rgba(169, 155, 234, 0.3)",
            marginBottom: "2rem",
          }}
        >
          <h3 className="heading-sm" style={{ marginBottom: "0.75rem" }}>
            About These Assessments
          </h3>
          <p className="body-sm" style={{ marginBottom: "0.5rem" }}>
            These are brief screening tools designed to help you understand your current mental health symptoms.
            They are <strong>not diagnostic tools</strong> and cannot determine if you have a mental health
            condition.
          </p>
          <p className="body-sm">
            If you're concerned about your well-being, please consider speaking with a qualified mental health
            professional.
          </p>
        </div>

        {/* Available Assessments */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 className="heading-md" style={{ marginBottom: "1.5rem" }}>
            Available Assessments
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {assessments.map((assessment) => (
              <motion.div
                key={assessment._id}
                className="glass-card-lg"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(169, 155, 234, 0.15)" }}
                onClick={() => handleStartAssessment(assessment._id)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #A99BEA 0%, #DDD7F7 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FiClipboard size={24} style={{ color: "white" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className="heading-sm" style={{ marginBottom: "0.25rem" }}>
                      {assessment.name}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "var(--lavender-dark)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {assessment.assessmentType}
                    </span>
                  </div>
                </div>

                <p className="body-md" style={{ marginBottom: "1.25rem" }}>
                  {assessment.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #E5E7EB",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiClipboard size={16} style={{ color: "var(--lavender-dark)" }} />
                    <span className="body-sm text-muted">{assessment.questionCount} questions</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiClock size={16} style={{ color: "var(--lavender-dark)" }} />
                    <span className="body-sm text-muted">~{assessment.estimatedMinutes} min</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  Start Assessment <FiArrowRight />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent History */}
        {recentHistory.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 className="heading-md">Recent Assessments</h2>
              <button onClick={handleViewHistory} className="btn btn-secondary">
                View All History
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {recentHistory.map((item) => (
                <div
                  key={item.attemptId}
                  className="glass-card"
                  style={{ padding: "1.25rem", cursor: item.resultId ? "pointer" : "default" }}
                  onClick={() => item.resultId && navigate(`/assessments/results/${item.resultId}`)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <h4 className="heading-sm" style={{ marginBottom: "0.25rem" }}>
                        {item.assessmentName}
                      </h4>
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span className="body-sm text-muted">
                          {new Date(item.completedAt).toLocaleDateString()}
                        </span>
                        {item.score !== null && (
                          <>
                            <span className="body-sm text-muted">Score: {item.score}</span>
                            <span
                              className="body-sm"
                              style={{
                                fontWeight: "600",
                                color: item.severity === "severe" || item.severity === "moderately_severe"
                                  ? "#DC2626"
                                  : item.severity === "moderate"
                                    ? "#F59E0B"
                                    : item.severity === "mild"
                                      ? "#10B981"
                                      : "#6B7280",
                              }}
                            >
                              {item.label}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {item.resultId && (
                      <FiArrowRight size={20} style={{ color: "var(--lavender-dark)" }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AssessmentsPage;

