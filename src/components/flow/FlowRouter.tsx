import React from 'react';
import { motion } from 'framer-motion';
import { WelcomeScreen } from '../WelcomeScreen';
import { EmotionSelectionScreen } from '../EmotionSelectionScreen';
import { GamePromptScreen } from '../GamePromptScreen';
import { UnityGame } from '../games/UnityGame';
import { GameCompletion } from '../games/GameCompletion';
import { PostGameFeedback } from '../games/PostGameFeedback';
import { JournalingStep } from '../JournalingStep';
import { DashboardScreen } from '../DashboardScreen';
import { useFlowManager } from '../../hooks/useFlowManager';
import { useFlowParams } from '../../hooks/useFlowParams';
import { useFlowState } from '../../hooks/useFlowState';
import { useUserFlowState } from '../../hooks/useUserFlowState';
import { LumenMascot } from '../ui';

interface FlowRouterProps {
  onComplete?: () => void;
}

const FlowRouter: React.FC<FlowRouterProps> = ({ onComplete }) => {
  const { currentStep, selectedEmotion, isManualFlow, hasLoggedToday } = useFlowState();
  const { advanceToNextStep, resetFlow } = useFlowManager();
  const { gameId, gameName } = useFlowParams();
  const { currentStreak, weeklyData } = useUserFlowState();

  const handleRewardEarned = (reward: any) => {
    // TODO: Add reward handling to flow state
  };

  const handleGameComplete = () => {
    advanceToNextStep();
  };

  const handleFlowComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeScreen
            isManualFlow={isManualFlow}
            onContinue={advanceToNextStep}
          />
        );

      case 'emotion-selection':
        return (
          <EmotionSelectionScreen
            onEmotionSelected={advanceToNextStep}
            selectedEmotion={selectedEmotion}
          />
        );

      case 'game-prompt':
        return (
          <GamePromptScreen
            selectedEmotion={selectedEmotion}
            onContinue={advanceToNextStep}
          />
        );

      case 'game':
        return (
          <UnityGame
            gameId={gameId}
            gameName={gameName}
            emotionData={selectedEmotion}
            onGameComplete={handleGameComplete}
            onRewardEarned={handleRewardEarned}
          />
        );

      case 'game-completion':
        return (
          <GameCompletion
            onContinue={advanceToNextStep}
          />
        );

      case 'post-game-feedback':
        return (
          <PostGameFeedback
            onContinue={advanceToNextStep}
          />
        );

      case 'journaling':
        return (
          <JournalingStep
            selectedEmotion={selectedEmotion}
            onComplete={advanceToNextStep}
          />
        );

      case 'dashboard':
        return (
          <DashboardScreen
            selectedEmotion={selectedEmotion}
            currentStreak={currentStreak}
            weeklyData={weeklyData}
            onReset={resetFlow}
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