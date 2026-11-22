import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiFilter, FiCalendar } from "react-icons/fi";
import { getAssessmentHistory } from "../services/assessmentService";
import "../styles/mentovya.css";

const AssessmentHistoryPage = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(null); // null, "PHQ-9", "GAD-7"
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [filter, currentPage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getAssessmentHistory(filter, currentPage, 10);
      setHistory(data.history);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
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

  if (loading && history.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/assessments")}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}
          >
            <FiArrowLeft /> Back to Assessments
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 className="heading-xl" style={{ marginBottom: "0.5rem" }}>
                Assessment History
              </h1>
              <p className="body-md text-muted">View your past assessment results</p>
            </div>

            {/* Filter */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <FiFilter style={{ color: "#9CA3AF" }} />
              <select
                value={filter || ""}
                onChange={(e) => handleFilterChange(e.target.value || null)}
                className="form-input"
                style={{ minWidth: "150px" }}
              >
                <option value="">All Assessments</option>
                <option value="PHQ-9">PHQ-9 Only</option>
                <option value="GAD-7">GAD-7 Only</option>
              </select>
            </div>
          </div>
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

        {/* History List */}
        {history.length === 0 ? (
          <div className="glass-card-lg" style={{ textAlign: "center", padding: "3rem" }}>
            <FiCalendar size={48} style={{ color: "#D1D5DB", marginBottom: "1rem" }} />
            <h3 className="heading-md" style={{ marginBottom: "0.5rem", color: "#6B7280" }}>
              No Assessment History
            </h3>
            <p className="body-md text-muted" style={{ marginBottom: "1.5rem" }}>
              {filter ? "No assessments found with the selected filter." : "You haven't completed any assessments yet."}
            </p>
            <button onClick={() => navigate("/assessments")} className="btn btn-primary">
              Take an Assessment
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {history.map((item) => (
                <motion.div
                  key={item.attemptId}
                  className="glass-card-lg"
                  style={{ cursor: item.resultId ? "pointer" : "default" }}
                  whileHover={item.resultId ? { scale: 1.01 } : {}}
                  onClick={() => item.resultId && navigate(`/assessments/results/${item.resultId}`)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <h3 className="heading-sm">{item.assessmentName}</h3>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#E5E7EB",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color: "#6B7280",
                          }}
                        >
                          {item.assessmentType}
                        </span>
                        {item.status !== "completed" && (
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: "#FEF3C7",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              color: "#92400E",
                            }}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FiCalendar size={16} style={{ color: "#9CA3AF" }} />
                          <span className="body-sm text-muted">
                            {item.completedAt
                              ? `Completed ${new Date(item.completedAt).toLocaleDateString()}`
                              : `Started ${new Date(item.startedAt).toLocaleDateString()}`}
                          </span>
                        </div>

                        {item.score !== null && (
                          <>
                            <span className="body-sm text-muted">
                              Score: <strong>{item.score}</strong>
                            </span>
                            {item.label && (
                              <span
                                className="body-sm"
                                style={{
                                  fontWeight: "600",
                                  color: getSeverityColor(item.severity),
                                }}
                              >
                                {item.label}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {item.resultId && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="body-sm" style={{ color: "var(--lavender-dark)", fontWeight: "600" }}>
                          View Details
                        </span>
                        <FiArrowRight style={{ color: "var(--lavender-dark)" }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                  style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  Previous
                </button>

                <span className="body-sm text-muted">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="btn btn-secondary"
                  style={{ opacity: currentPage === pagination.totalPages ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AssessmentHistoryPage;

