import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import http from "node:http";

process.env.JWT_SECRET = "test-secret-key-123";
process.env.AI_INTERNAL_API_KEY = "test-internal-key";

import aiChatRoutes from "../routes/aiChatRoutes.js";
import { aiServiceClient } from "../services/aiServiceClient.js";

test("aiChatRoutes - Unauthenticated request returns 401", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/ai-chat", aiChatRoutes);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello" }),
    });

    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.message, "No token");
  } finally {
    server.close();
  }
});

test("aiChatRoutes - Invalid token returns 401", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/ai-chat", aiChatRoutes);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/ai-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-token-xyz",
      },
      body: JSON.stringify({ message: "Hello" }),
    });

    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.message, "Invalid token");
  } finally {
    server.close();
  }
});

test("aiChatRoutes - Missing message returns 400", async () => {
  const app = express();
  app.use(express.json());

  // Mock protect middleware bypassing DB for route validation test
  const testRouter = express.Router();
  testRouter.post("/", (req, res, next) => {
    req.user = { _id: "user-123", role: "student" };
    next();
  }, aiChatRoutes.stack.find((layer) => layer.route?.path === "/").route.stack[1].handle);

  app.use("/api/ai-chat", testRouter);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "   " }),
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.message, "Message is required");
  } finally {
    server.close();
  }
});

test("aiChatRoutes - Successful chat returns reply and safetyAssessment", async () => {
  // 1. Mock Python AI Service
  const mockAiServer = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        analysis_status: "SUCCESS",
        risk_detected: true,
        risks: [
          {
            subject: "self",
            type: "self_harm",
            severity: "severe",
            imminence: "acute",
            features: ["distress"],
          },
        ],
        model_name: "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
      })
    );
  });

  await new Promise((resolve) => mockAiServer.listen(0, "127.0.0.1", resolve));
  const aiPort = mockAiServer.address().port;
  aiServiceClient.setBaseUrl(`http://127.0.0.1:${aiPort}`);

  // 2. Setup backend app
  const app = express();
  app.use(express.json());

  const testRouter = express.Router();
  testRouter.post("/", (req, res, next) => {
    req.user = { _id: "user-123", role: "student" };
    next();
  }, aiChatRoutes.stack.find((layer) => layer.route?.path === "/").route.stack[1].handle);

  app.use("/api/ai-chat", testRouter);

  const backendServer = http.createServer(app);
  await new Promise((resolve) => backendServer.listen(0, "127.0.0.1", resolve));
  const port = backendServer.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "I am feeling extremely overwhelmed and having thoughts of hurting myself.",
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();

    assert.ok(data.reply);
    assert.ok(data.timestamp);
    assert.ok(data.safetyAssessment);
    assert.equal(data.safetyAssessment.riskDetected, true);
    assert.equal(data.safetyAssessment.analysisStatus, "SUCCESS");
    assert.equal(data.safetyAssessment.risks[0].type, "self_harm");
    assert.equal(data.safetyAssessment.risks[0].severity, "severe");
  } finally {
    mockAiServer.close();
    backendServer.close();
    aiServiceClient.setBaseUrl(null);
  }
});
