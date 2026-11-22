"""Configuration for NOPE Edge local model integration via Ollama."""

import os

from pydantic import BaseModel, Field


class NOPEEdgeConfig(BaseModel):
    """Runtime configuration for NOPE Edge safety detection."""

    ollama_base_url: str = Field(
        default_factory=lambda: os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/"),
        description="Base URL of the Ollama server runtime",
    )
    model_name: str = Field(
        default_factory=lambda: os.getenv("NOPE_MODEL", "hf.co/nopenet/nope-edge-GGUF:Q4_K_M"),
        description="Model tag identifier registered in Ollama",
    )
    timeout_seconds: float = Field(
        default_factory=lambda: float(os.getenv("NOPE_TIMEOUT_SECONDS", "30.0")),
        description="HTTP client timeout in seconds for inference requests",
    )
    generate_endpoint: str = Field(
        default="/api/generate",
        description="Inference API endpoint path in Ollama",
    )

    @property
    def generate_url(self) -> str:
        """Fully-qualified Ollama generate URL."""
        return f"{self.ollama_base_url}{self.generate_endpoint}"


def get_nope_config() -> NOPEEdgeConfig:
    """Instantiate a NOPEEdgeConfig with current environment settings."""
    return NOPEEdgeConfig()
