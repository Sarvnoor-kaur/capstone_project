import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { protect } from "../middleware/authMiddleware.js";
import { aiServiceClient } from "../services/aiServiceClient.js";

const router = express.Router();

const SYSTEM_PROMPT = `You are a compassionate mental health support AI assistant for students in higher education. Your role is to provide:

1. Emotional support and empathetic listening
2. Information about stress management, anxiety, depression, and other mental health topics
3. Coping strategies and wellness techniques
4. Study-life balance advice
5. General mental health resources and guidance

IMPORTANT RESTRICTIONS:
- ONLY answer questions related to mental health, emotional wellbeing, stress, anxiety, depression, self-care, wellness, counseling, and student life challenges
- If asked about topics unrelated to mental health (e.g., coding, math, history, sports, entertainment), politely redirect: "I'm specifically designed to help with mental health and emotional wellbeing questions. For that topic, I'd recommend consulting other resources. Is there anything about your mental health or emotional wellbeing I can help you with?"
- Do NOT provide medical diagnoses or replace professional medical care
- Always encourage seeking professional help for serious concerns
- Be warm, supportive, and non-judgmental
- Keep responses concise (2-4 paragraphs) and actionable
- If someone mentions self-harm or suicide, immediately provide crisis resources

Remember: You're a supportive companion, not a replacement for professional therapy or emergency services.`;

/**
 * Generates an empathetic fallback message when Gemini API is unavailable.
 */
function getFallbackReply(safetyAssessment) {
  if (safetyAssessment?.riskDetected) {
    return (
      "I hear how difficult things are for you right now, and I want you to know you don't have to carry this alone. " +
      "Please connect with someone who can support you today. Campus counselors and crisis helplines are free, confidential, and available 24/7."
    );
  }
  return (
    "Thank you for reaching out. I'm here to listen and support your emotional wellbeing. " +
    "Whether you're dealing with academic stress, feeling down, or just need to reflect, please feel free to share what's on your mind."
  );
}

/**
 * Main AI chat endpoint.
 * Evaluates student message via NOPE Edge on Python AI server,
 * then generates empathetic guidance while attaching structured safety assessment.
 */
router.post("/", protect, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const trimmedMessage = message.trim();

    // 1. Evaluate safety risk signals via Python AI service (NOPE Edge)
    const safetyAssessment = await aiServiceClient.analyzeRisk(trimmedMessage);

    // 2. Generate conversational reply
    let aiReply = "";

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let conversationContext = SYSTEM_PROMPT + "\n\n";
        const recentHistory = Array.isArray(conversationHistory)
          ? conversationHistory.slice(-10)
          : [];

        recentHistory.forEach((msg) => {
          conversationContext += `${msg.role === "user" ? "User" : "Assistant"}: ${
            msg.content
          }\n`;
        });

        conversationContext += `User: ${trimmedMessage}\nAssistant:`;

        const result = await model.generateContent(conversationContext);
        const response = await result.response;
        aiReply = response.text();
      } catch (geminiError) {
        console.warn("Gemini generation failed, falling back to supportive template:", geminiError.message);
        aiReply = getFallbackReply(safetyAssessment);
      }
    } else {
      // Graceful fallback when Gemini key is not configured
      aiReply = getFallbackReply(safetyAssessment);
    }

    return res.json({
      reply: aiReply,
      timestamp: new Date().toISOString(),
      safetyAssessment,
    });
  } catch (error) {
    console.error("AI Chat route unexpected error:", error.message);

    if (error.status === 429) {
      return res.status(429).json({
        message: "The AI is currently busy. Please try again in a minute.",
        error: "Quota Exceeded",
      });
    }

    return res.status(500).json({
      message: "Failed to process chat message. Please try again.",
      error: error.message,
    });
  }
});

/**
 * Dedicated endpoint for evaluating message safety risk without generating full chat reply.
 */
router.post("/safety-check", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const safetyAssessment = await aiServiceClient.analyzeRisk(message.trim());
    return res.json({
      safetyAssessment,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Safety-check error:", err.message);
    return res.status(500).json({ message: "Safety analysis failed" });
  }
});

export default router;
