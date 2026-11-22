"""Input text preprocessing and sanitization service.

Follows AI System Design guidelines:
- Validate length and emptiness.
- Normalize Unicode (NFKC) and collapse extraneous whitespace.
- Strip non-printable ASCII control characters.
- Strip invisible / zero-width characters.
- CRITICALLY: Do NOT remove negations ('not', 'no', 'never', 'n\\'t') or alter context.
"""

import re
import unicodedata

# Matches control characters except newline and tab
_CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]")

# Matches zero-width and invisible unicode characters
_ZERO_WIDTH_RE = re.compile(r"[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]")

# Matches multiple consecutive spaces/tabs (preserving newlines)
_MULTI_SPACE_RE = re.compile(r"[^\S\r\n]+")

# Matches more than two consecutive newlines
_MULTI_NEWLINE_RE = re.compile(r"\n{3,}")


def sanitize_text(text: str) -> str:
    """Remove control characters and zero-width characters without changing semantics."""
    # Strip zero-width characters first
    cleaned = _ZERO_WIDTH_RE.sub("", text)
    # Strip non-printable control characters
    cleaned = _CONTROL_CHAR_RE.sub("", cleaned)
    return cleaned


def normalize_whitespace(text: str) -> str:
    """Normalize excess horizontal spaces and duplicate empty lines while preserving structure."""
    # Normalize carriage returns
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Replace multiple spaces with a single space per line
    lines = [_MULTI_SPACE_RE.sub(" ", line).strip() for line in text.split("\n")]
    # Reassemble and collapse 3+ newlines to 2
    reassembled = "\n".join(lines)
    return _MULTI_NEWLINE_RE.sub("\n\n", reassembled).strip()


def preprocess_text(text: str, max_length: int = 4000) -> str:
    """Apply standard normalization and validation to incoming student text.

    Steps:
    1. Validate non-empty and max length limits.
    2. Normalize Unicode to NFKC.
    3. Strip dangerous control characters and invisible tokens.
    4. Normalize whitespace while preserving punctuation and negations.
    """
    if not text or not text.strip():
        raise ValueError("Input text cannot be empty or solely whitespace.")

    # Unicode NFKC normalization
    normalized = unicodedata.normalize("NFKC", text)

    # Sanitize control & invisible characters
    cleaned = sanitize_text(normalized)

    # Normalize whitespace
    processed = normalize_whitespace(cleaned)

    if not processed:
        raise ValueError("Input text contains no valid non-control characters.")

    if len(processed) > max_length:
        raise ValueError(
            f"Input text exceeds maximum allowed length of {max_length} characters (got {len(processed)})."
        )

    return processed
