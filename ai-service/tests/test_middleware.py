"""Tests for Request ID middleware and standardized error response formats."""

import uuid

from fastapi.testclient import TestClient


def test_request_id_generated_when_missing(client: TestClient) -> None:
    """Middleware should automatically generate and return a valid UUID X-Request-ID."""
    response = client.get("/health")
    assert response.status_code == 200

    req_id = response.headers.get("X-Request-ID")
    assert req_id is not None
    # Validate it's a valid UUID
    parsed_uuid = uuid.UUID(req_id)
    assert str(parsed_uuid) == req_id


def test_request_id_echoed_when_provided(client: TestClient) -> None:
    """Middleware should preserve and echo client-provided X-Request-ID."""
    custom_id = "test-custom-request-id-9988"
    response = client.get("/health", headers={"X-Request-ID": custom_id})
    assert response.status_code == 200
    assert response.headers.get("X-Request-ID") == custom_id


def test_404_error_follows_standard_envelope(client: TestClient) -> None:
    """404 Not Found response must conform strictly to standard error schema."""
    custom_id = "not-found-trace-id-123"
    response = client.get("/api/v1/non-existent-endpoint", headers={"X-Request-ID": custom_id})
    assert response.status_code == 404

    data = response.json()
    assert "error" in data
    error = data["error"]
    assert error["code"] == "NOT_FOUND"
    assert "message" in error
    assert error["requestId"] == custom_id
    assert response.headers.get("X-Request-ID") == custom_id
