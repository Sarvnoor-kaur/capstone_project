"""Safety analysis endpoint stub (Phase AI-2)."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import verify_api_key
from app.schemas.safety import (
    SafetyAction,
    SafetyAnalysisRequest,
    SafetyAnalysisResponse,
    SafetyState,
)
from app.services.preprocessing import preprocess_text

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/analyze",
    response_model=SafetyAnalysisResponse,
    summary="Evaluate message for crisis or safety risks",
    description="Internal endpoint evaluating message against safety guardrails. Returns mock response in Phase AI-2.",
)
async def analyze_safety(request: SafetyAnalysisRequest) -> SafetyAnalysisResponse:
    """Preprocess input and return safety evaluation."""
    try:
        _ = preprocess_text(request.message)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        ) from e

    # Mock response stub adhering to Pydantic contract
    return SafetyAnalysisResponse(
        state=SafetyState.NORMAL,
        action=SafetyAction.PROCEED,
        flaggedKeywords=[],
        riskScore=0.02,
        fallbackResponse=None,
        modelVersion="mock-safety-rules-v0.1.0",
    )
