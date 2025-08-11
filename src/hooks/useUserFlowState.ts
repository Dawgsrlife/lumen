import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { apiService } from '../services/api';

export interface UserFlowState {
  isFirstTime: boolean;
  hasLoggedEmotionToday: boolean;
  isManualFlow: boolean;
  lastEmotionLog: Date | null;
  todayEmotion: string | null;
  currentStreak: number;
  weeklyData: boolean[];
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
    todayEmotion: null,
    currentStreak: 0,
    weeklyData: [false, false, false, false, false, false, false],
    isLoading: true,
    error: null,
  });

  // Initialize flow state by checking today's emotion status
  useEffect(() => {
    const checkTodayEmotion = async () => {
      if (!user) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Call the API to check today's emotion status
        const response = await apiService.getTodayEmotion();
        
        setState({
          isFirstTime: false, // We'll determine this based on data later
          hasLoggedEmotionToday: response.hasLoggedToday,
          isManualFlow: false,
          lastEmotionLog: response.todayEntry ? new Date(response.todayEntry.createdAt) : null,
          todayEmotion: response.userData?.currentEmotion || null,
          currentStreak: response.userData?.currentStreak || 0,
          weeklyData: response.userData?.weeklyData || [false, false, false, false, false, false, false],
          isLoading: false,
          error: null,
        });

        console.log('Today emotion check result:', {
          hasLoggedToday: response.hasLoggedToday,
          todayEmotion: response.userData?.currentEmotion,
          currentStreak: response.userData?.currentStreak
        });

      } catch (error) {
        console.error('Failed to check today emotion status:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load today\'s emotion status',
        }));
      }
    };

    checkTodayEmotion();
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

  const refreshEmotionStatus = async () => {
    if (!user) return;

    try {
      const response = await apiService.getTodayEmotion();
      setState(prev => ({
        ...prev,
        hasLoggedEmotionToday: response.hasLoggedToday,
        lastEmotionLog: response.todayEntry ? new Date(response.todayEntry.createdAt) : null,
        todayEmotion: response.userData?.currentEmotion || null,
        currentStreak: response.userData?.currentStreak || 0,
        weeklyData: response.userData?.weeklyData || [false, false, false, false, false, false, false],
      }));
    } catch (error) {
      console.error('Failed to refresh emotion status:', error);
    }
  };

  return {
    state,
    setManualFlow,
    markEmotionLogged,
    resetFlowState,
    refreshEmotionStatus,
  };
}; 