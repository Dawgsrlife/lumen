import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useFlow } from '../context/FlowProvider';
import { useUserFlowState } from './useUserFlowState';
import type { FlowStep } from '../context/FlowProvider';
import type { EmotionType } from '../types';
import type { UnityGameData, UnityReward } from '../services/unity';

export interface FlowState {
  // App state
  user: any;
  isLoading: boolean;
  
  // Flow state
  currentStep: FlowStep;
  selectedEmotion: EmotionType | null;
  gameData: UnityGameData | null;
  gameRewards: UnityReward[];
  
  // User flow state
  hasLoggedToday: boolean;
  isManualFlow: boolean;
  error: string | null;
}

export interface FlowActions {
  setCurrentStep: (step: FlowStep) => void;
  selectEmotion: (emotion: EmotionType) => void;
  completeGame: (data: UnityGameData) => void;
  skipStep: () => void;
  completeFlow: () => void;
  markEmotionLogged: () => void;
  resetFlowState: () => void;
}

export const useFlowState = (): FlowState & { actions: FlowActions } => {
  const { state: appState, logEmotion, completeGame } = useAppContext();
  const { state: flowState, dispatch, setEmotion, setGameData, skipToJournaling, skipToEmotionSelection } = useFlow();
  const { state: userFlowState, setManualFlow, markEmotionLogged, resetFlowState } = useUserFlowState();

  // Memoized state
  const state = useMemo((): FlowState => ({
    // App state
    user: appState.user,
    isLoading: appState.isLoading || userFlowState.isLoading,
    
    // Flow state
    currentStep: flowState.currentStep,
    selectedEmotion: flowState.selectedEmotion as EmotionType | null,
    gameData: flowState.gameData,
    gameRewards: [], // TODO: Add to flow state if needed
    
    // User flow state
    hasLoggedToday: userFlowState.hasLoggedEmotionToday,
    isManualFlow: userFlowState.isManualFlow,
    error: userFlowState.error,
  }), [appState, flowState, userFlowState]);

  // Individual action handlers
  const setCurrentStep = useCallback((step: FlowStep) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  }, [dispatch]);

  const selectEmotion = useCallback((emotion: EmotionType) => {
    console.log('Selecting emotion:', emotion);
    setEmotion(emotion);
    logEmotion(emotion);
    markEmotionLogged();
    // ✅ DON'T auto-advance - let FlowRouter handle step transitions
    // Remove: dispatch({ type: 'SET_CURRENT_STEP', payload: 'game' });
  }, [setEmotion, logEmotion, markEmotionLogged]);

  const handleCompleteGame = useCallback((data: UnityGameData) => {
    setGameData(data);
    completeGame();
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'feedback' });
  }, [setGameData, completeGame, dispatch]);

  const skipStep = useCallback(() => {
    skipToJournaling();
  }, [skipToJournaling]);

  const completeFlow = useCallback(() => {
    completeGame();
    resetFlowState();
  }, [completeGame, resetFlowState]);

  const handleMarkEmotionLogged = useCallback(() => {
    markEmotionLogged();
  }, [markEmotionLogged]);

  const handleResetFlowState = useCallback(() => {
    resetFlowState();
  }, [resetFlowState]);

  // Memoized actions object
  const actions = useMemo((): FlowActions => ({
    setCurrentStep,
    selectEmotion,
    completeGame: handleCompleteGame,
    skipStep,
    completeFlow,
    markEmotionLogged: handleMarkEmotionLogged,
    resetFlowState: handleResetFlowState,
  }), [setCurrentStep, selectEmotion, handleCompleteGame, skipStep, completeFlow, handleMarkEmotionLogged, handleResetFlowState]);

  return {
    ...state,
    actions,
  };
}; 