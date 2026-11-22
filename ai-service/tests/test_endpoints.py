"""End-to-end endpoint tests for AI service stubs (Phase AI-2)."""

from fastapi.testclient import TestClient


def test_safety_analyze_endpoint(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/safety/analyze should validate schema and return mock safety evaluation."""
    payload = {
        "message": "I'm having trouble focusing on coursework this week.",
        "conversationId": "conv-test-01",
        "context": ["Hi, can you assist with scheduling?"],
    }
    response = client.post("/api/v1/safety/analyze", json=payload, headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["state"] == "NORMAL"
    assert data["action"] == "PROCEED"
    assert isinstance(data["flaggedKeywords"], list)
    assert "modelVersion" in data
    assert "timestamp" in data


def test_classification_predict_endpoint(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    """POST /api/v1/classification/predict should return classified topic."""
    payload = {
        "text": "Feeling anxious about my upcoming exam presentation next Monday.",
        "threshold": 0.5,
    }
    response = client.post("/api/v1/classification/predict", json=payload, headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["primaryTopic"] is not None
    assert isinstance(data["confidence"], float)
    assert isinstance(data["allTopics"], list)
    assert "modelVersion" in data


def test_screening_analyze_phq9_minimal(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/screening/analyze with PHQ-9 minimal scores."""
    # 9 questions, all score 0
    payload = {
        "instrument": "PHQ-9",
        "responses": [{"questionId": i, "score": 0} for i in range(1, 10)],
    }
    response = client.post("/api/v1/screening/analyze", json=payload, headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["instrument"] == "PHQ-9"
    assert data["totalScore"] == 0
    assert data["severityLevel"] == "NONE_MINIMAL"
    assert data["safetyFlag"] is False
    assert data["safetyState"] == "NORMAL"
    assert "disclaimer" in data


def test_screening_analyze_phq9_item9_self_harm_triggers_safety_flag(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    """FR-12: Item 9 self-harm > 0 triggers safety flag and URGENT state independent of total score."""
    # Total score only 2, but Question 9 has score 2 (several days)
    responses = [{"questionId": i, "score": 0} for i in range(1, 9)]
    responses.append({"questionId": 9, "score": 2})

    payload = {
        "instrument": "PHQ-9",
        "responses": responses,
    }
    response = client.post("/api/v1/screening/analyze", json=payload, headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["totalScore"] == 2
    # Even though total score is in minimal range (0-4), safetyFlag MUST be True and safetyState URGENT!
    assert data["safetyFlag"] is True
    assert data["safetyState"] == "URGENT"
    assert "Item 9 endorsed self-harm" in data["summary"]


def test_screening_analyze_gad7_scoring(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/screening/analyze with GAD-7 moderate anxiety."""
    # 7 questions, each score 2 -> total 14 (MODERATE)
    payload = {
        "instrument": "GAD-7",
        "responses": [{"questionId": i, "score": 2} for i in range(1, 8)],
    }
    response = client.post("/api/v1/screening/analyze", json=payload, headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["instrument"] == "GAD-7"
    assert data["totalScore"] == 14
    assert data["severityLevel"] == "MODERATE"
    assert data["safetyState"] == "NORMAL"


def test_chat_generate_endpoint(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/chat/generate should validate payload and return mock supportive reply."""
    payload = {
        "message": "How do I deal with exam stress?",
        "conversationId": "conv-test-99",
        "history": [
            {"role": "student", "content": "Hello"},
            {"role": "assistant", "content": "Hi there! How can I support you today?"},
        ],
        "includeRag": True,
    }
    response = client.post("/api/v1/chat/generate", json=payload, headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data["reply"], str)
    assert len(data["reply"]) > 10
    assert data["safetyState"] == "NORMAL"
    assert isinstance(data["sources"], list)
    assert len(data["sources"]) > 0
    assert data["sources"][0]["sourceId"] == "src-uni-counseling-guide-01"


def test_endpoint_validation_errors(client: TestClient, auth_headers: dict[str, str]) -> None:
    """Invalid requests should return 422 with standard error envelope."""
    # Empty message
    response = client.post(
        "/api/v1/safety/analyze",
        json={"message": ""},
        headers=auth_headers,
    )
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "requestId" in data["error"]
