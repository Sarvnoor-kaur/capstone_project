# Authentication, Privacy and Security

## Principles
Least privilege, server-side authorization, data minimization, secure defaults, transparent consent and auditable sensitive actions.

## Authentication
Select a vetted auth/session implementation before coding. If local passwords are used, hash with a suitable algorithm such as Argon2id; never store plaintext. Use secure server-managed sessions, HTTP-only cookies, Secure in production, appropriate SameSite, logout invalidation and rate limits.

## Authorization
Roles: STUDENT, COUNSELLOR, ADMIN. Role checks alone are insufficient. Students access their own records; counsellors only assigned referrals and explicitly shared information. Admin access to sensitive content must be minimized and audited.

## Service security
FastAPI is private. Authenticate Next.js-to-FastAPI calls with server-side credentials or deployment identity. Never expose credentials to browser code. Apply timeouts, request limits and strict schemas.

## Data protection
HTTPS in production; encryption at rest where supported; secrets manager/environment variables; no `.env` or secrets in Git; no raw sensitive content in ordinary logs; synthetic development fixtures.

## LLM privacy
Review provider retention, training use, region, subprocessors, contractual terms and privacy controls. Send minimum necessary context. Avoid direct identifiers unless justified and approved.

## Consent/retention
Version consent and record withdrawal. Define retention/deletion by data category before production. Do not promise immediate erasure without accounting for backups, audit and legal obligations.

## Threats to test
Broken access control/IDOR, session attacks, brute force, injection, XSS, CSRF where applicable, prompt injection, sensitive-data leakage, SSRF/document ingestion, dependency vulnerabilities and secret exposure.
