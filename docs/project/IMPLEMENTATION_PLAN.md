# Implementation Plan

Build one testable vertical slice at a time; do not ask an agent to implement the entire SRS in one operation.

## Phase 0 — Decisions and baseline
Confirm institution scope, age eligibility, LLM provider/budget, dataset, professional reviewer, retention and crisis operations. Create repository and docs.
Exit: baseline and open decisions recorded.

## Phase 1 — Skeleton
Scaffold Next.js and FastAPI; Docker Compose; health endpoints; service communication; lint/test commands.
Exit: services start locally.

## Phase 2 — Database and identity
Review Prisma schema; migrations; authentication/session; roles/ownership; consent.
Exit: secure login and isolation tests pass.

## Phase 3 — Core workflows
Dashboard, chat persistence, assessment UI/scoring, mood, resources, referral request.
Exit: core workflows work without advanced AI.

## Phase 4 — AI foundation (Standalone AI Server)
> **Active phase.** Full plan: see `AI_SERVER_IMPLEMENTATION_PLAN.md` artifact and AI Server tasks in `TASK_TRACKER.md`.

Build the Python FastAPI AI server (`ai-service/`) as a standalone service. Seven sub-phases:
- **AI-1:** Skeleton — FastAPI app, health endpoints, Docker, linting, testing setup.
- **AI-2:** Schemas, auth & preprocessing — Pydantic contracts, service auth, input validation, stub endpoints.
- **AI-3:** Safety module — Rule-based crisis detection, failure handling, fallback responses.
- **AI-4:** Topic classification — Dataset feasibility, classifier (trained or zero-shot), uncertainty handling.
- **AI-5:** RAG foundation — pgvector setup, embeddings, ingestion pipeline, source governance.
- **AI-6:** LLM integration & chat — Gemini adapter, prompt templates, full pipeline orchestration, output validation.
- **AI-7:** Hardening — Load testing, prompt injection testing, privacy review, contract tests.

Exit: AI server passes all standalone tests, safety tests, and contract tests. Ready for integration.

## Phase 5 — Integration (AI Server ↔ Node.js Backend)
Connect the validated AI server with the existing Express backend via internal REST.
Define service authentication, timeouts, error mapping, and end-to-end chat flow.
Exit: chat messages flow from browser → Express → FastAPI → response, with safety handling.

## Phase 6 — Safety and NLP (Post-Integration)
Dataset feasibility; professional-reviewed safety rules/workflow; evaluate safety; add classifier only if data supports it.
Exit: documented evaluation and approved safety behavior.

## Phase 7 — RAG (Post-Integration)
Approve sources; ingestion, chunking, embeddings, pgvector retrieval, provenance and evaluation.
Exit: approved-source retrieval tests pass.

## Phase 7 — Counsellor/admin
Assigned referral views, transitions, audit trail, resource approval.
Exit: role isolation and workflow tests pass.

## Phase 8 — Hardening/release
Security, E2E, load/failure tests, deployment, backup/restore, monitoring, docs and demo.
Exit: release checklist complete.

Voice, image, mobile, multilingual, predictive risk modelling, Kubernetes and advanced analytics are deferred unless explicitly approved.
