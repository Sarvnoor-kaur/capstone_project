"""HTTP client for communicating with local Ollama runtime hosting NOPE Edge."""

import time
from typing import Any

import httpx

from app.logging import get_logger
from app.services.nope_edge.config import NOPEEdgeConfig, get_nope_config

logger = get_logger(__name__)


class NOPEClientError(Exception):
    """Base exception for Ollama client communication errors."""


class NOPEConnectionError(NOPEClientError):
    """Raised when the Ollama service is unreachable or connection is refused."""


class NOPETimeoutError(NOPEClientError):
    """Raised when an inference request to Ollama exceeds configured timeout."""


class NOPEInvalidResponseError(NOPEClientError):
    """Raised when Ollama returns an unexpected status code or malformed payload."""


class OllamaClient:
    """Client for dispatching inference requests to local Ollama runtime."""

    def __init__(
        self,
        config: NOPEEdgeConfig | None = None,
        http_client: httpx.Client | None = None,
        async_http_client: httpx.AsyncClient | None = None,
    ) -> None:
        self.config = config or get_nope_config()
        self._sync_client = http_client
        self._async_client = async_http_client

    def _prepare_payload(self, prompt: str) -> dict[str, Any]:
        """Construct the Ollama /api/generate JSON payload."""
        return {
            "model": self.config.model_name,
            "prompt": prompt,
            "stream": False,
        }

    def _extract_response_text(self, response_data: Any) -> str:
        """Validate and extract the text response from Ollama payload."""
        if not isinstance(response_data, dict):
            raise NOPEInvalidResponseError(
                f"Ollama returned non-dictionary JSON payload: {type(response_data).__name__}"
            )
        if "response" not in response_data:
            raise NOPEInvalidResponseError(
                "Ollama JSON payload is missing mandatory 'response' field."
            )
        response_text = response_data["response"]
        if not isinstance(response_text, str):
            raise NOPEInvalidResponseError(
                f"'response' field in Ollama payload is not a string: {type(response_text).__name__}"
            )
        return response_text

    def generate(self, prompt: str) -> str:
        """Synchronously send prompt to Ollama and return the generated text.

        Args:
            prompt: Text to send to NOPE Edge model.

        Returns:
            The raw text string produced by the model.

        Raises:
            NOPEConnectionError: When Ollama daemon cannot be reached.
            NOPETimeoutError: When request times out.
            NOPEInvalidResponseError: When HTTP status is non-200 or response payload is invalid.
        """
        payload = self._prepare_payload(prompt)
        url = self.config.generate_url

        # Log request metadata without logging raw message text to preserve student privacy
        logger.debug(
            f"Dispatching NOPE Edge inference (model='{self.config.model_name}', "
            f"prompt_length={len(prompt)})"
        )
        start_time = time.perf_counter()

        def _do_request(client: httpx.Client) -> httpx.Response:
            return client.post(url, json=payload)

        try:
            if self._sync_client is not None:
                response = _do_request(self._sync_client)
            else:
                with httpx.Client(timeout=self.config.timeout_seconds) as client:
                    response = _do_request(client)
        except (httpx.ConnectError, httpx.ConnectTimeout, httpx.NetworkError) as exc:
            logger.error(
                f"Ollama connection refused or unavailable at {self.config.ollama_base_url}: {exc}"
            )
            raise NOPEConnectionError(
                f"Ollama service unavailable at {self.config.ollama_base_url}: {exc}"
            ) from exc
        except (httpx.ReadTimeout, httpx.WriteTimeout, httpx.TimeoutException) as exc:
            logger.error(
                f"Ollama request timed out after {self.config.timeout_seconds}s: {exc}"
            )
            raise NOPETimeoutError(
                f"Ollama request timed out after {self.config.timeout_seconds}s: {exc}"
            ) from exc
        except httpx.HTTPError as exc:
            logger.error(f"HTTP error communicating with Ollama: {exc}")
            raise NOPEClientError(f"HTTP error communicating with Ollama: {exc}") from exc

        elapsed_ms = (time.perf_counter() - start_time) * 1000

        if response.status_code != 200:
            logger.error(
                f"Ollama returned HTTP error status {response.status_code} "
                f"after {elapsed_ms:.1f}ms: {response.text[:200]}"
            )
            raise NOPEInvalidResponseError(
                f"Ollama returned non-200 HTTP status: {response.status_code}"
            )

        try:
            data = response.json()
        except Exception as exc:
            logger.error(f"Failed to parse JSON response from Ollama: {exc}")
            raise NOPEInvalidResponseError("Ollama response is not valid JSON.") from exc

        response_text = self._extract_response_text(data)
        logger.debug(
            f"NOPE Edge inference complete (elapsed={elapsed_ms:.1f}ms, "
            f"response_length={len(response_text)})"
        )
        return response_text

    async def generate_async(self, prompt: str) -> str:
        """Asynchronously send prompt to Ollama and return the generated text.

        Args:
            prompt: Text to send to NOPE Edge model.

        Returns:
            The raw text string produced by the model.

        Raises:
            NOPEConnectionError: When Ollama daemon cannot be reached.
            NOPETimeoutError: When request times out.
            NOPEInvalidResponseError: When HTTP status is non-200 or response payload is invalid.
        """
        payload = self._prepare_payload(prompt)
        url = self.config.generate_url

        logger.debug(
            f"Dispatching async NOPE Edge inference (model='{self.config.model_name}', "
            f"prompt_length={len(prompt)})"
        )
        start_time = time.perf_counter()

        async def _do_request(client: httpx.AsyncClient) -> httpx.Response:
            return await client.post(url, json=payload)

        try:
            if self._async_client is not None:
                response = await _do_request(self._async_client)
            else:
                async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                    response = await _do_request(client)
        except (httpx.ConnectError, httpx.ConnectTimeout, httpx.NetworkError) as exc:
            logger.error(
                f"Ollama connection refused or unavailable at {self.config.ollama_base_url}: {exc}"
            )
            raise NOPEConnectionError(
                f"Ollama service unavailable at {self.config.ollama_base_url}: {exc}"
            ) from exc
        except (httpx.ReadTimeout, httpx.WriteTimeout, httpx.TimeoutException) as exc:
            logger.error(
                f"Ollama async request timed out after {self.config.timeout_seconds}s: {exc}"
            )
            raise NOPETimeoutError(
                f"Ollama request timed out after {self.config.timeout_seconds}s: {exc}"
            ) from exc
        except httpx.HTTPError as exc:
            logger.error(f"HTTP error communicating with Ollama: {exc}")
            raise NOPEClientError(f"HTTP error communicating with Ollama: {exc}") from exc

        elapsed_ms = (time.perf_counter() - start_time) * 1000

        if response.status_code != 200:
            logger.error(
                f"Ollama returned HTTP error status {response.status_code} "
                f"after {elapsed_ms:.1f}ms: {response.text[:200]}"
            )
            raise NOPEInvalidResponseError(
                f"Ollama returned non-200 HTTP status: {response.status_code}"
            )

        try:
            data = response.json()
        except Exception as exc:
            logger.error(f"Failed to parse JSON response from Ollama: {exc}")
            raise NOPEInvalidResponseError("Ollama response is not valid JSON.") from exc

        response_text = self._extract_response_text(data)
        logger.debug(
            f"NOPE Edge async inference complete (elapsed={elapsed_ms:.1f}ms, "
            f"response_length={len(response_text)})"
        )
        return response_text
