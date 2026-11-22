"""Request timeout middleware enforcing bounded processing times."""

import asyncio
from collections.abc import Awaitable, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)


class TimeoutMiddleware(BaseHTTPMiddleware):
    """Enforces a maximum duration for request processing, returning 504 on timeout."""

    EXEMPT_PATHS = {"/health", "/readiness", "/api/v1/health", "/api/v1/readiness"}

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        settings = get_settings()
        timeout_seconds = float(settings.REQUEST_TIMEOUT_SECONDS)

        if request.url.path in self.EXEMPT_PATHS:
            return await call_next(request)

        request_id = getattr(request.state, "request_id", "unknown-request-id")

        try:
            return await asyncio.wait_for(call_next(request), timeout=timeout_seconds)
        except TimeoutError:
            logger.error(
                f"Request timeout after {timeout_seconds}s at {request.method} {request.url.path}"
            )
            return JSONResponse(
                status_code=504,
                content={
                    "error": {
                        "code": "GATEWAY_TIMEOUT",
                        "message": f"Request processing timed out after {timeout_seconds} seconds.",
                        "requestId": request_id,
                    }
                },
                headers={"X-Request-ID": request_id},
            )
