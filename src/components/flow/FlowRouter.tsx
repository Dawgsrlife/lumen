import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '../WelcomeScreen';
import EmotionSelectionScreen from '../EmotionSelectionScreen';
import FlowGameSection from './FlowGameSection';
import { PostGameFeedback } from '../games';
import JournalingStep from '../JournalingStep';
import type { FlowStep } from '../../context/FlowProvider';
import type { UnityGameData, UnityReward } from '../../services/unity';
import type { EmotionType } from '../../types';

interface FlowRouterProps {
  currentStep: FlowStep;
  selectedEmotion: EmotionType | null;
  user: any;
  onEmotionSelect: (emotion: EmotionType) => void;
  onGameComplete: (data: UnityGameData) => void;
  onRewardEarned: (reward: UnityReward) => void;
  onSkipGame: () => void;
  onFeedbackResponse: (feeling: boolean) => void;
  onSkipFeedback: () => void;
  onJournalingComplete: () => void;
  onJournalingSkip: () => void;
  setCurrentStep: (step: FlowStep) => void;
}

const stepOrder: FlowStep[] = ['welcome', 'emotion-selection', 'game', 'feedback', 'journaling'];

const FlowRouter: React.FC<FlowRouterProps> = ({
  currentStep,
  selectedEmotion,
  user,
  onEmotionSelect,
  onGameComplete,
  onRewardEarned,
  onSkipGame,
  onFeedbackResponse,
  onSkipFeedback,
  onJournalingComplete,
  onJournalingSkip,
  setCurrentStep
}) => {
  const advanceToNextStep = () => {
    const idx = stepOrder.indexOf(currentStep);
    if (idx < stepOrder.length - 1) setCurrentStep(stepOrder[idx + 1]);
  };

  // Debug logging
  console.log('Current step:', currentStep, 'Selected emotion:', selectedEmotion);

  switch (currentStep) {
    case 'welcome':
      return (
        <WelcomeScreen
          username={user?.username}
          onComplete={advanceToNextStep}
        />
      );
    case 'emotion-selection':
      return (
        <EmotionSelectionScreen
          onEmotionSelect={emotion => {
            onEmotionSelect(emotion);
            advanceToNextStep();
          }}
        />
      );
    case 'game':
      if (!selectedEmotion) {
        return (
          <div key="game-error" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No emotion selected</h3>
              <p className="text-gray-600">Please select an emotion to continue</p>
              <button onClick={advanceToNextStep} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Continue</button>
              <button onClick={() => window.location.href = '/dashboard'} className="fixed bottom-4 right-4 text-xs text-gray-400 underline">Skip to Dashboard</button>
            </div>
          </div>
        );
      }
      return (
        <FlowGameSection
          emotion={selectedEmotion}
          onGameComplete={data => {
            onGameComplete(data);
            advanceToNextStep();
          }}
          onRewardEarned={onRewardEarned}
          onSkip={() => {
            onSkipGame();
            advanceToNextStep();
          }}
        />
      );
    case 'feedback':
      if (!selectedEmotion) {
        return (
          <div key="feedback-error" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No emotion selected</h3>
              <p className="text-gray-600">Please select an emotion to continue</p>
              <button onClick={advanceToNextStep} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Continue</button>
              <button onClick={() => window.location.href = '/dashboard'} className="fixed bottom-4 right-4 text-xs text-gray-400 underline">Skip to Dashboard</button>
            </div>
          </div>
        );
      }
      return (
        <PostGameFeedback
          emotion={selectedEmotion}
          gameTitle="Calming Game"
          onFeedback={feeling => {
            onFeedbackResponse(feeling);
            advanceToNextStep();
          }}
          onSkip={() => {
            onSkipFeedback();
            advanceToNextStep();
          }}
        />
      );
    case 'journaling':
      return (
        <JournalingStep
          onComplete={() => {
            onJournalingComplete();
            // Optionally, navigate to dashboard or show a complete screen
          }}
          onSkip={() => {
            onJournalingSkip();
            // Optionally, navigate to dashboard or show a complete screen
          }}
        />
      );
    default:
      return (
        <div>
          <p>Unknown step: {currentStep}</p>
          <button onClick={advanceToNextStep}>Continue</button>
          <button onClick={() => window.location.href = '/dashboard'} className="fixed bottom-4 right-4 text-xs text-gray-400 underline">Skip to Dashboard</button>
        </div>
      );
  }
};

export default FlowRouter; 