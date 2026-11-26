# Task Tracker

Statuses: NOT_STARTED, IN_PROGRESS, BLOCKED, IN_REVIEW, DONE. Do not mark DONE without implementation evidence/tests/review.

---

## Existing Backend/Frontend Tasks

| ID | Task | Phase | Status | Notes |
|---|---|---:|---|---|
| T-001 | Confirm open decisions | 0 | NOT_STARTED | See SRS and KNOWN_ISSUES |
| T-002 | Initialize monorepo | 1 | NOT_STARTED | |
| T-003 | Scaffold Next.js | 1 | NOT_STARTED | |
| T-004 | Scaffold FastAPI | 1 | NOT_STARTED | |
| T-005 | Configure Docker Compose | 1 | NOT_STARTED | |
| T-006 | Review and define Prisma schema | 2 | NOT_STARTED | |
| T-007 | Implement auth/RBAC | 2 | NOT_STARTED | |
| T-008 | Implement chat persistence | 3 | NOT_STARTED | |
| T-009 | Implement screening | 3 | NOT_STARTED | Professional review |
| T-010 | Implement mood/referral | 3 | NOT_STARTED | |
| T-011 | Define AI contracts | 4 | NOT_STARTED | |
| T-012 | Dataset feasibility review | 5 | NOT_STARTED | Do not assume dataset exists |
| T-013 | Approve safety protocol | 5 | NOT_STARTED | Blocker for real users |
| T-014 | Implement RAG | 6 | NOT_STARTED | Approved sources only |
| T-015 | Counsellor/admin workflows | 7 | NOT_STARTED | |
| T-016 | Security and E2E testing | 8 | NOT_STARTED | |

---

## AI Server Tasks (Standalone Python Service — `ai-service/`)

> Build and test independently before integrating with Node.js backend.

### Phase AI-1: Skeleton & Infrastructure
| ID | Task | Status | Notes |
|---|---|---|---|
| T-AI-101 | Create `ai-service/` directory structure | DONE | Scaffolded complete app/ and tests/ hierarchy |
| T-AI-102 | Set up `pyproject.toml`, `requirements.txt`, `requirements-dev.txt` | DONE | FastAPI, Uvicorn, Pydantic, Pytest, Ruff, Mypy |
| T-AI-103 | Create FastAPI app entry point (`app/main.py`) | DONE | Lifespan, CORS, middlewares, error handlers |
| T-AI-104 | Implement `GET /health` and `GET /readiness` endpoints | DONE | Root & /api/v1/ versions implemented |
| T-AI-105 | Implement config loading from env vars (`app/config.py`) | DONE | Pydantic BaseSettings with .env support |
| T-AI-106 | Add error handling middleware and standard error response | DONE | Standard error envelope with requestId |
| T-AI-107 | Add request ID middleware and structured logging | DONE | X-Request-ID propagation & privacy guardrails |
| T-AI-108 | Create `Dockerfile` and `docker-compose.yml` | DONE | AI service + PostgreSQL 16 pgvector |
| T-AI-109 | Create `.env.example`, `.gitignore`, `README.md` | DONE | Documented boundaries, setup, commands |
| T-AI-110 | Set up Pytest with health endpoint test | DONE | 7 unit & integration tests passing |
| T-AI-111 | Configure Ruff + mypy linting | DONE | Ruff and mypy passing with 0 errors |

### Phase AI-2: Schemas, Auth & Preprocessing
| ID | Task | Status | Notes |
|---|---|---|---|
| T-AI-201 | Define all Pydantic request/response schemas | DONE | Safety, classification, chat, screening schemas defined with strict typing |
| T-AI-202 | Define safety states enum (NORMAL, ELEVATED, URGENT, UNAVAILABLE) | DONE | SafetyState and SafetyAction enums implemented |
| T-AI-203 | Implement service-to-service API key auth | DONE | Constant-time header check via X-Internal-API-Key with 401 rejection |
| T-AI-204 | Implement input preprocessing (normalize, validate, length limit) | DONE | NFKC normalization, whitespace collapsing, control/invisible char sanitization, preserves negations |
| T-AI-205 | Add request rate limiting middleware | DONE | In-memory sliding window rate limiter (120 req/min), health exempt, 429 response |
| T-AI-206 | Add request timeout configuration | DONE | Timeout middleware enforcing REQUEST_TIMEOUT_SECONDS with 504 response |
| T-AI-207 | Stub all API endpoints with mock responses | DONE | /safety/analyze, /classification/predict, /screening/analyze, /chat/generate stubs with full schema validation |

