import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { User, EmotionEntry, ProgressStats } from '../types';

// State interface
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentEmotion: EmotionEntry | null;
  progressStats: ProgressStats | null;
  theme: 'light' | 'dark' | 'system';
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_EMOTION'; payload: EmotionEntry | null }
  | { type: 'SET_PROGRESS_STATS'; payload: ProgressStats | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  currentEmotion: null,
  progressStats: null,
  theme: 'system',
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CURRENT_EMOTION':
      return { ...state, currentEmotion: action.payload };
    case 'SET_PROGRESS_STATS':
      return { ...state, progressStats: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Convenience hooks
export const useUser = () => {
  const { state } = useApp();
  return state.user;
};

export const useAuth = () => {
  const { state } = useApp();
  return {
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  };
};

export const useTheme = () => {
  const { state, dispatch } = useApp();
  return {
    theme: state.theme,
    setTheme: (theme: 'light' | 'dark' | 'system') =>
      dispatch({ type: 'SET_THEME', payload: theme }),
  };
};

export const useError = () => {
  const { state, dispatch } = useApp();
  return {
    error: state.error,
    setError: (error: string) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };
}; 