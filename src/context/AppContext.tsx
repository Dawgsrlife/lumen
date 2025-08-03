import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useClerkUser } from '../hooks/useClerkUser';
import { apiService } from '../services/api';
import type { EmotionType } from '../types';

// User Session Interface
interface UserSession {
  userId: string;
  username: string;
  lastEmotionDate: Date | null;
  currentEmotion: EmotionType | null;
  hasPlayedGameToday: boolean;
  currentStreak: number;
  weeklyData: boolean[]; // 7 days of emotion logging
}

// App State Interface
interface AppState {
  user: UserSession | null;
  currentView: 'landing' | 'welcome' | 'emotion-selection' | 'game-prompt' | 'game' | 'dashboard' | 'feedback';
  showHeader: boolean;
  isLoading: boolean;
  error: string | null;
}

// Action Types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: UserSession }
  | { type: 'SET_CURRENT_VIEW'; payload: AppState['currentView'] }
  | { type: 'SET_SHOW_HEADER'; payload: boolean }
  | { type: 'SET_CURRENT_EMOTION'; payload: EmotionType }
  | { type: 'COMPLETE_GAME' }
  | { type: 'RESET_TO_EMOTION_SELECTION' }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'UPDATE_WEEKLY_DATA'; payload: boolean[] };

// Initial State
const initialState: AppState = {
  user: null,
  currentView: 'landing',
  showHeader: false,
  isLoading: true,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_SHOW_HEADER':
      return { ...state, showHeader: action.payload };
    
    case 'SET_CURRENT_EMOTION':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          currentEmotion: action.payload,
          lastEmotionDate: new Date(),
        } : null,
      };
    
    case 'COMPLETE_GAME':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          hasPlayedGameToday: true,
        } : null,
      };
    
    case 'RESET_TO_EMOTION_SELECTION':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          currentEmotion: null,
          hasPlayedGameToday: false,
        } : null,
        currentView: 'emotion-selection',
        showHeader: false,
      };
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          currentStreak: action.payload,
        } : null,
      };
    
    case 'UPDATE_WEEKLY_DATA':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          weeklyData: action.payload,
        } : null,
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  logEmotion: (emotion: EmotionType) => Promise<void>;
  completeGame: () => void;
  resetToEmotionSelection: () => void;
} | null>(null);

