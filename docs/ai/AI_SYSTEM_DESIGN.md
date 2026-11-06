# AI System Design

## Purpose and limits
AI supports conversations and resource discovery. It does not diagnose, prescribe, or independently control safety escalation.

## Modules
- Preprocessing: validate and apply model-specific normalization. Do not remove negations/context indiscriminately.
- Topic classification: broad concern topic only, conditional on suitable dataset/labels; return uncertain when appropriate.
- Safety: independent rules and, only if validated, a dedicated classifier. Run early. LLM is not the safety authority.
- Screening: versioned PHQ-9/GAD-7 scoring with approved wording; application backend owns attempts/results.
- Decision engine: transparent reviewed rules; urgent safety policy takes precedence.
- RAG: retrieve only approved/current sources and preserve provenance.
- LLM: generate bounded supportive responses using minimum necessary context; validate outputs.

## Safety states
NORMAL, ELEVATED_CONCERN, URGENT_CONCERN, SAFETY_SERVICE_UNAVAILABLE. Definitions, thresholds and actions require professional approval. Failure must never silently become NORMAL.

## Model lifecycle
Record source, license, version, intended use, limitations, dataset provenance, label definitions, split strategy, metrics and reviewer. Separate training/evaluation/inference. Never fabricate metrics. Synthetic data is not clinical validation.

## Failure behavior
Classifier failure -> unclassified. Safety failure -> unavailable and approved fallback. RAG failure -> no fabricated sources. LLM failure -> safe fallback/retry. Timeouts must be bounded.
