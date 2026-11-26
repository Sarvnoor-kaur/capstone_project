"""Tests for service-to-service API key authentication (Phase AI-2)."""

from fastapi.testclient import TestClient

from app.config import Settings


def test_health_endpoints_exempt_from_auth(client: TestClient) -> None:
    """Health probes must remain accessible without any API key."""
    assert client.get("/health").status_code == 200
    assert client.get("/readiness").status_code == 200
    assert client.get("/api/v1/health").status_code == 200
    assert client.get("/api/v1/readiness").status_code == 200


def test_protected_endpoint_rejects_missing_key(client: TestClient) -> None:
    """Protected endpoints must reject requests lacking X-Internal-API-Key with 401."""
    response = client.post(
        "/api/v1/safety/analyze",
        json={"message": "Testing without API key"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "UNAUTHORIZED"
    assert "Missing" in data["error"]["message"] or "API key" in data["error"]["message"]


def test_protected_endpoint_rejects_invalid_key(client: TestClient) -> None:
    """Protected endpoints must reject requests with wrong API key with 401."""
    response = client.post(
        "/api/v1/safety/analyze",
        json={"message": "Testing with wrong API key"},
        headers={"X-Internal-API-Key": "wrong-secret-key-1234"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "UNAUTHORIZED"
    assert "Invalid" in data["error"]["message"]


def test_protected_endpoint_accepts_valid_key(
    client: TestClient, test_settings: Settings, auth_headers: dict[str, str]
) -> None:
    """Protected endpoints must succeed when valid internal API key is supplied."""
    response = client.post(
        "/api/v1/safety/analyze",
        json={"message": "I feel stressed about my upcoming project deadline."},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["state"] == "NORMAL"