// Provider Component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: clerkUser } = useClerkUser();

  // Enhanced emotion logging with better date checking
  const logEmotion = async (emotion: EmotionType) => {
    console.log('AppContext: Logging emotion', emotion);
    
    try {
      // Update local state immediately for better UX
      const updatedUser = {
        ...state.user!,
        currentEmotion: emotion,
        lastEmotionDate: new Date(),
        hasPlayedGameToday: false
      };
      
      dispatch({ type: 'SET_USER', payload: updatedUser });
      dispatch({ type: 'SET_CURRENT_EMOTION', payload: emotion });
      dispatch({ type: 'SET_SHOW_HEADER', payload: true });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'game-prompt' });

      // Try to save to API with enhanced data integration
      try {
        const emotionData = {
          emotion,
          intensity: 5,
          context: 'dashboard',
          timestamp: new Date().toISOString()
        };
        
        const response = await apiService.createEmotionEntry(emotionData);
        console.log('AppContext: Emotion saved to API', response);
        
        // Update user data with API response
        if (response) {
          const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
          const updatedWeeklyData = [...state.user!.weeklyData];
          updatedWeeklyData[today] = true;
          
          dispatch({ 
            type: 'UPDATE_WEEKLY_DATA', 
            payload: updatedWeeklyData 
          });
          
          // Update streak from API response
          if (response.userData) {
            dispatch({ 
              type: 'UPDATE_STREAK', 
              payload: response.userData.currentStreak 
            });
          }
        }
        
      } catch (error) {
        console.warn('AppContext: Failed to save emotion to API, using local state only:', error);
        // Continue with local state even if API fails
      }
      
    } catch (error) {
      console.error('AppContext: Failed to log emotion:', error);
      // Keep the emotion logged locally even if API fails
    }
  };

  // Enhanced initialization with better data checking
  useEffect(() => {
    const initializeUserSession = async () => {
      console.log('AppContext: Initializing user session', { clerkUser: !!clerkUser });

      // If no Clerk user, create a demo user session
      if (!clerkUser) {
        console.log('AppContext: No clerk user, creating demo session');
        const demoUserSession: UserSession = {
          userId: 'demo-user',
          username: 'Demo User',
          lastEmotionDate: null,
          currentEmotion: null,
          hasPlayedGameToday: false,
          currentStreak: 0,
          weeklyData: [false, false, false, false, false, false, false],
        };
        dispatch({ type: 'SET_USER', payload: demoUserSession });
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'welcome' });
        dispatch({ type: 'SET_LOADING', payload: false });
        setTimeout(() => {
          console.log('AppContext: Transitioning to emotion selection');
          dispatch({ type: 'SET_CURRENT_VIEW', payload: 'emotion-selection' });
        }, 2000);
        return;
      }

      try {
        console.log('AppContext: Starting initialization with clerk user');
        dispatch({ type: 'SET_LOADING', payload: true });

        // Create a basic user session with fallback data
        const userSession: UserSession = {
          userId: clerkUser.id,
          username: clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there',
          lastEmotionDate: null,
          currentEmotion: null,
          hasPlayedGameToday: false,
          currentStreak: 0,
          weeklyData: [false, false, false, false, false, false, false],
        };

        // Try to get today's emotion data from API
        try {
          const todayData = await apiService.getTodayEmotion();
          console.log('AppContext: Got today\'s data from API', todayData);
          
          if (todayData.userData) {
            userSession.currentStreak = todayData.userData.currentStreak;
            userSession.weeklyData = todayData.userData.weeklyData;
            userSession.currentEmotion = todayData.userData.currentEmotion as any;
            userSession.hasPlayedGameToday = todayData.userData.hasPlayedGameToday;
          }
          
          if (todayData.hasLoggedToday && todayData.todayEntry) {
            userSession.lastEmotionDate = new Date(todayData.todayEntry.createdAt);
            userSession.currentEmotion = todayData.todayEntry.emotion as any;
            console.log('AppContext: Found today\'s emotion', todayData.todayEntry.emotion);
          }
          
        } catch (error) {
          console.warn('Failed to get today\'s data from API:', error);
        }

        // Try to get user profile from API, but don't fail if it doesn't work
        try {
          const userProfile = await apiService.getUserProfile();
          userSession.userId = userProfile.id;
          userSession.username = userProfile.firstName || userProfile.email?.split('@')[0] || userSession.username;
          console.log('AppContext: Got user profile from API');
        } catch (error) {
          console.warn('Failed to get user profile from API, using fallback data:', error);
        }

        dispatch({ type: 'SET_USER', payload: userSession });

        // Determine initial view based on today's data
        if (userSession.currentEmotion && todayData?.hasLoggedToday) {
          // User already logged emotion today - go to dashboard
          console.log('AppContext: User has emotion today, going to dashboard');
          dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
          dispatch({ type: 'SET_SHOW_HEADER', payload: true });
        } else {
          // Show welcome, then emotion selection
          console.log('AppContext: User needs emotion selection, going to welcome');
          dispatch({ type: 'SET_CURRENT_VIEW', payload: 'welcome' });
          setTimeout(() => {
            console.log('AppContext: Transitioning to emotion selection');
            dispatch({ type: 'SET_CURRENT_VIEW', payload: 'emotion-selection' });
          }, 2000);
        }

      } catch (error) {
        console.error('Failed to initialize user session:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });

        // Set up fallback user session
        const fallbackUserSession: UserSession = {
          userId: clerkUser.id,
          username: clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there',
          lastEmotionDate: null,
          currentEmotion: null,
          hasPlayedGameToday: false,
          currentStreak: 0,
          weeklyData: [false, false, false, false, false, false, false],
        };

        console.log('AppContext: Using fallback user session');
        dispatch({ type: 'SET_USER', payload: fallbackUserSession });
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'welcome' });
        setTimeout(() => {
          dispatch({ type: 'SET_CURRENT_VIEW', payload: 'emotion-selection' });
        }, 2000);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        console.log('AppContext: Initialization complete');
      }
    };
    initializeUserSession();
  }, [clerkUser]);

  // Enhanced game completion with better state management
  const completeGame = async () => {
    console.log('AppContext: Completing game');
    
    try {
      const updatedUser = {
        ...state.user!,
        hasPlayedGameToday: true
      };
      
      dispatch({ type: 'SET_USER', payload: updatedUser });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
      
      // Try to update streak if we have API access
      try {
        // In a real app, we'd update the streak based on consecutive days
        // For now, we'll just increment the local streak
        const newStreak = state.user!.currentStreak + 1;
        dispatch({ type: 'UPDATE_STREAK', payload: newStreak });
        
      } catch (error) {
        console.warn('AppContext: Failed to update streak in API:', error);
      }
      
    } catch (error) {
      console.error('AppContext: Failed to complete game:', error);
    }
  };

  // Enhanced reset function
  const resetToEmotionSelection = () => {
    console.log('AppContext: Resetting to emotion selection');
    
    const updatedUser = {
      ...state.user!,
      currentEmotion: null,
      hasPlayedGameToday: false
    };
    
    dispatch({ type: 'SET_USER', payload: updatedUser });
    dispatch({ type: 'SET_CURRENT_EMOTION', payload: null });
    dispatch({ type: 'SET_SHOW_HEADER', payload: false });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'emotion-selection' });
  };

  const value = {
    state,
    dispatch,
    logEmotion,
    completeGame,
    resetToEmotionSelection,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 