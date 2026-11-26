"""Compatibility package exposing NOPE Edge AI modules for internal imports."""

from app.services.nope_edge import (
    AnalysisStatus,
    NOPEAnalysisResult,
    NOPEEdgeConfig,
    NOPEEdgeDetector,
    RiskItem,
)

__all__ = [
    "NOPEEdgeDetector",
    "NOPEEdgeConfig",
    "NOPEAnalysisResult",
    "RiskItem",
    "AnalysisStatus",
]
