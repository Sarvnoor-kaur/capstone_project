"""Safety analysis request and response schemas and safety state enums."""

from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class SafetyState(StrEnum):
    """Safety concern level for user message or session state.

    Crucial rule: Safety-service failure must never silently become NORMAL;
    UNAVAILABLE must be represented explicitly.
    """

    NORMAL = "NORMAL"
    ELEVATED = "ELEVATED"
    URGENT = "URGENT"
    UNAVAILABLE = "UNAVAILABLE"


class SafetyAction(StrEnum):
    """Recommended escalation or handling action derived from safety state."""

    PROCEED = "PROCEED"
    OFFER_RESOURCES = "OFFER_RESOURCES"
    CRISIS_ESCALATION = "CRISIS_ESCALATION"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"


class SafetyAnalysisRequest(BaseModel):
    """Request payload for evaluating safety and crisis signals in text."""

    model_config = ConfigDict(populate_by_name=True)

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="User text or message content to evaluate for safety concerns",
        examples=["I feel overwhelmed with upcoming exam deadlines and need study advice."],
    )
    conversation_id: str | None = Field(
        default=None,
        alias="conversationId",
        description="Optional conversation identifier for context correlation",
    )
    user_id: str | None = Field(
        default=None,
        alias="userId",
        description="Optional opaque user identifier (do not send raw PII)",
    )
    context: list[str] = Field(
        default_factory=list,
        max_length=10,
        description="Recent message snippets for multi-turn conversational context",
    )


class SafetyAnalysisResponse(BaseModel):
    """Structured response indicating safety state, identified risks, and recommended actions."""

    model_config = ConfigDict(populate_by_name=True)

    state: SafetyState = Field(
        ...,
        description="Evaluated safety state (NORMAL, ELEVATED, URGENT, UNAVAILABLE)",
    )
    action: SafetyAction = Field(
        ...,
        description="Recommended action based on transparent safety rules",
    )
    flagged_keywords: list[str] = Field(
        default_factory=list,
        alias="flaggedKeywords",
        description="Matched distress or risk patterns (redacted of sensitive details)",
    )
    risk_score: float | None = Field(
        default=None,
        ge=0.0,
        le=1.0,
        alias="riskScore",
        description="Optional confidence or risk score if calculated by an approved model",
    )
    fallback_response: str | None = Field(
        default=None,
        alias="fallbackResponse",
        description="Approved supportive crisis message when elevated or urgent",
    )
    model_version: str = Field(
        ...,
        alias="modelVersion",
        description="Version identifier of the safety rules/model used for evaluation",
    )
    timestamp: str = Field(
        default_factory=lambda: datetime.now(UTC).isoformat(),
        description="ISO 8601 UTC timestamp of evaluation",
    )
