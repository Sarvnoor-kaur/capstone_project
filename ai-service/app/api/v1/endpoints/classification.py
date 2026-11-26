"""Topic classification endpoint stub (Phase AI-2)."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import verify_api_key
from app.schemas.classification import (
    ClassificationRequest,
    ClassificationResponse,
    TopicCategory,
    TopicScore,
)
from app.services.preprocessing import preprocess_text

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/predict",
    response_model=ClassificationResponse,
    summary="Predict primary student support topic",
    description="Internal endpoint classifying student concern topic. Returns mock response in Phase AI-2.",
)
async def predict_classification(request: ClassificationRequest) -> ClassificationResponse:
    """Preprocess input and return topic prediction."""
    try:
        _ = preprocess_text(request.text)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        ) from e

    # Mock response stub adhering to Pydantic contract
    return ClassificationResponse(
        primaryTopic=TopicCategory.GENERAL_WELLBEING.value,
        confidence=0.88,
        allTopics=[
            TopicScore(topic=TopicCategory.GENERAL_WELLBEING.value, score=0.88),
            TopicScore(topic=TopicCategory.ACADEMIC_STRESS.value, score=0.08),
            TopicScore(topic=TopicCategory.ANXIETY.value, score=0.04),
        ],
        isUncertain=False,
        modelVersion="mock-topic-classifier-v0.1.0",
    )
