# Changelog

## Unreleased
- Initial documentation baseline.
- Architecture baseline: Next.js UI and primary backend, separate Python FastAPI AI service, PostgreSQL+pgvector, Prisma, REST and Docker Compose.
- Predictive risk modelling deferred pending dataset and validation feasibility.
- AI components remain modules in one FastAPI service.

### 2026-11-21
- Added:
  - Completed Phase AI-2 (Schemas, Auth & Preprocessing):
    - Pydantic models for safety analysis, topic classification, PHQ-9/GAD-7 screening, and chat orchestration.
    - SafetyState (`NORMAL`, `ELEVATED`, `URGENT`, `UNAVAILABLE`) and SafetyAction enums.
    - Constant-time service-to-service API key authentication (`X-Internal-API-Key`).
    - Input preprocessing service with Unicode NFKC normalization, control character stripping, max length enforcement, and strictly preserved negations.
    - Sliding window rate limiting middleware (120 req/min per IP, health endpoints exempt).
    - Request timeout middleware enforcing `REQUEST_TIMEOUT_SECONDS` with 504 error response.
    - Authenticated endpoint stubs: `POST /api/v1/safety/analyze`, `POST /api/v1/classification/predict`, `POST /api/v1/screening/analyze`, and `POST /api/v1/chat/generate`.
    - Comprehensive unit and integration test suite (34 passing tests, 0 ruff errors, 0 mypy issues).
  - Comprehensive AI Server Implementation Plan covering 7 build phases (AI-1 through AI-7).
  - 50+ granular AI server tasks added to TASK_TRACKER.md.
  - ADR-007: Standalone AI server development-first strategy.
  - ADR-008: Keep existing Node.js/Express backend for application logic.
  - Full API contract specifications (health, safety, classification, chat) with request/response schemas.
  - Safety-first processing pipeline design.
  - Directory structure for `ai-service/`.
  - Open decisions register (D-AI-1 through D-AI-6) and risk register for AI phase.
  - Completed Phase AI-1 (Skeleton & Infrastructure): scaffolded standalone `ai-service/` with FastAPI, Pydantic settings, structured logging, RequestIDMiddleware, standardized error responses, health/readiness endpoints, Dockerfile, docker-compose (pgvector), Pytest suite, Ruff linting, and Mypy type validation.

## Entry template
### YYYY-MM-DD
- Added:
- Changed:
- Fixed:
- Security:
- Migration/compatibility notes:
