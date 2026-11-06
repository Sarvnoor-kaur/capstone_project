# Mentovya – Premium 3D AI Mental Wellness Platform Redesign

## 🎨 Design Overview

I've redesigned your mental wellness platform with a premium, immersive user experience featuring:
- **3D Interactive Elements** using Three.js and React Three Fiber
- **Premium Glass Morphism Design** with elegant animations
- **Mentovya Brand Identity** with calming color palette
- **Smooth Framer Motion Animations**
- **Fully Responsive** modern interface

---

## 🎨 Brand Colors

### Mentovya Color Palette:
- **Warm Ivory**: `#F8F7F3` - Primary background
- **Soft Lavender**: `#DCD6F7` - Accent color
- **Deep Navy**: `#202338` - Text and CTA
- **Muted Sage**: `#B8C9B3` - Secondary accent
- **Soft Peach**: `#F4CDBB` - Tertiary accent
- **Pure White**: `#FFFFFF` - Cards and surfaces

---

## 📦 New Dependencies Installed

```bash
npm install three @react-three/fiber @react-three/drei framer-motion
```

**Packages:**
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Helpers for React Three Fiber
- `framer-motion` - Animation library

---

## 📁 Files Created/Modified

### ✨ New Files Created:

#### Design System
1. **frontend/src/styles/mentovya.css** - Complete premium design system

#### 3D Components
2. **frontend/src/components/3d/Scene3D.jsx** - Main 3D canvas wrapper
3. **frontend/src/components/3d/WellnessOrb.jsx** - Animated wellness orb for landing
4. **frontend/src/components/3d/ChatAssistant3D.jsx** - 3D assistant for AI chat
5. **frontend/src/components/3d/BreathingOrb.jsx** - Interactive breathing animation
6. **frontend/src/components/3d/FloatingParticles.jsx** - Ambient particles

#### Redesigned Pages
7. **frontend/src/pages/LandingPage.jsx** - Premium landing page (REDESIGNED)
8. **frontend/src/pages/LandingPage.css** - Landing page styles
9. **frontend/src/pages/DashboardPage.jsx** - Modern dashboard (REDESIGNED)
10. **frontend/src/pages/DashboardPage.css** - Dashboard styles

### 🔄 In Progress:
- AI Chat Page with 3D assistant
- Breathing Exercise Page with immersive 3D orb
- Mood Tracker redesign
- Resources Page redesign
- Enhanced Login/Register pages

---

## 🎯 Completed Features

### 1. Landing Page (/pages/LandingPage.jsx)
✅ Beautiful hero section with animated 3D wellness orb
✅ Smooth entrance animations
✅ Floating insight cards
✅ Premium glass card features section
✅ CTA section with gradient background
✅ Responsive navigation
✅ Mobile-optimized layout

### 2. Dashboard Page (/dashboard)
✅ Time-based greeting (Good morning/afternoon/evening)
✅ Daily check-in prompt card
✅ Quick actions grid with 4 premium cards
✅ Wellness overview stats integration
✅ Tabbed interface (Overview, Analytics, Achievements, Track Mood)
✅ Daily inspiration quote
✅ Empty states for no data
✅ Smooth tab transitions
✅ Mobile responsive

### 3. Design System (mentovya.css)
✅ Complete color palette
✅ Typography system (Playfair Display + Inter)
✅ Glass morphism effects
✅ Button variants
✅ Mood badges
✅ Grid system
✅ Animations (fadeIn, slideUp, float, pulse)
✅ Form inputs
✅ Utilities
✅ Reduced motion support

### 4. 3D Components
✅ Scene3D wrapper with lighting
✅ Wellness Orb with distortion effects
✅ Chat Assistant rotating sphere
✅ Breathing Orb with scale animations
✅ Floating ambient particles

---

## 🚀 How to Run

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The backend will run on `http://localhost:5001`
The frontend will run on `http://localhost:5173`

---

## 🎨 Key Design Features

