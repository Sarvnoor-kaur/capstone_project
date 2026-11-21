# Phase 1 & 2 Implementation Report - Pre-Implementation Analysis

**Date:** November 21, 2026  
**Project:** Mentovya Mental Health Support Platform  
**Phases:** Phase 1 (Database Architecture) + Phase 2 (Authentication & RBAC)

---

## 1. EXISTING PROJECT ANALYSIS

### ✅ Current Implementation Status

#### Backend Structure
```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── middleware/
│   └── authMiddleware.js        # JWT auth + role check
├── models/
│   ├── User.js                  # Basic user model
│   ├── MoodEntry.js             # Mood tracking
│   ├── Resource.js              # Resources
│   └── SupportRequest.js        # Support requests (referrals)
├── routes/
│   ├── authRoutes.js            # Register, login, /me
│   ├── moodRoutes.js            # Mood CRUD
│   ├── resourceRoutes.js        # Resource CRUD
│   ├── supportRoutes.js         # Support request CRUD
│   └── aiChatRoutes.js          # Gemini AI chat
├── server.js                    # Express server
├── seed.js                      # Database seeding
└── package.json
```

#### Dependencies Installed
- ✅ express
- ✅ mongoose
- ✅ cors
- ✅ dotenv
- ✅ bcryptjs
- ✅ jsonwebtoken
- ✅ @google/generative-ai
- ✅ nodemon (dev)

#### Current Models

**User Model** (`models/User.js`):
```javascript
{
  name: String (required)
  email: String (unique, required)
  passwordHash: String (required)
  role: String (enum: ['student', 'counselor'], default: 'student')
  institution: String
  program: String
  year: String
  timestamps: true
}
```

**MoodEntry Model**:
```javascript
{
  user: ObjectId -> User
  mood: Number (1-5)
  note: String
  date: Date
  timestamps: true
}
```

**Resource Model**:
```javascript
{
  title: String (required)
  category: String (required)
  description: String
  link: String
  tags: [String]
  createdBy: ObjectId -> User
  timestamps: true
}
```

**SupportRequest Model**:
```javascript
{
  student: ObjectId -> User (required)
  topic: String (required)
  preferredMode: String (enum: ['email', 'call', 'in_person'])
  description: String (required)
  status: String (enum: ['open', 'in_progress', 'closed'])
  counselorNote: String
  timestamps: true
}
```

#### Current Authentication

**Middleware** (`middleware/authMiddleware.js`):
- `protect`: JWT verification, attaches user to `req.user`
- `requireRole(roles)`: Role-based access control

**Auth Routes** (`routes/authRoutes.js`):
- POST `/api/auth/register` - Register student
- POST `/api/auth/login` - Login with email/password
- GET `/api/auth/me` - Get current user (protected)

**Current Features**:
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token generation (30-day expiry)
- ✅ Email uniqueness check
- ✅ Role-based routing ('student', 'counselor')
- ❌ No Admin role
- ❌ No account status (isActive) tracking
- ❌ No email verification
- ❌ No lastLogin tracking
- ❌ No password change endpoint
- ❌ No rate limiting
- ❌ No ownership verification middleware

---

## 2. MISSING FUNCTIONALITY (Required for Phase 1 & 2)

### 🔴 Missing Database Collections (11 collections)

1. **StudentProfile** - Extended student information
2. **CounselorProfile** - Extended counselor information
3. **Consent** - User consent tracking
4. **Conversation** - AI chat conversations
5. **Message** - Chat messages
6. **AssessmentDefinition** - PHQ-9, GAD-7 definitions
7. **AssessmentAttempt** - User assessment attempts
8. **AssessmentResult** - Scored results
9. **SafetyEvent** - Safety incident logs
10. **Referral** - Proper referral system (replace SupportRequest)
11. **ReferralUpdate** - Referral history
12. **KnowledgeDocument** - Document metadata
13. **KnowledgeChunk** - Document chunks with embeddings
14. **AuditLog** - Admin action tracking

### 🔴 Missing Authentication Features

1. **Admin role** - Add to User model
2. **Account status tracking** - isActive, isEmailVerified, lastLogin
3. **Role restrictions** - Prevent public admin/counselor registration
4. **Ownership verification** - Middleware to check resource ownership
5. **Password change** - Secure password update endpoint
6. **Rate limiting** - Protect login/register endpoints
7. **Token refresh** - Optional refresh token mechanism
8. **Session management** - Track active sessions
9. **Email verification** - Verify email addresses
10. **Failed login tracking** - Account lockout after N failures

