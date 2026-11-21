# Phase 3 Implementation Report - Pre-Implementation Analysis

**Date:** November 21, 2026  
**Project:** Mentovya Mental Health Support Platform  
**Phase:** Phase 3 (Student Profile & Consent Management)

---

## 1. EXISTING IMPLEMENTATION INSPECTION

### ✅ Models Already Created (Phase 1 & 2)

#### User Model
- ✅ Has name, email, passwordHash, role fields
- ✅ Has isActive, isEmailVerified, lastLogin
- ✅ Has account locking mechanism
- ✅ Supports 'student', 'counselor', 'admin' roles
- ❌ Missing: profilePicture, phoneNumber, dateOfBirth, bio

#### StudentProfile Model
- ✅ Has userId, studentId, university, department, course, yearOfStudy
- ✅ Has preferences (communicationMode, notificationsEnabled, theme)
- ❌ Missing: profilePicture, phoneNumber, dateOfBirth, bio

#### Consent Model
- ✅ Has userId, consentType, consentVersion, isAccepted
- ✅ Has acceptedAt, withdrawnAt
- ✅ Has ipAddress, userAgent for tracking
- ✅ Has withdraw() method
- ✅ Supports required consent types
- ❌ Missing: purpose field (optional enhancement)

### ✅ Middleware Already Created

#### Authentication Middleware (`authMiddleware.js`)
- ✅ `protect` - JWT verification and user attachment
- ✅ `requireRole` - Role-based access control
- ❌ Missing: Ownership verification middleware

### ✅ Frontend Context

#### AuthContext
- ✅ User state management
- ✅ Login/logout functionality
- ✅ Token persistence
- ✅ Auto-fetch user on mount

---

## 2. REQUIRED MODIFICATIONS

### Models to Extend

#### StudentProfile (Add Optional Fields)
```javascript
{
  // Add these fields:
  profilePicture: String,
  phoneNumber: String,
  dateOfBirth: Date,
  bio: String (max 500 chars)
}
```

#### User Model (Optional - for profile picture at user level)
- Consider adding profilePicture at User level for all roles
- Or keep it only in StudentProfile

---

## 3. NEW FILES TO CREATE

### Backend Files (9 files)

#### Middleware (1 file)
```
backend/middleware/
└── ownership.js          # NEW - Verify resource ownership
```

#### Services (2 files)
```
backend/services/
├── consentService.js     # NEW - Consent business logic
└── privacyService.js     # NEW - Data export & deletion
```

#### Routes (3 files)
```
backend/routes/
├── studentProfileRoutes.js    # NEW - Student profile CRUD
├── consentRoutes.js           # NEW - Consent management
└── privacyRoutes.js           # NEW - Privacy & data export
```

#### Controllers (3 files)
```
backend/controllers/
├── studentProfileController.js  # NEW
├── consentController.js         # NEW
└── privacyController.js         # NEW
```

### Frontend Files (4 pages + 3 components)

#### Pages (4 files)
```
frontend/src/pages/
├── StudentProfilePage.jsx      # NEW - View/edit profile
├── PrivacySettingsPage.jsx     # NEW - Privacy dashboard
├── ConsentManagementPage.jsx   # NEW - Manage consents
└── DataExportPage.jsx          # NEW - Data export UI
```

#### Components (3 files)
```
frontend/src/components/
├── ProfilePictureUpload.jsx    # NEW - Image upload
├── ConsentCard.jsx             # NEW - Single consent UI
└── ProfileCompletionBar.jsx    # NEW - Profile progress
```

---

## 4. FILES TO MODIFY

### Backend (2 files)

1. **backend/models/StudentProfile.js**
   - Add: profilePicture, phoneNumber, dateOfBirth, bio

2. **backend/server.js**
   - Add: New route handlers for profile, consent, privacy

### Frontend (2 files)

1. **frontend/src/App.jsx**
   - Add: New route definitions

2. **frontend/src/components/DashboardLayout.jsx** (if exists)
   - Add: Navigation links to profile and privacy pages

