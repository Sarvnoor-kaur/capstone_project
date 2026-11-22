"""Unit tests for NOPE Edge safety detector using mocked Ollama responses."""

import httpx
import pytest

from ai_modules.nope_edge.detector import NOPEEdgeDetector as AliasedNOPEEdgeDetector
from app.services.nope_edge import (
    AnalysisStatus,
    NOPEEdgeConfig,
    NOPEEdgeDetector,
    OllamaClient,
)


def _build_detector_with_mock_response(
    response_body: str,
    status_code: int = 200,
) -> NOPEEdgeDetector:
    """Helper to build a detector backed by a mock sync HTTP response."""
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            status_code=status_code,
            json={
                "model": "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
                "response": response_body,
                "done": True,
            },
        )

    transport = httpx.MockTransport(handler)
    http_client = httpx.Client(transport=transport)
    client = OllamaClient(http_client=http_client)
    return NOPEEdgeDetector(client=client)


def _build_detector_with_transport(transport: httpx.MockTransport) -> NOPEEdgeDetector:
    """Helper to build a detector backed by a custom transport (e.g. for exceptions)."""
    http_client = httpx.Client(transport=transport)
    client = OllamaClient(http_client=http_client)
    return NOPEEdgeDetector(client=client)


# ---------------------------------------------------------------------------
# Test Cases (matching Section 8 requirements)
# ---------------------------------------------------------------------------


def test_no_detected_risks() -> None:
    """Test analysis when model explicitly reports zero risks."""
    model_output = (
        "<reflection>\n"
        "The student is discussing their study schedule for exams. No signs of distress or harm.\n"
        "</reflection>\n"
        "<risks>\n"
        "</risks>"
    )
    detector = _build_detector_with_mock_response(model_output)
    result = detector.analyze("I need to study hard for my exams tomorrow.")

    assert result.analysis_status == AnalysisStatus.SUCCESS
    assert result.risk_detected is False
    assert result.risks == []
    assert result.error is None
    assert result.reflection is not None
    assert "No signs of distress" in result.reflection
    assert result.is_success is True
    assert result.has_risk is False


def test_one_detected_risk() -> None:
    """Test analysis when model detects exactly one risk."""
    model_output = (
        "<reflection>\n"
        "The user expresses pervasive hopelessness and lack of self-care.\n"
        "</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" type="self_neglect" severity="moderate" '
        'imminence="subacute" features="hopelessness,social_isolation" />\n'
        "</risks>"
    )
    detector = _build_detector_with_mock_response(model_output)
    result = detector.analyze("I have been feeling hopeless lately and stopped eating.")

    assert result.analysis_status == AnalysisStatus.SUCCESS
    assert result.risk_detected is True
    assert len(result.risks) == 1
    assert result.error is None

    risk = result.risks[0]
    assert risk.subject == "self"
    assert risk.type == "self_neglect"
    assert risk.severity == "moderate"
    assert risk.imminence == "subacute"
    assert risk.features == ["hopelessness", "social_isolation"]
    assert result.is_success is True
    assert result.has_risk is True


def test_multiple_detected_risks() -> None:
    """Test analysis when model identifies multiple risk factors."""
    model_output = (
        "<reflection>\n"
        "Multi-factor crisis: user references both active self-harm and acute suicidal ideation.\n"
        "</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" type="self_harm" severity="severe" '
        'imminence="acute" features="cutting,physical_injury" />\n'
        '    <risk subject="self" type="suicide" severity="critical" '
        'imminence="imminent" features="hopelessness,farewell_messages" />\n'
        "</risks>"
    )
    detector = _build_detector_with_mock_response(model_output)
    result = detector.analyze("I can't take this anymore and want to end it all.")

    assert result.analysis_status == AnalysisStatus.SUCCESS
    assert result.risk_detected is True
    assert len(result.risks) == 2
    assert result.error is None

    types = [r.type for r in result.risks]
    assert "self_harm" in types
    assert "suicide" in types

    severities = [r.severity for r in result.risks]
    assert "severe" in severities
    assert "critical" in severities


