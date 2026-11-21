# Development Gap Analysis - Mentovya Mental Health Platform

**Date:** November 21, 2026  
**Analyzed by:** Kiro AI Assistant  
**Status:** Current Implementation vs. Documentation Requirements

---

## Executive Summary

Your project documentation describes an **enterprise-grade mental health platform** with Next.js, FastAPI, PostgreSQL, and comprehensive AI features. However, your **current implementation** is a **basic MVP** using React + Vite, Express.js, MongoDB, and Google Gemini API.

**Major Gap:** ~70% of documented features are **not yet implemented**.

---

## 1. ARCHITECTURE MISMATCH

### 📋 DOCUMENTED ARCHITECTURE
- **Frontend:** Next.js App Router + TypeScript + Tailwind CSS
- **Backend:** FastAPI (Python) for AI processing
- **Database:** PostgreSQL + pgvector for embeddings
- **ORM:** Prisma
- **Deployment:** Docker Compose

### ✅ CURRENT IMPLEMENTATION
- **Frontend:** React + Vite + JavaScript (not Next.js)
- **Backend:** Express.js (Node.js) - **no FastAPI service**
- **Database:** MongoDB (not PostgreSQL)
- **ORM:** Mongoose (not Prisma)
- **Deployment:** No Docker setup

### 🔴 CRITICAL ISSUE
**Your actual tech stack is completely different from your documentation!**

---

## 2. IMPLEMENTED FEATURES (Current Status)

### ✅ WORKING FEATURES

#### Authentication & Authorization
- ✅ User registration (email/password)
- ✅ User login with JWT
- ✅ Protected routes with middleware
- ✅ Basic role support (student/counselor)
- ❌ Admin role not implemented
- ❌ No session management
- ❌ No consent tracking
- ❌ No audit logs

#### AI Chat
- ✅ Basic AI conversation using Google Gemini API
- ✅ Conversation history (localStorage only)
- ✅ Mental health focused responses
- ❌ No chat persistence in database
- ❌ No topic classification
- ❌ No safety analysis module
- ❌ No RAG (Retrieval-Augmented Generation)
- ❌ No conversation ownership/privacy

#### Mood Tracking
- ✅ Create mood entries (1-5 scale)
- ✅ View mood history (last 14 entries)
- ✅ Mood visualization (charts, heatmap)
- ✅ Achievement badges
- ✅ Mood statistics

#### Resources
- ✅ Browse resources (public)
- ✅ Search/filter by category and keywords
- ✅ Counselor can create/edit/delete resources
- ❌ No approval workflow for resources
- ❌ No versioning or metadata tracking

#### Support Requests (Referrals)
- ✅ Students can create support requests
- ✅ Students can view their own requests
- ✅ Counselors can view all requests
- ✅ Counselors can update status and add notes
- ❌ No assignment to specific counselors
- ❌ No consent tracking for information sharing
- ❌ No referral workflow state machine

#### UI/UX
- ✅ Landing page with premium design
- ✅ Modern authentication pages (split-screen SaaS style)
- ✅ Dashboard with mood tracking
- ✅ Responsive design
- ✅ Premium Mentovya branding

---

## 3. MISSING CRITICAL FEATURES

### 🔴 HIGH PRIORITY (Phase 1-4)

#### 1. **Proper Database Architecture**
**Status:** Not Started  
**Required:**
- [ ] Migrate from MongoDB to PostgreSQL
- [ ] Implement Prisma schema with all entities
- [ ] Set up pgvector for embeddings
- [ ] Create proper migrations
- [ ] Implement UUID primary keys
- [ ] Add foreign key constraints
- [ ] Create indexes for performance

**Entities Missing:**
- `student_profiles` / `counsellor_profiles` (role-specific data)
- `consents` (versioned consent tracking)
- `conversations` / `messages` (chat ownership)
- `assessment_definitions` / `assessment_questions`
- `assessment_attempts` / `assessment_responses` / `assessment_results`
- `safety_events` (safety incident tracking)
- `knowledge_documents` / `knowledge_chunks` (RAG system)
- `referrals` / `referral_updates` (proper referral workflow)
- `audit_logs` (sensitive action tracking)

#### 2. **FastAPI AI Service**
**Status:** Not Started  
**Required:**
- [ ] Create separate `ai-service/` directory
- [ ] Set up FastAPI with Python
- [ ] Implement internal service authentication
- [ ] Create AI processing endpoints:
  - `/api/v1/safety/analyze` - Safety analysis
  - `/api/v1/classification/predict` - Topic classification
  - `/api/v1/chat/generate` - LLM generation
  - `/api/v1/screening/analyze` - Screening analysis
