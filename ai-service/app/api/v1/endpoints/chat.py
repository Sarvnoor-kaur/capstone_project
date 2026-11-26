"""Chat generation endpoint stub (Phase AI-2)."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import verify_api_key
from app.schemas.chat import (
    ChatGenerateRequest,
    ChatGenerateResponse,
    RAGSource,
)
from app.schemas.safety import SafetyState
from app.services.preprocessing import preprocess_text

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post(
    "/generate",
    response_model=ChatGenerateResponse,
    summary="Generate supportive AI chat response",
    description="Internal endpoint generating supportive chat replies with safety and RAG grounding. Returns mock response in Phase AI-2.",
)
async def generate_chat(request: ChatGenerateRequest) -> ChatGenerateResponse:
    """Preprocess message and return mock supportive response."""
    try:
        _ = preprocess_text(request.message)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        ) from e

    # Mock response stub adhering to Pydantic contract
    mock_sources: list[RAGSource] = []
    if request.include_rag:
        mock_sources.append(
            RAGSource(
                sourceId="src-uni-counseling-guide-01",
                title="Student Academic Wellbeing & Stress Guide",
                publisher="University Student Wellbeing Services",
                url="https://wellbeing.example.edu/guides/academic-stress",
                snippet="Breaking complex assignments into 25-minute focused blocks with breaks can ease anxiety.",
                relevanceScore=0.91,
            )
        )

    return ChatGenerateResponse(
        reply=(
            "Thank you for reaching out. Balancing academic demands can feel challenging at times. "
            "Remember to take steady breaks, and please feel free to explore campus wellbeing resources."
        ),
        safetyState=SafetyState.NORMAL,
        primaryTopic="ACADEMIC_STRESS",
        sources=mock_sources,
        suggestedResources=["Time Management Strategies", "Campus Wellbeing Center"],
        isFallback=False,
        modelVersion="mock-chat-orchestrator-v0.1.0",
    )
