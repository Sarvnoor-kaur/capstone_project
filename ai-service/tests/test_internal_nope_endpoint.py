"""Tests for the development-only NOPE Edge internal testing endpoint."""

import httpx
import pytest
from fastapi.testclient import TestClient

from app.api.internal import set_internal_detector
from app.config import get_settings
from app.main import create_application
from app.services.nope_edge import (
    NOPEEdgeDetector,
    OllamaClient,
)


def _build_test_detector(response_body: str, status_code: int = 200) -> NOPEEdgeDetector:
    """Build mock detector for route testing."""
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            status_code=status_code,
            json={
                "model": "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
                "response": response_body,
                "done": True,
            },
        )

    transport = httpx.MockTransport(handler)
    async_client = httpx.AsyncClient(transport=transport)
    client = OllamaClient(async_http_client=async_client)
    return NOPEEdgeDetector(client=client)


def test_internal_nope_analyze_with_detected_risk(client: TestClient) -> None:
    """Test POST /internal/nope/analyze returns risk details when distress detected."""
    model_output = (
        "<reflection>Severe hopelessness and social isolation.</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" type="self_neglect" severity="moderate" '
        'imminence="subacute" features="hopelessness,social_isolation" />\n'
        "</risks>"
    )
    detector = _build_test_detector(model_output)
    set_internal_detector(detector)

    response = client.post(
        "/internal/nope/analyze",
        json={"message": "I have been feeling hopeless lately."},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["analysis_status"] == "SUCCESS"
    assert data["risk_detected"] is True
    assert len(data["risks"]) == 1
    assert data["risks"][0]["type"] == "self_neglect"
    assert data["risks"][0]["severity"] == "moderate"
    assert data["risks"][0]["features"] == ["hopelessness", "social_isolation"]
    assert data["error"] is None
    assert data["model_name"] == "hf.co/nopenet/nope-edge-GGUF:Q4_K_M"


def test_internal_nope_analyze_zero_risk(client: TestClient) -> None:
    """Test POST /internal/nope/analyze returns risk_detected=False for benign input."""
    model_output = (
        "<reflection>Academic study questions.</reflection>\n"
        "<risks></risks>"
    )
    detector = _build_test_detector(model_output)
    set_internal_detector(detector)

    response = client.post(
        "/internal/nope/analyze",
        json={"message": "Can you give me study advice for chemistry?"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["analysis_status"] == "SUCCESS"
    assert data["risk_detected"] is False
    assert data["risks"] == []
    assert data["error"] is None


def test_internal_nope_analyze_empty_message_rejected(client: TestClient) -> None:
    """Test POST /internal/nope/analyze returns 422 for empty or whitespace messages."""
    response = client.post(
        "/internal/nope/analyze",
        json={"message": "   "},
    )
    assert response.status_code == 422


def test_internal_nope_analyze_missing_field_rejected(client: TestClient) -> None:
    """Test POST /internal/nope/analyze returns 422 when message field is omitted."""
    response = client.post(
        "/internal/nope/analyze",
        json={},
    )
    assert response.status_code == 422


def test_internal_nope_analyze_service_unavailable(client: TestClient) -> None:
    """Test POST /internal/nope/analyze returns UNAVAILABLE when Ollama cannot be reached."""
    def offline_handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("Connection refused")

    transport = httpx.MockTransport(offline_handler)
    async_client = httpx.AsyncClient(transport=transport)
    detector = NOPEEdgeDetector(client=OllamaClient(async_http_client=async_client))
    set_internal_detector(detector)

    response = client.post(
        "/internal/nope/analyze",
        json={"message": "I feel down."},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["analysis_status"] == "UNAVAILABLE"
    assert data["risk_detected"] is None
    assert data["risks"] == []
    assert "unavailable" in data["error"].lower()


def test_internal_nope_disabled_in_production(monkeypatch: pytest.MonkeyPatch) -> None:
    """Verify that in production environments (DEBUG=False, ENV=production), the endpoint is not mounted."""
    monkeypatch.setenv("ENV", "production")
    monkeypatch.setenv("DEBUG", "false")
    get_settings.cache_clear()

    try:
        prod_app = create_application()
        prod_client = TestClient(prod_app)

        response = prod_client.post(
            "/internal/nope/analyze",
            json={"message": "Hello"},
        )
        assert response.status_code == 404
    finally:
        get_settings.cache_clear()