- [ ] Implement proper error handling
- [ ] Add request timeouts
- [ ] Model versioning and metadata

#### 3. **Mental Health Assessments (PHQ-9, GAD-7)**
**Status:** Not Started  
**Required:**
- [ ] Obtain official questionnaire permissions
- [ ] Implement PHQ-9 (depression screening)
- [ ] Implement GAD-7 (anxiety screening)
- [ ] Create versioned assessment definitions
- [ ] Implement proper scoring algorithms
- [ ] Store assessment attempts and results
- [ ] Professional review of scoring logic
- [ ] Self-harm response detection
- [ ] Results interpretation (not diagnosis!)

#### 4. **Safety System**
**Status:** Not Started - **CRITICAL FOR PRODUCTION**  
**Required:**
- [ ] Professional mental health reviewer approval
- [ ] Safety state definitions (NORMAL, ELEVATED_CONCERN, URGENT_CONCERN, UNAVAILABLE)
- [ ] Independent safety analysis module
- [ ] Self-harm/suicide keyword detection
- [ ] Crisis resource display
- [ ] Safety event logging
- [ ] Failure handling (never default to NORMAL)
- [ ] After-hours coverage plan
- [ ] Crisis escalation ownership

#### 5. **Chat Persistence & Ownership**
**Status:** Not Started  
**Required:**
- [ ] Create conversations table with user ownership
- [ ] Store messages in database (not localStorage)
- [ ] Enforce conversation access control
- [ ] Implement data retention policy
- [ ] Add conversation export
- [ ] Implement conversation deletion
- [ ] Proper timestamp handling (UTC)

#### 6. **Authorization & RBAC**
**Status:** Partially Implemented  
**Required:**
- [ ] Add Admin role functionality
- [ ] Implement record ownership checks in all queries
- [ ] Counselor assignment to referrals
- [ ] Restrict counselor access to assigned referrals only
- [ ] Admin resource approval workflow
- [ ] Audit trail for sensitive actions
- [ ] Prevent privilege escalation

### 🟡 MEDIUM PRIORITY (Phase 5-6)

#### 7. **RAG (Retrieval-Augmented Generation)**
**Status:** Not Started  
**Required:**
- [ ] Approve knowledge base sources
- [ ] Document ingestion pipeline
- [ ] Chunking strategy
- [ ] Embedding generation (Sentence Transformers)
- [ ] pgvector setup for similarity search
- [ ] Source provenance tracking
- [ ] Version control for documents
- [ ] Approval workflow for content
- [ ] RAG evaluation metrics

#### 8. **Topic Classification**
**Status:** Not Started  
**Required:**
- [ ] Dataset acquisition and licensing
- [ ] Label definitions for mental health topics
- [ ] Model training with scikit-learn or PyTorch
- [ ] Evaluation metrics documentation
- [ ] Handle "unclassified" gracefully
- [ ] Model versioning
- [ ] Return confidence scores

#### 9. **Admin Dashboard Features**
**Status:** Not Started  
**Required:**
- [ ] Resource approval interface
- [ ] User management (view, disable, not delete sensitive data)
- [ ] System statistics
- [ ] Audit log viewer
- [ ] Safety event monitoring
- [ ] Report generation

#### 10. **Counselor Dashboard Features**
**Status:** Partially Implemented  
**Required:**
- [ ] Assigned referrals view only
- [ ] Referral status transitions
- [ ] Student profile access (with consent)
- [ ] Assessment results view (if shared)
- [ ] Communication with students
- [ ] Schedule management

### 🟢 LOWER PRIORITY (Phase 7-8)

#### 11. **Docker & Deployment**
**Status:** Not Started  
**Required:**
- [ ] Docker Compose configuration
- [ ] Dockerfile for Next.js (when migrated)
- [ ] Dockerfile for FastAPI
- [ ] PostgreSQL container setup
- [ ] Environment variable management
- [ ] Production deployment guide
- [ ] Backup and restore procedures
- [ ] Monitoring setup

#### 12. **Testing**
**Status:** Not Started  
**Required:**
- [ ] Unit tests (Vitest for frontend)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] API tests (Pytest for FastAPI)
- [ ] Security tests
- [ ] Load testing (20-50 concurrent users)
- [ ] Accessibility tests (WCAG 2.2 AA)

