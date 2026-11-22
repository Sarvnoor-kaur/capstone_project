"""Data models and schemas for NOPE Edge risk analysis."""

from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AnalysisStatus(StrEnum):
    """Execution status for a NOPE Edge safety analysis request."""

    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    UNAVAILABLE = "UNAVAILABLE"
    TIMEOUT = "TIMEOUT"
    MALFORMED_OUTPUT = "MALFORMED_OUTPUT"


class RiskItem(BaseModel):
    """A single structured risk observation produced by NOPE Edge."""

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    subject: str = Field(
        ...,
        description="Subject of the risk (e.g. 'self', 'other', 'student')",
    )
    type: str = Field(
        ...,
        description="Categorical risk type (e.g. 'self_neglect', 'self_harm', 'suicide', 'violence')",
    )
    severity: str = Field(
        ...,
        description="Assessed severity level (e.g. 'low', 'moderate', 'severe', 'critical')",
    )
    imminence: str = Field(
        ...,
        description="Temporal urgency / imminence (e.g. 'chronic', 'subacute', 'acute', 'imminent')",
    )
    features: list[str] = Field(
        default_factory=list,
        description="Specific behavioral or affective features associated with the risk",
    )
    raw_attributes: dict[str, str] = Field(
        default_factory=dict,
        description="Original attributes preserved from the XML element for auditability",
    )

    @field_validator("features", mode="before")
    @classmethod
    def _parse_features(cls, value: Any) -> list[str]:
        """Convert comma-delimited feature strings or sequences into cleaned list of strings."""
        if isinstance(value, str):
            if not value.strip():
                return []
            return [f.strip() for f in value.split(",") if f.strip()]
        if isinstance(value, (list, tuple)):
            return [str(item).strip() for item in value if str(item).strip()]
        return []


class NOPEAnalysisResult(BaseModel):
    """Structured result returned from NOPE Edge safety analysis.

    Safety contract:
    - When analysis_status is SUCCESS and 0 risks are present: risk_detected is False.
    - When analysis_status is SUCCESS and 1+ risks are present: risk_detected is True.
    - When analysis_status is NOT SUCCESS (FAILED, TIMEOUT, UNAVAILABLE, MALFORMED_OUTPUT):
      risk_detected is None. It is NEVER silently coerced to False.
    """

    model_config = ConfigDict(populate_by_name=True)

    analysis_status: AnalysisStatus = Field(
        ...,
        description="Status of the analysis lifecycle (SUCCESS, FAILED, UNAVAILABLE, TIMEOUT, MALFORMED_OUTPUT)",
    )
    risk_detected: bool | None = Field(
        default=None,
        description=(
            "True if 1+ valid risks detected; False if successfully analyzed with 0 risks; "
            "None if analysis failed, timed out, or produced malformed output."
        ),
    )
    risks: list[RiskItem] = Field(
        default_factory=list,
        description="List of detected risks when analysis succeeds",
    )
    model_name: str = Field(
        ...,
        description="Identifier of the model used for safety inference",
    )
    error: str | None = Field(
        default=None,
        description="Descriptive error explanation when analysis fails",
    )
    reflection: str | None = Field(
        default=None,
        description=(
            "Internal model reasoning captured from <reflection> tags. Preserved exclusively for "
            "developer/clinician auditability. MUST NOT be used for automated risk decisions."
        ),
    )
    raw_output: str | None = Field(
        default=None,
        description="Raw output emitted by the model runtime",
    )

    @property
    def is_success(self) -> bool:
        """Check if analysis completed successfully."""
        return self.analysis_status == AnalysisStatus.SUCCESS

    @property
    def has_risk(self) -> bool:
        """Convenience property indicating confirmed positive risk detection."""
        return self.risk_detected is True
