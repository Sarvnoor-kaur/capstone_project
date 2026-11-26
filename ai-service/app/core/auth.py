"""Service-to-service authentication dependency using shared API key."""

import secrets

from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

from app.config import get_settings

# Internal service communication header
API_KEY_HEADER = APIKeyHeader(
    name="X-Internal-API-Key",
    auto_error=False,
    description="Shared secret API key for private service-to-service calls",
)


async def verify_api_key(api_key: str | None = Security(API_KEY_HEADER)) -> str:
    """Validate internal service-to-service API key.

    Rejects requests missing the key or providing an invalid key with 401 Unauthorized.
    Uses constant-time comparison to prevent timing side-channel attacks.
    """
    settings = get_settings()

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing required internal API key in 'X-Internal-API-Key' header.",
        )

    # Constant time comparison
    if not secrets.compare_digest(api_key, settings.INTERNAL_API_KEY):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key provided.",
        )

    return api_key