---

## 5. API ENDPOINTS TO IMPLEMENT

### Student Profile APIs

```
GET    /api/students/profile           # Get own profile
PUT    /api/students/profile           # Update full profile
PATCH  /api/students/profile/picture   # Update profile picture
PATCH  /api/students/profile/preferences  # Update preferences only
GET    /api/students/profile/completion   # Get completion percentage
```

### Consent APIs

```
GET    /api/consents                   # Get current consents
GET    /api/consents/history           # Get consent history
POST   /api/consents                   # Accept consent
PATCH  /api/consents/:id/withdraw      # Withdraw consent
GET    /api/consents/required          # Get required consents
```

### Privacy APIs

```
POST   /api/privacy/export             # Request data export
GET    /api/privacy/export/:requestId  # Download export
POST   /api/privacy/delete-request     # Request account deletion
GET    /api/privacy/delete-request/status  # Check deletion status
```

---

## 6. CONSENT CONFIGURATION

### Required Consents (Cannot create account without)
1. **terms_of_service** - v1.0 - Required
2. **privacy_policy** - v1.0 - Required

### Optional Consents (Can be toggled)
3. **data_processing** - v1.0 - Optional (required for some features)
4. **ai_interaction** - v1.0 - Optional (required for AI chat)
5. **counselor_sharing** - v1.0 - Optional (required for referrals)
6. **research_participation** - v1.0 - Optional

### Consent Descriptions

```javascript
const CONSENT_DEFINITIONS = {
  terms_of_service: {
    title: "Terms of Service",
    description: "I agree to the Mentovya Terms of Service and Community Guidelines.",
    required: true,
    version: "1.0"
  },
  privacy_policy: {
    title: "Privacy Policy",
    description: "I acknowledge that I have read and understand the Privacy Policy.",
    required: true,
    version: "1.0"
  },
  data_processing: {
    title: "Data Processing",
    description: "I consent to processing of my mental wellness data for service improvement.",
    required: false,
    version: "1.0"
  },
  ai_interaction: {
    title: "AI Chat Processing",
    description: "I consent to my chat conversations being processed by AI for support purposes.",
    required: false,
    requiredFor: ["AI Chat"],
    version: "1.0"
  },
  counselor_sharing: {
    title: "Counselor Data Sharing",
    description: "I consent to sharing my assessment results and mood data with assigned counselors.",
    required: false,
    requiredFor: ["Counselor Referrals"],
    version: "1.0"
  },
  research_participation: {
    title: "Research Participation",
    description: "I consent to anonymized use of my data for mental health research.",
    required: false,
    version: "1.0"
  }
};
```

---

## 7. DATA EXPORT STRUCTURE

### Export Format (JSON)
```javascript
{
  "exportDate": "2026-11-21T...",
  "userId": "...",
  "user": {
    "name": "...",
    "email": "...",
    "role": "student",
    "createdAt": "..."
  },
  "studentProfile": {
    "studentId": "...",
    "university": "...",
    // ... all profile fields
  },
  "consents": [...],
  "moodEntries": [...],
  "conversations": [...],
  "messages": [...],
  "assessmentAttempts": [...],
  "assessmentResults": [...],
  "referrals": [...]
}
```

### Excluded from Export
- passwordHash
- JWT tokens
- Internal IDs of other users
- Admin audit logs
- Safety events (requires special permission)
- Other users' data

---

## 8. PROFILE COMPLETION CALCULATION

```javascript
const calculateCompletion = (user, profile) => {
  const fields = [
    user.name,              // Required (always 1)
    user.email,             // Required (always 1)
    profile.studentId,
    profile.university,
    profile.department,
    profile.course,
    profile.yearOfStudy,
    profile.profilePicture,
    profile.phoneNumber,
    profile.bio
  ];
  
  const completed = fields.filter(f => f && f.trim()).length;
  return Math.round((completed / fields.length) * 100);
};
```

---

## 9. SECURITY CONSIDERATIONS

