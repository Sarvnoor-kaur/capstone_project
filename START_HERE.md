# 🚀 Quick Start Guide - Phase 3

## ✅ Fixes Applied

All async/await bugs in `privacyController.js` and `privacyService.js` have been fixed!

---

## 🔧 How to Start the Application

### Step 1: Start Backend Server

Open a **new terminal** (Command Prompt or PowerShell):

```bash
cd c:\Users\sarvn\OneDrive\Desktop\projects\capstonemental\Digital_Mental_Health\backend
npm run dev
```

**Expected Output:**
```
Server running on port 5001
MongoDB connected
```

✅ If you see this, backend is running correctly!

❌ If you see errors:
- Check MongoDB is running
- Check `.env` file exists in backend folder
- Check no other process is using port 5001

---

### Step 2: Start Frontend

Open a **second terminal** (keep backend running):

```bash
cd c:\Users\sarvn\OneDrive\Desktop\projects\capstonemental\Digital_Mental_Health\frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ If you see this, frontend is running correctly!

---

### Step 3: Test in Browser

1. Open browser: http://localhost:5173
2. Login or Register
3. After login, you should see the dashboard
4. Click on the sidebar links:
   - **My Profile** - Edit your profile
   - **Consent** - Manage consents
   - **Privacy** - Data export and deletion

**No more 404 errors!** ✅

---

## 🐛 If You Still See 404 Errors

### Option A: Restart Backend Server

1. In the backend terminal, press `Ctrl + C`
2. Run again: `npm run dev`
3. Refresh your browser

### Option B: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option C: Check Backend Console

Look for any RED error messages in the backend terminal. Common errors:

- **"Cannot find module"** → File path issue
- **"EADDRINUSE"** → Port already in use
- **"MongoDB connection error"** → MongoDB not running

---

## ✅ Verification Checklist

Once both servers are running, verify:

- [ ] Backend shows "MongoDB connected"
- [ ] Frontend loads at http://localhost:5173
- [ ] Can login/register
- [ ] Dashboard loads
- [ ] Sidebar shows all menu items including:
  - My Profile
  - Consent
  - Privacy
- [ ] Clicking "My Profile" loads the page (no 404)
- [ ] Clicking "Consent" loads the page (no 404)
- [ ] Clicking "Privacy" loads the page (no 404)

---

## 📊 What's Implemented

### Student Profile Page
- ✅ View profile with completion percentage
- ✅ Edit mode for all fields
- ✅ Save/Cancel buttons
- ✅ Personal info (name, email, phone, DOB)
- ✅ Academic info (student ID, university, department, course, year)
- ✅ Bio section (500 char max)

### Consent Management Page
- ✅ View all 6 consent types
- ✅ Required vs optional distinction
- ✅ Accept consent button
- ✅ Withdraw consent button (with confirmation)
- ✅ Consent history modal
- ✅ Version tracking

### Privacy Settings Page
- ✅ Data privacy information
- ✅ Download data export (JSON file)
- ✅ Request account deletion
- ✅ View deletion status
- ✅ Cancel deletion request
- ✅ Legal documents links

---

## 🎯 Quick Test Flow

1. **Test Profile:**
   - Go to "My Profile"
   - Click "Edit Profile"
   - Change any field (e.g., phone number)
   - Click "Save Changes"
   - Verify success message
   - Refresh page - changes should persist

2. **Test Consents:**
   - Go to "Consent"
   - Accept a required consent (e.g., Terms of Service)
   - Accept an optional consent (e.g., AI Interaction)
   - Try to withdraw required - should show error
   - Withdraw optional consent - should work
   - Click "View Consent History" - should show all actions

3. **Test Privacy:**
   - Go to "Privacy"
   - Click "Download My Data"
   - Wait for processing (2-3 seconds)
   - JSON file should download automatically
   - Click "Delete My Account"
   - Confirm deletion
   - Verify pending deletion status shows
   - Click "Cancel Deletion Request"
   - Verify cancellation

---

## 🔍 Troubleshooting Commands

### Check if Backend is Running
```bash
# Windows
netstat -ano | findstr :5001
```
Should show something if backend is running.

### Kill Process on Port 5001 (if needed)
```bash
# Windows - Find PID
netstat -ano | findstr :5001

# Kill it
taskkill /PID <PID_NUMBER> /F
```

### Check MongoDB is Running
```bash
mongosh
```
Should connect. If not, start MongoDB service.

### Clear Node Modules (if issues persist)
```bash
# Backend
cd backend
rmdir /s /q node_modules
npm install

# Frontend
cd frontend
rmdir /s /q node_modules
npm install
```

---

## 📝 Environment Variables

Make sure `backend/.env` has:
```
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/mentalhealth
JWT_SECRET=mentalhealthsecretkey
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ No 404 errors in browser console  
✅ All pages load correctly  
✅ Form submissions work  
✅ Data persists after refresh  
✅ Success messages appear  
✅ No red errors in backend console  

---

## 📞 Need Help?

Check these files for more info:
- `TROUBLESHOOTING_404.md` - Detailed 404 troubleshooting
- `PHASE_3_COMPLETE.md` - Full implementation details
- Backend console - Look for error messages
- Browser DevTools → Console - Look for errors
- Browser DevTools → Network - Check API call statuses

---

**Phase 3 Status:** ✅ Complete and Ready to Test!

**Last Updated:** November 21, 2026
