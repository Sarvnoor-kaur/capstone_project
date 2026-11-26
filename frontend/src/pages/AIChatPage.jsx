import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../api/axiosClient";
import { FiSend, FiTrash2, FiUser, FiCpu, FiHeart, FiInfo } from "react-icons/fi";

const AIChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const savedMessages = localStorage.getItem("aiChatMessages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        setMessages([]);
      }
    } else {
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm here to support you with any mental health or emotional wellbeing concerns. Whether you're feeling stressed, anxious, overwhelmed, or just need someone to talk to, I'm here to listen and help. How are you feeling today?",
          timestamp: new Date().toISOString(),
          safetyAssessment: null,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("aiChatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const trimmedContent = inputMessage.trim();

    const userMessage = {
      role: "user",
      content: trimmedContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/ai-chat", {
        message: userMessage.content,
        conversationHistory: messages,
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.reply,
        timestamp: response.data.timestamp || new Date().toISOString(),
        safetyAssessment: response.data.safetyAssessment || null,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Failed to get AI response:", err);
      setError(
        err.response?.data?.message ||
          "Unable to reach the support assistant right now. Please try again."
      );

      // Preserve original student message in input box so it is not lost
      setInputMessage(trimmedContent);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      localStorage.removeItem("aiChatMessages");
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm here to support you with any mental health or emotional wellbeing concerns. Whether you're feeling stressed, anxious, overwhelmed, or just need someone to talk to, I'm here to listen and help. How are you feeling today?",
          timestamp: new Date().toISOString(),
          safetyAssessment: null,
        },
      ]);
    }
  };

  if (!user) {
    return (
      <div className="page-container-full">
        <div className="ai-chat-page">
          <div className="ai-chat-background"></div>
          <div
            className="ai-chat-wrapper"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div
              className="card"
              style={{
                zIndex: 2,
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2>Please Log In</h2>
              <p>You need to be logged in to access AI Chat Support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-full">
      <div className="ai-chat-page">
        <div className="ai-chat-background"></div>
        <div className="ai-chat-wrapper">
          <div className="ai-chat-header">
            <div className="header-content">
              <h1
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FiCpu style={{ fontSize: "1.75rem" }} /> AI Mental Health
                Support
              </h1>
              <p className="subtitle">
                Chat with our AI assistant about mental health, stress, anxiety,
                and emotional wellbeing
              </p>
            </div>
            <button
              onClick={handleClearChat}
              className="btn btn-secondary btn-small"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FiTrash2 /> Clear Chat
            </button>
          </div>

          <div className="ai-chat-container">
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className="message-wrapper">
                  <div
                    className={`message ${
                      msg.role === "user" ? "user-message" : "ai-message"
                    }`}
                  >
                    <div className="message-avatar">
                      {msg.role === "user" ? <FiUser /> : <FiCpu />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.content}</div>
                      <div className="message-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Crisis support resource card displayed when risk signals are detected */}
                  {msg.role === "assistant" &&
                    msg.safetyAssessment?.riskDetected === true && (
                      <div
                        className="crisis-support-card"
                        role="region"
                        aria-label="Crisis Support Resources"
                      >
                        <div className="crisis-card-header">
                          <FiHeart className="crisis-card-icon" />
                          <span className="crisis-card-title">
                            Support Resources Available
                          </span>
                        </div>
                        <p className="crisis-card-text">
                          We want to ensure you have compassionate, confidential support.
                          If you or someone you know is feeling overwhelmed, experiencing thoughts
                          of self-harm, or in distress, please know you are not alone and help is
                          available 24/7.
                        </p>
                        <div className="crisis-resources-grid">
                          <div className="crisis-resource-item">
                            <strong>National 988 Suicide & Crisis Lifeline</strong>
                            <span>Call or text <strong>988</strong> (Free, confidential, 24/7)</span>
                          </div>
                          <div className="crisis-resource-item">
                            <strong>Crisis Text Line</strong>
                            <span>Text <strong>HOME</strong> to <strong>741741</strong></span>
                          </div>
                        </div>
                        <div className="crisis-card-actions">
                          <Link to="/support" className="btn btn-primary btn-small">
                            Connect with Campus Counselor
                          </Link>
                        </div>
                      </div>
                    )}

                  {/* Discreet notice when AI safety assessment was inconclusive or unavailable */}
                  {msg.role === "assistant" &&
                    msg.safetyAssessment &&
                    msg.safetyAssessment.riskDetected === null && (
                      <div className="safety-offline-notice">
                        <FiInfo />
                        <span>
                          Safety screening was inconclusive or temporarily unavailable.
                          Campus counseling and 24/7 crisis lines (988) are always accessible.
                        </span>
                      </div>
                    )}
                </div>
              ))}

              {isLoading && (
                <div className="message ai-message">
                  <div className="message-avatar">
                    <FiCpu />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div
                className="chat-error"
                style={{ padding: "0 20px", color: "var(--danger)" }}
              >
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="message-input-form">
              <div className="input-wrapper">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  rows="1"
                  disabled={isLoading}
                  className="message-input"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="send-button"
                  aria-label="Send message"
                >
                  <FiSend />
                </button>
              </div>
              <div className="input-hint">
                Ask me about stress management, coping strategies, anxiety,
                study-life balance, or any mental health concerns
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