### 🔴 Missing RBAC Features

1. **Counselor assignment** - Assign counselors to referrals
2. **Admin-only routes** - User management, resource approval
3. **Counselor-only routes** - Assigned referral access
4. **Audit logging** - Log all sensitive operations
5. **Consent checking** - Verify consent before data sharing
6. **Resource approval workflow** - Admin approval required

---

## 3. FILES TO BE CREATED

### New Model Files (14 files)
```
backend/models/
├── StudentProfile.js          # NEW
├── CounselorProfile.js        # NEW
├── Consent.js                 # NEW
├── Conversation.js            # NEW
├── Message.js                 # NEW
├── AssessmentDefinition.js    # NEW
├── AssessmentAttempt.js       # NEW
├── AssessmentResult.js        # NEW
├── SafetyEvent.js             # NEW
├── Referral.js                # NEW
├── ReferralUpdate.js          # NEW
├── KnowledgeDocument.js       # NEW
├── KnowledgeChunk.js          # NEW
└── AuditLog.js                # NEW
```

### New Middleware Files (3 files)
```
backend/middleware/
├── ownership.js               # NEW - Ownership verification
├── validation.js              # NEW - Input validation
└── rateLimiter.js             # NEW - Rate limiting
```

### New Service Files (3 files)
```
backend/services/              # NEW DIRECTORY
├── auditService.js            # Audit logging
├── consentService.js          # Consent management
└── authService.js             # Auth business logic
```

### New Route Files (2 files)
```
backend/routes/
├── adminRoutes.js             # NEW - Admin management
└── counselorRoutes.js         # NEW - Counselor dashboard
```

### New Utility Files (1 file)
```
backend/utils/                 # NEW DIRECTORY
└── validators.js              # Input validators
```

---

## 4. FILES TO BE MODIFIED

### Existing Files Requiring Updates (7 files)

1. **backend/models/User.js**
   - Add: isActive, isEmailVerified, lastLogin, failedLoginAttempts, lockUntil
   - Update: Add 'admin' to role enum
   - Add: Methods for account locking

2. **backend/models/SupportRequest.js**
   - Deprecate in favor of Referral model
   - Add migration notes

3. **backend/middleware/authMiddleware.js**
   - Update: protect middleware to check isActive
   - Update: Better error messages
   - Add: Token expiry handling

4. **backend/routes/authRoutes.js**
   - Update: Registration to create StudentProfile + Consent
   - Update: Login to update lastLogin and track failures
   - Add: Password change endpoint
   - Add: Rate limiting

5. **backend/routes/resourceRoutes.js**
   - Add: Approval workflow
   - Add: Admin approval required
   - Update: Filter by approvalStatus

6. **backend/routes/supportRoutes.js**
   - Update: Documentation to point to new referral system
   - Keep for backward compatibility (Phase 3 migration)

7. **backend/server.js**
   - Add: New route handlers
   - Add: Rate limiter middleware
   - Add: Helmet security headers
   - Update: Error handling

---

## 5. IMPLEMENTATION STRATEGY

### Phase 1A: Database Models (Priority 1)
**Time Estimate:** 3-4 hours

1. Create all 14 new Mongoose models
2. Add indexes for performance
3. Add validation and enums
4. Test model creation

**Order:**
1. StudentProfile, CounselorProfile (extend User)
2. Consent (required for registration)
3. Conversation, Message (chat persistence)
4. Referral, ReferralUpdate (replace SupportRequest)
5. AssessmentDefinition, AssessmentAttempt, AssessmentResult (screening)
6. SafetyEvent (safety tracking)
7. KnowledgeDocument, KnowledgeChunk (RAG)
8. AuditLog (compliance)

### Phase 1B: Update Existing Models
**Time Estimate:** 1 hour

1. Update User model with new fields
2. Test backward compatibility
3. Update existing routes if needed

### Phase 2A: Enhanced Authentication
**Time Estimate:** 2-3 hours

1. Create auth service layer
2. Update registration flow
3. Update login flow
4. Add password change
5. Add rate limiting

### Phase 2B: RBAC Implementation
**Time Estimate:** 2-3 hours

1. Create ownership middleware
2. Create admin routes
3. Create counselor routes
4. Add authorization checks to existing routes
5. Implement audit logging

### Phase 2C: Testing
**Time Estimate:** 2 hours

1. Manual API testing
2. Security testing
3. Role permission testing

---

## 6. POTENTIAL BREAKING CHANGES

### ⚠️ HIGH RISK

