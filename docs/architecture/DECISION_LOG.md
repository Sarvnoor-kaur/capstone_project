# Architecture Decision Log

Append decisions; do not erase history.

## ADR-001: Next.js frontend and primary backend
Status: ACCEPTED. Use Next.js App Router, React, TypeScript and Route Handlers. Reason: reduce infrastructure and language duplication. Consequence: keep handlers thin and avoid long-running AI jobs in request handlers.

## ADR-002: Separate Python AI service
Status: ACCEPTED. Use one FastAPI service for AI processing. Consequence: REST contracts, service authentication, timeouts and failure handling required.

## ADR-003: PostgreSQL + pgvector
Status: ACCEPTED. Use one PostgreSQL platform for relational data and vector search. Consequence: least-privilege access for AI vector operations.

## ADR-004: Prisma owns application data access
Status: ACCEPTED. Next.js uses Prisma and migrations. Python must not independently write application workflow records.

## ADR-005: Modular AI service
Status: ACCEPTED. Classification, safety, RAG and LLM are modules in one FastAPI deployment, not separate deployable microservices.

## ADR-006: Rules before predictive risk model
Status: ACCEPTED. Start with transparent reviewed rules. Defer predictive risk modelling until dataset, target, rights and evaluation are established.

## ADR-007: Standalone AI server development-first strategy
Status: ACCEPTED. Date: 2026-11-21. Build and validate the Python FastAPI AI server (`ai-service/`) as a standalone service before integrating with the Node.js backend. Reason: the existing backend uses Express + MongoDB (not Next.js + Prisma as originally planned); building the AI server independently avoids coupling, enables parallel testing, and allows the AI pipeline (safety, classification, RAG, LLM) to be validated in isolation. The Node.js backend will call the AI server via internal REST once both sides are ready. Consequence: AI server must have its own Docker Compose, health checks, mock/stub endpoints, and standalone test suite. Integration phase is deferred.

## ADR-008: Keep existing Node.js/Express backend for application logic
Status: ACCEPTED. Date: 2026-11-21. The existing Express + MongoDB backend continues to own user authentication, sessions, CRUD operations, mood tracking, support requests, and resource management. The docs reference Next.js but the working codebase uses Express; we build on what exists rather than rewriting. Consequence: the AI server communicates with Express (not Next.js) via REST. API contracts remain the same regardless of the application backend framework.

## Pending
LLM provider/budget; dataset; institution scope; age eligibility; professional reviewer; crisis operations; retention; hosting; Python vector-access pattern.
