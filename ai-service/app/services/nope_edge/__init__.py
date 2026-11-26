"""NOPE Edge safety analysis module.

Provides local LLM-based risk detection using the quantized NOPE Edge model
served via Ollama.
"""

from app.services.nope_edge.client import (
    NOPEClientError,
    NOPEConnectionError,
    NOPEInvalidResponseError,
    NOPETimeoutError,
    OllamaClient,
)
from app.services.nope_edge.config import NOPEEdgeConfig, get_nope_config
from app.services.nope_edge.detector import NOPEEdgeDetector
from app.services.nope_edge.parser import (
    NOPEMalformedXMLError,
    NOPEMissingRisksSectionError,
    NOPEOutputParser,
    NOPEParserError,
    NOPERiskValidationError,
)
from app.services.nope_edge.schemas import (
    AnalysisStatus,
    NOPEAnalysisResult,
    RiskItem,
)

__all__ = [
    "NOPEEdgeDetector",
    "NOPEEdgeConfig",
    "get_nope_config",
    "OllamaClient",
    "NOPEOutputParser",
    "AnalysisStatus",
    "RiskItem",
    "NOPEAnalysisResult",
    "NOPEClientError",
    "NOPEConnectionError",
    "NOPETimeoutError",
    "NOPEInvalidResponseError",
    "NOPEParserError",
    "NOPEMissingRisksSectionError",
    "NOPEMalformedXMLError",
    "NOPERiskValidationError",
]
