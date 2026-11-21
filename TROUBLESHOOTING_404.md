# 🔧 Troubleshooting 404 Errors - Phase 3 Routes

## Problem
Getting 404 errors for:
- `/api/students/profile`
- `/api/consents`
- `/api/privacy/*`

## Root Cause Analysis

The errors indicate that the **backend server is not recognizing the new Phase 3 routes**. This can happen due to:

1. ❌ Backend server not running
2. ❌ Backend server needs restart
3. ❌ Routes not properly registered
4. ❌ Port mismatch

---

## ✅ Solution Steps

### Step 1: Verify Backend is Running

Open a terminal in the `backend` folder and check if the server is running:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5001
MongoDB connected
```

### Step 2: Restart Backend Server

If the server was already running, **restart it** to load the new routes:

1. Stop the server: `Ctrl + C`
2. Start again: `npm run dev`

### Step 3: Verify Routes Are Registered

Check the console output when the server starts. You should NOT see any errors about missing files.

### Step 4: Test Routes with curl

Open a new terminal and test if the backend is accessible:

```bash
# Test auth route (should work)
curl http://localhost:5001/api/auth/register

# Test new routes (should return 401 or valid response, not 404)
curl http://localhost:5001/api/students/profile
curl http://localhost:5001/api/consents
```

### Step 5: Check for Import Errors

Make sure all controller files exist:

```bash
cd backend
dir controllers\studentProfileController.js
dir controllers\consentController.js
dir controllers\privacyController.js
```

All three should exist.

---

## 🔍 Verification Checklist

- [ ] Backend server is running on port 5001
- [ ] No red errors in backend console
- [ ] MongoDB is connected
- [ ] All route files exist in `backend/routes/`
- [ ] All controller files exist in `backend/controllers/`
- [ ] All service files exist in `backend/services/`
- [ ] `.env` file has `PORT=5001`
- [ ] Frontend `axiosClient.js` points to `http://localhost:5001/api`

---

## 🐛 Common Issues

### Issue 1: "Cannot find module"
**Symptom:** Red error in backend console about missing file  
**Fix:** Verify all files are saved and exist

### Issue 2: Port already in use
**Symptom:** `Error: listen EADDRINUSE: address already in use :::5001`  
**Fix:** 
```bash
# Windows - Kill process on port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Then restart server
npm run dev
```

### Issue 3: MongoDB not connected
**Symptom:** `MongoDB connection error`  
**Fix:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongosh
```

If not installed, install MongoDB Community Edition

### Issue 4: JWT token expired or missing
**Symptom:** 401 errors instead of 404  
**Fix:** Login again to get a fresh token

---

## 📝 Quick Test Script

Save this as `test-routes.js` in the backend folder:

```javascript
// test-routes.js
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

async function testRoutes() {
  console.log('Testing Phase 3 routes...\n');
  
  const routes = [
    '/students/profile',
    '/consents',
    '/consents/definitions',
    '/privacy/delete-request/status'
  ];
  
  for (const route of routes) {
    try {
      const response = await fetch(`${BASE_URL}${route}`);
      const status = response.status;
      console.log(`${route}: ${status} ${status === 404 ? '❌ NOT FOUND' : '✅'}`);
    } catch (error) {
      console.log(`${route}: ❌ ERROR - ${error.message}`);
    }
  }
}

testRoutes();
```

Run with:
```bash
node test-routes.js
```

**Expected Results:**
- Should see `401` (unauthorized) or `403` (forbidden) - **NOT 404**
- 404 means route doesn't exist

---

## ✅ Final Check

Once backend is restarted, test in browser:

1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to `/profile` page
4. Check the request to `/api/students/profile`

**Success:** Status 200 or 401 (not 404)  
**Failure:** Status 404

---

## 🚀 Quick Fix Commands

**Windows (cmd):**
```batch
REM Stop backend if running (Ctrl+C in terminal)

REM Navigate to backend
cd backend

REM Install dependencies (if first time)
npm install

REM Start backend server
npm run dev

REM In another terminal, start frontend
cd ..\frontend
npm run dev
```

---

## 📞 Still Not Working?

If you still see 404 errors after following all steps:

1. **Check the backend console** - Look for any red error messages
2. **Verify file paths** - Make sure all files are in correct locations
3. **Check for typos** - Verify route paths match in:
   - `server.js` route registration
   - Route files (`studentProfileRoutes.js`, etc.)
   - Controller files
4. **Clear cache** - Sometimes browser cache causes issues:
   - Hard refresh: `Ctrl + Shift + R`
   - Clear localStorage: Open DevTools → Application → Local Storage → Clear

---

## 📋 Expected Backend Console Output

When backend starts correctly, you should see:

```
Server running on port 5001
MongoDB connected
```

**No errors about:**
- "Cannot find module"
- "SyntaxError"
- "Unexpected token"

---

## 🎯 What Should Work Now

After following these steps:

✅ `/api/students/profile` - Returns profile data or 401 (not 404)  
✅ `/api/consents` - Returns consents or 401 (not 404)  
✅ `/api/privacy/export` - Accepts POST request  
✅ All Phase 3 pages render without errors  
✅ Navigation sidebar shows all links  
✅ No 404 errors in browser console

---

**Last Updated:** November 21, 2026  
**Status:** Ready for testing after backend restart
