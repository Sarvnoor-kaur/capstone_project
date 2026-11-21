# API Specification

## Conventions
Application API prefix: `/api/v1`. JSON by default. Authenticate and authorize protected routes. Enforce record ownership. Validate inputs and AI responses. Do not expose stack traces or secrets.

## Standard error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be processed.",
    "requestId": "opaque-request-id"
  }
}
```

## Application endpoint inventory
| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | /api/v1/auth/register | Public | Register |
| POST | /api/v1/auth/login | Public | Login |
| POST | /api/v1/auth/logout | Authenticated | Logout |
| GET/PATCH | /api/v1/users/me | Authenticated | Read/update own profile |
| GET/POST | /api/v1/chat/conversations | Student | List/create own conversations |
| GET | /api/v1/chat/conversations/{id} | Owner | Read conversation |
| GET/POST | /api/v1/chat/conversations/{id}/messages | Owner | Read/send messages |
| GET | /api/v1/assessments | Authenticated | List instruments |
| GET | /api/v1/assessments/{type} | Authenticated | Get active version |
| POST | /api/v1/assessments/{type}/submit | Student | Submit attempt |
| GET | /api/v1/assessments/history | Student | Own history |
| POST/GET | /api/v1/mood | Student | Create/list own mood entries |
| GET | /api/v1/mood/summary | Student | Own trend summary |
| GET | /api/v1/resources | Authenticated | Browse approved resources |
| POST | /api/v1/referrals | Student | Request referral |
| GET | /api/v1/referrals | Authorized | List permitted referrals |
| PATCH | /api/v1/counsellor/referrals/{id} | Assigned counsellor | Update allowed status |
| GET/POST/PATCH | /api/v1/admin/resources | Admin | Manage resources |

This is an endpoint inventory, not a complete OpenAPI contract. Define exact schemas, status codes, pagination, idempotency and authorization before implementing each endpoint.

## Internal FastAPI endpoints
- GET `/api/v1/health`
- POST `/api/v1/safety/analyze`
- POST `/api/v1/classification/predict`
- POST `/api/v1/chat/generate`
- POST `/api/v1/screening/analyze` (only if needed)

Internal endpoints require service authentication, strict schemas, request limits and timeouts. Return explicit unavailable states. Include model versions where relevant. Return source metadata for RAG. Do not expose prompts or secrets.

Breaking contract changes require coordinated updates and tests.
