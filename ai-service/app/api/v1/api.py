"""Aggregation of API v1 routes."""

from fastapi import APIRouter

from app.api.v1.endpoints import chat, classification, health, nope, safety, screening

api_router = APIRouter()

# Unauthenticated health probes
api_router.include_router(health.router, tags=["Health"])

# Authenticated internal AI endpoints
api_router.include_router(
    nope.router, prefix="/nope", tags=["NOPE Edge Risk Analysis"]
)
api_router.include_router(safety.router, prefix="/safety", tags=["Safety Analysis"])
api_router.include_router(
    classification.router, prefix="/classification", tags=["Topic Classification"]
)
api_router.include_router(screening.router, prefix="/screening", tags=["Screening"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat Orchestration"])
