"""In-memory rate limiting middleware to prevent service abuse and request floods."""

import time
from collections import defaultdict
from collections.abc import Awaitable, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Sliding-window rate limiter per client IP address.

    Exempts health and readiness probes from rate limiting.
    """

    EXEMPT_PATHS = {"/health", "/readiness", "/api/v1/health", "/api/v1/readiness"}

    def __init__(self, app: object) -> None:
        super().__init__(app)  # type: ignore[arg-type]
        self._request_history: dict[str, list[float]] = defaultdict(list)

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        settings = get_settings()

        if not settings.RATE_LIMIT_ENABLED or request.url.path in self.EXEMPT_PATHS:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown_client"
        now = time.monotonic()
        window_start = now - 60.0

        # Prune old timestamps
        history = [ts for ts in self._request_history[client_ip] if ts > window_start]
        self._request_history[client_ip] = history

        # Check limit
        if len(history) >= settings.RATE_LIMIT_REQUESTS_PER_MINUTE:
            request_id = getattr(request.state, "request_id", "unknown-request-id")
            logger.warning(
                f"Rate limit exceeded for IP {client_ip} at {request.url.path} "
                f"({len(history)}/{settings.RATE_LIMIT_REQUESTS_PER_MINUTE} req/min)"
            )
            return JSONResponse(
                status_code=429,
                content={
                    "error": {
                        "code": "TOO_MANY_REQUESTS",
                        "message": (
                            f"Rate limit of {settings.RATE_LIMIT_REQUESTS_PER_MINUTE} requests "
                            "per minute exceeded. Please try again shortly."
                        ),
                        "requestId": request_id,
                    }
                },
                headers={
                    "Retry-After": "60",
                    "X-Request-ID": request_id,
                },
            )

        # Record this request timestamp
        self._request_history[client_ip].append(now)

        return await call_next(request)