def test_empty_risk_section() -> None:
    """Test handling of empty risk sections: self-closing <risks/> and whitespace-only tags."""
    # Sub-case A: self-closing <risks/>
    output_self_closing = (
        "<reflection>Normal conversational inquiry.</reflection>\n"
        "<risks/>"
    )
    detector_a = _build_detector_with_mock_response(output_self_closing)
    result_a = detector_a.analyze("What time is the library open?")

    assert result_a.analysis_status == AnalysisStatus.SUCCESS
    assert result_a.risk_detected is False
    assert result_a.risks == []
    assert result_a.error is None

    # Sub-case B: empty <risks> </risks> with whitespace and newlines
    output_whitespace = (
        "<reflection>No issues detected.</reflection>\n"
        "<risks>\n      \n</risks>"
    )
    detector_b = _build_detector_with_mock_response(output_whitespace)
    result_b = detector_b.analyze("Can you suggest a breathing exercise?")

    assert result_b.analysis_status == AnalysisStatus.SUCCESS
    assert result_b.risk_detected is False
    assert result_b.risks == []


def test_malformed_xml() -> None:
    """Test handling of corrupt or unparseable XML in model output.

    Must never treat parsing failure as evidence of no risk (risk_detected must be None).
    """
    malformed_output = (
        "<reflection>Thinking...</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" type="self_harm" severity="severe" '
        "imminence=acute features=cutting unclosed tag\n"
        "</risks>"
    )
    detector = _build_detector_with_mock_response(malformed_output)
    result = detector.analyze("I feel really distressed.")

    assert result.analysis_status == AnalysisStatus.MALFORMED_OUTPUT
    # CRITICAL: Must not silently coerce to False
    assert result.risk_detected is None
    assert result.risks == []
    assert result.error is not None
    assert "XML syntax error" in result.error or "Failed to parse XML" in result.error


def test_missing_risk_attributes() -> None:
    """Test that risk tags missing mandatory attributes (type, severity, imminence) fail safely."""
    incomplete_risk_output = (
        "<reflection>Incomplete attributes.</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" features="hopelessness" />\n'
        "</risks>"
    )
    detector = _build_detector_with_mock_response(incomplete_risk_output)
    result = detector.analyze("I feel low.")

    assert result.analysis_status == AnalysisStatus.MALFORMED_OUTPUT
    assert result.risk_detected is None
    assert result.risks == []
    assert result.error is not None
    assert "missing required attribute" in result.error.lower()


def test_ollama_unavailable() -> None:
    """Test graceful handling when Ollama daemon is unreachable or connection is refused."""
    def error_handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError(
            "[WinError 10061] No connection could be made because the target machine actively refused it"
        )

    transport = httpx.MockTransport(error_handler)
    detector = _build_detector_with_transport(transport)
    result = detector.analyze("Hello, are you there?")

    assert result.analysis_status == AnalysisStatus.UNAVAILABLE
    assert result.risk_detected is None
    assert result.risks == []
    assert result.error is not None
    assert "unavailable" in result.error.lower() or "connection" in result.error.lower()


def test_request_timeout() -> None:
    """Test graceful handling when Ollama inference request exceeds timeout."""
    def timeout_handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ReadTimeout("The read operation timed out after 30.0 seconds")

    transport = httpx.MockTransport(timeout_handler)
    detector = _build_detector_with_transport(transport)
    result = detector.analyze("I need immediate help.")

    assert result.analysis_status == AnalysisStatus.TIMEOUT
    assert result.risk_detected is None
    assert result.risks == []
    assert result.error is not None
    assert "timed out" in result.error.lower()


