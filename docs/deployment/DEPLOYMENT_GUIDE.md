# Deployment Guide

## Environments
Use development, staging and production. Do not use real student data in non-production without an approved process.

## Local
Docker Compose should run Next.js, FastAPI and PostgreSQL+pgvector. Document ports, health checks, volumes, startup order and migration commands.

## Configuration
Use environment variables for database URLs, session secrets, internal service credentials, LLM credentials and model settings. `.env.example` contains placeholders only. Never expose secrets through `NEXT_PUBLIC_*`.

## Database
Back up before migrations; review Prisma migrations; use least-privilege credentials; test restore; never run destructive reset commands on shared/production DB.

## Production
HTTPS, secure cookies, private FastAPI access, secret manager, managed DB/backups, redacted logs, health checks, monitoring, dependency patching and rollback procedure.

## Release checklist
Tests pass; env verified; backup available; migrations reviewed; no secrets in image/source; provider privacy reviewed; safety operations approved for intended use; monitoring/rollback ready; release version recorded.

Hosting provider is undecided. Choose based on budget, privacy/data-region requirements, model compute, availability and institutional rules. Kubernetes is not initially required.
