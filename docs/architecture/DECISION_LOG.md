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

## Pending
LLM provider/budget; dataset; institution scope; age eligibility; professional reviewer; crisis operations; retention; hosting; Python vector-access pattern.
