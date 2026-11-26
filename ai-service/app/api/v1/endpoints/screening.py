"""Screening scoring and safety check endpoint stub (Phase AI-2)."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import verify_api_key
from app.schemas.safety import SafetyState
from app.schemas.screening import (
    ScreeningAnalyzeRequest,
    ScreeningAnalyzeResponse,
    ScreeningInstrument,
    ScreeningSeverity,
)

router = APIRouter(dependencies=[Depends(verify_api_key)])


def _score_phq9(responses_map: dict[int, int]) -> tuple[int, ScreeningSeverity, bool, SafetyState]:
    """Score PHQ-9 responses with strict safety rule for Item 9 (self-harm)."""
    for q_id in range(1, 10):
        if q_id not in responses_map:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Missing required response for PHQ-9 question {q_id}.",
            )

    total_score = sum(responses_map[q_id] for q_id in range(1, 10))

    # FR-12: Self-harm-related answers trigger approved safety workflow independent of total score
    item_9_score = responses_map.get(9, 0)
    safety_flag = item_9_score > 0

    if total_score <= 4:
        severity = ScreeningSeverity.NONE_MINIMAL
    elif total_score <= 9:
        severity = ScreeningSeverity.MILD
    elif total_score <= 14:
        severity = ScreeningSeverity.MODERATE
    elif total_score <= 19:
        severity = ScreeningSeverity.MODERATELY_SEVERE
    else:
        severity = ScreeningSeverity.SEVERE

    if safety_flag:
        safety_state = SafetyState.URGENT
    elif severity in (ScreeningSeverity.MODERATELY_SEVERE, ScreeningSeverity.SEVERE):
        safety_state = SafetyState.ELEVATED
    else:
        safety_state = SafetyState.NORMAL

    return total_score, severity, safety_flag, safety_state


def _score_gad7(responses_map: dict[int, int]) -> tuple[int, ScreeningSeverity, bool, SafetyState]:
    """Score GAD-7 responses across 7 questions."""
    for q_id in range(1, 8):
        if q_id not in responses_map:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Missing required response for GAD-7 question {q_id}.",
            )

    total_score = sum(responses_map[q_id] for q_id in range(1, 8))

    if total_score <= 4:
        severity = ScreeningSeverity.NONE_MINIMAL
    elif total_score <= 9:
        severity = ScreeningSeverity.MILD
    elif total_score <= 14:
        severity = ScreeningSeverity.MODERATE
    else:
        severity = ScreeningSeverity.SEVERE

    safety_flag = False
    safety_state = (
        SafetyState.ELEVATED if severity == ScreeningSeverity.SEVERE else SafetyState.NORMAL
    )

    return total_score, severity, safety_flag, safety_state


@router.post(
    "/analyze",
    response_model=ScreeningAnalyzeResponse,
    summary="Score screening instrument and evaluate critical safety flags",
    description="Internal endpoint calculating standardized scores for PHQ-9 and GAD-7 screening attempts.",
)
async def analyze_screening(request: ScreeningAnalyzeRequest) -> ScreeningAnalyzeResponse:
    """Calculate screening assessment results and evaluate item-level safety flags."""
    responses_map = {r.question_id: r.score for r in request.responses}

    if request.instrument == ScreeningInstrument.PHQ_9:
        total_score, severity, safety_flag, safety_state = _score_phq9(responses_map)
        summary = (
            f"PHQ-9 score is {total_score}/27, indicating {severity.value.lower().replace('_', ' ')} depression indicators."
        )
    elif request.instrument == ScreeningInstrument.GAD_7:
        total_score, severity, safety_flag, safety_state = _score_gad7(responses_map)
        summary = (
            f"GAD-7 score is {total_score}/21, indicating {severity.value.lower().replace('_', ' ')} anxiety indicators."
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unsupported screening instrument: {request.instrument}",
        )

    if safety_flag:
        summary += " Notice: Item 9 endorsed self-harm thoughts; safety protocol triggered."

    return ScreeningAnalyzeResponse(
        instrument=request.instrument.value,
        totalScore=total_score,
        severityLevel=severity,
        safetyFlag=safety_flag,
        safetyState=safety_state,
        summary=summary,
    )
