"""Unit tests for Pydantic request/response schemas and enums (Phase AI-2)."""

import pytest
from pydantic import ValidationError

from app.schemas import (
    ChatGenerateRequest,
    ChatGenerateResponse,
    ChatMessage,
    ClassificationRequest,
    ClassificationResponse,
    QuestionResponse,
    RAGSource,
    SafetyAction,
    SafetyAnalysisRequest,
    SafetyAnalysisResponse,
    SafetyState,
    ScreeningAnalyzeRequest,
    ScreeningAnalyzeResponse,
    ScreeningInstrument,
    ScreeningSeverity,
    TopicCategory,
    TopicScore,
)


def test_safety_states_enum_values() -> None:
    """Verify safety state and action enum values conform to specifications."""
    assert SafetyState.NORMAL.value == "NORMAL"
    assert SafetyState.ELEVATED.value == "ELEVATED"
    assert SafetyState.URGENT.value == "URGENT"
    assert SafetyState.UNAVAILABLE.value == "UNAVAILABLE"

    assert SafetyAction.PROCEED.value == "PROCEED"
    assert SafetyAction.OFFER_RESOURCES.value == "OFFER_RESOURCES"
    assert SafetyAction.CRISIS_ESCALATION.value == "CRISIS_ESCALATION"
    assert SafetyAction.SERVICE_UNAVAILABLE.value == "SERVICE_UNAVAILABLE"


def test_safety_schemas_validation() -> None:
    """Verify SafetyAnalysisRequest and SafetyAnalysisResponse behavior."""
    # Valid request with camelCase alias
    req = SafetyAnalysisRequest.model_validate({
        "message": "I feel stressed about my exams.",
        "conversationId": "conv-123",
        "userId": "user-456",
        "context": ["Earlier message"],
    })
    assert req.message == "I feel stressed about my exams."
    assert req.conversation_id == "conv-123"
    assert req.user_id == "user-456"
    assert len(req.context) == 1

    # Empty message should fail
    with pytest.raises(ValidationError):
        SafetyAnalysisRequest(message="")

    # Valid response
    resp = SafetyAnalysisResponse(
        state=SafetyState.NORMAL,
        action=SafetyAction.PROCEED,
        flaggedKeywords=[],
        riskScore=0.15,
        modelVersion="test-safety-v1",
    )
    dumped = resp.model_dump(by_alias=True)
    assert dumped["state"] == "NORMAL"
    assert dumped["riskScore"] == 0.15
    assert "timestamp" in dumped

    # Invalid risk score bounds (> 1.0)
    with pytest.raises(ValidationError):
        SafetyAnalysisResponse(
            state=SafetyState.NORMAL,
            action=SafetyAction.PROCEED,
            riskScore=1.5,
            modelVersion="test-v1",
        )


def test_classification_schemas_validation() -> None:
    """Verify ClassificationRequest and ClassificationResponse serialization."""
    req = ClassificationRequest(text="Need help coping with panic attacks", threshold=0.6)
    assert req.text == "Need help coping with panic attacks"
    assert req.threshold == 0.6

    # Invalid threshold
    with pytest.raises(ValidationError):
        ClassificationRequest(text="Hello", threshold=1.5)

    resp = ClassificationResponse(
        primaryTopic=TopicCategory.ANXIETY.value,
        confidence=0.92,
        allTopics=[TopicScore(topic=TopicCategory.ANXIETY.value, score=0.92)],
        isUncertain=False,
        modelVersion="test-classifier-v1",
    )
    dumped = resp.model_dump(by_alias=True)
    assert dumped["primaryTopic"] == "ANXIETY"
    assert dumped["confidence"] == 0.92
    assert dumped["isUncertain"] is False


def test_screening_schemas_validation() -> None:
    """Verify QuestionResponse and ScreeningAnalyze schemas."""
    # Valid QuestionResponse
    q = QuestionResponse(questionId=1, score=2)
    assert q.question_id == 1
    assert q.score == 2

    # Invalid question score (> 3)
    with pytest.raises(ValidationError):
        QuestionResponse(questionId=1, score=4)

    # Invalid question score (< 0)
    with pytest.raises(ValidationError):
        QuestionResponse(questionId=1, score=-1)

    # Valid request
    req = ScreeningAnalyzeRequest(
        instrument=ScreeningInstrument.PHQ_9,
        responses=[QuestionResponse(questionId=i, score=1) for i in range(1, 10)],
    )
    assert req.instrument == ScreeningInstrument.PHQ_9
    assert len(req.responses) == 9

    # Valid response
    resp = ScreeningAnalyzeResponse(
        instrument="PHQ-9",
        totalScore=9,
        severityLevel=ScreeningSeverity.MILD,
        safetyFlag=False,
        safetyState=SafetyState.NORMAL,
        summary="Mild depression indicators.",
    )
    dumped = resp.model_dump(by_alias=True)
    assert dumped["totalScore"] == 9
    assert dumped["severityLevel"] == "MILD"
    assert "disclaimer" in dumped


def test_chat_schemas_validation() -> None:
    """Verify ChatGenerateRequest and ChatGenerateResponse."""
    req = ChatGenerateRequest(
        message="Can you recommend techniques for deep breathing?",
        conversationId="conv-999",
        history=[ChatMessage(role="student", content="Hello")],
        includeRag=True,
    )
    dumped_req = req.model_dump(by_alias=True)
    assert dumped_req["conversationId"] == "conv-999"
    assert dumped_req["includeRag"] is True

    source = RAGSource(
        sourceId="src-01",
        title="Mindfulness Guide",
        publisher="University Health Center",
        url="https://health.edu/mindfulness",
        snippet="Box breathing technique involves 4 seconds inhale...",
        relevanceScore=0.95,
    )
    resp = ChatGenerateResponse(
        reply="Try box breathing to center yourself.",
        safetyState=SafetyState.NORMAL,
        primaryTopic="ANXIETY",
        sources=[source],
        suggestedResources=["Mindfulness Workshop"],
        modelVersion="test-chat-v1",
    )
    dumped = resp.model_dump(by_alias=True)
    assert dumped["sources"][0]["sourceId"] == "src-01"
    assert dumped["sources"][0]["relevanceScore"] == 0.95
    assert dumped["safetyState"] == "NORMAL"
