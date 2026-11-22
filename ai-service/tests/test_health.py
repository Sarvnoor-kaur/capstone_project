"""Unit and integration tests for health and readiness endpoints."""

from fastapi.testclient import TestClient

from app.config import Settings


def test_root_health_endpoint(client: TestClient, test_settings: Settings) -> None:
    """GET /health should return 200 OK and valid health payload."""
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == test_settings.APP_VERSION
    assert data["service"] == test_settings.APP_NAME
    assert "timestamp" in data
    assert "X-Request-ID" in response.headers


def test_root_readiness_endpoint(client: TestClient, test_settings: Settings) -> None:
    """GET /readiness should return 200 OK with checks structure."""
    response = client.get("/readiness")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ready"
    assert data["service"] == test_settings.APP_NAME
    assert isinstance(data["checks"], dict)
    assert data["checks"]["configuration"] == "ready"
    assert "timestamp" in data
    assert "X-Request-ID" in response.headers


def test_v1_health_endpoint(client: TestClient, test_settings: Settings) -> None:
    """GET /api/v1/health should return 200 OK."""
    response = client.get(f"{test_settings.API_V1_PREFIX}/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == test_settings.APP_VERSION


def test_v1_readiness_endpoint(client: TestClient, test_settings: Settings) -> None:
    """GET /api/v1/readiness should return 200 OK."""
    response = client.get(f"{test_settings.API_V1_PREFIX}/readiness")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ready"
