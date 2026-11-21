# Database Design

## Baseline
PostgreSQL; Prisma schema/migrations in `frontend/prisma/`; UUID primary keys; UTC timestamps; foreign keys and deliberate indexes. A UUID is not authorization: enforce ownership in server-side queries.

## Logical entities
- users: identity, role, account status.
- student_profiles / counsellor_profiles: role-specific profile data.
- consents: versioned grants and withdrawals.
- conversations / messages: chat ownership and content.
- assessment_definitions / assessment_questions: versioned instruments.
- assessment_attempts / assessment_responses / assessment_results: attempts, answers and scored results.
- safety_events: restricted safety processing events.
- mood_entries: user-submitted mood.
- resources: approved source resources.
- knowledge_documents / knowledge_chunks: source versions, extracted chunks and embeddings.
- referrals / referral_updates: referral workflow and history.
- audit_logs: sensitive administrative/security actions.

## Relationships
User 1:N conversations; conversation 1:N messages; user 1:N assessment attempts; assessment definition 1:N questions/attempts; attempt 1:N responses and result; user 1:N mood entries/referrals; counsellor 1:N assigned referrals; referral 1:N updates; document 1:N chunks.

## Integrity and access rules
Unique normalized email; each conversation has one owner; each message belongs to a conversation; students access only their records; counsellors only assigned referrals and authorized shared data; assessment attempts retain instrument version; referral transitions validated; knowledge chunks trace to approved source version.

## Sensitive data
Messages, screening responses/results, safety events, referral summaries and mood notes are sensitive. Restrict access, avoid raw-content logs, and define retention/deletion before production.

## Vector data
Each chunk stores document ID, chunk index, content, embedding, source metadata, version, approval status and indexed timestamp. Only approved current material is retrievable.

## Index candidates
users.email unique; conversations(user_id, updated_at); messages(conversation_id, created_at); assessment_attempts(user_id, completed_at); mood_entries(user_id, created_at); referrals(student_id, created_at), referrals(counsellor_id, status); referral_updates(referral_id, created_at); knowledge_chunks(document_id).

Do not finalize physical schema until fields, nullability, enums, retention, access and deletion behavior are reviewed. Avoid indiscriminate cascade deletion.
