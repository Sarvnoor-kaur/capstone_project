"""Screening instrument schemas and scoring structures."""

from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.safety import SafetyState


class ScreeningInstrument(StrEnum):
    """Supported standardized mental health screening instruments."""

    PHQ_9 = "PHQ-9"
    GAD_7 = "GAD-7"


class ScreeningSeverity(StrEnum):
    """Categorized screening severity bands.

    Note: Screening severity is not a diagnostic label.
    """

    NONE_MINIMAL = "NONE_MINIMAL"
    MILD = "MILD"
    MODERATE = "MODERATE"
    MODERATELY_SEVERE = "MODERATELY_SEVERE"
    SEVERE = "SEVERE"


class QuestionResponse(BaseModel):
    """Individual item response for an assessment instrument."""

    model_config = ConfigDict(populate_by_name=True)

    question_id: int = Field(
        ...,
        alias="questionId",
        ge=1,
        le=10,
        description="Question number within the assessment (1-9 for PHQ-9, 1-7 for GAD-7)",
    )
    score: int = Field(
        ...,
        ge=0,
        le=3,
        description="Response score: 0 (Not at all), 1 (Several days), 2 (More than half the days), 3 (Nearly every day)",
    )


class ScreeningAnalyzeRequest(BaseModel):
    """Request payload for scoring and safety review of a screening attempt."""

    model_config = ConfigDict(populate_by_name=True)

    instrument: ScreeningInstrument = Field(
        ...,
        description="Standardized instrument identifier (PHQ-9 or GAD-7)",
    )
    responses: list[QuestionResponse] = Field(
        ...,
        min_length=7,
        max_length=10,
        description="Array of item responses covering all required questions",
    )


class ScreeningAnalyzeResponse(BaseModel):
    """Response containing calculated score, severity band, and critical safety flags."""

    model_config = ConfigDict(populate_by_name=True)

    instrument: str = Field(..., description="Evaluated screening instrument name")
    total_score: int = Field(
        ...,
        alias="totalScore",
        ge=0,
        description="Total calculated sum score across all questions",
    )
    severity_level: ScreeningSeverity = Field(
        ...,
        alias="severityLevel",
        description="Severity band indicating level of concern (not a clinical diagnosis)",
    )
    safety_flag: bool = Field(
        default=False,
        alias="safetyFlag",
        description="Set to true if self-harm or crisis question was endorsed (>0) independent of total score",
    )
    safety_state: SafetyState = Field(
        ...,
        alias="safetyState",
        description="Safety state triggered by screening results (URGENT if safetyFlag is true)",
    )
    summary: str = Field(
        ...,
        description="Supportive explanatory summary with recommended next steps",
    )
    disclaimer: str = Field(
        default="Screening scores are preliminary self-assessments, not clinical or psychiatric diagnoses.",
        description="Mandatory clinical disclaimer",
    )
    timestamp: str = Field(
        default_factory=lambda: datetime.now(UTC).isoformat(),
        description="ISO 8601 UTC timestamp of analysis",
    )
