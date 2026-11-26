"""Structured logging with request ID tracking and privacy protection."""

import logging
import sys
from contextvars import ContextVar
from datetime import UTC, datetime

# Context variable holding the request ID for the current async task
request_id_ctx_var: ContextVar[str] = ContextVar("request_id", default="")


class RequestIDFilter(logging.Filter):
    """Logging filter that injects the current request_id into log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_ctx_var.get() or "no-request-id"
        return True


class StructuredFormatter(logging.Formatter):
    """Formatter that outputs structured logs with timestamp, level, request ID, and message.

    Adheres to safety/privacy rules: sensitive student messages are not logged here.
    """

    def format(self, record: logging.LogRecord) -> str:
        timestamp = datetime.now(UTC).isoformat()
        req_id = getattr(record, "request_id", "no-request-id")
        return f"[{timestamp}] [{record.levelname}] [{req_id}] [{record.name}]: {record.getMessage()}"


def setup_logging(log_level: str = "INFO") -> None:
    """Configure application logging handlers, level, and formatters."""
    numeric_level = getattr(logging.LogLevel if hasattr(logging, "LogLevel") else logging, log_level.upper(), logging.INFO)

    root_logger = logging.getLogger()
    root_logger.setLevel(numeric_level)

    # Avoid adding duplicate handlers on reload
    if not root_logger.handlers:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(numeric_level)
        console_handler.addFilter(RequestIDFilter())
        console_handler.setFormatter(StructuredFormatter())
        root_logger.addHandler(console_handler)
    else:
        for handler in root_logger.handlers:
            handler.setLevel(numeric_level)
            handler.addFilter(RequestIDFilter())
            handler.setFormatter(StructuredFormatter())

    # Suppress overly chatty external libraries if needed
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Obtain a logger instance with the given name."""
    return logging.getLogger(name)