#### 13. **Security Hardening**
**Status:** Basic Implementation  
**Required:**
- [ ] HTTPS in production
- [ ] Secure session management
- [ ] Rate limiting on all endpoints
- [ ] Input validation with Zod
- [ ] SQL injection prevention (use Prisma properly)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Encryption at rest
- [ ] Secrets management (not in .env files)
- [ ] Security headers

#### 14. **Data Privacy & Compliance**
**Status:** Not Started  
**Required:**
- [ ] Data retention policy implementation
- [ ] User data export feature
- [ ] User data deletion feature (GDPR)
- [ ] Consent management system
- [ ] Privacy policy integration
- [ ] Age verification (if required)
- [ ] Anonymization for research data

---

## 4. FEATURES OUT OF SCOPE (Per Documentation)

These are explicitly deferred:
- Native mobile apps
- Voice/image analysis
- Multilingual support
- Predictive risk modeling (XGBoost, SHAP)
- Kubernetes deployment
- Real-time monitoring dashboards

---

## 5. CRITICAL DECISIONS NEEDED

According to `KNOWN_ISSUES.md`, you need to decide:

| ID | Decision Required | Impact |
|---|---|---|
| K-001 | Target institution (single university vs general) | Profile fields, resources scope |
| K-002 | Dataset for classification (source, license, quality) | AI classifier feasibility |
| K-003 | LLM provider and budget | Cost planning |
| K-004 | **Qualified mental health professional reviewer** | **BLOCKER for production** |
| K-005 | **Crisis escalation protocol** | **CRITICAL safety requirement** |
| K-006 | Data retention schedule | Database schema, deletion logic |
| K-007 | PHQ-9/GAD-7 usage permissions | Assessment legality |
| K-008 | Production hosting and data region | Deployment planning |
| K-009 | Python database access pattern | Security architecture |
| K-010 | Authentication provider | Identity implementation |

---

## 6. TECH STACK MIGRATION PATH

### Option A: Align Implementation to Documentation (Recommended)
**Migrate to the documented stack:**
1. Migrate from React/Vite → **Next.js 14+ App Router**
2. Add **TypeScript** across the project
3. Create **FastAPI** service in `ai-service/` directory
4. Migrate MongoDB → **PostgreSQL + pgvector**
5. Replace Mongoose → **Prisma ORM**
6. Add **Docker Compose** for local development
7. Implement all missing features

**Pros:**
- Matches your professional documentation
- Scalable architecture
- Better for production deployment
- Proper separation of concerns

**Cons:**
- Significant development time (~4-6 weeks)
- Complete rewrite of database layer
- Learning curve for new technologies

### Option B: Update Documentation to Match Implementation
**Keep current stack and update docs:**
1. Keep React + Vite
2. Keep Express.js backend
3. Keep MongoDB
4. Integrate AI features into Express
5. Update all documentation

**Pros:**
- No migration work
- Continue with familiar stack

**Cons:**
- Less scalable
- Harder to implement RAG (no pgvector)
- Documentation was clearly designed for enterprise use
- Mixing AI logic with application logic

---

## 7. ESTIMATED EFFORT

| Phase | Features | Estimated Time |
|---|---|---|
| **Tech Stack Migration** | Next.js + FastAPI + PostgreSQL | 3-4 weeks |
| **Phase 2: Database & Auth** | Prisma schema, RBAC, consent | 2 weeks |
| **Phase 3: Core Workflows** | Chat persistence, assessments, mood, referrals | 3 weeks |
| **Phase 4: AI Foundation** | FastAPI service, LLM integration | 2 weeks |
| **Phase 5: Safety & NLP** | Safety system, classification | 3 weeks (+ professional review) |
| **Phase 6: RAG** | Knowledge base, embeddings, retrieval | 2-3 weeks |
| **Phase 7: Admin/Counselor** | Role-specific dashboards | 2 weeks |
| **Phase 8: Hardening** | Security, testing, deployment | 2-3 weeks |
| **TOTAL** | Full Implementation | **19-24 weeks (5-6 months)** |

---

## 8. IMMEDIATE NEXT STEPS

### 🔥 CRITICAL (Do First)

1. **Make Architecture Decision**
   - [ ] Choose: Migrate to Next.js/FastAPI OR Update docs to match current stack
   - [ ] Document decision in `DECISION_LOG.md`

2. **Close Open Questions**
   - [ ] Find qualified mental health professional reviewer
   - [ ] Define crisis escalation protocol
   - [ ] Obtain PHQ-9/GAD-7 usage permissions
   - [ ] Choose LLM provider and budget

3. **Database Design**
   - [ ] Finalize schema based on architecture decision
   - [ ] Implement missing entities
   - [ ] Add proper indexes and constraints

