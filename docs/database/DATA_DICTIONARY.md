# Data Dictionary

Use UUID IDs and UTC timestamps unless schema decisions specify otherwise. Mark sensitive fields and enforce access controls.

| Entity | Important fields | Meaning / sensitivity |
|---|---|---|
| users | id, email, role, account_status, created_at | Identity, access control; email is personal |
| student_profiles | id, user_id, display_name, institution fields | Student profile; personal |
| counsellor_profiles | id, user_id, qualifications, availability_status | Counsellor profile; verify qualifications |
| consents | id, user_id, consent_type, version, granted, withdrawn_at | Consent history |
| conversations | id, user_id, title, status, timestamps | Owner and conversation metadata |
| messages | id, conversation_id, sender_type, content, processing_status | Content is highly sensitive |
| assessment_attempts | id, user_id, assessment_id, version, status, timestamps | Sensitive screening event |
| assessment_responses | id, attempt_id, question_id, response_value | Highly sensitive |
| assessment_results | id, attempt_id, total_score, interpretation_code, scoring_version | Highly sensitive; not diagnosis |
| safety_events | id, user_id, message_id, safety_state, reason_codes, review_status | Highly sensitive |
| mood_entries | id, user_id, mood_value, optional_note, created_at | Personal/sensitive |
| resources | id, title, source_url, approval_status, review_date, version | Governance metadata |
| knowledge_chunks | id, document_id, content, embedding, chunk_index | Derived/source content |
| referrals | id, student_id, counsellor_id, status, consent_id, authorized_summary | Highly sensitive |
| referral_updates | id, referral_id, old_status, new_status, updated_by | Sensitive workflow audit |
| audit_logs | id, actor_id, action, resource, timestamp, metadata | Security-sensitive |

Still to decide: profile fields, mood scale, consent types, exact status enums, retention metadata, referral transitions and audit metadata. Do not invent these silently.
