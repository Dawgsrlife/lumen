import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlowParams } from './useFlowParams';
import { useUserFlowState } from './useUserFlowState';
import type { FlowStep } from '../context/FlowProvider';

export interface FlowManager {
  initializeFlow: () => FlowStep | null;
  handleAutoTransitions: (currentStep: FlowStep) => (() => void) | null;
  shouldRedirectToDashboard: boolean;
  error: string | null;
}

export const useFlowManager = (): FlowManager => {
  const navigate = useNavigate();
  const { isManualFlow } = useFlowParams();
  const { state: userFlowState, setManualFlow } = useUserFlowState();
  const autoTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
      }
    };
  }, []);

  // Single source of truth for flow initialization
  const initializeFlow = useCallback((): FlowStep | null => {
    if (userFlowState.isLoading) return null;
    
    console.log('Flow initialization:', {
      hasLoggedEmotionToday: userFlowState.hasLoggedEmotionToday,
      isManualFlow,
      currentStep: 'initializing'
    });

    // Set manual flow state
    setManualFlow(isManualFlow);
    
    // Return the initial step
    return isManualFlow ? 'emotion-selection' : 'welcome';
  }, [userFlowState.isLoading, userFlowState.hasLoggedEmotionToday, isManualFlow, setManualFlow]);

  // Auto-transition logic
  const handleAutoTransitions = useCallback((currentStep: FlowStep) => {
    // Clear any existing timer
    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    if (currentStep === 'welcome' && !isManualFlow) {
      console.log('Welcome screen auto-transition timer started');
      
      autoTransitionTimerRef.current = setTimeout(() => {
        console.log('Welcome screen auto-transitioning to emotion selection');
        // This will be handled by the parent component
        // We return a cleanup function
      }, 3500);

      return () => {
        console.log('Welcome screen auto-transition timer cleared');
        if (autoTransitionTimerRef.current) {
          clearTimeout(autoTransitionTimerRef.current);
          autoTransitionTimerRef.current = null;
        }
      };
    }

    return () => {}; // Return empty cleanup function instead of null
  }, [isManualFlow]);

  // Check if we should redirect to dashboard
  const shouldRedirectToDashboard = useMemo(() => {
    return userFlowState.hasLoggedEmotionToday && !isManualFlow;
  }, [userFlowState.hasLoggedEmotionToday, isManualFlow]);

  return {
    initializeFlow,
    handleAutoTransitions,
    shouldRedirectToDashboard,
    error: userFlowState.error,
  };
}; 