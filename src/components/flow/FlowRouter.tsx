import React, { useEffect } from 'react';
import WelcomeScreen from '../WelcomeScreen';
import EmotionSelectionScreen from '../EmotionSelectionScreen';
import GamePromptScreen from '../GamePromptScreen';
import UnityGame from '../games/UnityGame';
import GameCompletion from '../games/GameCompletion';
import PostGameFeedback from '../games/PostGameFeedback';
import JournalingStep from '../JournalingStep';
import DashboardScreen from '../DashboardScreen';
import { useFlowState } from '../../hooks/useFlowState';
import { LumenMascot } from '../ui';
import type { EmotionType } from '../../types';

interface FlowRouterProps {
  onComplete?: () => void;
}

const FlowRouter: React.FC<FlowRouterProps> = ({ onComplete }) => {
  const flowState = useFlowState(); // Use the unified hook
  
  // Debug logging for step changes
  useEffect(() => {
    console.log('FlowRouter: Step changed to:', flowState.currentStep);
  }, [flowState.currentStep]);
  
  const handleWelcomeComplete = () => {
    console.log('Welcome completed, advancing to emotion selection');
    flowState.actions.setCurrentStep('emotion-selection');
  };

  const handleEmotionSelected = (emotion: EmotionType) => {
    console.log('Emotion selected:', emotion);
    flowState.actions.selectEmotion(emotion);
    // Don't auto-advance to game - go to game-prompt first
    flowState.actions.setCurrentStep('game-prompt');
  };

  const handleGamePromptContinue = () => {
    console.log('Game prompt continue');
    flowState.actions.setCurrentStep('game');
  };

  const handleGameComplete = (data: any) => {
    console.log('Game completed');
    flowState.actions.completeGame(data);
    flowState.actions.setCurrentStep('journaling');
  };

  const handleJournalingComplete = () => {
    console.log('Journaling completed');
    // Save journal entry and complete flow
    flowState.actions.completeFlow();
    if (onComplete) {
      onComplete();
    }
  };

  const renderStep = () => {
    console.log('Rendering step:', flowState.currentStep);
    
    switch (flowState.currentStep) {
      case 'welcome':
        return (
          <WelcomeScreen
            onComplete={handleWelcomeComplete}
          />
        );

      case 'emotion-selection':
        return (
          <EmotionSelectionScreen
            onEmotionSelect={handleEmotionSelected} // ✅ CORRECT prop name
          />
        );

      case 'game-prompt':
        return (
          <GamePromptScreen
            selectedEmotion={flowState.selectedEmotion || 'happy'}
            onPlayGame={handleGamePromptContinue}
            onSkipGame={() => {
              flowState.actions.completeFlow();
              if (onComplete) onComplete();
            }}
          />
        );

      case 'game':
        return (
          <UnityGame
            gameId="lumen-minigames"
            gameName="default"
            gameTitle="Lumen Minigames"
            description="A collection of therapeutic games"
            buildUrl="/unity-builds/lumen-minigames/"
            emotionData={{
              emotion: flowState.selectedEmotion || 'happy',
              intensity: 5,
              context: { source: 'flow', timestamp: new Date().toISOString() }
            }}
            onGameComplete={handleGameComplete}
            onRewardEarned={(reward) => console.log('Reward earned:', reward)}
          />
        );

      case 'journaling':
        return (
          <JournalingStep
            selectedEmotion={flowState.selectedEmotion || 'happy'}
            gameCompleted={flowState.gameData?.gameId || undefined}
            onComplete={handleJournalingComplete}
            onSkip={() => {
              flowState.actions.completeFlow();
              if (onComplete) onComplete();
            }}
          />
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Unknown Step: {flowState.currentStep}</h1>
              <button 
                onClick={() => flowState.actions.setCurrentStep('welcome')} 
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              >
                Restart Flow
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {flowState.currentStep !== 'welcome' && flowState.currentStep !== 'game' && <LumenMascot currentPage="/flow" />}
      {renderStep()}
    </div>
  );
};

export default FlowRouter; 