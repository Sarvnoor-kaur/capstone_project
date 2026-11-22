"""Chat orchestration and RAG generation schemas."""

from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.safety import SafetyState


class ChatRole(StrEnum):
    """Message sender role in conversational history."""

    STUDENT = "student"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    USER = "user"


class ChatMessage(BaseModel):
    """Individual turn in a conversational exchange."""

    role: str = Field(
        ...,
        description="Speaker role: student/user, assistant, or system",
    )
    content: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Text content of the message",
    )


class RAGSource(BaseModel):
    """Traceable metadata of an approved source retrieved during generation."""

    model_config = ConfigDict(populate_by_name=True)

    source_id: str = Field(
        ...,
        alias="sourceId",
        description="Unique identifier of the approved knowledge chunk/source",
    )
    title: str = Field(..., description="Document or resource title")
    publisher: str = Field(..., description="Authoring organization or verified publisher")
    url: str | None = Field(default=None, description="External reference URL if available")
    snippet: str = Field(..., description="Relevant excerpt grounding the response")
    relevance_score: float = Field(
        ...,
        alias="relevanceScore",
        ge=0.0,
        le=1.0,
        description="Vector similarity relevance score",
    )


class ChatGenerateRequest(BaseModel):
    """Request payload for AI chat generation."""

    model_config = ConfigDict(populate_by_name=True)

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Latest message from the student",
        examples=["I've been feeling stressed about my thesis deadline. Can you help me break down tasks?"],
    )
    conversation_id: str = Field(
        ...,
        alias="conversationId",
        description="Opaque conversation identifier for tracking and persistence",
    )
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=20,
        description="Recent dialogue history for multi-turn context (max 20 turns)",
    )
    include_rag: bool = Field(
        default=True,
        alias="includeRag",
        description="Whether to retrieve approved campus & health resources to ground response",
    )


class ChatGenerateResponse(BaseModel):
    """Generated response from AI service with safety metadata and source provenance."""

    model_config = ConfigDict(populate_by_name=True)

    reply: str = Field(
        ...,
        description="Supportive AI response validated against safety guardrails",
    )
    safety_state: SafetyState = Field(
        ...,
        alias="safetyState",
        description="Safety state evaluated before generation (NORMAL, ELEVATED, URGENT, UNAVAILABLE)",
    )
    primary_topic: str | None = Field(
        default=None,
        alias="primaryTopic",
        description="Classified topic category or None if unclassified",
    )
    sources: list[RAGSource] = Field(
        default_factory=list,
        description="Approved references and campus resources retrieved for context",
    )
    suggested_resources: list[str] = Field(
        default_factory=list,
        alias="suggestedResources",
        description="Identifiers or titles of suggested student self-help resources",
    )
    is_fallback: bool = Field(
        default=False,
        alias="isFallback",
        description="True if generation failed and a verified safety fallback was returned",
    )
    model_version: str = Field(
        ...,
        alias="modelVersion",
        description="Model and prompt pipeline version",
    )
    timestamp: str = Field(
        default_factory=lambda: datetime.now(UTC).isoformat(),
        description="ISO 8601 UTC timestamp of response generation",
    )