### Phase AI-3: Safety Analysis Module
| ID | Task | Status | Notes |
|---|---|---|---|
| T-AI-301 | Implement rule-based safety keyword/pattern detection | NOT_STARTED | Most critical module |
| T-AI-302 | Handle indirect/ambiguous distress signals | NOT_STARTED | |
| T-AI-303 | Handle negation and quoted speech correctly | NOT_STARTED | "I am NOT suicidal" → not flagged |
| T-AI-304 | Handle misspellings and informal language | NOT_STARTED | Fuzzy matching |
| T-AI-305 | Implement safety state transitions | NOT_STARTED | NORMAL → ELEVATED → URGENT |
| T-AI-306 | Implement safety service failure handling | NOT_STARTED | Failure → UNAVAILABLE + fallback |
| T-AI-307 | Add approved fallback responses per safety state | NOT_STARTED | |
| T-AI-308 | Write comprehensive safety tests | NOT_STARTED | See AI_SAFETY_TESTING.md |
| T-AI-309 | `POST /api/v1/safety/analyze` end-to-end | NOT_STARTED | |

### Phase AI-4: Topic Classification
| ID | Task | Status | Notes |
|---|---|---|---|
| T-AI-401 | Research dataset feasibility | NOT_STARTED | Relates to K-002 |
| T-AI-402 | Implement classifier (trained or zero-shot) | NOT_STARTED | Depends on dataset decision |
| T-AI-403 | Support UNCLASSIFIED / UNCERTAIN responses | NOT_STARTED | |
| T-AI-404 | Implement model registry with version tracking | NOT_STARTED | |
| T-AI-405 | Write classification evaluation tests | NOT_STARTED | Per-class metrics |
| T-AI-406 | `POST /api/v1/classification/predict` end-to-end | NOT_STARTED | |

### Phase AI-5: RAG Foundation
| ID | Task | Status | Notes |
|---|---|---|---|
| T-AI-501 | Set up PostgreSQL + pgvector in Docker Compose | NOT_STARTED | |
| T-AI-502 | Implement database connection layer | NOT_STARTED | Connection pooling |
| T-AI-503 | Implement embedding generation (sentence-transformers) | NOT_STARTED | |
| T-AI-504 | Build source ingestion pipeline | NOT_STARTED | Chunking + metadata |
| T-AI-505 | Implement vector store (insert + similarity search) | NOT_STARTED | |
| T-AI-506 | Add source governance (approval, version, expiry) | NOT_STARTED | Unapproved filtered out |
| T-AI-507 | Preserve provenance (source ID, title, URL) | NOT_STARTED | |
| T-AI-508 | Handle no-results (don't fabricate sources) | NOT_STARTED | |
| T-AI-509 | Write RAG evaluation tests | NOT_STARTED | |

### Phase AI-6: LLM Integration & Chat
| ID | Task | Status | Notes |
|---|---|---|---|
| T-AI-601 | Implement LLM provider adapter (Gemini API) | NOT_STARTED | Requires GEMINI_API_KEY |
| T-AI-602 | Build prompt templates with safety guardrails | NOT_STARTED | No diagnosis/prescription |
| T-AI-603 | Implement chat orchestration pipeline | NOT_STARTED | Safety → classify → RAG → LLM |
| T-AI-604 | Implement output validation | NOT_STARTED | Reject unsafe LLM output |
| T-AI-605 | Handle LLM failure/timeout with safe fallback | NOT_STARTED | |
| T-AI-606 | Include model versions + source metadata in response | NOT_STARTED | |
| T-AI-607 | `POST /api/v1/chat/generate` end-to-end | NOT_STARTED | Full pipeline |
| T-AI-608 | Write comprehensive chat integration tests | NOT_STARTED | All failure modes |

### Phase AI-7: Hardening & Standalone Validation
| ID | Task | Status | Notes |
|---|---|---|---|
| T-AI-701 | Load testing (20-50 concurrent requests) | NOT_STARTED | p95 < 10s target |
| T-AI-702 | Prompt injection testing | NOT_STARTED | |
| T-AI-703 | Privacy review (no PII leakage to LLM) | NOT_STARTED | |
| T-AI-704 | OpenAPI documentation verification | NOT_STARTED | Auto-generated Swagger |
| T-AI-705 | Write Node.js contract integration tests | NOT_STARTED | For future integration |
| T-AI-706 | Document all env vars and configuration | NOT_STARTED | |
| T-AI-707 | Final Docker image optimization | NOT_STARTED | |

---

Update this tracker as tasks change. Use an external issue tracker if task volume grows.
