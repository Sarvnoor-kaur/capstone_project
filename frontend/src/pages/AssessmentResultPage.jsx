import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { getResultById } from "../services/assessmentService";
import "../styles/mentovya.css";

const AssessmentResultPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const data = await getResultById(resultId);
      setResult(data);
    } catch (err) {
      setError("Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "severe":
      case "moderately_severe":
        return "#DC2626";
      case "moderate":
        return "#F59E0B";
      case "mild":
        return "#10B981";
      case "none":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="page-container" style={{ padding: "2rem" }}>
        <div className="glass-card-lg" style={{ textAlign: "center", padding: "3rem" }}>
          <p className="body-md" style={{ color: "#EF4444" }}>
            {error || "Result not found"}
          </p>
          <button onClick={() => navigate("/assessments")} className="btn btn-secondary" style={{ marginTop: "1rem" }}>
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const assessment = result.attemptId.assessmentId;
  const maxScore = assessment.assessmentType === "PHQ-9" ? 27 : 21;

  return (
    <div className="page-container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <button
          onClick={() => navigate("/assessments")}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}
        >
          <FiArrowLeft /> Back to Assessments
        </button>

        {/* Result Header */}
        <div className="glass-card-lg" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: `${getSeverityColor(result.interpretation.severity)}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <FiCheckCircle size={32} style={{ color: getSeverityColor(result.interpretation.severity) }} />
          </div>

          <h1 className="heading-xl" style={{ marginBottom: "0.5rem" }}>
            Assessment Complete
          </h1>
          <p className="body-lg text-muted">{assessment.name}</p>
        </div>

        {/* Score Summary */}
        <div className="glass-card-lg" style={{ marginBottom: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                fontSize: "4rem",
                fontWeight: "700",
                color: getSeverityColor(result.interpretation.severity),
                marginBottom: "0.5rem",
              }}
            >
              {result.totalScore}
              <span style={{ fontSize: "2rem", color: "#9CA3AF" }}>/{maxScore}</span>
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "0.5rem 1.5rem",
                borderRadius: "24px",
                background: `${getSeverityColor(result.interpretation.severity)}20`,
                color: getSeverityColor(result.interpretation.severity),
                fontWeight: "600",
                fontSize: "1.125rem",
                marginBottom: "1rem",
              }}
            >
              {result.interpretation.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
              <FiCalendar style={{ color: "#9CA3AF" }} />
              <span className="body-sm text-muted">
                Completed on {new Date(result.completedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "#F9FAFB",
              borderRadius: "12px",
            }}
          >
            <h3 className="heading-sm" style={{ marginBottom: "0.75rem" }}>
              What This Means
            </h3>
            <p className="body-md">{result.interpretation.description}</p>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            background: "rgba(169, 155, 234, 0.1)",
            border: "1px solid rgba(169, 155, 234, 0.3)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <FiAlertCircle size={24} style={{ color: "var(--lavender-dark)", flexShrink: 0 }} />
            <div>
              <h4 className="heading-sm" style={{ marginBottom: "0.5rem" }}>
                Important: This is a Screening Tool
              </h4>
              <p className="body-sm">
                This assessment is a screening tool, <strong>not a medical diagnosis</strong>. Your result cannot
                determine whether you have a mental health condition. If you're concerned about your well-being,
                please consider speaking with a qualified mental health professional.
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card-lg" style={{ marginBottom: "2rem" }}>
          <h3 className="heading-md" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiTrendingUp /> Recommended Next Steps
          </h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {result.interpretation.recommendations.map((rec, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1rem",
                  background: "#F9FAFB",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--lavender-dark)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                <p className="body-md">{rec}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/assessments")}
            className="btn btn-primary"
            style={{ flex: 1, minWidth: "200px" }}
          >
            Take Another Assessment
          </button>
          <button
            onClick={() => navigate("/assessments/history")}
            className="btn btn-secondary"
            style={{ flex: 1, minWidth: "200px" }}
          >
            View History
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentResultPage;

