"""Unit tests for text preprocessing and sanitization (Phase AI-2)."""

import pytest

from app.services.preprocessing import preprocess_text, sanitize_text


def test_preprocess_collapses_whitespace_and_newlines() -> None:
    """Extra spaces and multiple newlines should be collapsed while preserving structure."""
    raw = "   Hello    world!   \n\n\n\nHow    are    you?   "
    processed = preprocess_text(raw)
    assert processed == "Hello world!\n\nHow are you?"


def test_preprocess_preserves_negations_and_context() -> None:
    """CRITICAL SAFETY RULE: Negations must NEVER be stripped or altered."""
    sentences = [
        "I am not feeling suicidal at all.",
        "I have never thought about harming myself.",
        "No, that isn't what I meant.",
        "I won't give up on my studies.",
    ]
    for s in sentences:
        processed = preprocess_text(s)
        assert processed == s, f"Negation altered: '{processed}' != '{s}'"


def test_preprocess_strips_invisible_and_control_chars() -> None:
    """Zero-width and non-printable control characters must be cleanly stripped."""
    # Zero-width spaces embedded
    raw = "Help\u200b me\ufeff please\u200d!"
    assert sanitize_text(raw) == "Help me please!"

    # Control chars (e.g. \x00, \x1b)
    raw_with_control = "Safe text\x00\x08with control\x1bchars."
    sanitized = sanitize_text(raw_with_control)
    assert sanitized == "Safe textwith controlchars."


def test_preprocess_normalizes_unicode_nfkc() -> None:
    """Full-width and decomposition characters should be normalized via NFKC."""
    full_width = "Ｈｅｌｌｏ ｗｏｒｌｄ"
    processed = preprocess_text(full_width)
    assert processed == "Hello world"


def test_preprocess_rejects_empty_or_whitespace_only() -> None:
    """Empty strings or strings containing only whitespace/control chars must raise ValueError."""
    with pytest.raises(ValueError, match="empty or solely whitespace"):
        preprocess_text("")

    with pytest.raises(ValueError, match="empty or solely whitespace"):
        preprocess_text("   \n\t   ")

    with pytest.raises(ValueError, match="no valid non-control characters"):
        preprocess_text("\x00\x01\x02\u200b")


def test_preprocess_enforces_max_length() -> None:
    """Strings exceeding max_length must raise ValueError."""
    long_text = "a" * 4001
    with pytest.raises(ValueError, match="exceeds maximum allowed length"):
        preprocess_text(long_text, max_length=4000)

    # Within bounds should pass
    valid_text = "a" * 4000
    assert len(preprocess_text(valid_text, max_length=4000)) == 4000
