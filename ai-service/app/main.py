"""Main entry point for the FastAPI AI Service."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.internal import router as internal_router
from app.api.v1.api import api_router
from app.api.v1.endpoints.health import router as health_router
from app.config import get_settings
from app.logging import get_logger, setup_logging
from app.middleware import (
    RateLimitMiddleware,
    RequestIDMiddleware,
    TimeoutMiddleware,
    register_error_handlers,
)

settings = get_settings()
setup_logging(settings.LOG_LEVEL)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context manager for startup and shutdown procedures."""
    logger.info(
        f"Starting {settings.APP_NAME} v{settings.APP_VERSION} (env={settings.ENV}, debug={settings.DEBUG})"
    )
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


def create_application() -> FastAPI:
    """Create and configure FastAPI application instance."""
    app_settings = get_settings()
    app = FastAPI(
        title="Mental Health Support AI Service",
        description=(
            "Internal FastAPI service providing safety analysis, crisis detection, "
            "topic classification, RAG-grounded retrieval, and LLM chat orchestration."
        ),
        version=app_settings.APP_VERSION,
        docs_url="/docs" if app_settings.DEBUG or app_settings.ENV != "production" else None,
        redoc_url="/redoc" if app_settings.DEBUG or app_settings.ENV != "production" else None,
        lifespan=lifespan,
    )

    # Register standard error handling
    register_error_handlers(app)

    # Register middlewares
    # Note: Starlette executes middlewares in reverse order of addition
    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(TimeoutMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(RequestIDMiddleware)

    # Mount health and readiness checks at root (/health, /readiness)
    app.include_router(health_router, tags=["System Health"])

    # Mount API v1 router under configured prefix (/api/v1)
    app.include_router(api_router, prefix=app_settings.API_V1_PREFIX)

    # Mount development-only internal testing routes outside of production
    if app_settings.ENV != "production" or app_settings.DEBUG:
        app.include_router(
            internal_router,
            prefix="/internal/nope",
            tags=["Internal Testing (Dev Only)"],
        )

    return app


app = create_application()
