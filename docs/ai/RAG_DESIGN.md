# RAG Design

## Goal
Ground support responses in approved resources; RAG is not clinical authority.

## Source governance
Each source needs title, publisher, URL, license/usage notes, owner, version, approval state and review date. Only approved/current sources may be indexed. Withdrawn/expired sources must be excluded.

## Ingestion
1. Propose source.
2. Verify source and usage rights.
3. Review and approve.
4. Extract text.
5. Normalize without changing meaning.
6. Chunk and preserve source references.
7. Generate embeddings with documented model/version.
8. Store chunks and vectors in PostgreSQL/pgvector.
9. Evaluate retrieval.
10. Publish indexed version.

## Chunk metadata
Document ID, source title/URL, publisher, document version, chunk index, approval state, review date, embedding model/version, indexed timestamp.

## Retrieval and generation
Filter unapproved/expired content. Retrieve only relevant chunks. Preserve source IDs. If no suitable source exists, say so; never invent citations. Treat retrieved text as untrusted reference material, not executable instructions. Protect against prompt injection in documents.

## Re-indexing
Re-index when source content, approval, chunking or embedding model changes. Keep version traceability.

## Evaluation
Maintain reviewed queries and evaluate relevance, source accuracy, freshness, unsupported claims, injection resistance and missing-source behavior.
