# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lumen is a mental health web app built with React 19, TypeScript, and Vite. The app focuses on emotion tracking, AI-powered feedback using Google Gemini, and therapeutic mini-games. The project has evolved significantly from basic setup to a comprehensive, fully-featured application with stunning visual design, complete routing system, authentication, advanced animations, and a polished landing page experience.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

**Note**: Requires Node.js 20+ due to Vite 7 and React Router 7 dependencies.

## Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite 7
- **Routing**: React Router 7 with lazy loading and protected routes
- **Styling**: Tailwind CSS v4 (configured via @tailwindcss/vite plugin)
- **Animations**: Framer Motion + GSAP
- **Authentication**: Clerk (@clerk/clerk-react) with custom provider wrapper
- **State Management**: Context API with useReducer for global app state
- **Database**: MongoDB + Mongoose
- **AI Integration**: Google Gemini API (@google/generative-ai)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Build Tool**: Vite with SWC React plugin for fast compilation

## Current Project Structure

```
src/
├── components/
│   ├── ai/                # AI-related components
│   │   ├── AIFeedback.tsx         # AI feedback display component
│   │   └── index.ts               # AI component exports
│   ├── auth/              # Authentication components
│   │   ├── ClerkProvider.tsx      # Clerk authentication wrapper
│   │   ├── ProtectedRoute.tsx     # Route protection component
│   │   ├── RootRedirect.tsx       # Smart root redirect based on auth
│   │   ├── SignInForm.tsx         # Login form
│   │   ├── SignUpForm.tsx         # Registration form
│   │   └── UserProfile.tsx        # User profile component
│   ├── emotion/           # Emotion tracking components
│   │   ├── EmotionSurvey.tsx      # Emotion entry survey
│   │   └── index.ts               # Emotion component exports
│   ├── games/             # Game-related components
│   │   └── UnityGame.tsx          # Unity game integration
│   ├── layout/            # Layout components
│   │   ├── Header.tsx             # App header/navigation
│   │   ├── Footer.tsx             # App footer
│   │   └── index.ts               # Layout exports
│   └── ui/                # Reusable UI components
│       ├── AnimatedBall.tsx       # 3D animated ball component
│       ├── Button.tsx             # Button component
│       ├── Card.tsx               # Card component
│       ├── ErrorBoundary.tsx      # Error boundary wrapper
│       ├── Input.tsx              # Input component
│       ├── LoadingSpinner.tsx     # Loading spinner
│       ├── LumenIcon.tsx          # Custom Lumen brand icon
│       ├── Modal.tsx              # Modal component
│       └── index.ts               # UI exports
├── context/
│   └── AppContext.tsx     # Global app state management
├── hooks/
│   └── useClerkUser.ts    # Custom Clerk user hook
├── pages/                 # Page components (lazy loaded)
│   ├── Analytics.tsx      # Analytics dashboard
│   ├── Dashboard.tsx      # Main user dashboard
│   ├── Games.tsx          # Games interface
│   ├── LandingPage.tsx    # Stunning animated landing page
│   ├── Login.tsx          # Login page
│   ├── Onboarding.tsx     # User onboarding flow
│   ├── Profile.tsx        # User profile page
│   ├── Register.tsx       # Registration page
│   └── WelcomePage.tsx    # Welcome page for new users
├── services/              # Service layer
│   ├── ai.ts              # AI service integration
│   ├── api.ts             # Complete API client with all endpoints
│   ├── database.ts        # Database service layer
│   ├── storage.ts         # Storage service utilities
│   └── unity.ts           # Unity game integration service
├── types/
│   └── index.ts           # Comprehensive TypeScript definitions
└── App.tsx                # Main app with routing and providers
```

## Application Architecture

### Routing Structure
- **Root Route**: `/` uses `RootRedirect` component for smart authentication-based routing
- **Public Routes**: `/landing`, `/sign-in`, `/sign-up` (no header/footer)
- **Protected Routes**: `/welcome`, `/dashboard`, `/profile`, `/analytics`, `/games`, `/onboarding` (with header/footer)
- **Route Protection**: Uses `ProtectedRoute` wrapper component with Clerk authentication
- **Lazy Loading**: All pages are dynamically imported for optimal performance
- **Layout System**: Conditional header/footer rendering based on route type
- **Fallback**: Redirects unknown routes to root for smart handling

### State Management
- **Global State**: Context API with `useReducer` pattern in `AppContext.tsx`
- **State Shape**: User auth, current emotion, progress stats, theme, error handling
- **Convenience Hooks**: `useUser()`, `useAuth()`, `useTheme()`, `useError()`

### Type System
Comprehensive TypeScript definitions including:
- **User Types**: User profiles, preferences, authentication state
- **Emotion Types**: 9 emotion types with intensity, context, and AI feedback
- **Game Types**: Game sessions, achievements, progress tracking
- **API Types**: Response wrappers, pagination, error handling
- **Component Types**: Reusable component prop interfaces

