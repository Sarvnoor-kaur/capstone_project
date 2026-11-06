# Testing Strategy

## Test layers
- Unit: domain functions, validation, scoring, state transitions, preprocessing.
- Integration: Prisma/database, Next.js-to-FastAPI contracts, vector retrieval.
- E2E: student, counsellor and admin journeys.
- AI evaluation: classifier, safety, RAG and LLM quality.
- Security: authorization, leakage, injection and abuse controls.

## Tools
Vitest + React Testing Library; Playwright; Pytest; FastAPI OpenAPI/contract tests; ESLint/TypeScript; Ruff.

## Required scenarios
Auth/session lifecycle; role/ownership isolation; chat persistence and AI failure; assessment version/scoring; safety urgent/unavailable; approved-source filtering; LLM timeout/malformed output; referral assignment/transitions; resource approval/withdrawal; retention/deletion behavior once policy is approved.

## Test data
Use synthetic users/messages/assessments/referrals. Never use real student data in fixtures. Keep secrets out of logs.

## CI
Run lint, type checks, unit tests, relevant integration tests and build checks on pull requests. Run E2E and AI evaluation suites on appropriate release gates.

A feature is not complete because the page renders. Tests, access control and failure paths must pass.
