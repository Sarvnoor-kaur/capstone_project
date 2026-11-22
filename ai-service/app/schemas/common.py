"""Standardized response models conforming to API Specification."""


from pydantic import BaseModel, Field


class StandardErrorDetails(BaseModel):
    """Payload representing standard error information."""

    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable description of the error")
    requestId: str = Field(..., description="Correlation ID for request tracing")


class StandardErrorResponse(BaseModel):
    """Enveloping standard error response."""

    error: StandardErrorDetails


class HealthResponse(BaseModel):
    """Payload for the liveness health check."""

    status: str = Field(default="ok", description="Service health status")
    version: str = Field(..., description="Current service version")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp")
    service: str = Field(..., description="Service name")


class ReadinessResponse(BaseModel):
    """Payload for readiness probe verifying dependency availability."""

    status: str = Field(default="ready", description="Readiness indicator")
    checks: dict[str, str] = Field(default_factory=dict, description="Status of internal components")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp")
    service: str = Field(..., description="Service name")