### Ownership Middleware
```javascript
// Verify that req.user._id matches the resource owner
// Prevent students from accessing other students' data
```

### Profile Picture Upload
- Accept only: .jpg, .jpeg, .png, .gif
- Max size: 5MB
- Store in: `uploads/profiles/` or cloud storage
- Validate file type server-side
- Generate unique filenames
- Serve via protected route or CDN

### Consent Validation
- Verify userId matches authenticated user
- Don't allow backdating acceptedAt
- Maintain full history
- Required consents cannot be withdrawn
- Withdrawing optional consent doesn't delete account

### Data Export Security
- Generate temporary download tokens
- Expire tokens after 1 hour
- Rate limit: 1 export per 24 hours
- Log export requests
- Don't email sensitive data

---

## 10. IMPLEMENTATION CHECKLIST

### Phase 3A: Models & Middleware (2 hours)
- [ ] Extend StudentProfile model
- [ ] Create ownership middleware
- [ ] Create consent service
- [ ] Create privacy service
- [ ] Test model changes

### Phase 3B: Backend APIs (3 hours)
- [ ] Create studentProfileController
- [ ] Create consentController
- [ ] Create privacyController
- [ ] Create profile routes
- [ ] Create consent routes
- [ ] Create privacy routes
- [ ] Add routes to server.js
- [ ] Test all endpoints

### Phase 3C: Frontend Pages (3 hours)
- [ ] Create StudentProfilePage
- [ ] Create PrivacySettingsPage
- [ ] Create ConsentManagementPage
- [ ] Create DataExportPage
- [ ] Create ProfilePictureUpload component
- [ ] Create ConsentCard component
- [ ] Create ProfileCompletionBar component

### Phase 3D: Integration (1 hour)
- [ ] Update App.jsx with routes
- [ ] Update navigation
- [ ] Update AuthContext if needed
- [ ] Test full flow

### Phase 3E: Testing (1 hour)
- [ ] Manual API testing
- [ ] Security testing
- [ ] Ownership testing
- [ ] Consent workflow testing
- [ ] Data export testing

---

## 11. ACCEPTANCE CRITERIA CHECKLIST

- [ ] Students can view their own profile
- [ ] Students can edit their profile
- [ ] Students cannot edit other students' profiles
- [ ] Students cannot change role or account status
- [ ] Profile picture upload works
- [ ] Profile completion percentage displays
- [ ] Consent acceptance works
- [ ] Consent withdrawal works
- [ ] Consent history is maintained
- [ ] Required consents cannot be withdrawn
- [ ] Optional consents work correctly
- [ ] Privacy settings page works
- [ ] Data export generates correct JSON
- [ ] Data export contains only own data
- [ ] Account deletion request works
- [ ] Audit logging for sensitive operations
- [ ] Existing features still work

---

## 12. ESTIMATED TIMELINE

| Task | Hours |
|---|---|
| Models & Middleware | 2h |
| Backend APIs | 3h |
| Frontend Pages | 3h |
| Integration | 1h |
| Testing | 1h |
| **TOTAL** | **10 hours** |

---

## 13. KNOWN LIMITATIONS

### Out of Scope for Phase 3
- Email verification system
- File storage on cloud (S3, Cloudinary)
- Automated data deletion execution
- GDPR compliance automation
- Multi-language consent text
- Consent version migration
- Profile picture cropping/editing
- Real-time profile sync
- Profile analytics

### Requires Phase 4+
- Counselor profile management
- Admin user management
- Advanced privacy controls
- Data anonymization
- Automated retention policies

---

## 14. NEXT STEPS

1. **Get Approval** - Confirm this implementation plan
2. **Start Implementation** - Begin with models and middleware
3. **Test Incrementally** - Test each component as it's built
4. **Document** - Update API docs and user guides
5. **Deploy to Dev** - Test in development environment

---

**Report Prepared:** November 21, 2026  
**Ready to Begin Implementation:** Yes  
**Estimated Completion:** 10 working hours
