"""Tests for request timeout middleware (Phase AI-2)."""

import asyncio

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.config import Settings
from app.middleware.errors import register_error_handlers
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.timeout import TimeoutMiddleware


def test_fast_request_succeeds_under_timeout() -> None:
    """A fast endpoint response should complete with 200 OK without timeout triggers."""
    test_app = FastAPI()
    register_error_handlers(test_app)
    test_app.add_middleware(TimeoutMiddleware)
    test_app.add_middleware(RequestIDMiddleware)

    @test_app.get("/fast")
    async def fast_endpoint() -> dict[str, str]:
        return {"result": "done"}

    client = TestClient(test_app)
    response = client.get("/fast")
    assert response.status_code == 200
    assert response.json() == {"result": "done"}


def test_slow_request_triggers_timeout_504(monkeypatch: object) -> None:
    """An endpoint exceeding REQUEST_TIMEOUT_SECONDS should return 504 GATEWAY_TIMEOUT."""
    import app.middleware.timeout as timeout_module

    monkeypatch.setattr(
        timeout_module,
        "get_settings",
        lambda: Settings(REQUEST_TIMEOUT_SECONDS=0),
    )

    test_app = FastAPI()
    register_error_handlers(test_app)
    test_app.add_middleware(TimeoutMiddleware)
    test_app.add_middleware(RequestIDMiddleware)

    @test_app.get("/slow")
    async def slow_endpoint() -> dict[str, str]:
        await asyncio.sleep(0.5)
        return {"result": "too_late"}

    client = TestClient(test_app)
    response = client.get("/slow")
    assert response.status_code == 504

    data = response.json()
    assert data["error"]["code"] == "GATEWAY_TIMEOUT"
    assert "timed out" in data["error"]["message"].lower()
    assert "requestId" in data["error"]
