# 🎯 Lumen Development Game Plan

## 📋 Project Overview
Lumen is a minimalist mental health web app designed to support users through emotion tracking, AI-powered feedback, and engaging gamified experiences.

**Team Size**: 4 members  
**Timeline**: 6 weeks  
**Tech Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + GSAP + Clerk + MongoDB + Gemini AI

---

## 🚀 Phase 1: Foundation & Core Structure (Week 1)
**Priority: High | Timeline: 5-7 days**

### 1.1 Project Architecture Setup
- [ ] **Folder Structure** - Create organized component hierarchy
- [ ] **Routing System** - Set up React Router with protected routes
- [ ] **State Management** - Context API for global state (user, emotions, progress)
- [ ] **Type Definitions** - TypeScript interfaces for all data structures
- [ ] **Environment Setup** - API integration placeholders

### 1.2 Authentication & User Management
- [ ] **Clerk Integration** - Login/signup flows
- [ ] **User Context** - Global user state management
- [ ] **Protected Routes** - Dashboard access control
- [ ] **User Profile** - Basic user information storage

### 1.3 Core UI Components
- [ ] **Design System** - Button, Input, Card, Modal components
- [ ] **Layout Components** - Header, Sidebar, Footer
- [ ] **Loading States** - Skeleton loaders, spinners
- [ ] **Error Boundaries** - Graceful error handling

---

## 🎨 Phase 2: Landing & Onboarding (Week 1-2)
**Priority: High | Timeline: 3-5 days**

### 2.1 Landing Page
- [ ] **Hero Section** - Compelling introduction with animations
- [ ] **Features Showcase** - Emotion tracking, AI feedback, games
- [ ] **Call-to-Action** - Sign up/login buttons
- [ ] **Social Proof** - Testimonials or statistics

### 2.2 Onboarding Flow
- [ ] **Welcome Screen** - App introduction
- [ ] **Emotion Survey** - Initial emotional state assessment
- [ ] **Preferences Setup** - Notification settings, privacy
- [ ] **First Experience** - Guided tour of dashboard

---

## 📊 Phase 3: Dashboard & Core Features (Week 2-3)
**Priority: High | Timeline: 7-10 days**

### 3.1 Main Dashboard
- [ ] **Emotion Tracker** - Daily mood logging interface
- [ ] **Progress Overview** - Streaks, achievements, statistics
- [ ] **Quick Actions** - Start game, log emotion, view insights
- [ ] **Recent Activity** - Last few entries and AI feedback

### 3.2 Emotion Tracking System
- [ ] **Emotion Selection** - Visual emotion picker (9 emotions)
- [ ] **Survey System** - Contextual questions based on emotion
- [ ] **Data Storage** - MongoDB integration for user data
- [ ] **Trend Analysis** - Basic emotion pattern recognition

### 3.3 AI Integration
- [ ] **Gemini API Setup** - Personalized feedback generation
- [ ] **Context Analysis** - Emotion + survey data processing
- [ ] **Feedback Display** - Beautiful presentation of AI insights
- [ ] **Actionable Advice** - Specific recommendations for users

---

## 🎮 Phase 4: Mini-Games Integration (Week 3-4)
**Priority: Medium | Timeline: 10-14 days**

### 4.1 Game Framework
- [ ] **Game Router** - Navigation to different games
- [ ] **Game State Management** - Progress, scores, achievements
- [ ] **Game Launcher** - Emotion-based game selection
- [ ] **Progress Tracking** - Game completion and rewards

### 4.2 Game Placeholders (For Nathan to implement)
- [ ] **Color Bloom** - Sadness game interface
- [ ] **Smash Shift** - Anger game interface
- [ ] **Echo Garden** - Loneliness game interface
- [ ] **Breath Beacon** - Anxiety game interface
- [ ] **Reset Runes** - Frustration game interface
- [ ] **Sound Stream** - Stress game interface
- [ ] **Light Up** - Lethargy game interface
- [ ] **Shadow Steps** - Fear game interface
- [ ] **Memory Lanterns** - Grief game interface

---

## 📈 Phase 5: Analytics & Progress (Week 4-5)
**Priority: Medium | Timeline: 5-7 days**

### 5.1 Progress Tracking
- [ ] **Statistics Dashboard** - Charts and graphs (Recharts)
- [ ] **Emotion History** - Timeline view of emotional journey
- [ ] **Achievement System** - Badges, streaks, milestones
- [ ] **Export Features** - Data export for users

### 5.2 Insights & Reports
- [ ] **Weekly Reports** - Emotion summary and trends
- [ ] **Monthly Insights** - Deeper analysis and patterns
- [ ] **Recommendations** - Personalized improvement suggestions
- [ ] **Goal Setting** - User-defined mental health goals

---

