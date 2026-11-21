# Architecture

## Decision
Monorepo with two deployable application services:
1. `frontend/`: Next.js App Router for UI and primary backend.
2. `ai-service/`: Python FastAPI for AI processing.
PostgreSQL is primary DB; pgvector stores knowledge embeddings. Docker Compose runs local services.

## Responsibilities
**Next.js:** UI, Route Handlers, authentication, sessions, RBAC, ownership checks, application workflows, Prisma access, referrals/consent, calls to AI service.

**FastAPI:** preprocessing, topic classification inference, safety analysis, embeddings/RAG orchestration, LLM integration, output validation, AI health/model metadata.

**PostgreSQL/pgvector:** application records and approved knowledge chunks. Application records are written through Next.js/Prisma. If Python needs vector access, use a least-privilege DB role or controlled retrieval interface.

## Request flow
Browser -> Next.js (authenticate, authorize, validate) -> private FastAPI (service authentication) -> structured response -> Next.js validates, applies application policy, persists authorized records -> browser.

## Safety ordering
Safety checks run early and independently. Urgent safety handling must not wait for classification, RAG, or LLM. LLM is not the safety authority. Safety failure remains unavailable/unknown.

## Deployment
Local: Docker Compose with Next.js, FastAPI, PostgreSQL+pgvector. Production: separately deployable Next.js and FastAPI, managed DB where feasible, HTTPS, secret management, backups, monitoring. Kubernetes is not initially required.

## Constraints
No separate Express/Nest backend; no separate AI microservice per module initially; no extra database without approval; no AI-owned application authorization.
