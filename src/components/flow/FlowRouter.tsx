import React, { useEffect } from 'react';
import WelcomeScreen from '../WelcomeScreen';
import EmotionSelectionScreen from '../EmotionSelectionScreen';
import GamePromptScreen from '../GamePromptScreen';
import FlowGameSection from './FlowGameSection';
import VoiceChatStep from '../VoiceChatStep';
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
    
    // Update URL with game parameter based on selected emotion
    const emotionToGameName: Record<string, string> = {
      'frustration': 'boxbreathing',
      'stress': 'boxbreathing', 
      'anxiety': 'boxbreathing',
      'sad': 'colorbloom',
      'grief': 'memorylantern',
      'lethargy': 'rythmgrow',
      'anger': 'balancingact',
      'happy': 'colorbloom',
      'loneliness': 'memorylantern',
      'fear': 'boxbreathing'
    };
    
    const selectedEmotion = flowState.selectedEmotion;
    const gameName = selectedEmotion ? emotionToGameName[selectedEmotion] : null;
    
    if (gameName) {
      // Update URL without page refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('game', gameName);
      window.history.replaceState({}, '', newUrl.toString());
      console.log('Updated URL with game parameter:', gameName);
    }
    
    flowState.actions.setCurrentStep('game');
  };

  const handleGameComplete = (data: any) => {
    console.log('Game completed');
    
    // Remove game parameter from URL when moving to journaling
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('game');
    window.history.replaceState({}, '', newUrl.toString());
    
    flowState.actions.completeGame(data);
    flowState.actions.setCurrentStep('voice-chat');
  };

  const handleVoiceChatComplete = () => {
    console.log('Voice chat completed');
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
          <FlowGameSection
            emotion={flowState.selectedEmotion || 'happy'}
            onGameComplete={handleGameComplete}
            onRewardEarned={(reward) => console.log('Reward earned:', reward)}
            onSkip={() => {
              flowState.actions.setCurrentStep('voice-chat');
            }}
          />
        );

      case 'voice-chat':
        return (
          <VoiceChatStep
            selectedEmotion={flowState.selectedEmotion || 'happy'}
            gameCompleted={flowState.gameData?.gameId || undefined}
            onComplete={handleVoiceChatComplete}
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