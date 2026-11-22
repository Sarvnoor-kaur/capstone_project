import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiShield, FiClock, FiClipboard } from "react-icons/fi";
import { getAssessmentById } from "../services/assessmentService";
import "../styles/mentovya.css";

const AssessmentInstructionsPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const data = await getAssessmentById(assessmentId);
      setAssessment(data);
    } catch (err) {
      setError("Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    navigate(`/assessments/${assessmentId}/take`);
  };

  const handleBack = () => {
    navigate("/assessments");
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="page-container" style={{ padding: "2rem" }}>
        <div className="glass-card-lg" style={{ textAlign: "center", padding: "3rem" }}>
          <p className="body-md" style={{ color: "#EF4444" }}>
            {error || "Assessment not found"}
          </p>
          <button onClick={handleBack} className="btn btn-secondary" style={{ marginTop: "1rem" }}>
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <button
          onClick={handleBack}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}
        >
          <FiArrowLeft /> Back to Assessments
        </button>

        <div className="glass-card-lg">
          <h1 className="heading-xl" style={{ marginBottom: "1rem" }}>
            {assessment.name}
          </h1>

          <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiClipboard style={{ color: "var(--lavender-dark)" }} />
              <span className="body-md text-muted">{assessment?.questions?.length || 0} questions</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiClock style={{ color: "var(--lavender-dark)" }} />
              <span className="body-md text-muted">~{Math.ceil((assessment?.questions?.length || 0) / 2)} minutes</span>
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 className="heading-sm" style={{ marginBottom: "0.75rem" }}>
              About This Assessment
            </h3>
            <p className="body-md" style={{ marginBottom: "1rem" }}>
              {assessment.description}
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 className="heading-sm" style={{ marginBottom: "0.75rem" }}>
              Instructions
            </h3>
            <p className="body-md">{assessment.instructions}</p>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(169, 155, 234, 0.1)",
              border: "1px solid rgba(169, 155, 234, 0.3)",
              borderRadius: "12px",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <FiShield size={24} style={{ color: "var(--lavender-dark)", flexShrink: 0 }} />
              <div>
                <h4 className="heading-sm" style={{ marginBottom: "0.5rem" }}>
                  Privacy & Important Information
                </h4>
                <ul className="body-sm" style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                  <li>Your responses are confidential and stored securely</li>
                  <li>This is a screening tool, not a diagnostic test</li>
                  <li>Results cannot determine if you have a mental health condition</li>
                  <li>If you're concerned about your well-being, speak with a mental health professional</li>
                  <li>Take your time and answer honestly based on your recent experiences</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button onClick={handleBack} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              Start Assessment <FiArrowRight />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentInstructionsPage;

