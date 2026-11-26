"""Aggregation and export of all AI Service Pydantic schemas."""

from app.schemas.chat import (
    ChatGenerateRequest,
    ChatGenerateResponse,
    ChatMessage,
    ChatRole,
    RAGSource,
)
from app.schemas.classification import (
    ClassificationRequest,
    ClassificationResponse,
    TopicCategory,
    TopicScore,
)
from app.schemas.common import (
    HealthResponse,
    ReadinessResponse,
    StandardErrorDetails,
    StandardErrorResponse,
)
from app.schemas.safety import (
    SafetyAction,
    SafetyAnalysisRequest,
    SafetyAnalysisResponse,
    SafetyState,
)
from app.schemas.screening import (
    QuestionResponse,
    ScreeningAnalyzeRequest,
    ScreeningAnalyzeResponse,
    ScreeningInstrument,
    ScreeningSeverity,
)

__all__ = [
    # Common
    "StandardErrorDetails",
    "StandardErrorResponse",
    "HealthResponse",
    "ReadinessResponse",
    # Safety
    "SafetyState",
    "SafetyAction",
    "SafetyAnalysisRequest",
    "SafetyAnalysisResponse",
    # Classification
    "TopicCategory",
    "TopicScore",
    "ClassificationRequest",
    "ClassificationResponse",
    # Screening
    "ScreeningInstrument",
    "ScreeningSeverity",
    "QuestionResponse",
    "ScreeningAnalyzeRequest",
    "ScreeningAnalyzeResponse",
    # Chat
    "ChatRole",
    "ChatMessage",
    "RAGSource",
    "ChatGenerateRequest",
    "ChatGenerateResponse",
]
