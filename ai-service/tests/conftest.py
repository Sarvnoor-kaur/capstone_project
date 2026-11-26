"""Pytest configuration and common fixtures."""

import pytest
from fastapi.testclient import TestClient

from app.config import Settings, get_settings
from app.main import app


@pytest.fixture
def client() -> TestClient:
    """TestClient fixture with standard app configuration."""
    return TestClient(app)


@pytest.fixture
def test_settings() -> Settings:
    """Settings fixture for verifying environment and configuration."""
    return get_settings()


@pytest.fixture
def auth_headers(test_settings: Settings) -> dict[str, str]:
    """Headers containing valid internal API key for authenticated requests."""
    return {"X-Internal-API-Key": test_settings.INTERNAL_API_KEY}
