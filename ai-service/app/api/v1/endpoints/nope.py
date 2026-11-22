"""NOPE Edge safety analysis endpoint under API v1."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.auth import verify_api_key
from app.services.nope_edge.detector import NOPEEdgeDetector
from app.services.nope_edge.schemas import NOPEAnalysisResult

router = APIRouter(dependencies=[Depends(verify_api_key)])

# Reusable detector instance (singleton per process, injectable for testing)
_detector: NOPEEdgeDetector | None = None


def get_nope_detector() -> NOPEEdgeDetector:
    """Retrieve or initialize the NOPEEdgeDetector singleton."""
    global _detector
    if _detector is None:
        _detector = NOPEEdgeDetector()
    return _detector


def set_nope_detector(detector: NOPEEdgeDetector | None) -> None:
    """Override the detector instance for testing or dependency injection."""
    global _detector
    _detector = detector


class NOPEAnalyzeRequest(BaseModel):
    """Payload for NOPE Edge safety risk assessment."""

    model_config = ConfigDict(populate_by_name=True)

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Text message to evaluate for distress and safety signals",
        examples=["I have been feeling hopeless lately."],
    )

    @field_validator("message")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        """Reject empty or whitespace-only message payloads."""
        if not v or not v.strip():
            raise ValueError("Message cannot be empty or solely whitespace.")
        return v.strip()


@router.post(
    "/analyze",
    response_model=NOPEAnalysisResult,
    summary="Evaluate message for safety risks using NOPE Edge",
    description=(
        "Internal authenticated endpoint that evaluates input message for crisis and safety "
        "signals using the local NOPE Edge model runtime via Ollama."
    ),
)
async def analyze_message(
    payload: NOPEAnalyzeRequest,
    detector: NOPEEdgeDetector = Depends(get_nope_detector),
) -> NOPEAnalysisResult:
    """Evaluate message asynchronously using NOPEEdgeDetector and return structured result."""
    return await detector.analyze_async(payload.message)
