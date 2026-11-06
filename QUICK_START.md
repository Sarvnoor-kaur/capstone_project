# 🚀 Mentovya Quick Start Guide

## Installation & Setup

### 1. Install New Dependencies
```bash
cd frontend
npm install
```

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

## ✅ What's Been Redesigned

### Completed Pages:
1. ✅ **Landing Page** - Premium 3D hero with wellness orb
2. ✅ **Dashboard** - Modern layout with quick actions
3. ✅ **Design System** - Complete Mentovya brand CSS

### 3D Components Created:
- WellnessOrb - Landing page hero
- ChatAssistant3D - For AI chat
- BreathingOrb - For breathing exercises
- FloatingParticles - Ambient background
- Scene3D - Reusable 3D canvas wrapper

## 🎨 Import the Design System

All pages should import:
```jsx
import "../styles/mentovya.css";
```

## 📋 TODO: Remaining Pages

### High Priority:
1. **AIChatPage** - Add 3D assistant
2. **Breathing Exercise Page** - Create immersive interface
3. **MoodPage** - Enhance with better forms
4. **ResourcesPage** - Modern card layout
5. **SupportPage** - Premium request interface

### Medium Priority:
6. **LoginPage** - Apply Mentovya styling
7. **RegisterPage** - Match login design
8. **MoodForm Component** - Redesign selector
9. **DashboardLayout** - Apply new sidebar

## 🔗 Quick Links

- Main Design System: `frontend/src/styles/mentovya.css`
- 3D Components: `frontend/src/components/3d/`
- Redesigned Pages: `frontend/src/pages/`

## 💡 Using Design System

### Typography Classes:
```jsx
<h1 className="heading-display">Large Hero</h1>
<h2 className="heading-xl">Extra Large</h2>
<h3 className="heading-lg">Large</h3>
<p className="body-lg">Large body text</p>
```

### Card Styles:
```jsx
<div className="glass-card">Basic Glass Card</div>
<div className="glass-card-lg">Large Glass Card</div>
```

### Buttons:
```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-outline">Outline</button>
<button className="btn btn-lg">Large Button</button>
```

### Mood Badges:
```jsx
<span className="mood-badge mood-badge-happy">Happy</span>
<span className="mood-badge mood-badge-calm">Calm</span>
<span className="mood-badge mood-badge-anxious">Anxious</span>
```

## 🎯 Quick Test

1. Visit `http://localhost:5173`
2. You should see the new premium landing page with 3D orb
3. Register/Login
4. Dashboard should show modern layout with quick action cards
5. All existing functionality (mood tracking, AI chat) still works

## 🐛 Troubleshooting

**3D elements not showing?**
- Check browser console for WebGL errors
- Try in Chrome/Edge (best WebGL support)

**Styles not applying?**
- Clear browser cache
- Check import statements

**Backend errors?**
- Ensure MongoDB is running
- Check `.env` file exists with proper keys

## 📱 Test Responsive

- Desktop: 1920px
- Tablet: 768px
- Mobile: 375px

All layouts are fully responsive!

## 🎨 Color Reference

Quick copy-paste:
```css
--ivory: #F8F7F3;
--lavender: #DCD6F7;
--navy: #202338;
--sage: #B8C9B3;
--peach: #F4CDBB;
```

---

Happy coding! 🚀 Your Mentovya redesign is ready to shine!
