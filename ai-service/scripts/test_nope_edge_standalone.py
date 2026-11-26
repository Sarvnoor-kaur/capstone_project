#!/usr/bin/env python3
"""Standalone verification script for NOPE Edge detector integration.

Demonstrates importing and executing the detector as an internal monolithic module.
Can run in offline mock mode (default) or live mode against a running Ollama daemon.

Usage:
    # Run with built-in test scenarios (mocked offline inference):
    python scripts/test_nope_edge_standalone.py

    # Run against active local Ollama daemon (requires model loaded):
    python scripts/test_nope_edge_standalone.py --live "I feel completely hopeless today."
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Ensure ai-service root is in sys.path when running as a standalone script
current_dir = Path(__file__).resolve().parent
ai_service_dir = current_dir.parent
if str(ai_service_dir) not in sys.path:
    sys.path.insert(0, str(ai_service_dir))

import httpx  # noqa: E402

# Internal monolithic import (as specified in Section 4)
from ai_modules.nope_edge.detector import NOPEEdgeDetector  # noqa: E402
from app.services.nope_edge.client import OllamaClient  # noqa: E402
from app.services.nope_edge.config import NOPEEdgeConfig  # noqa: E402
from app.services.nope_edge.schemas import NOPEAnalysisResult  # noqa: E402


def print_result(label: str, text: str, result: NOPEAnalysisResult) -> None:
    """Format and print structured analysis result to stdout."""
    print(f"\n{'='*70}")
    print(f"Scenario: {label}")
    print(f'Input text: "{text}"')
    print(f"{'-'*70}")
    print(f"Analysis Status : {result.analysis_status.value}")
    print(f"Risk Detected   : {result.risk_detected}")
    print(f"Model Name      : {result.model_name}")
    print(f"Error           : {result.error}")
    if result.reflection:
        print(f"Reflection      : {result.reflection}")

    print(f"Detected Risks  : {len(result.risks)}")
    for idx, risk in enumerate(result.risks, 1):
        print(f"  [{idx}] Type: {risk.type} | Severity: {risk.severity} | Imminence: {risk.imminence}")
        print(f"      Subject: {risk.subject} | Features: {', '.join(risk.features)}")
    print(f"{'='*70}")


def run_mock_scenarios() -> None:
    """Run internal test scenarios validating structured output across edge cases."""
    print("\nRunning NOPE Edge internal test suite (Mocked Offline Mode)...")

    # Scenario 1: Distress message with detected risks
    distress_text = "I have been feeling hopeless lately and stopped eating."
    distress_xml = (
        "<reflection>The user expresses pervasive hopelessness and lack of self-care.</reflection>\n"
        "<risks>\n"
        '    <risk subject="self" type="self_neglect" severity="moderate" '
        'imminence="subacute" features="hopelessness,social_isolation" />\n'
        "</risks>"
    )

    def handle_distress(req: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={"model": "hf.co/nopenet/nope-edge-GGUF:Q4_K_M", "response": distress_xml},
        )

    client1 = OllamaClient(http_client=httpx.Client(transport=httpx.MockTransport(handle_distress)))
    d1 = NOPEEdgeDetector(client=client1)
    res1 = d1.analyze(distress_text)
    print_result("1. Moderate Risk Detected", distress_text, res1)

    # Scenario 2: Benign message with zero detected risks
    safe_text = "I need advice on managing my study schedule for tomorrow's chemistry exam."
    safe_xml = (
        "<reflection>Normal academic query. No safety concerns identified.</reflection>\n"
        "<risks></risks>"
    )

    def handle_safe(req: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={"model": "hf.co/nopenet/nope-edge-GGUF:Q4_K_M", "response": safe_xml},
        )

    client2 = OllamaClient(http_client=httpx.Client(transport=httpx.MockTransport(handle_safe)))
    d2 = NOPEEdgeDetector(client=client2)
    res2 = d2.analyze(safe_text)
    print_result("2. Zero Risks (Safe Input)", safe_text, res2)

    # Scenario 3: Malformed XML from model (fails safely without false negative)
    broken_text = "I feel very overwhelmed."
    broken_xml = '<risks><risk subject="self" unclosed broken xml'

    def handle_broken(req: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={"model": "hf.co/nopenet/nope-edge-GGUF:Q4_K_M", "response": broken_xml},
        )

    client3 = OllamaClient(http_client=httpx.Client(transport=httpx.MockTransport(handle_broken)))
    d3 = NOPEEdgeDetector(client=client3)
    res3 = d3.analyze(broken_text)
    print_result("3. Malformed XML (Fails Safely, risk_detected=None)", broken_text, res3)

    # Scenario 4: Ollama daemon unavailable
    offline_text = "Is anyone there?"

    def handle_offline(req: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("Connection refused: Ollama daemon not running")

    client4 = OllamaClient(http_client=httpx.Client(transport=httpx.MockTransport(handle_offline)))
    d4 = NOPEEdgeDetector(client=client4)
    res4 = d4.analyze(offline_text)
    print_result("4. Ollama Unavailable (Graceful degradation)", offline_text, res4)

    print("\nAll offline scenarios completed successfully!")


def run_live(message: str) -> None:
    """Run real inference against locally running Ollama daemon."""
    config = NOPEEdgeConfig()
    print(f"\nConnecting to local Ollama at: {config.ollama_base_url}")
    print(f"Target model: {config.model_name}")

    detector = NOPEEdgeDetector(config=config)
    result = detector.analyze(message)
    print_result("Live Ollama Inference", message, result)


def main() -> None:
    parser = argparse.ArgumentParser(description="NOPE Edge Standalone Verification Script")
    parser.add_argument(
        "--live",
        nargs="?",
        const="I have been feeling hopeless lately.",
        default=None,
        help="Run against active local Ollama daemon at http://localhost:11434 with optional text",
    )
    args = parser.parse_args()

    if args.live:
        run_live(args.live)
    else:
        run_mock_scenarios()


if __name__ == "__main__":
    main()
