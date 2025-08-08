# Lumen Project - UI Design Implementation from ui-v2 Reference

## Project Overview

**Lumen** is a comprehensive mental health and wellness platform that combines emotional journaling, AI-powered insights, Unity-based therapeutic mini-games, and analytics to support users' mental well-being. The platform uses a guided flow system that takes users through emotional check-ins, therapeutic gaming experiences, and reflective journaling.

## Core Values & Mission

- **Empathetic Design**: Clean, calming aesthetics that promote mental wellness
- **Accessibility**: Intuitive interfaces that don't overwhelm users during vulnerable moments
- **Evidence-Based**: Therapeutic approaches backed by clinical research
- **Gamification for Healing**: Unity mini-games designed to address specific emotions (anxiety, stress, loneliness, etc.)
- **Data-Driven Insights**: Analytics that help users understand their emotional patterns

## Technical Stack

- **Frontend**: React + TypeScript with Vite
- **Styling**: Tailwind CSS with custom gradients and animations
- **Animations**: Framer Motion for smooth, therapeutic micro-interactions
- **Games**: Unity WebGL integration via react-unity-webgl
- **Authentication**: Clerk
- **State Management**: React Context + custom hooks
- **API**: Axios with enhanced error handling and CORS fallbacks

## Current Flow System

1. **Welcome Screen** - Gentle introduction with calming animations
2. **Emotion Selection** - Users choose their current emotional state
3. **Game Prompt** - AI suggests appropriate therapeutic mini-game
4. **Unity Game Integration** - Emotion-specific therapeutic games
5. **Journaling Step** - Reflective writing prompts
6. **Dashboard** - Analytics and progress tracking

## Task: Implement UI Design from ui-v2 Reference

I have a complete `ui-v2` folder containing the perfected UI designs for all our key screens. **Please reference this folder PURELY for UI/design implementation** and update the following pages in the main branch:

### 1. Welcome Screen (`src/components/WelcomeScreen.tsx`)

- Implement the elegant, calming design from `ui-v2/src/components/WelcomeScreen.tsx`
- Preserve soft gradients, typography (Playfair Display), and framer-motion animations
- Maintain the therapeutic, non-overwhelming aesthetic

### 2. Emotion Selection (`src/components/EmotionSelectionScreen.tsx`)

- Use the design from `ui-v2/src/components/EmotionSelectionScreen.tsx`
- Keep the centered layout, gentle background gradients, and smooth animations
- Ensure the emotion selector maintains its clean, accessible design

### 3. Game Prompt Screen (`src/components/GamePromptScreen.tsx`)

- Implement design from `ui-v2/src/components/GamePromptScreen.tsx`
- Preserve the AI prompt styling and game suggestion interface
- Maintain consistency with the overall flow aesthetic

### 4. Unity Game Screen - DESIGN ONLY (`src/components/games/UnityGame.tsx`)

- **IMPORTANT**: Only copy the UI/design elements, NOT the Unity integration logic
- The Unity functionality is broken in ui-v2, so preserve the current working Unity logic
- Focus on: layout, styling, error states, loading states, and visual design
- Keep existing Unity game parameter passing and functionality intact

### 5. Dashboard (`src/pages/Dashboard.tsx` + `src/components/DashboardScreen.tsx`)

- Implement the comprehensive dashboard design from ui-v2
- Include analytics cards, progress tracking, and emotional insights
- Preserve the clean, data-visualization friendly layout

### 6. Analytics Page (`src/pages/Analytics.tsx`)

- Use the analytics page design from ui-v2
- Maintain the detailed insights, charts, and progress tracking interfaces

## Design Principles to Maintain

- **Soft Color Palette**: Gentle gradients, muted tones, therapeutic atmosphere
- **Typography**: Playfair Display for headings, clean sans-serif for body
- **Animations**: Subtle, smooth framer-motion transitions that feel healing
- **Spacing**: Generous whitespace to avoid overwhelming users
- **Accessibility**: High contrast where needed, clear visual hierarchy

## Key Files in ui-v2 to Reference

```
ui-v2/src/components/WelcomeScreen.tsx
ui-v2/src/components/EmotionSelectionScreen.tsx
ui-v2/src/components/GamePromptScreen.tsx
ui-v2/src/components/games/UnityGame.tsx (DESIGN ONLY)
ui-v2/src/pages/Dashboard.tsx
ui-v2/src/components/DashboardScreen.tsx
ui-v2/src/pages/Analytics.tsx
ui-v2/src/components/ui/ (supporting UI components)
```

## Important Notes

- **Unity Game**: Only copy visual design, NOT the integration logic (it's broken in ui-v2)
- **Preserve Functionality**: Don't break existing working features while updating designs
- **Consistency**: Ensure all screens feel cohesive and therapeutic
- **Mobile Responsive**: Maintain responsive design across all screen sizes

## Success Criteria

The updated UI should feel like a cohesive, calming, therapeutic experience that guides users gently through their mental health journey while maintaining all existing functionality.
