"""Integration tests for the authenticated production NOPE Edge endpoint (/api/v1/nope/analyze)."""

import httpx
import pytest
from fastapi.testclient import TestClient

from app.api.v1.endpoints.nope import set_nope_detector
from app.config import get_settings
from app.main import create_application
from app.services.nope_edge import (
    AnalysisStatus,
    NOPEEdgeDetector,
    OllamaClient,
)


def _build_test_detector(response_body: str, status_code: int = 200) -> NOPEEdgeDetector:
    """Build a mocked NOPEEdgeDetector returning the given response body."""
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


def test_v1_nope_analyze_successful_risk(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/nope/analyze returns risk items when distress is detected."""
    model_output = (
        "<reflection>Severe self-neglect and hopelessness.</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" type="self_neglect" severity="moderate" '
        'imminence="subacute" features="hopelessness,isolation" />\n'
        "</risks>"
    )
    detector = _build_test_detector(model_output)
    set_nope_detector(detector)

    try:
        response = client.post(
            "/api/v1/nope/analyze",
            json={"message": "I've been skipping meals and feel like giving up."},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_status"] == AnalysisStatus.SUCCESS
        assert data["risk_detected"] is True
        assert len(data["risks"]) == 1
        assert data["risks"][0]["type"] == "self_neglect"
        assert data["risks"][0]["severity"] == "moderate"
        assert data["risks"][0]["imminence"] == "subacute"
        assert data["risks"][0]["features"] == ["hopelessness", "isolation"]
        assert data["error"] is None
        assert data["model_name"] == "hf.co/nopenet/nope-edge-GGUF:Q4_K_M"
    finally:
        set_nope_detector(None)


def test_v1_nope_analyze_no_risk(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/nope/analyze returns risk_detected=False when no risks are detected."""
    model_output = (
        "<reflection>General study discussion.</reflection>\n"
        "<risks></risks>"
    )
    detector = _build_test_detector(model_output)
    set_nope_detector(detector)

    try:
        response = client.post(
            "/api/v1/nope/analyze",
            json={"message": "Can you give me study advice for finals?"},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_status"] == AnalysisStatus.SUCCESS
        assert data["risk_detected"] is False
        assert data["risks"] == []
        assert data["error"] is None
    finally:
        set_nope_detector(None)


def test_v1_nope_analyze_ollama_unavailable(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/nope/analyze returns UNAVAILABLE and risk_detected=None when Ollama is offline."""
    def offline_handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("Connection refused by target machine")

    transport = httpx.MockTransport(offline_handler)
    async_client = httpx.AsyncClient(transport=transport)
    detector = NOPEEdgeDetector(client=OllamaClient(async_http_client=async_client))
    set_nope_detector(detector)

    try:
        response = client.post(
            "/api/v1/nope/analyze",
            json={"message": "I feel stressed."},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_status"] == AnalysisStatus.UNAVAILABLE
        # Safety critical: Must NEVER coerce to False
        assert data["risk_detected"] is None
        assert data["risks"] == []
        assert data["error"] is not None
        assert "unavailable" in data["error"].lower()
    finally:
        set_nope_detector(None)


def test_v1_nope_analyze_timeout(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/nope/analyze returns TIMEOUT and risk_detected=None when inference times out."""
    def timeout_handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ReadTimeout("Request timed out after 30.0s")

    transport = httpx.MockTransport(timeout_handler)
    async_client = httpx.AsyncClient(transport=transport)
    detector = NOPEEdgeDetector(client=OllamaClient(async_http_client=async_client))
    set_nope_detector(detector)

    try:
        response = client.post(
            "/api/v1/nope/analyze",
            json={"message": "I need help."},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_status"] == AnalysisStatus.TIMEOUT
        assert data["risk_detected"] is None
        assert data["risks"] == []
        assert "timed out" in data["error"].lower()
    finally:
        set_nope_detector(None)


def test_v1_nope_analyze_malformed_output(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/nope/analyze returns MALFORMED_OUTPUT and risk_detected=None on unparseable output."""
    bad_output = "<reflection>Thinking...</reflection><risks>unclosed tag<risk bad"
    detector = _build_test_detector(bad_output)
    set_nope_detector(detector)

    try:
        response = client.post(
            "/api/v1/nope/analyze",
            json={"message": "I am having trouble."},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_status"] == AnalysisStatus.MALFORMED_OUTPUT
        assert data["risk_detected"] is None
        assert data["risks"] == []
    finally:
        set_nope_detector(None)


def test_v1_nope_analyze_validation_errors(client: TestClient, auth_headers: dict[str, str]) -> None:
    """POST /api/v1/nope/analyze rejects empty or missing messages with 422."""
    # Empty message
    res_empty = client.post(
        "/api/v1/nope/analyze",
        json={"message": "   "},
        headers=auth_headers,
    )
    assert res_empty.status_code == 422

    # Missing message field
    res_missing = client.post(
        "/api/v1/nope/analyze",
        json={},
        headers=auth_headers,
    )
    assert res_missing.status_code == 422


def test_v1_nope_analyze_auth_required(client: TestClient) -> None:
    """POST /api/v1/nope/analyze rejects unauthenticated or invalid API key with 401."""
    # Missing header
    res_no_auth = client.post(
        "/api/v1/nope/analyze",
        json={"message": "Hello"},
    )
    assert res_no_auth.status_code == 401

    # Invalid header
    res_bad_auth = client.post(
        "/api/v1/nope/analyze",
        json={"message": "Hello"},
        headers={"X-Internal-API-Key": "wrong-key"},
    )
    assert res_bad_auth.status_code == 401


def test_v1_nope_endpoint_available_in_production(monkeypatch: pytest.MonkeyPatch, auth_headers: dict[str, str]) -> None:
    """Verify that /api/v1/nope/analyze remains mounted in production mode."""
    monkeypatch.setenv("ENV", "production")
    monkeypatch.setenv("DEBUG", "false")
    get_settings.cache_clear()

    model_output = "<reflection>Fine.</reflection><risks></risks>"
    detector = _build_test_detector(model_output)
    set_nope_detector(detector)

    try:
        prod_app = create_application()
        prod_client = TestClient(prod_app)

        response = prod_client.post(
            "/api/v1/nope/analyze",
            json={"message": "Hello in production"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["analysis_status"] == AnalysisStatus.SUCCESS
    finally:
        set_nope_detector(None)
        get_settings.cache_clear()