def test_invalid_model_output() -> None:
    """Test various invalid model output formats.

    1. Response missing <risks> section entirely.
    2. Non-200 HTTP status from Ollama.
    3. Missing 'response' key in JSON payload.
    """
    # 1. Missing <risks> section entirely
    plain_text_output = "I am an AI assistant and I cannot assess safety."
    detector_1 = _build_detector_with_mock_response(plain_text_output)
    res_1 = detector_1.analyze("I feel down.")
    assert res_1.analysis_status == AnalysisStatus.MALFORMED_OUTPUT
    assert res_1.risk_detected is None
    assert "missing" in res_1.error.lower()

    # 2. Non-200 HTTP error code (e.g. 500 internal server error in Ollama)
    detector_2 = _build_detector_with_mock_response("Internal error", status_code=500)
    res_2 = detector_2.analyze("I feel sad.")
    assert res_2.analysis_status == AnalysisStatus.FAILED
    assert res_2.risk_detected is None
    assert "non-200" in res_2.error.lower()

    # 3. Malformed JSON payload from Ollama (missing 'response' field)
    def bad_json_handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(status_code=200, json={"error": "model crashed"})

    bad_transport = httpx.MockTransport(bad_json_handler)
    detector_3 = _build_detector_with_transport(bad_transport)
    res_3 = detector_3.analyze("I feel sad.")
    assert res_3.analysis_status == AnalysisStatus.FAILED
    assert res_3.risk_detected is None
    assert "response" in res_3.error.lower()


# ---------------------------------------------------------------------------
# Additional Guardrail & Architecture Tests
# ---------------------------------------------------------------------------


def test_reflection_not_used_for_automated_decision() -> None:
    """Test that alarmist text inside <reflection> is NEVER used to declare risk."""
    alarmist_reflection_output = (
        "<reflection>\n"
        "CRITICAL: User is in extreme crisis and suicidal. Imminent self harm.\n"
        "</reflection>\n"
        "<risks>\n"
        "</risks>"
    )
    detector = _build_detector_with_mock_response(alarmist_reflection_output)
    result = detector.analyze("I am working on my homework.")

    # Even though reflection mentions crisis, risks tag is empty -> risk_detected MUST be False
    assert result.analysis_status == AnalysisStatus.SUCCESS
    assert result.risk_detected is False
    assert result.risks == []
    assert result.reflection is not None
    assert "CRITICAL" in result.reflection


def test_empty_input_text_rejected() -> None:
    """Test that empty or whitespace-only inputs are safely rejected before inference."""
    detector = NOPEEdgeDetector()
    result = detector.analyze("   \n\t  ")

    assert result.analysis_status == AnalysisStatus.FAILED
    assert result.risk_detected is None
    assert result.risks == []
    assert "empty" in result.error.lower()


@pytest.mark.anyio
async def test_async_analyze() -> None:
    """Test asynchronous detection workflow (for async FastAPI endpoints)."""
    model_output = (
        "<reflection>Mild anxiety detected.</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" type="anxiety" severity="low" '
        'imminence="chronic" features="worry" />\n'
        "</risks>"
    )

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            status_code=200,
            json={
                "model": "hf.co/nopenet/nope-edge-GGUF:Q4_K_M",
                "response": model_output,
            },
        )

    transport = httpx.MockTransport(handler)
    async_http_client = httpx.AsyncClient(transport=transport)
    client = OllamaClient(async_http_client=async_http_client)
    detector = NOPEEdgeDetector(client=client)

    result = await detector.analyze_async("I worry about tomorrow.")
    assert result.analysis_status == AnalysisStatus.SUCCESS
    assert result.risk_detected is True
    assert len(result.risks) == 1
    assert result.risks[0].type == "anxiety"


def test_ai_modules_import_parity() -> None:
    """Verify that importing from ai_modules.nope_edge.detector works identically."""
    detector = AliasedNOPEEdgeDetector(config=NOPEEdgeConfig())
    assert isinstance(detector, NOPEEdgeDetector)
    assert detector.config.model_name == "hf.co/nopenet/nope-edge-GGUF:Q4_K_M"