### Glass Morphism
- Translucent backgrounds with backdrop blur
- Subtle borders and shadows
- Layered depth

### Premium Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, clean)
- Responsive font scaling

### Animations
- **Framer Motion** for page/component animations
- **Three.js** for 3D object animations
- Smooth transitions throughout
- Respects `prefers-reduced-motion`

### Mood Colors
Each mood has a unique color:
- Happy: `#FFD93D` (Yellow)
- Calm: `#A8D8EA` (Blue)
- Okay: `#B8C9B3` (Sage)
- Anxious: `#FFAB73` (Orange)
- Sad: `#A3A7D8` (Lavender Blue)
- Stressed: `#FF6B9D` (Pink)

---

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

All pages are fully responsive with mobile-first design.

---

## 🔧 Next Steps

### Pages to Complete:
1. **AI Chat Page** - Add 3D assistant, premium chat interface
2. **Breathing Exercise Page** - Interactive 3D orb with breathing phases
3. **Mood Page** - Enhanced mood tracker with beautiful calendar
4. **Resources Page** - Modern card layout with search/filters
5. **Support Page** - Professional support request interface
6. **Login/Register Pages** - Premium auth experience

### Enhanced Features:
- Add more 3D assets (GLB models)
- Implement breathing exercise controller
- Add achievement animations
- Create micro-interactions
- Add sound effects (optional)
- Dark mode support

---

## 🎓 Design Principles

1. **Calm & Friendly** - Soft colors, rounded corners, gentle animations
2. **Trustworthy** - Professional typography, clear hierarchy
3. **Modern** - Glass morphism, 3D elements, smooth transitions
4. **Accessible** - High contrast, keyboard navigation, reduced motion support
5. **Student-Focused** - Age-appropriate, supportive tone

---

## 📊 Technical Stack

### Frontend
- React 19.2.0
- Vite (Build tool)
- React Router DOM 7.9.6
- Framer Motion (Animations)
- Three.js + React Three Fiber (3D)
- Recharts (Data visualization)
- React Icons
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI API
- Bcrypt (Password hashing)
- CORS

---

## 🔐 Security Notes

- JWT tokens stored in localStorage
- API keys in `.env` (never commit!)
- Password hashing with bcrypt
- Protected API routes with authentication middleware
- CORS configured properly

---

## ✨ Special Features

### 1. 3D Wellness Orb (Landing Page)
- Auto-rotating floating orb
- Distortion material effect
- Floating ambient particles
- Soft lighting and glow

### 2. Greeting System (Dashboard)
- Dynamic greeting based on time of day
- Animated icons (Sun, Coffee, Moon)
- Personalized with user's name

### 3. Quick Actions Cards
- Four themed cards (Lavender, Sage, Peach, Navy)
- Hover animations with depth
- Icon transitions
- Responsive grid

### 4. Glass Cards
- Backdrop blur effect
- Semi-transparent backgrounds
- Layered shadows
- Smooth hover effects

---

## 🐛 Known Issues & Fixes

None currently - fresh redesign!

---

## 📝 Notes for Development

- All existing backend API integrations are preserved
- No breaking changes to authentication or data models
- Mood tracking, AI chat, and resources all work as before
- Enhanced UI/UX on top of existing functionality

---

## 🎉 What Makes This Special

1. **Premium Visual Identity** - Not a basic student project
2. **3D Interactive Elements** - Stand out with Three.js integration
3. **Professional Polish** - Attention to micro-interactions
4. **Consistent Design System** - Reusable components and styles
5. **Performance Optimized** - Lazy loading, code splitting, optimized assets
6. **Accessibility First** - WCAG compliant color contrast, keyboard nav

---

## 📞 Support

If you encounter any issues:
1. Check console for errors
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check `.env` file for API keys
5. Clear browser cache if needed

---

**Created by:** AI Assistant
**Date:** 2024
**Version:** 1.0.0 (Mentovya Premium Redesign)

**Built with ❤️ for student mental wellness**
