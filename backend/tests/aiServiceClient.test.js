import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { AIServiceClient } from "../services/aiServiceClient.js";

test("AIServiceClient - Successful risk detection", async () => {
  const server = http.createServer((req, res) => {
    assert.equal(req.method, "POST");
    assert.equal(req.url, "/api/v1/nope/analyze");
    assert.equal(req.headers["x-internal-api-key"], "test-key");

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const parsed = JSON.parse(body);
      assert.equal(parsed.message, "I feel like giving up.");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          analysis_status: "SUCCESS",
          risk_detected: true,
          risks: [
            {
              subject: "self",
              type: "self_neglect",
              severity: "moderate",
              imminence: "subacute",
              features: ["hopelessness"],
            },
          ],
          model_name: "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
          error: null,
        })
      );
    });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const client = new AIServiceClient({
      baseUrl: `http://127.0.0.1:${port}`,
      apiKey: "test-key",
      timeoutMs: 2000,
    });

    const result = await client.analyzeRisk("I feel like giving up.");
    assert.equal(result.analysisStatus, "SUCCESS");
    assert.equal(result.riskDetected, true);
    assert.equal(result.risks.length, 1);
    assert.equal(result.risks[0].type, "self_neglect");
    assert.equal(result.risks[0].severity, "moderate");
    assert.deepEqual(result.risks[0].features, ["hopelessness"]);
    assert.equal(result.error, null);
  } finally {
    server.close();
  }
});

test("AIServiceClient - Successful zero risk (benign)", async () => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        analysis_status: "SUCCESS",
        risk_detected: false,
        risks: [],
        model_name: "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
        error: null,
      })
    );
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const client = new AIServiceClient({
      baseUrl: `http://127.0.0.1:${port}`,
      apiKey: "test-key",
    });

    const result = await client.analyzeRisk("How do I prepare for exams?");
    assert.equal(result.analysisStatus, "SUCCESS");
    assert.equal(result.riskDetected, false);
    assert.deepEqual(result.risks, []);
    assert.equal(result.error, null);
  } finally {
    server.close();
  }
});

test("AIServiceClient - AI server unavailable (connection refused)", async () => {
  // Use a port where no server is listening
  const client = new AIServiceClient({
    baseUrl: "http://127.0.0.1:59999",
    apiKey: "test-key",
    timeoutMs: 1000,
  });

  const result = await client.analyzeRisk("Hello there");
  assert.equal(result.analysisStatus, "UNAVAILABLE");
  // CRITICAL SAFETY CHECK: Must be null, NEVER false!
  assert.equal(result.riskDetected, null);
  assert.deepEqual(result.risks, []);
  assert.ok(result.error.includes("Could not connect"));
});

test("AIServiceClient - Request timeout handled safely", async () => {
  const server = http.createServer((req, res) => {
    // Deliberately delay response beyond client timeout
    setTimeout(() => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ analysis_status: "SUCCESS", risk_detected: false }));
    }, 2000);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const client = new AIServiceClient({
      baseUrl: `http://127.0.0.1:${port}`,
      apiKey: "test-key",
      timeoutMs: 200, // short timeout
    });

    const result = await client.analyzeRisk("I feel stressed");
    assert.equal(result.analysisStatus, "TIMEOUT");
    // CRITICAL: Must be null, never false
    assert.equal(result.riskDetected, null);
    assert.deepEqual(result.risks, []);
    assert.ok(result.error.includes("timed out"));
  } finally {
    server.close();
  }
});

test("AIServiceClient - Invalid response / 500 error from AI server", async () => {
  const server = http.createServer((req, res) => {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: { message: "Internal server error in Ollama" } }));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const client = new AIServiceClient({
      baseUrl: `http://127.0.0.1:${port}`,
      apiKey: "test-key",
    });

    const result = await client.analyzeRisk("Hello");
    assert.equal(result.analysisStatus, "UNAVAILABLE");
    assert.equal(result.riskDetected, null);
    assert.deepEqual(result.risks, []);
  } finally {
    server.close();
  }
});

test("AIServiceClient - Empty or whitespace message validation", async () => {
  const client = new AIServiceClient();
  const resEmpty = await client.analyzeRisk("");
  assert.equal(resEmpty.analysisStatus, "FAILED");
  assert.equal(resEmpty.riskDetected, null);

  const resWhitespace = await client.analyzeRisk("    ");
  assert.equal(resWhitespace.analysisStatus, "FAILED");
  assert.equal(resWhitespace.riskDetected, null);
});
