import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck, FiAlertCircle, FiPhone } from "react-icons/fi";
import { getAssessmentById, startAssessment, submitAssessment } from "../services/assessmentService";
import "../styles/mentovya.css";

const TakeAssessmentPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  useEffect(() => {
    initializeAssessment();
  }, [assessmentId]);

  const initializeAssessment = async () => {
    try {
      setLoading(true);
      const assessmentData = await getAssessmentById(assessmentId);
      setAssessment(assessmentData);

      const attemptData = await startAssessment(assessmentId);
      setAttemptId(attemptData.attemptId);
    } catch (err) {
      setError("Failed to start assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionNumber, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));

    // Check for PHQ-9 Question 9 safety concern
    if (assessment.assessmentType === "PHQ-9" && questionNumber === 9 && value > 0) {
      setShowSafetyModal(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all questions are answered
    const unansweredQuestions = assessment.questions.filter(
      (q) => q.required && responses[q.questionNumber] === undefined
    );

    if (unansweredQuestions.length > 0) {
      setError(`Please answer all required questions. ${unansweredQuestions.length} remaining.`);
      return;
    }

    if (!window.confirm("Are you sure you want to submit your responses? You cannot change them after submission.")) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formattedResponses = Object.entries(responses).map(([questionNumber, value]) => ({
        questionNumber: parseInt(questionNumber),
        value,
      }));

      const result = await submitAssessment(attemptId, formattedResponses);

      // Navigate to result page
      navigate(`/assessments/results/${result.resultId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit assessment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="page-container" style={{ padding: "2rem" }}>
        <div className="glass-card-lg" style={{ textAlign: "center", padding: "3rem" }}>
          <p className="body-md" style={{ color: "#EF4444" }}>
            {error}
          </p>
          <button onClick={() => navigate("/assessments")} className="btn btn-secondary" style={{ marginTop: "1rem" }}>
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const allAnswered = assessment.questions.every((q) => !q.required || responses[q.questionNumber] !== undefined);

  return (
    <div className="page-container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/assessments")}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}
          >
            <FiArrowLeft /> Exit Assessment
          </button>
          <h2 className="heading-lg">{assessment.name}</h2>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span className="body-sm text-muted">
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </span>
            <span className="body-sm text-muted">{Math.round(progress)}% Complete</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "#E5E7EB",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #A99BEA 0%, #DDD7F7 100%)",
              }}
            />
          </div>
        </div>

        {/* Error Message */}
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

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card-lg"
          >
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--lavender-dark)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  {currentQuestion.questionNumber}
                </div>
                <h3 className="heading-md" style={{ flex: 1 }}>
                  {currentQuestion.questionText}
                </h3>
              </div>
            </div>

            {/* Answer Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {currentQuestion.options.map((option) => {
                const isSelected = responses[currentQuestion.questionNumber] === option.value;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectAnswer(currentQuestion.questionNumber, option.value)}
                    style={{
                      padding: "1.25rem",
                      border: isSelected
                        ? "2px solid var(--lavender-dark)"
                        : "2px solid #E5E7EB",
                      borderRadius: "12px",
                      background: isSelected
                        ? "rgba(169, 155, 234, 0.1)"
                        : "white",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      className="body-md"
                      style={{
                        fontWeight: isSelected ? "600" : "400",
                        color: isSelected ? "var(--lavender-dark)" : "#1F2937",
                      }}
                    >
                      {option.label}
                    </span>
                    {isSelected && <FiCheck size={20} style={{ color: "var(--lavender-dark)" }} />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
            }}
          >
            <FiArrowLeft /> Previous
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={responses[currentQuestion.questionNumber] === undefined}
              className="btn btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: responses[currentQuestion.questionNumber] === undefined ? 0.5 : 1,
              }}
            >
              Next <FiArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="btn btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: !allAnswered || submitting ? 0.5 : 1,
              }}
            >
              {submitting ? "Submitting..." : <><FiCheck /> Submit Assessment</>}
            </button>
          )}
        </div>

        {/* Answer Progress Indicator */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p className="body-sm text-muted">
            {Object.keys(responses).length} of {assessment.questions.length} questions answered
          </p>
        </div>
      </motion.div>

      {/* Safety Modal for PHQ-9 Question 9 */}
      {showSafetyModal && (
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
          onClick={() => setShowSafetyModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-lg"
            style={{ maxWidth: "600px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <FiAlertCircle size={48} style={{ color: "#DC2626", marginBottom: "1rem" }} />
              <h3 className="heading-md" style={{ marginBottom: "0.5rem" }}>
                We're Here to Support You
              </h3>
              <p className="body-md">
                Your well-being matters to us. If you're having thoughts of self-harm, please reach out for support.
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                background: "rgba(220, 38, 38, 0.1)",
                borderRadius: "12px",
                marginBottom: "1.5rem",
              }}
            >
              <h4 className="heading-sm" style={{ marginBottom: "1rem", color: "#991B1B" }}>
                Crisis Resources in India
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiPhone style={{ color: "#991B1B" }} />
                  <span className="body-sm">
                    <strong>Vandrevala Foundation:</strong> 1860-2662-345 (24/7)
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiPhone style={{ color: "#991B1B" }} />
                  <span className="body-sm">
                    <strong>AASRA:</strong> 91-22-27546669 (24/7)
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiPhone style={{ color: "#991B1B" }} />
                  <span className="body-sm">
                    <strong>iCall:</strong> 022-25521111 (Mon-Sat, 8 AM - 10 PM)
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <p className="body-sm" style={{ marginBottom: "0.5rem" }}>
                <strong>You can also:</strong>
              </p>
              <ul className="body-sm" style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                <li>Contact your campus counseling center</li>
                <li>Speak with a trusted friend, family member, or counselor</li>
                <li>Visit the nearest hospital emergency department</li>
              </ul>
            </div>

            <button
              onClick={() => setShowSafetyModal(false)}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Continue Assessment
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TakeAssessmentPage;

