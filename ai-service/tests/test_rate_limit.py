"""Tests for request rate limiting middleware (Phase AI-2)."""

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.config import Settings
from app.middleware.errors import register_error_handlers
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_id import RequestIDMiddleware


def test_rate_limit_allows_normal_traffic() -> None:
    """Requests under rate limit should proceed normally."""
    test_app = FastAPI()
    register_error_handlers(test_app)
    test_app.add_middleware(RateLimitMiddleware)
    test_app.add_middleware(RequestIDMiddleware)

    @test_app.get("/test-rate")
    async def sample_endpoint() -> dict[str, str]:
        return {"status": "ok"}

    client = TestClient(test_app)
    response = client.get("/test-rate")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_rate_limit_blocks_excessive_requests(monkeypatch: object) -> None:
    """Requests exceeding limit must receive 429 Too Many Requests with standard error format."""
    # Temporarily set rate limit to 3 requests per minute
    custom_settings = Settings(RATE_LIMIT_REQUESTS_PER_MINUTE=3)

    test_app = FastAPI()
    register_error_handlers(test_app)
    test_app.add_middleware(RateLimitMiddleware)
    test_app.add_middleware(RequestIDMiddleware)

    @test_app.get("/limited")
    async def limited_endpoint() -> dict[str, str]:
        return {"result": "success"}

    import app.middleware.rate_limit as rl_module

    # Monkeypatch settings
    monkeypatch.setattr(rl_module, "get_settings", lambda: custom_settings)  # type: ignore[attr-defined]

    client = TestClient(test_app)

    # First 3 requests should pass
    for _ in range(3):
        res = client.get("/limited")
        assert res.status_code == 200

    # 4th request must be rate limited
    blocked_res = client.get("/limited")
    assert blocked_res.status_code == 429
    assert blocked_res.headers.get("Retry-After") == "60"

    data = blocked_res.json()
    assert data["error"]["code"] == "TOO_MANY_REQUESTS"
    assert "Rate limit" in data["error"]["message"]
    assert "requestId" in data["error"]


def test_health_endpoints_exempt_from_rate_limiting(monkeypatch: object) -> None:
    """Health probes must not be throttled even under high volume."""
    custom_settings = Settings(RATE_LIMIT_REQUESTS_PER_MINUTE=1)
    import app.middleware.rate_limit as rl_module

    monkeypatch.setattr(rl_module, "get_settings", lambda: custom_settings)  # type: ignore[attr-defined]

    test_app = FastAPI()
    test_app.add_middleware(RateLimitMiddleware)

    @test_app.get("/health")
    async def health_endpoint() -> dict[str, str]:
        return {"status": "ok"}

    client = TestClient(test_app)
    # Exceed limit
    for _ in range(5):
        res = client.get("/health")
        assert res.status_code == 200
