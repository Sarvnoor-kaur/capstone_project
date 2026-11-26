"""Main detection interface for NOPE Edge safety risk assessment."""

from app.logging import get_logger
from app.services.nope_edge.client import (
    NOPEClientError,
    NOPEConnectionError,
    NOPEInvalidResponseError,
    NOPETimeoutError,
    OllamaClient,
)
from app.services.nope_edge.config import NOPEEdgeConfig, get_nope_config
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
)
from app.services.preprocessing import preprocess_text

logger = get_logger(__name__)


class NOPEEdgeDetector:
    """Internal AI detector for identifying crisis and safety risks using NOPE Edge.

    Monolithic integration:
    - Intended solely for internal invocation by safety, chat, or screening services.
    - Exposes no external/public HTTP endpoints.
    - Does not perform autonomous interventions or clinical diagnoses.
    - Never conflates analysis failures with safety (failed analysis yields risk_detected=None).
    """

    def __init__(
        self,
        config: NOPEEdgeConfig | None = None,
        client: OllamaClient | None = None,
        parser: NOPEOutputParser | None = None,
    ) -> None:
        """Initialize the NOPE Edge detector with optional overrides.

        Args:
            config: Custom configuration override. If None, environment settings are used.
            client: Custom OllamaClient override (useful for testing and dependency injection).
            parser: Custom NOPEOutputParser override.
        """
        self.config = config or get_nope_config()
        self.client = client or OllamaClient(config=self.config)
        self.parser = parser or NOPEOutputParser()

    def _sanitize_input(self, text: str) -> str:
        """Sanitize and validate text using existing monolithic preprocessing service."""
        try:
            return preprocess_text(text)
        except ValueError:
            # Fall back to basic whitespace stripping if text is too long or malformed
            return text.strip() if text else ""

    def analyze(self, text: str) -> NOPEAnalysisResult:
        """Perform synchronous safety analysis on the input text.

        Args:
            text: Raw input message to evaluate for distress and safety signals.

        Returns:
            NOPEAnalysisResult: Structured evaluation with status, risks, and detection flag.
        """
        sanitized = self._sanitize_input(text)
        if not sanitized:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.FAILED,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error="Input text cannot be empty or solely whitespace.",
            )

        try:
            raw_output = self.client.generate(prompt=sanitized)
        except NOPEConnectionError as exc:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.UNAVAILABLE,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Ollama service unavailable: {exc}",
            )
        except NOPETimeoutError as exc:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.TIMEOUT,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Inference request timed out: {exc}",
            )
        except (NOPEInvalidResponseError, NOPEClientError) as exc:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.FAILED,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Model runtime error: {exc}",
            )
        except Exception as exc:
            logger.error(f"Unexpected error during NOPE Edge analysis: {exc}")
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.FAILED,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error="Unexpected internal error during inference.",
            )

        return self._process_model_output(raw_output)

    async def analyze_async(self, text: str) -> NOPEAnalysisResult:
        """Perform asynchronous safety analysis on the input text.

        Args:
            text: Raw input message to evaluate for distress and safety signals.

        Returns:
            NOPEAnalysisResult: Structured evaluation with status, risks, and detection flag.
        """
        sanitized = self._sanitize_input(text)
        if not sanitized:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.FAILED,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error="Input text cannot be empty or solely whitespace.",
            )

        try:
            raw_output = await self.client.generate_async(prompt=sanitized)
        except NOPEConnectionError as exc:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.UNAVAILABLE,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Ollama service unavailable: {exc}",
            )
        except NOPETimeoutError as exc:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.TIMEOUT,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Inference request timed out: {exc}",
            )
        except (NOPEInvalidResponseError, NOPEClientError) as exc:
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.FAILED,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Model runtime error: {exc}",
            )
        except Exception as exc:
            logger.error(f"Unexpected error during async NOPE Edge analysis: {exc}")
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.FAILED,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error="Unexpected internal error during inference.",
            )

        return self._process_model_output(raw_output)

    def _process_model_output(self, raw_output: str) -> NOPEAnalysisResult:
        """Parse and validate output from the model, mapping errors to safe states."""
        try:
            risks, reflection = self.parser.parse(raw_output)
        except NOPEMissingRisksSectionError as exc:
            logger.warning(f"NOPE Edge model output missing risks block: {exc}")
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.MALFORMED_OUTPUT,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Model output format error: {exc}",
                raw_output=raw_output,
            )
        except NOPEMalformedXMLError as exc:
            logger.warning(f"NOPE Edge model output contained malformed XML: {exc}")
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.MALFORMED_OUTPUT,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"XML syntax error in model output: {exc}",
                raw_output=raw_output,
            )
        except NOPERiskValidationError as exc:
            logger.warning(f"NOPE Edge risk attributes failed validation: {exc}")
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.MALFORMED_OUTPUT,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Invalid risk attributes: {exc}",
                raw_output=raw_output,
            )
        except NOPEParserError as exc:
            logger.warning(f"NOPE Edge parsing error: {exc}")
            return NOPEAnalysisResult(
                analysis_status=AnalysisStatus.MALFORMED_OUTPUT,
                risk_detected=None,
                risks=[],
                model_name=self.config.model_name,
                error=f"Parser failure: {exc}",
                raw_output=raw_output,
            )

        # Successful parsing: 0 risks -> risk_detected=False; 1+ risks -> risk_detected=True
        has_risks = len(risks) > 0
        return NOPEAnalysisResult(
            analysis_status=AnalysisStatus.SUCCESS,
            risk_detected=has_risks,
            risks=risks,
            model_name=self.config.model_name,
            error=None,
            reflection=reflection,
            raw_output=raw_output,
        )