1. **User Model Changes**
   - Adding new required fields may break existing users
   - **Solution:** Set defaults for existing users

2. **SupportRequest → Referral Migration**
   - Existing support requests need migration
   - **Solution:** Keep SupportRequest for backward compatibility, add migration script

3. **Authentication Flow Changes**
   - Frontend needs to handle new response structure
   - **Solution:** Maintain backward compatibility, add new fields gradually

### ⚠️ MEDIUM RISK

1. **Role Enum Update**
   - Adding 'admin' role to existing enum
   - **Solution:** No breaking change, just addition

2. **New Required Consents**
   - Registration now requires consent
   - **Solution:** Create default consent during registration

### ⚠️ LOW RISK

1. **New Middleware**
   - Additional middleware may slow down requests
   - **Solution:** Optimize middleware, use caching

---

## 7. ENVIRONMENT VARIABLES REQUIRED

### Current Variables (from .env.example)
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/mentalhealth
JWT_SECRET=mentalhealthsecretkey
GEMINI_API_KEY=your_gemini_api_key_here
```

### New Variables Needed
```env
# Authentication
JWT_EXPIRY=30d
JWT_REFRESH_SECRET=refresh_secret_here
JWT_REFRESH_EXPIRY=90d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5

# Email (for verification - Phase 3)
# EMAIL_SERVICE=gmail
# EMAIL_USER=your_email
# EMAIL_PASSWORD=your_password

# Security
BCRYPT_ROUNDS=10
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_DURATION_MS=1800000

