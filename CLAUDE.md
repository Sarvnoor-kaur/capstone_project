# Claude Code Instructions

Read this file and the relevant `docs/` files before changing code.

## Project baseline
- Next.js App Router + React + TypeScript: frontend and primary backend.
- Next.js Route Handlers: browser-facing APIs.
- Python + FastAPI: separate AI service.
- PostgreSQL + pgvector: relational and vector storage.
- Prisma: application ORM and migrations, owned by Next.js.
- REST: Next.js-to-FastAPI communication.
- Docker Compose: local orchestration.
- Tests: Vitest, React Testing Library, Playwright, Pytest.

## Architecture rules
1. Next.js owns UI, authentication, sessions, authorization, business workflows, and application database writes.
2. FastAPI owns AI processing: NLP, safety analysis, embeddings, RAG orchestration, and LLM integration.
3. Browser code must never call the private AI service or receive its secret.
4. AI service must not manage users, roles, permissions, referrals, or authoritative application records.
5. Keep AI components as modules in one FastAPI service. Do not create separate microservices without an approved reason.
6. Use `/api/v1/` for APIs. Use UUID IDs and UTC timestamps by default.
7. Do not add Express/NestJS, Redis, queues, Kubernetes, Terraform, or another database without documenting the need and getting approval.

## Safety and privacy rules
- This is a support tool, not diagnosis, therapy replacement, or emergency service.
- PHQ-9/GAD-7 results are screening results, not diagnoses.
- LLM must never be the sole safety detector or crisis decision-maker.
- Safety-service failure must never silently become NORMAL; represent unavailable explicitly and follow an approved fallback.
- Do not invent emergency numbers, professional credentials, datasets, model metrics, sources, or clinical claims.
- Do not use real student data in development fixtures, notebooks, screenshots, or logs.
- Minimize personal data sent to external LLMs. Do not log raw sensitive messages by default.
- Do not claim human monitoring or notification unless operationally confirmed.

## Engineering rules
- Inspect existing code before editing.
- Implement one bounded feature at a time.
- Keep route handlers thin; put business logic in services/domain modules.
- Validate all inputs and AI-service responses.
- Enforce role checks and record ownership server-side.
- Use Prisma migrations; never reset valuable databases.
- Add tests for normal and failure paths.
- Never hardcode secrets or commit `.env`, private datasets, or model weights.
- Do not claim a model is trained when it is only a placeholder/rule-based component.

## Task workflow
1. Identify relevant requirement IDs and docs.
2. Inspect existing implementation and tests.
3. Propose a short plan and state assumptions.
4. Ask before changing architecture, safety policy, privacy, database semantics, or API contracts.
5. Implement the smallest complete change.
6. Add/update tests and run lint/type/build/test checks.
7. Report changed files, test results, limitations, and unresolved decisions.
8. Update docs when approved decisions change.

If docs conflict, report the conflict; do not silently choose. Record approved decisions in `docs/architecture/DECISION_LOG.md`.
