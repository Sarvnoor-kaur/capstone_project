# AI Safety and Crisis Workflow Testing

This is a technical test plan, not a clinical protocol. A qualified professional and relevant institution must approve real-world policies.

## States
NORMAL, ELEVATED_CONCERN, URGENT_CONCERN, SAFETY_SERVICE_UNAVAILABLE. Exact meanings, thresholds and actions require professional approval.

## Test scenarios
- Explicit high-concern language.
- Indirect/ambiguous distress.
- Negation and quoted speech.
- Misspellings/informal language.
- Context changes across turns.
- Ordinary academic stress false positives.
- Safety classifier timeout/unavailable.
- LLM unavailable after safety result.
- DB failure after safety result.
- Duplicate/retried requests.
- Unauthorized safety-event access.

## Required properties
- Safety independent from topic classification and LLM.
- Safety runs early.
- Failure is unavailable, never silently NORMAL.
- Urgent handling does not wait for RAG/LLM.
- Never claim notification unless it succeeded and an operational process exists.
- Sensitive data is restricted and audited.
- User-facing wording is professionally reviewed.
- Verified emergency directory has an owner and review date.

## Test records
Record test ID, synthetic input, expected state/action, actual result, model/rule version, pass/fail, reviewer and date. Never use real student disclosures in fixtures.

## Release gate
No real-student pilot until professional review, operational ownership, after-hours handling, consent/notification policy, verified emergency information and failure drills are complete.
