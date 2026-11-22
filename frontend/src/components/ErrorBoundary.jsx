import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "3rem",
          maxWidth: "600px",
          margin: "4rem auto",
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(32, 35, 56, 0.08)",
          textAlign: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌿</div>
          <h2 style={{ color: "#202338", marginBottom: "0.5rem" }}>Something went wrong</h2>
          <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>
            {this.state.error?.message || "An unexpected error occurred while loading this view."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#A99BEA",
              color: "white",
              border: "none",
              borderRadius: "9999px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
