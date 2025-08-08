# UI v2 - Saved Components and Pages

This directory contains saved copies of all the UI components and pages representing the current design state for:

## Full Flow System

- `src/components/WelcomeScreen.tsx` - Welcome/landing screen with animations
- `src/components/EmotionSelectionScreen.tsx` - Emotion selection interface
- `src/components/GamePromptScreen.tsx` - Game prompt and selection
- `src/components/JournalingStep.tsx` - Journaling interface
- `src/pages/FlowPage.tsx` - Main flow orchestration page
- `src/context/FlowProvider.tsx` - Flow state management
- `src/hooks/useFlowManager.ts` - Flow management logic
- `src/hooks/useFlowState.ts` - Flow state hooks
- `src/hooks/useFlowParams.ts` - Flow parameter handling
- `src/hooks/useUserFlowState.ts` - User-specific flow state
- `src/components/flow/` - Flow-specific components
- `src/components/games/UnityGame.tsx` - Unity game integration (WORKING VERSION)
- `src/components/emotion/EmotionSelector.tsx` - Emotion selection UI

## Dashboard System

- `src/pages/Dashboard.tsx` - Main dashboard page with error handling
- `src/components/DashboardScreen.tsx` - Dashboard UI component with analytics
- Enhanced with comprehensive null safety and API error handling

## Analytics Page

- `src/pages/Analytics.tsx` - Analytics and insights page

## Supporting Files

- `src/types/index.ts` - Type definitions
- `src/context/AppContext.tsx` - Global app context
- `src/services/api.ts` - Enhanced API service with CORS handling and fallbacks
- `src/services/database.ts` - Database service
- `src/App.tsx` - Main app component
- `src/components/ui/` - Complete UI component library

## Key Features Preserved

- ✅ Working Unity game integration with proper parameter passing
- ✅ Comprehensive error handling and null safety
- ✅ Enhanced API service with CORS fallbacks
- ✅ Consistent UI design with framer-motion animations
- ✅ Robust flow state management
- ✅ Dashboard with analytics integration

## Notes

These files represent the working state with:

- Fixed Unity game functionality
- Enhanced dashboard error handling
- Improved API service reliability
- Maintained UI design consistency
- Complete flow system implementation

Use these files as reference when updating the main branch UI.
