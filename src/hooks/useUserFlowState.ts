import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export interface UserFlowState {
  isFirstTime: boolean;
  hasLoggedEmotionToday: boolean;
  isManualFlow: boolean;
  lastEmotionLog: Date | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserFlowState = () => {
  const { user } = useUser();
  const [state, setState] = useState<UserFlowState>({
    isFirstTime: false,
    hasLoggedEmotionToday: false,
    isManualFlow: false,
    lastEmotionLog: null,
    isLoading: true,
    error: null,
  });

  // Initialize flow state
  useEffect(() => {
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Simplified logic - always assume new user for demo
      setState({
        isFirstTime: true,
        hasLoggedEmotionToday: false,
        isManualFlow: false,
        lastEmotionLog: null,
        isLoading: false,
        error: null,
      });
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load user state',
      }));
    }
  }, [user]);

  // Actions
  const setManualFlow = (isManual: boolean) => {
    setState(prev => ({ ...prev, isManualFlow: isManual }));
  };

  const markEmotionLogged = () => {
    setState(prev => ({
      ...prev,
      hasLoggedEmotionToday: true,
      lastEmotionLog: new Date(),
    }));
  };

  const resetFlowState = () => {
    setState(prev => ({
      ...prev,
      isManualFlow: false,
    }));
  };

  return {
    state,
    setManualFlow,
    markEmotionLogged,
    resetFlowState,
  };
}; 