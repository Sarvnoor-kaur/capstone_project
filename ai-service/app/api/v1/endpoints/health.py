"""Health and readiness probe endpoints."""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, status

from app.config import Settings, get_settings
from app.schemas.common import HealthResponse, ReadinessResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check / Liveness probe",
    description="Check whether the AI service is live and responding.",
)
async def get_health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """Return basic health status of the service."""
    return HealthResponse(
        status="ok",
        version=settings.APP_VERSION,
        timestamp=datetime.now(UTC).isoformat(),
        service=settings.APP_NAME,
    )


@router.get(
    "/readiness",
    response_model=ReadinessResponse,
    status_code=status.HTTP_200_OK,
    summary="Readiness check / Readiness probe",
    description="Check whether the service and its internal components are initialized and ready to serve traffic.",
)
async def get_readiness(settings: Settings = Depends(get_settings)) -> ReadinessResponse:
    """Check readiness of dependencies and internal modules."""
    # Check status of configured components (stubs for AI-1, updated in later phases)
    checks = {
        "configuration": "ready",
        "safety_module": "ready",
        "database": "unconfigured" if settings.POSTGRES_SERVER == "localhost" else "configured",
    }
    return ReadinessResponse(
        status="ready",
        checks=checks,
        timestamp=datetime.now(UTC).isoformat(),
        service=settings.APP_NAME,
    )
