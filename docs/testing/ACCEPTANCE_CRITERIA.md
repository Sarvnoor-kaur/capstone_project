# Acceptance Criteria

## MVP checklist
- [ ] Docker Compose starts local services.
- [ ] Next.js and FastAPI health checks work.
- [ ] PostgreSQL and Prisma migrations work.
- [ ] Authentication/session flow works.
- [ ] Role and record ownership prevent cross-user access.
- [ ] Student can create conversations and exchange messages.
- [ ] Chat persists under approved retention rules.
- [ ] FastAPI calls use private service authentication.
- [ ] AI failures are handled explicitly.
- [ ] PHQ-9/GAD-7 use reviewed versions and scoring.
- [ ] Safety workflow has professional approval and failure tests before real use.
- [ ] RAG retrieves approved sources with traceable metadata.
- [ ] LLM cannot change privileged application state.
- [ ] Mood entries work.
- [ ] Student can request referral with sharing consent.
- [ ] Counsellor sees only assigned referrals.
- [ ] Admin manages approved resources.
- [ ] Sensitive access is restricted and audited.
- [ ] Tests/build pass.
- [ ] Deployment, backup/restore and rollback are documented.

## Feature acceptance template
Requirement IDs; user story; preconditions; expected behavior; authorization; validation; failure behavior; tests; documentation; reviewer; status.

A working endpoint does not prove model quality or clinical validity.
