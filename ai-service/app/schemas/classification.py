"""Topic classification schemas and category enums."""

from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class TopicCategory(StrEnum):
    """Broad concern categories for student support.

    Topic classification is an informational aid, NOT a clinical diagnosis.
    """

    ACADEMIC_STRESS = "ACADEMIC_STRESS"
    ANXIETY = "ANXIETY"
    DEPRESSION_LOW_MOOD = "DEPRESSION_LOW_MOOD"
    RELATIONSHIPS = "RELATIONSHIPS"
    SLEEP_PHYSICAL = "SLEEP_PHYSICAL"
    GENERAL_WELLBEING = "GENERAL_WELLBEING"
    UNCLASSIFIED = "UNCLASSIFIED"


class TopicScore(BaseModel):
    """Confidence score associated with a specific topic classification."""

    topic: str = Field(..., description="Topic label")
    score: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")


class ClassificationRequest(BaseModel):
    """Request payload for topic classification."""

    model_config = ConfigDict(populate_by_name=True)

    text: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Text to classify into student support topics",
        examples=["I can't seem to sleep before exams and my heart races constantly."],
    )
    threshold: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Confidence threshold below which prediction is marked uncertain",
    )


class ClassificationResponse(BaseModel):
    """Response payload containing classified topics and confidence levels."""

    model_config = ConfigDict(populate_by_name=True)

    primary_topic: str = Field(
        ...,
        alias="primaryTopic",
        description="Primary topic category or UNCLASSIFIED",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for primary topic",
    )
    all_topics: list[TopicScore] = Field(
        default_factory=list,
        alias="allTopics",
        description="Per-topic breakdown of prediction confidence",
    )
    is_uncertain: bool = Field(
        default=False,
        alias="isUncertain",
        description="True if model confidence falls below threshold or input is ambiguous",
    )
    model_version: str = Field(
        ...,
        alias="modelVersion",
        description="Version identifier of classification model",
    )
    timestamp: str = Field(
        default_factory=lambda: datetime.now(UTC).isoformat(),
        description="ISO 8601 UTC timestamp of classification",
    )
