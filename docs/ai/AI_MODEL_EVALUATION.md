# AI Model Evaluation Plan

## Dataset gate
Before training, document source, license/permissions, lawful basis, population, language coverage, label definitions, annotator process, class balance, missingness, bias, and de-identification. If provenance/rights are unclear, do not train.

## Data splitting
Prevent leakage. If users or conversations repeat, split by person/source where appropriate. Preserve a final held-out test set.

## Topic classification
Report per-class precision, recall, F1, macro/weighted F1, confusion matrix, class support, and calibration/threshold behavior if confidence is exposed. Accuracy alone is insufficient.

## Safety
Use a professionally reviewed test protocol. Analyze false negatives and false positives. Test indirect language, negation, spelling variation, ambiguous cases, and service failure. Synthetic tests alone do not prove clinical safety.

## RAG
Evaluate retrieval relevance, source correctness, coverage, stale-source exclusion, grounding, and citation-to-claim consistency.

## LLM
Evaluate relevance, unsupported claims, safety, privacy leakage, prompt injection, fallback behavior, and consistency.

## Report/release gate
Every report records model/provider version, dataset version, date, method, metrics, limitations and reviewer. No model is production-ready solely because inference works. Require approval and rollback plan.
