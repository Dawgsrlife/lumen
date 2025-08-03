import React from 'react';
import WelcomeScreen from '../WelcomeScreen';
import EmotionSelectionScreen from '../EmotionSelectionScreen';
import GamePromptScreen from '../GamePromptScreen';
import UnityGame from '../games/UnityGame';
import GameCompletion from '../games/GameCompletion';
import PostGameFeedback from '../games/PostGameFeedback';
import JournalingStep from '../JournalingStep';
import DashboardScreen from '../DashboardScreen';
import { useFlowManager } from '../../hooks/useFlowManager';
import { useFlowParams } from '../../hooks/useFlowParams';
import { useFlowState } from '../../hooks/useFlowState';
import { useUserFlowState } from '../../hooks/useUserFlowState';
import { LumenMascot } from '../ui';

interface FlowRouterProps {
  onComplete?: () => void;
}

const FlowRouter: React.FC<FlowRouterProps> = ({ onComplete }) => {
  const { currentStep, selectedEmotion, isManualFlow } = useFlowState();
  const { initializeFlow, handleAutoTransitions, shouldRedirectToDashboard } = useFlowManager();
  const { isManualFlow: isManualFlowParam } = useFlowParams();
  const { state: userFlowState } = useUserFlowState();

  const handleRewardEarned = () => {
    // TODO: Add reward handling to flow state
  };

  const handleGameComplete = () => {
    // TODO: Implement game completion logic
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeScreen
            onContinue={() => {
              // TODO: Implement continue logic
            }}
          />
        );

      case 'emotion-selection':
        return (
          <EmotionSelectionScreen
            onEmotionSelect={() => {
              // TODO: Implement emotion selection logic
            }}
            selectedEmotion={selectedEmotion || 'happy'}
          />
        );

      case 'game-prompt':
        return (
          <GamePromptScreen
            selectedEmotion={selectedEmotion || 'happy'}
            onContinue={() => {
              // TODO: Implement continue logic
            }}
          />
        );

      case 'game':
        return (
          <UnityGame
            gameId="default"
            gameName="default"
            emotionData={{
              emotion: selectedEmotion || 'happy',
              intensity: 5,
              context: 'flow'
            }}
            onGameComplete={handleGameComplete}
            onRewardEarned={handleRewardEarned}
          />
        );

      case 'game-completion':
        return (
          <GameCompletion
            gameTitle="Default Game"
            gameData={{}}
            rewards={[]}
            onContinue={() => {
              // TODO: Implement continue logic
            }}
          />
        );

      case 'journaling':
        return (
          <JournalingStep
            onComplete={() => {
              // TODO: Implement complete logic
            }}
          />
        );

      case 'dashboard':
        return (
          <DashboardScreen
            selectedEmotion={selectedEmotion || 'happy'}
            currentStreak={0}
            weeklyData={[false, false, false, false, false, false, false]}
            onReset={() => {
              // TODO: Implement reset logic
            }}
          />
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Step Not Found</h1>
              <p className="text-gray-600 mb-6">The requested step could not be found.</p>
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <LumenMascot currentPage="/flow" />
      {renderStep()}
    </div>
  );
};

export default FlowRouter; 