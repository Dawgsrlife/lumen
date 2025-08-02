# Lumen - Mental Health Web App

A minimalist mental health web app designed to support users through emotion tracking, AI-powered feedback, and engaging gamified experiences.

## 🚀 Features

- **Emotion Tracking**: Daily mood and emotional state logging
- **AI-Powered Feedback**: Personalized advice using Google Gemini AI
- **Gamified Experience**: Mini-games based on emotional states
- **Progress Tracking**: User engagement history and statistics
- **Minimalist Design**: Clean, calming interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion + GSAP
- **Authentication**: Clerk
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini API
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## 🎨 Design System

**Color Palette:**
- Primary (Yellow): `#FBBF24` - representing light/lumen
- Secondary (Purple): `#8B5CF6` - for highlights and accents
- Dark Mode: `#1F2937`
- Light Mode: `#F9FAFB`

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Dawgsrlife/lumen.git
cd lumen
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_MONGODB_URI=your_mongodb_connection_string_here
VITE_APP_NAME=Lumen
VITE_APP_VERSION=1.0.0
```

### 4. Get API Keys
- **Clerk**: [Dashboard](https://dashboard.clerk.com/) for authentication
- **Google Gemini**: [AI Studio](https://aistudio.google.com/) for AI features
- **MongoDB**: [Atlas](https://cloud.mongodb.com/) for database

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📁 Project Structure

```
lumen/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── styles/        # Global styles and themes
│   └── assets/        # Static assets
├── public/            # Public assets
└── package.json       # Dependencies and scripts
```

## 🎮 Mini-Games

Each emotion triggers a specific therapeutic mini-game:

- 😢 **Sadness** → Color Bloom: Nurture flowers to restore color
- 😡 **Anger** → Smash Shift: Controlled destruction with breathing
- 🧍 **Loneliness** → Echo Garden: Plant seeds with shared messages
- 😰 **Anxiety** → Breath Beacon: Guide orb with breath patterns
- 😤 **Frustration** → Reset Runes: Low-stakes puzzle solving
- 😵 **Stress** → Sound Stream: Interactive ambient relaxation
- 🛌 **Lethargy** → Light Up: Gentle movement prompts
- 😱 **Fear** → Shadow Steps: Movement with calm heart rate
- 💔 **Grief** → Memory Lanterns: Guided reflection and release

## 🤝 Team Roles

- **Alex**: Frontend & UI/UX Design (Lead)
- **Nathan**: Game Development (Mini-games)
- **Zikora**: Frontend & UI/UX Design (Support)
- **Vishnu**: Backend Integration & API Support

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Development Guidelines

1. **Component Structure**: Use functional components with TypeScript
2. **Styling**: Prefer Tailwind classes, custom CSS for complex animations
3. **State Management**: Use React hooks and context where needed
4. **Animations**: Combine Framer Motion for UI, GSAP for complex sequences
5. **Accessibility**: Follow WCAG guidelines for inclusive design

## 📊 Healthcare Focus

This app addresses mental health through:
- **Clinical Relevance**: Evidence-based therapeutic techniques
- **Healthcare Outcomes**: Measurable impact on user well-being
- **Evidence-Based**: Research-backed intervention methods
- **Ethics & Responsibility**: Patient autonomy and cultural inclusivity

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for mental health awareness and support.**
