/**
 * Dedicated client for communicating with the internal Python AI service.
 * Handles service-to-service authentication, timeouts, network failures,
 * and standardizes the NOPE Edge response contract.
 */

const DEFAULT_AI_SERVICE_URL = "http://localhost:8000";
const DEFAULT_INTERNAL_KEY = "dev-internal-secret-key-change-in-production";
const DEFAULT_TIMEOUT_MS = 10000;

export class AIServiceClient {
  constructor(options = {}) {
    this._customBaseUrl = options.baseUrl;
    this._customApiKey = options.apiKey;
    this._customTimeoutMs = options.timeoutMs;
  }

  getBaseUrl() {
    return (
      this._customBaseUrl ||
      process.env.AI_SERVICE_URL ||
      DEFAULT_AI_SERVICE_URL
    ).replace(/\/+$/, "");
  }

  getApiKey() {
    return (
      this._customApiKey ||
      process.env.AI_INTERNAL_API_KEY ||
      DEFAULT_INTERNAL_KEY
    );
  }

  getTimeoutMs() {
    return (
      this._customTimeoutMs ||
      parseInt(process.env.AI_SERVICE_TIMEOUT_MS || `${DEFAULT_TIMEOUT_MS}`, 10)
    );
  }

  setBaseUrl(url) {
    this._customBaseUrl = url;
  }

  /**
   * Evaluates student message for crisis and safety signals via Python AI service.
   *
   * Adheres strictly to the safety contract:
   * - SUCCESS with 0 risks -> riskDetected: false
   * - SUCCESS with 1+ risks -> riskDetected: true
   * - Failure / timeout / unavailable / malformed -> riskDetected: null (NEVER false)
   * - Does not expose internal prompts or reflection tags
   * - Does not log sensitive student messages in full
   *
   * @param {string} message - Student text to analyze
   * @returns {Promise<{
   *   analysisStatus: "SUCCESS" | "FAILED" | "UNAVAILABLE" | "TIMEOUT" | "MALFORMED_OUTPUT",
   *   riskDetected: boolean | null,
   *   risks: Array<{
   *     subject: string,
   *     type: string,
   *     severity: string,
   *     imminence: string,
   *     features: string[]
   *   }>,
   *   modelName: string,
   *   error: string | null
   * }>}
   */
  async analyzeRisk(message) {
    if (typeof message !== "string" || !message.trim()) {
      return {
        analysisStatus: "FAILED",
        riskDetected: null,
        risks: [],
        modelName: "nope-edge",
        error: "Message must be a non-empty string.",
      };
    }

    const trimmed = message.trim();
    const baseUrl = this.getBaseUrl();
    const apiKey = this.getApiKey();
    const timeoutMs = this.getTimeoutMs();
    const endpoint = `${baseUrl}/api/v1/nope/analyze`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-API-Key": apiKey,
        },
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorDetail = `AI Service returned HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.error?.message) {
            errorDetail = errJson.error.message;
          } else if (errJson?.detail) {
            errorDetail =
              typeof errJson.detail === "string"
                ? errJson.detail
                : JSON.stringify(errJson.detail);
          }
        } catch {
          // ignore JSON parse failure on non-JSON error pages
        }

        return {
          analysisStatus: response.status >= 500 ? "UNAVAILABLE" : "FAILED",
          riskDetected: null,
          risks: [],
          modelName: "nope-edge",
          error: errorDetail,
        };
      }

      const data = await response.json();

      const analysisStatus = data.analysis_status || "SUCCESS";
      let riskDetected =
        data.risk_detected !== undefined ? data.risk_detected : null;

      // Critical safety invariant: non-SUCCESS must never be coerced to false
      if (analysisStatus !== "SUCCESS") {
        riskDetected = null;
      }

      const risks = Array.isArray(data.risks)
        ? data.risks.map((item) => ({
            subject: item.subject || "self",
            type: item.type || "general_distress",
            severity: item.severity || "moderate",
            imminence: item.imminence || "subacute",
            features: Array.isArray(item.features) ? item.features : [],
          }))
        : [];

      return {
        analysisStatus,
        riskDetected,
        risks,
        modelName: data.model_name || "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
        error: data.error || null,
      };
    } catch (err) {
      clearTimeout(timer);

      if (err.name === "AbortError" || err.code === 20) {
        return {
          analysisStatus: "TIMEOUT",
          riskDetected: null,
          risks: [],
          modelName: "nope-edge",
          error: `AI Service request timed out after ${timeoutMs}ms`,
        };
      }

      return {
        analysisStatus: "UNAVAILABLE",
        riskDetected: null,
        risks: [],
        modelName: "nope-edge",
        error: `Could not connect to AI Service: ${err.message}`,
      };
    }
  }
}

export const aiServiceClient = new AIServiceClient();
export default aiServiceClient;
