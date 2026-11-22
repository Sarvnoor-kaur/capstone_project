import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AIChatPage from "../pages/AIChatPage.jsx";
import axios from "../api/axiosClient.js";

// Mock axiosClient
vi.mock("../api/axiosClient.js", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { _id: "user-test-1", name: "Alex Student", email: "alex@college.edu", role: "student" },
  }),
}));

describe("AIChatPage Component - NOPE Edge Cross-Layer Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders default assistant greeting on mount", () => {
    render(
      <MemoryRouter>
        <AIChatPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Hello! I'm here to support you with any mental health/i)
    ).toBeInTheDocument();
  });

  it("handles successful no-risk result (riskDetected: false)", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        reply: "Here are some time management strategies for preparing for finals.",
        timestamp: new Date().toISOString(),
        safetyAssessment: {
          analysisStatus: "SUCCESS",
          riskDetected: false,
          risks: [],
          modelName: "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
        },
      },
    });

    render(
      <MemoryRouter>
        <AIChatPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: "How can I study better?" } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Here are some time management strategies for preparing for finals.")
      ).toBeInTheDocument();
    });

    // Crisis card MUST NOT be displayed for benign input
    expect(screen.queryByText(/Support Resources Available/i)).not.toBeInTheDocument();
  });

  it("shows loading indicator during message submission", async () => {
    let resolvePromise;
    const delayedResponse = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    axios.post.mockReturnValueOnce(delayedResponse);

    render(
      <MemoryRouter>
        <AIChatPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: "I need some advice." } });
    fireEvent.click(sendBtn);

    // Typing indicator should be present while waiting
    const typingIndicator = document.querySelector(".typing-indicator");
    expect(typingIndicator).toBeInTheDocument();

    // Resolve response
    resolvePromise({
      data: {
        reply: "I am here to listen.",
        timestamp: new Date().toISOString(),
        safetyAssessment: {
          analysisStatus: "SUCCESS",
          riskDetected: false,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("I am here to listen.")).toBeInTheDocument();
    });
  });

  it("handles risk signal result (riskDetected: true) by displaying crisis support resources", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        reply: "I hear how much pain you're in, and I want to support you right now.",
        timestamp: new Date().toISOString(),
        safetyAssessment: {
          analysisStatus: "SUCCESS",
          riskDetected: true,
          risks: [
            {
              subject: "self",
              type: "self_harm",
              severity: "severe",
              imminence: "acute",
              features: ["distress"],
            },
          ],
          modelName: "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
        },
      },
    });

    render(
      <MemoryRouter>
        <AIChatPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, {
      target: { value: "I feel completely hopeless and want to end everything." },
    });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(
        screen.getByText("I hear how much pain you're in, and I want to support you right now.")
      ).toBeInTheDocument();
    });

    // Crisis resources banner must be displayed
    expect(screen.getByText(/Support Resources Available/i)).toBeInTheDocument();
    expect(screen.getByText(/988 Suicide & Crisis Lifeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Crisis Text Line/i)).toBeInTheDocument();
    expect(screen.getByText(/Connect with Campus Counselor/i)).toBeInTheDocument();

    // Verify raw internal model names / prompts are NOT displayed
    expect(screen.queryByText(/hf\.co\/nopenet/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/<reflection>/i)).not.toBeInTheDocument();
  });

  it("handles inconclusive or unavailable AI analysis (riskDetected: null) separately from no-risk", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        reply: "I am here to support you. Let's talk through your thoughts.",
        timestamp: new Date().toISOString(),
        safetyAssessment: {
          analysisStatus: "UNAVAILABLE",
          riskDetected: null,
          risks: [],
          error: "AI Service unavailable",
        },
      },
    });

    render(
      <MemoryRouter>
        <AIChatPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: "I feel a bit overwhelmed." } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(
        screen.getByText("I am here to support you. Let's talk through your thoughts.")
      ).toBeInTheDocument();
    });

    // Notice about offline screening must appear
    expect(
      screen.getByText(/Safety screening was inconclusive or temporarily unavailable/i)
    ).toBeInTheDocument();

    // Must NOT state student is safe or cleared
    expect(screen.queryByText(/Verified safe/i)).not.toBeInTheDocument();
  });

  it("handles backend network error gracefully and preserves user input", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "The AI is currently busy. Please try again in a minute.",
        },
      },
    });

    render(
      <MemoryRouter>
        <AIChatPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    const userText = "My unique message that shouldn't be lost on network failure";
    fireEvent.change(input, { target: { value: userText } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/The AI is currently busy. Please try again in a minute./i)
      ).toBeInTheDocument();
    });

    // User's typed message MUST be restored into input so it is preserved
    expect(input.value).toBe(userText);
  });
});