### 🟡 HIGH PRIORITY (Week 1-2)

4. **Safety System**
   - [ ] Get professional approval for safety protocol
   - [ ] Implement safety analysis
   - [ ] Add crisis resources display
   - [ ] Test failure scenarios

5. **Mental Health Assessments**
   - [ ] Implement PHQ-9 and GAD-7
   - [ ] Professional review of scoring
   - [ ] Add self-harm detection

6. **Chat Persistence**
   - [ ] Move conversations from localStorage to database
   - [ ] Implement ownership checks
   - [ ] Add retention policy

### 🟢 MEDIUM PRIORITY (Week 3-4)

7. **Complete RBAC**
   - [ ] Add admin role functionality
   - [ ] Implement counselor assignment
   - [ ] Audit sensitive actions

8. **Testing Setup**
   - [ ] Unit tests for critical functions
   - [ ] Integration tests for API
   - [ ] Security testing

---

## 9. RISK ASSESSMENT

### 🔴 HIGH RISK
- **No professional mental health review** - Cannot launch without this
- **No safety system** - Liability and user safety concern
- **Conversations not persisted** - Data loss risk
- **No proper authorization** - Privacy violation risk
- **No crisis escalation plan** - Legal and ethical issue

### 🟡 MEDIUM RISK
- **Architecture mismatch** - Confusion for future developers
- **No assessments** - Missing core mental health feature
- **No RAG system** - Limited AI capabilities
- **No testing** - Quality and reliability concerns

### 🟢 LOW RISK
- **No Docker setup** - Can deploy manually initially
- **UI/UX incomplete** - Can iterate after launch
- **Missing admin features** - Can add post-MVP

---

## 10. RECOMMENDATIONS

### For Academic Project (Capstone)
**If this is a capstone/thesis project with limited time:**

1. **Keep current stack** (React + Express + MongoDB)
2. **Update documentation** to match reality
3. **Focus on core features:**
   - ✅ Working AI chat (already done)
   - Add PHQ-9 assessment (3-4 days)
   - Add basic safety keyword detection (2-3 days)
   - Persist chats to database (2-3 days)
   - Complete counselor dashboard (3-4 days)
   - Add basic tests (3-4 days)
4. **Clearly document limitations** in thesis
5. **Add disclaimer:** "Prototype only, not for clinical use"

**Timeline:** 2-3 weeks to feature-complete MVP

### For Production/Startup
**If you intend to launch this as a real product:**

1. **Migrate to Next.js + FastAPI + PostgreSQL** (as documented)
2. **Hire or consult with:**
   - Licensed mental health professional
   - Healthcare compliance lawyer
   - Security expert
3. **Implement ALL safety features** before launch
4. **Comprehensive testing** including security audits
5. **Establish crisis protocols** with actual mental health services
6. **Obtain proper insurance** (malpractice, cyber liability)

**Timeline:** 6+ months with a team

---

## 11. CONCLUSION

You have a **solid foundation** with:
- Beautiful, modern UI
- Working authentication
- Basic AI chat integration
- Mood tracking functionality
- Basic resource management

However, **~70% of the documented system is not implemented**, particularly:
- ❌ Enterprise architecture (Next.js, FastAPI, PostgreSQL)
- ❌ Mental health assessments
- ❌ Safety system (CRITICAL)
- ❌ Chat persistence
- ❌ RAG system
- ❌ Proper authorization
- ❌ Professional review/approval

**Your immediate priority** should be deciding:
1. Is this an academic prototype or production system?
2. Should you migrate to the documented architecture?
3. Can you get professional mental health oversight?

Without professional review and a proper safety system, this **cannot ethically be deployed for real users**.

---

## 12. FILES TO UPDATE

Once you decide on the path forward, update these files:

### If Keeping Current Stack:
- [ ] `docs/requirements/SRS.md` - Change to React/Express/MongoDB
- [ ] `docs/architecture/ARCHITECTURE.md` - Update tech stack
- [ ] `docs/project/IMPLEMENTATION_PLAN.md` - Revise phases
- [ ] `docs/api/API_SPECIFICATION.md` - Express endpoints

### If Migrating to Documented Stack:
- [ ] Create migration plan document
- [ ] Set up Next.js project structure
- [ ] Create `ai-service/` directory with FastAPI
- [ ] Set up Docker Compose
- [ ] Create Prisma schema
- [ ] Implement data migration from MongoDB to PostgreSQL

---

**Document Version:** 1.0  
**Last Updated:** November 21, 2026  
**Next Review:** After architecture decision is made