## ✨ Phase 6: Polish & Optimization (Week 5-6)
**Priority: Low | Timeline: 5-7 days**

### 6.1 UI/UX Polish
- [ ] **Animations** - Framer Motion + GSAP integration
- [ ] **Micro-interactions** - Button hover, page transitions
- [ ] **Responsive Design** - Mobile-first approach
- [ ] **Accessibility** - WCAG compliance

### 6.2 Performance & Testing
- [ ] **Performance Optimization** - Code splitting, lazy loading
- [ ] **Error Handling** - Comprehensive error management
- [ ] **Testing** - Unit tests for critical components
- [ ] **Deployment** - Production build and deployment

---

## 🎨 Design System & Branding

### Color Palette
- **Primary**: `#FBBF24` (Yellow) - Light, hope, energy
- **Secondary**: `#8B5CF6` (Purple) - Wisdom, calm, creativity
- **Dark**: `#1F2937` - Professional, grounding
- **Light**: `#F9FAFB` - Clean, minimal

### Typography
- **Primary Font**: Inter (clean, readable)
- **Headings**: Bold weights for hierarchy
- **Body**: Regular weight for readability

### Animation Principles
- **Smooth**: 300ms transitions
- **Purposeful**: Every animation serves a function
- **Calming**: Gentle easing curves
- **Responsive**: Adapts to user preferences

---

## 👥 Team Delegation Strategy

### Alex (Frontend Lead)
- [ ] **Architecture decisions**
- [ ] **Core components**
- [ ] **State management**
- [ ] **API integration**
- [ ] **Code review**

### Zikora (Frontend Support)
- [ ] **UI components** (buttons, forms, cards)
- [ ] **Responsive design**
- [ ] **Accessibility features**
- [ ] **Component testing**

### Nathan (Game Development)
- [ ] **Mini-game implementations**
- [ ] **Game mechanics**
- [ ] **Game state management**
- [ ] **Performance optimization**

### Vishnu (Backend & API)
- [ ] **MongoDB setup**
- [ ] **API endpoints**
- [ ] **Data validation**
- [ ] **Security implementation**

---

## 🚀 Immediate Next Steps

1. **Create folder structure** and basic routing
2. **Set up Clerk authentication** with protected routes
3. **Build landing page** with hero section
4. **Create dashboard layout** with emotion tracker
5. **Implement basic emotion logging** system

---

## 📝 Development Guidelines

### Code Standards
- **TypeScript**: Strict typing for all components
- **ESLint**: Consistent code style
- **Prettier**: Automatic formatting
- **Component Structure**: Functional components with hooks

### Git Workflow
- **Branch Strategy**: Feature branches → main (via PRs)
- **Commit Messages**: Conventional commits (feat:, fix:, docs:)
- **Code Reviews**: Required for all PRs
- **Merge Strategy**: Squash and merge

### Testing Strategy
- **Unit Tests**: Critical components and utilities
- **Integration Tests**: User flows and API interactions
- **E2E Tests**: Complete user journeys
- **Performance Tests**: Load times and responsiveness

---

## 🎯 Success Metrics

### Technical Metrics
- [ ] **Performance**: < 3s initial load time
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Mobile**: Responsive on all devices
- [ ] **Security**: Secure authentication and data handling

### User Experience Metrics
- [ ] **Engagement**: Daily active users
- [ ] **Retention**: 7-day and 30-day retention
- [ ] **Completion**: Emotion logging completion rate
- [ ] **Satisfaction**: User feedback and ratings

### Healthcare Impact Metrics
- [ ] **Clinical Relevance**: Evidence-based interventions
- [ ] **Outcome Focus**: Measurable mental health improvements
- [ ] **Evidence-Based**: Research-backed methodologies
- [ ] **Ethics**: Patient autonomy and cultural inclusivity

---

## 📅 Weekly Milestones

### Week 1
- [ ] Project architecture complete
- [ ] Authentication system working
- [ ] Basic UI components ready
- [ ] Landing page functional

### Week 2
- [ ] Dashboard layout complete
- [ ] Emotion tracking system working
- [ ] AI integration functional
- [ ] Basic game framework ready

### Week 3
- [ ] All core features implemented
- [ ] Game placeholders complete
- [ ] Analytics dashboard working
- [ ] User testing begins

### Week 4
- [ ] Mini-games integration complete
- [ ] Progress tracking functional
- [ ] Reports and insights working
- [ ] Performance optimization

### Week 5
- [ ] Polish and animations complete
- [ ] Accessibility compliance
- [ ] Testing and bug fixes
- [ ] Documentation complete

### Week 6
- [ ] Final testing and QA
- [ ] Production deployment
- [ ] Launch preparation
- [ ] Post-launch monitoring

---

**Built with ❤️ for mental health awareness and support.** 