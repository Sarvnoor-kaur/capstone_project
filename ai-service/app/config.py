"""Configuration management for the AI service using pydantic-settings."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application settings
    ENV: str = Field(default="development", description="Environment: development, staging, production, test")
    DEBUG: bool = Field(default=False, description="Debug mode")
    APP_NAME: str = Field(default="ai-service", description="Application service name")
    APP_VERSION: str = Field(default="0.1.0", description="Application version")
    API_V1_PREFIX: str = Field(default="/api/v1", description="API v1 route prefix")
    HOST: str = Field(default="0.0.0.0", description="Host to bind server")
    PORT: int = Field(default=8000, description="Port to bind server")
    LOG_LEVEL: str = Field(default="INFO", description="Log level: DEBUG, INFO, WARNING, ERROR, CRITICAL")

    # Service-to-service authentication
    INTERNAL_API_KEY: str = Field(
        default="dev-internal-secret-key-change-in-production",
        description="Shared secret API key for internal service-to-service calls",
    )

    # CORS
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
        description="Allowed CORS origins",
    )

    # Database & Vector Store (PostgreSQL + pgvector)
    POSTGRES_SERVER: str = Field(default="localhost", description="PostgreSQL host")
    POSTGRES_PORT: int = Field(default=5432, description="PostgreSQL port")
    POSTGRES_DB: str = Field(default="mental_health_ai", description="PostgreSQL database name")
    POSTGRES_USER: str = Field(default="postgres", description="PostgreSQL user")
    POSTGRES_PASSWORD: str = Field(default="postgres", description="PostgreSQL password")

    # AI / LLM Configuration
    GEMINI_API_KEY: str | None = Field(default=None, description="Google Gemini API key")
    GEMINI_MODEL: str = Field(default="gemini-1.5-flash", description="Gemini model identifier")
    EMBEDDING_MODEL: str = Field(default="all-MiniLM-L6-v2", description="Sentence Transformers embedding model")

    # NOPE Edge / Ollama Configuration
    OLLAMA_BASE_URL: str = Field(
        default="http://localhost:11434",
        description="Base URL for local Ollama runtime",
    )
    NOPE_MODEL: str = Field(
        default="hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
        description="NOPE Edge model identifier for Ollama inference",
    )
    NOPE_TIMEOUT_SECONDS: float = Field(
        default=30.0,
        description="Timeout in seconds for NOPE Edge inference requests",
    )

    # Timeouts and Limits
    REQUEST_TIMEOUT_SECONDS: int = Field(default=30, description="General request timeout")
    AI_RESPONSE_TIMEOUT_SECONDS: int = Field(default=10, description="AI processing timeout limit")
    MAX_INPUT_LENGTH: int = Field(default=4000, description="Maximum allowed input character length")
    RATE_LIMIT_ENABLED: bool = Field(default=True, description="Enable request rate limiting")
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = Field(
        default=120, description="Maximum allowed requests per minute per IP"
    )

    @property
    def postgres_uri(self) -> str:
        """Construct SQLAlchemy/Psycopg compatible connection URI."""
        return (
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


@lru_cache
def get_settings() -> Settings:
    """Get cached application settings instance."""
    return Settings()
