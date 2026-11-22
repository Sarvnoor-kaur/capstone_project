"""Standardized error handling middleware and handlers adhering to API Specification."""

import http
import uuid

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.logging import get_logger, request_id_ctx_var

logger = get_logger(__name__)


def _get_request_id(request: Request) -> str:
    """Extract request ID from request.state or contextvar."""
    req_id = getattr(request.state, "request_id", None)
    if not req_id:
        req_id = request_id_ctx_var.get()
    return req_id or str(uuid.uuid4())


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handle standard HTTP exceptions with standard JSON error envelope."""
    request_id = _get_request_id(request)

    # Derive machine-readable error code
    try:
        status_phrase = http.HTTPStatus(exc.status_code).name
    except ValueError:
        status_phrase = "HTTP_ERROR"

    code_map = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        408: "REQUEST_TIMEOUT",
        422: "VALIDATION_ERROR",
        429: "TOO_MANY_REQUESTS",
        500: "INTERNAL_SERVER_ERROR",
        502: "BAD_GATEWAY",
        503: "SERVICE_UNAVAILABLE",
        504: "GATEWAY_TIMEOUT",
    }
    error_code = code_map.get(exc.status_code, status_phrase)

    logger.warning(
        f"HTTP {exc.status_code} ({error_code}) at {request.method} {request.url.path}: {exc.detail}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": error_code,
                "message": str(exc.detail),
                "requestId": request_id,
            }
        },
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle request validation errors with clear structure."""
    request_id = _get_request_id(request)

    errors = exc.errors()
    # Build readable error message
    error_messages = []
    for err in errors:
        loc = " -> ".join(str(p) for p in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        error_messages.append(f"{loc}: {msg}" if loc else msg)

    summary_message = "; ".join(error_messages) if error_messages else "Validation error occurred."

    logger.warning(
        f"Validation error at {request.method} {request.url.path}: {summary_message}"
    )

    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": summary_message,
                "requestId": request_id,
            }
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unhandled 500 exceptions, redacting internal trace details for security."""
    request_id = _get_request_id(request)

    # Log full traceback internally for debugging
    logger.exception(f"Unhandled exception at {request.method} {request.url.path}")

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing the request.",
                "requestId": request_id,
            }
        },
    )


def register_error_handlers(app: FastAPI) -> None:
    """Register custom exception handlers on the FastAPI application."""
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, unhandled_exception_handler)