# Admin (initial setup)
ADMIN_SETUP_KEY=secure_admin_setup_key_here
```

---

## 8. API ENDPOINT CHANGES

### New Endpoints to Add

#### Authentication
```
POST   /api/auth/register          # Updated with consent
POST   /api/auth/login             # Updated with tracking
POST   /api/auth/logout            # New
PATCH  /api/auth/change-password   # New
GET    /api/auth/me                # Existing
```

#### Admin Routes (NEW)
```
GET    /api/admin/users            # List all users
PATCH  /api/admin/users/:id/status # Activate/deactivate
PATCH  /api/admin/users/:id/role   # Change role
POST   /api/admin/counselors/approve/:id  # Approve counselor
GET    /api/admin/audit-logs       # View audit logs
GET    /api/admin/stats            # System statistics
```

#### Counselor Routes (NEW)
```
GET    /api/counselor/profile      # Get own profile
PUT    /api/counselor/profile      # Update own profile
GET    /api/counselor/referrals    # Get assigned referrals
PATCH  /api/counselor/referrals/:id # Update referral status
```

#### User Routes (NEW)
```
GET    /api/users/me               # Existing (move from /api/auth/me)
PUT    /api/users/me               # Update profile
GET    /api/users/me/consents      # Get consents
POST   /api/users/me/consents      # Update consent
```

### Updated Endpoints

#### Resources (UPDATED)
```
GET    /api/resources              # Filter by approved only
POST   /api/resources              # Counselor creates (pending approval)
PUT    /api/resources/:id          # Update own resource
DELETE /api/resources/:id          # Soft delete
PATCH  /api/resources/:id/approve  # Admin approves (NEW)
```

---

## 9. DATABASE SCHEMA SUMMARY

### Collection Relationships

```
User (1) ----< (N) StudentProfile
User (1) ----< (N) CounselorProfile
User (1) ----< (N) Consent
User (1) ----< (N) Conversation
Conversation (1) ----< (N) Message
User (1) ----< (N) AssessmentAttempt
AssessmentDefinition (1) ----< (N) AssessmentAttempt
AssessmentAttempt (1) ----< (1) AssessmentResult
User (1) ----< (N) MoodEntry
User (1) ----< (N) Referral (as student)
User (1) ----< (N) Referral (as counselor)
Referral (1) ----< (N) ReferralUpdate
User (1) ----< (N) SafetyEvent
KnowledgeDocument (1) ----< (N) KnowledgeChunk
User (1) ----< (N) AuditLog
```

### Index Strategy

**User:**
- email (unique)
- role
- isActive

**Conversation:**
- userId, updatedAt (compound)

**Message:**
- conversationId, timestamp (compound)

**AssessmentAttempt:**
- userId, completedAt (compound)

**MoodEntry:**
- userId, date (compound)

**Referral:**
- studentId, createdAt (compound)
- counselorId, status (compound)

**SafetyEvent:**
- userId, createdAt (compound)
- severity, status (compound)

**KnowledgeChunk:**
- documentId
- approvalStatus

**AuditLog:**
- userId, timestamp (compound)
- resourceType, action (compound)

---

## 10. IMPLEMENTATION CHECKLIST

### Pre-Implementation
- [x] Analyze existing code
- [x] Document current functionality
- [x] Identify missing features
- [ ] Backup database
- [ ] Create development branch

### Phase 1: Database Models
- [ ] Create StudentProfile model
- [ ] Create CounselorProfile model
- [ ] Create Consent model
- [ ] Create Conversation model
- [ ] Create Message model
- [ ] Create AssessmentDefinition model
- [ ] Create AssessmentAttempt model
- [ ] Create AssessmentResult model
- [ ] Create SafetyEvent model
- [ ] Create Referral model
- [ ] Create ReferralUpdate model
- [ ] Create KnowledgeDocument model
- [ ] Create KnowledgeChunk model
- [ ] Create AuditLog model
- [ ] Update User model
- [ ] Test all models

### Phase 2A: Authentication
- [ ] Create auth service
- [ ] Create audit service
- [ ] Create consent service
- [ ] Update registration endpoint
- [ ] Update login endpoint
- [ ] Add logout endpoint
- [ ] Add password change endpoint
- [ ] Add rate limiting middleware
- [ ] Update auth middleware
- [ ] Test authentication flow

### Phase 2B: RBAC
- [ ] Create ownership middleware
- [ ] Create validation middleware
- [ ] Create admin routes
- [ ] Create counselor routes
- [ ] Update resource routes
- [ ] Add authorization to existing routes
- [ ] Implement audit logging
- [ ] Test permissions

### Testing
- [ ] Manual API tests
- [ ] Security tests
- [ ] Role permission tests
- [ ] Ownership tests
- [ ] Rate limiting tests

### Documentation
- [ ] Update API documentation
- [ ] Create migration guide
- [ ] Update README
- [ ] Document breaking changes

---

## 11. KNOWN ISSUES & LIMITATIONS

### Current Issues
1. No email verification system
2. No password reset functionality
3. No account recovery
4. No session management
5. No refresh tokens
6. Passwords stored with bcrypt (good, but consider argon2)
7. JWT stored in localStorage (XSS vulnerable)
8. No HTTPS enforcement
9. No CORS restrictions
10. No input sanitization

### Out of Scope (Phase 3+)
- Email verification system
- Password reset via email
- Two-factor authentication
- OAuth integration
- Advanced session management
- Real-time notifications
- Assessment implementation (PHQ-9, GAD-7)
- Safety detection system
- RAG implementation
- AI conversation persistence

---

## 12. NEXT STEPS

1. **Get Approval** - Confirm this implementation plan
2. **Backup Database** - Export existing data
3. **Create Branch** - `git checkout -b phase-1-2-implementation`
4. **Implement Phase 1** - Create all database models
5. **Implement Phase 2** - Add authentication & RBAC
6. **Test Thoroughly** - Manual and automated tests
7. **Document Changes** - Update all documentation
8. **Deploy to Dev** - Test in development environment
9. **Migrate Data** - If needed, migrate existing data
10. **Production Deployment** - After thorough testing

---

## 13. ESTIMATED TIMELINE

| Phase | Task | Hours | Status |
|---|---|---|---|
| **Phase 1A** | Create new models (14 models) | 3-4h | Not Started |
| **Phase 1B** | Update existing models | 1h | Not Started |
| **Phase 2A** | Enhanced authentication | 2-3h | Not Started |
| **Phase 2B** | RBAC implementation | 2-3h | Not Started |
| **Phase 2C** | Testing & debugging | 2h | Not Started |
| **Documentation** | Update docs | 1h | Not Started |
| **TOTAL** | | **11-14 hours** | |

---

## 14. SUCCESS CRITERIA

✅ **Phase 1 Complete When:**
- All 14 new models created and tested
- User model updated with new fields
- Database indexes created
- Models connect to MongoDB successfully
- No breaking changes to existing functionality

✅ **Phase 2 Complete When:**
- Student registration creates profile + consent
- Login tracks lastLogin and failed attempts
- Admin role functional
- Counselor profile management works
- Admin can manage users and resources
- Counselor can view assigned referrals only
- Ownership middleware prevents unauthorized access
- Audit logging tracks sensitive operations
- Rate limiting protects auth endpoints
- All tests pass
- Documentation updated

---

**Report Generated:** November 21, 2026  
**Next Action:** Await approval to proceed with implementation  
**Estimated Completion:** Phase 1 & 2 can be completed in 11-14 working hours
