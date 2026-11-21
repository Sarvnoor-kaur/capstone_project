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

## Phase 4 — AI foundation
Define schemas, internal authentication, timeouts, LLM adapter, output validation and failure handling.
Exit: controlled AI integration.

## Phase 5 — Safety and NLP
Dataset feasibility; professional-reviewed safety rules/workflow; evaluate safety; add classifier only if data supports it.
Exit: documented evaluation and approved safety behavior.

## Phase 6 — RAG
Approve sources; ingestion, chunking, embeddings, pgvector retrieval, provenance and evaluation.
Exit: approved-source retrieval tests pass.

## Phase 7 — Counsellor/admin
Assigned referral views, transitions, audit trail, resource approval.
Exit: role isolation and workflow tests pass.

## Phase 8 — Hardening/release
Security, E2E, load/failure tests, deployment, backup/restore, monitoring, docs and demo.
Exit: release checklist complete.

Voice, image, mobile, multilingual, predictive risk modelling, Kubernetes and advanced analytics are deferred unless explicitly approved.