### API Integration
- **REST Client**: Generic `ApiClient` class with full CRUD operations
- **Service Modules**: Comprehensive service layer including:
  - `ai.ts` - Google Gemini AI integration
  - `api.ts` - Main API client with endpoints
  - `database.ts` - MongoDB/Mongoose database operations
  - `storage.ts` - File storage utilities
  - `unity.ts` - Unity game integration service
- **Error Handling**: Consistent error responses and logging
- **Environment Config**: Configurable API base URL and service keys

## Environment Variables Required

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here  
VITE_MONGODB_URI=your_mongodb_connection_string_here
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Lumen
VITE_APP_VERSION=1.0.0
```

## Design System

- **Primary Color**: `#FBBF24` (Yellow - representing light/lumen)
- **Secondary Color**: `#8B5CF6` (Purple - for highlights and accents)
- **Dark Mode**: `#1F2937`
- **Light Mode**: `#F9FAFB`

## Emotion System

**9 Core Emotions** mapped to therapeutic mini-games:
- **Sadness** → Color Bloom (nurture flowers)
- **Anger** → Smash Shift (controlled destruction with breathing)  
- **Loneliness** → Echo Garden (plant seeds with shared messages)
- **Anxiety** → Breath Beacon (guide orb with breath patterns)
- **Frustration** → Reset Runes (low-stakes puzzle solving)
- **Stress** → Sound Stream (interactive ambient relaxation)
- **Lethargy** → Light Up (gentle movement prompts)
- **Fear** → Shadow Steps (movement with calm heart rate)
- **Grief** → Memory Lanterns (guided reflection and release)

## Development Guidelines

### Component Patterns
- Functional components with TypeScript
- Custom hooks for shared logic
- Error boundaries for robust error handling
- Lazy loading for performance optimization

### Code Organization
- Feature-based component grouping (`auth/`, `layout/`, `ui/`)
- Centralized type definitions in `types/index.ts`
- Service layer abstraction for API calls
- Context for global state, local state for components

### Authentication Flow
- Clerk handles authentication with custom provider wrapper
- Protected routes redirect unauthenticated users
- User state synchronized between Clerk and app context

## Team Structure

- **Alex**: Frontend & UI/UX Design (Lead)
- **Nathan**: Game Development (Mini-games)
- **Zikora**: Frontend & UI/UX Design (Support)
- **Vishnu**: Backend Integration & API Support

## Code Quality Tools

- ESLint with TypeScript, React Hooks, and React Refresh plugins
- Prettier with Tailwind CSS plugin for code formatting
- TypeScript strict configuration across app and node contexts

## Visual Design & Animation

### Landing Page Experience
- **3D Animated Ball**: Custom WebGL-powered entrance animation using `AnimatedBall.tsx`
- **GSAP Animations**: Sophisticated timeline-based animations for text and UI elements
- **Interactive Background**: Particle network system with touch/mouse interaction
- **Stain-like Aesthetics**: Organic, flowing background elements with CSS animations
- **Typography**: Premium serif fonts (Iowan Old Style) for elegant branding
- **Brand Identity**: Custom `LumenIcon.tsx` with animated lighting effects

### Animation Libraries
- **Framer Motion**: Page transitions and micro-interactions
- **GSAP**: Complex timeline animations and transforms
- **Animated Backgrounds**: Interactive particle systems
- **CSS Animations**: Custom keyframe animations for organic movement

### Design Philosophy
- **Light-themed**: Emphasizing the "Lumen" concept throughout visual design
- **Therapeutic Aesthetics**: Calming, organic shapes and gentle animations
- **Professional Polish**: High-end visual design suitable for mental health applications
- **Mobile-First**: Responsive design across all screen sizes

## Current Development Status

### ✅ Completed Features
- **Application Architecture**: Full React 19 + TypeScript + Vite 7 setup
- **Authentication System**: Complete Clerk integration with smart routing
- **Landing Page**: Professional, animated landing experience
- **Component Library**: Comprehensive UI component system
- **Service Layer**: AI, database, storage, and Unity integration services
- **Type System**: Complete TypeScript definitions for all features
- **Build System**: Optimized Vite configuration with SWC and Tailwind CSS v4

### 🚧 In Progress
- **Emotion Tracking**: Survey components and data collection
- **AI Integration**: Google Gemini feedback system
- **Mini-Games**: Unity integration and therapeutic game development
- **Dashboard**: User analytics and progress tracking

### 📋 Next Phases
- Emotion entry flow implementation
- AI-powered feedback generation
- Therapeutic mini-games development
- Analytics dashboard completion
- User onboarding experience

## Development Notes

- See `GAME_PLAN.md` for detailed project roadmap and weekly milestones
- Current branch: `ui-components-support` (ready for merge to main)
- All core infrastructure is complete and ready for feature development
- Landing page showcases the chosen design direction: "Brighten Your Mind, One Feeling at a Time"

### VERY IMPORTANT

Any design decisions are made with minimalism in mind. Minimalism. It should be very minimalist and beautiful.