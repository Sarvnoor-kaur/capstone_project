"""Development-only internal testing endpoints for AI capabilities."""

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.services.nope_edge.detector import NOPEEdgeDetector
from app.services.nope_edge.schemas import NOPEAnalysisResult

router = APIRouter()

# Reusable internal detector instance for development testing
_detector = NOPEEdgeDetector()


def get_internal_detector() -> NOPEEdgeDetector:
    """Retrieve the internal detector instance (allows test overrides)."""
    return _detector


def set_internal_detector(detector: NOPEEdgeDetector) -> None:
    """Override detector instance for testing with mocks."""
    global _detector
    _detector = detector


class NOPETestRequest(BaseModel):
    """Payload for internal NOPE Edge testing."""

    model_config = ConfigDict(populate_by_name=True)

    message: str = Field(
        ...,
        description="Text message to evaluate for safety risks with NOPE Edge",
        examples=["I have been feeling hopeless lately."],
    )

    @field_validator("message")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Message cannot be empty or solely whitespace.")
        return v.strip()


@router.post(
    "/analyze",
    response_model=NOPEAnalysisResult,
    summary="Test NOPE Edge safety analysis (Dev only)",
    description=(
        "Internal development-only endpoint to test and verify NOPE Edge risk detection "
        "using Postman or local HTTP clients without external dependencies."
    ),
)
async def test_nope_analyze(payload: NOPETestRequest) -> NOPEAnalysisResult:
    """Run message through internal NOPEEdgeDetector and return structured result."""
    detector = get_internal_detector()
    return await detector.analyze_async(payload.message)
