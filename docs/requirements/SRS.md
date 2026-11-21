# Software Requirements Specification

## Purpose
Build a student-facing support platform with AI-assisted conversations, structured screening, curated resources, mood tracking, and optional counsellor referrals. It must not diagnose, prescribe, replace therapy, or claim to be an emergency service.

## Users
- Student: chat, complete screenings, track mood, browse resources, request counselling.
- Counsellor: view assigned referrals and update status.
- Admin: manage accounts and approved resources with restricted access to sensitive data.

## Approved stack
Next.js App Router + React + TypeScript; Next.js Route Handlers; Tailwind CSS; React Hook Form; Zod; Prisma; PostgreSQL + pgvector; Python + FastAPI; PyTorch; Hugging Face Transformers; scikit-learn; pandas; NumPy; Sentence Transformers; LLM API; REST; Docker Compose; Vitest, Playwright, Pytest.

## Architecture boundary
Next.js owns UI, authentication, authorization, application workflows, and application records through Prisma. FastAPI owns AI processing and returns structured results. Browser must not call private AI service. AI service must not control permissions or referral state.

## Functional requirements
- FR-01 Register/login/logout users securely.
- FR-02 Support STUDENT, COUNSELLOR, ADMIN roles.
- FR-03 Enforce role authorization and record ownership on every protected operation.
- FR-04 Maintain versioned consent records and support withdrawal of optional consent.
- FR-05 Provide student dashboard, chat, assessment history, mood tracking, and resources.
- FR-06 Persist conversations subject to approved retention rules.
- FR-07 Send eligible chat messages from Next.js to FastAPI.
- FR-08 Provide topic classification only if dataset feasibility and evaluation support it; allow uncertain/unclassified.
- FR-09 Run safety analysis independently from topic classification and LLM generation.
- FR-10 Represent safety unavailable explicitly; never silently convert failure to NORMAL.
- FR-11 Provide PHQ-9 and GAD-7 using approved wording, versions, and scoring.
- FR-12 Treat screening as screening, not diagnosis; self-harm-related answers trigger approved safety workflow independent of total score.
- FR-13 Start with transparent, professionally reviewed support-routing rules, not predictive ML risk scores.
- FR-14 Retrieve only approved/current knowledge-base content and preserve source metadata.
- FR-15 Validate LLM output; LLM cannot diagnose, prescribe, authorize access, or change referrals/safety state.
- FR-16 Allow mood entries and history.
- FR-17 Allow students to request referrals with explicit information-sharing scope.
- FR-18 Counsellors can access only assigned referrals and update allowed statuses.
- FR-19 Admins can manage approved resources and permitted accounts; sensitive actions are audited.

## Non-functional requirements
HTTPS in production; secure password hashing if local passwords are used; secure sessions; least-privilege access; encryption at rest/in transit where supported; data minimization; no raw sensitive message logging by default; rate limiting; explicit failure handling; migrations and tests; responsive accessible UI (target WCAG 2.2 AA where practical).

## Provisional performance targets
Ordinary API p95 below 2 seconds; AI response target below 10 seconds where provider/model allows; initial load test 20–50 concurrent users. These are targets, not guarantees.

## AI constraints
Topic classification is not diagnosis. Safety is separate. Screening is not diagnosis. Predictive risk modelling is deferred until a suitable dataset, target definition, permissions, and evaluation plan exist. Synthetic data is for functional tests, not clinical model validation. Never fabricate metrics or sources.

## Core entities
Users, student_profiles, counsellor_profiles, consents, conversations, messages, assessment_definitions, assessment_questions, assessment_attempts, assessment_responses, assessment_results, safety_events, mood_entries, resources, knowledge_documents, knowledge_chunks, referrals, referral_updates, audit_logs.

## Error behavior
AI unavailable: controlled fallback. Safety unavailable: explicit unavailable state and approved fallback. Classifier failure: unclassified. RAG failure: do not invent sources. LLM failure: safe fallback. DB failure: controlled error. Invalid input: validation error. Unauthorized: 401/403.

## Out of scope initially
Native mobile, voice/image analysis, multilingual support, predictive risk modelling, XGBoost/LightGBM risk prediction, SHAP, Kubernetes, distributed microservices, continuous monitoring.

## Open decisions
Institution scope, dataset rights/quality, LLM provider/budget, professional reviewer, crisis operations, retention, age eligibility, questionnaire permissions, hosting, and production scale. Do not silently invent answers.
