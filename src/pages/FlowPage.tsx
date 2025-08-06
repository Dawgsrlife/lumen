import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowBackground } from '../components/ui';
import { FlowRouter, FlowErrorBoundary } from '../components/flow';
import { useFlowState } from '../hooks/useFlowState';
import { useClerkUser } from '../hooks/useClerkUser';
import { apiService } from '../services/api';
import type { EmotionType } from '../types';

const FlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useClerkUser();
  const flowState = useFlowState();
  const [isCheckingDailyStatus, setIsCheckingDailyStatus] = useState(true);

  // Add initial state logging
  useEffect(() => {
    console.log('FlowPage state:', {
      currentStep: flowState.currentStep,
      selectedEmotion: flowState.selectedEmotion,
      isLoading: flowState.isLoading,
      user: user?.id
    });
  }, [flowState, user]);

  // Check daily emotion status on mount
  useEffect(() => {
    const checkDailyStatus = async () => {
      if (!user) {
        console.log('No user available, skipping daily status check');
        return;
      }

      // Check for URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const isManualFlow = urlParams.get('manual') === 'true';
      const gameParam = urlParams.get('game');
      
      // Map game names to emotions for direct game access
      const gameToEmotion: Record<string, string> = {
        'boxbreathing': 'frustration',
        'colorbloom': 'sad',
        'memorylantern': 'grief',
        'rythmgrow': 'lethargy',
        'balancingact': 'stress'
      };
      
      // Handle direct game access via URL parameter
      if (gameParam && gameToEmotion[gameParam]) {
        console.log(`Direct game access requested: ${gameParam}`);
        const emotion = gameToEmotion[gameParam] as EmotionType;
        flowState.actions.selectEmotion(emotion);
        flowState.actions.setCurrentStep('game');
        setIsCheckingDailyStatus(false);
        return;
      }
      
      if (isManualFlow) {
        console.log('Manual flow requested, starting at welcome step');
        flowState.actions.setCurrentStep('welcome');
        setIsCheckingDailyStatus(false);
        return;
      }

      console.log('Checking daily status for user:', user.id);
      try {
        setIsCheckingDailyStatus(true);
        const response = await apiService.getTodayEmotion();
        const hasLogged = response.hasLoggedToday;
        
        // If user has already logged today, redirect to dashboard
        if (hasLogged) {
          console.log('User has already logged today, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }
        
        // If user hasn't logged today, start with welcome screen
        console.log('User has not logged today, starting flow at welcome step');
        flowState.actions.setCurrentStep('welcome');
      } catch (error) {
        console.error('Error checking daily status:', error);
        // On API error, default to welcome screen and don't retry
        console.log('API unavailable, defaulting to welcome screen');
        flowState.actions.setCurrentStep('welcome');
      } finally {
        setIsCheckingDailyStatus(false);
      }
    };

    // Only check once when user is available
    if (user && isCheckingDailyStatus) {
      checkDailyStatus();
    }
  }, [user, flowState.actions, isCheckingDailyStatus, navigate]);

  // Memoized background theme
  const backgroundTheme = useMemo(() => {
    switch (flowState.currentStep) {
      case 'welcome':
        return 'welcome';
      case 'emotion-selection':
        return 'emotions';
      case 'game':
        return 'game'; // Clean background for Unity games
      case 'journaling':
        return 'survey'; // Writing/reflection theme
      case 'feedback':
        return 'survey'; // Writing/reflection theme
      default:
        return 'none';
    }
  }, [flowState.currentStep]);

  // Prevent navigation away from game unless explicitly allowed
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (flowState.currentStep === 'game') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flowState.currentStep]);



  const handleFlowComplete = () => {
    console.log('Flow completed, navigating to dashboard');
    navigate('/dashboard', { replace: true });
  };

  // Early returns for loading and error states
  if (isCheckingDailyStatus || flowState.isLoading) {
    // Remove custom loading screen - just show the main content
    return (
      <FlowErrorBoundary>
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          <FlowBackground theme="none" />
          <FlowRouter onComplete={handleFlowComplete} />
        </div>
      </FlowErrorBoundary>
    );
  }

  if (flowState.error) {
    return (
      <FlowErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{flowState.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </FlowErrorBoundary>
    );
  }

  return (
    <FlowErrorBoundary>
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">

        {/* Dynamic Background */}
        <FlowBackground theme={backgroundTheme} />
        {/* Flow Router */}
        <FlowRouter onComplete={handleFlowComplete} />
      </div>
    </FlowErrorBoundary>
  );
};

export default FlowPage;