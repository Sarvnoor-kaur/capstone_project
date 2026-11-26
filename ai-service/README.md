# Mental Health Platform — AI Service

FastAPI-powered standalone AI service for mental health support conversations, safety analysis, topic classification, and grounded retrieval (RAG).

## Architecture Boundaries

As defined in the project baseline and `CLAUDE.md`:
1. **Next.js / Node.js Backend**: Owns browser UI, sessions, authentication, authorization, business workflows, and application records.
2. **AI Service (FastAPI)**: Owns AI processing — NLP, safety analysis, embeddings, RAG orchestration, and LLM integration.
3. Browser code **never** calls this private AI service directly.
4. AI service **never** manages users, roles, permissions, or authoritative application records.
5. All AI components reside in this single FastAPI service as modules.

## Features & Roadmap

- **Phase AI-1 (Current)**: Skeleton & infrastructure, configuration, structured logging, request ID propagation, health/readiness endpoints, Docker setup, and testing setup.
- **Phase AI-2**: Pydantic schemas, service auth, input preprocessing, stub endpoints.
- **Phase AI-3**: Safety analysis module (crisis keywords, negations, state transitions, fallbacks).
- **Phase AI-4**: Topic classification.
- **Phase AI-5**: RAG foundation with PostgreSQL + pgvector.
- **Phase AI-6**: LLM integration with Gemini adapter & safety guardrails.
- **Phase AI-7**: Hardening, load tests, and contract validation.

## Local Setup

### Prerequisites
- Python 3.11+
- pip

### 1. Environment Setup
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
python -m pip install -r requirements-dev.txt
```

### 3. Run Locally
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Running with Docker Compose

To run the AI service along with PostgreSQL + pgvector:
```bash
docker compose up --build
```

The service will be reachable at `http://localhost:8000`.

## Testing & Quality Assurance

Run test suite:
```bash
python -m pytest
```

Run linting with Ruff:
```bash
python -m ruff check .
```

Run type checks with mypy:
```bash
python -m mypy app
```

## Endpoints

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Liveness health check | Public / Internal |
| `GET` | `/readiness` | Readiness probe (checks dependencies) | Public / Internal |
| `GET` | `/api/v1/health` | Prefixed health check | Public / Internal |
| `GET` | `/api/v1/readiness` | Prefixed readiness probe | Public / Internal |
| `GET` | `/docs` | OpenAPI / Swagger interactive documentation | Development |
