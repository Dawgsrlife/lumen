import React from "react";
import { AnimatePresence } from "framer-motion";
import { useFlowState } from "../../hooks/useFlowState";
import WelcomeScreen from "../WelcomeScreen";
import EmotionSelectionScreen from "../EmotionSelectionScreen";
import GamePromptScreen from "../GamePromptScreen";
import JournalingStep from "../JournalingStep";
import FlowGameSection from "./FlowGameSection";
import type { EmotionType } from "../../types";

interface FlowRouterProps {
  onComplete: () => void;
}

const FlowRouter: React.FC<FlowRouterProps> = ({ onComplete }) => {
  const flowState = useFlowState();

  console.log("FlowRouter: Current step:", flowState.currentStep);

  const handleEmotionSelect = (emotion: EmotionType) => {
    flowState.actions.selectEmotion(emotion);
    flowState.actions.setCurrentStep("game-prompt");
  };

  const handlePlayGame = () => {
    flowState.actions.setCurrentStep("game");
  };

  const handleSkipGame = () => {
    flowState.actions.setCurrentStep("journaling");
  };

  const handleGameComplete = () => {
    flowState.actions.setCurrentStep("journaling");
  };

  const renderCurrentStep = () => {
    switch (flowState.currentStep) {
      case "welcome":
        return <WelcomeScreen key="welcome" />;

      case "emotion-selection":
        return (
          <EmotionSelectionScreen
            key="emotion-selection"
            onEmotionSelect={handleEmotionSelect}
          />
        );

      case "game-prompt":
        if (!flowState.selectedEmotion) {
          // Fallback to emotion selection if no emotion selected
          return (
            <EmotionSelectionScreen
              key="emotion-selection-fallback"
              onEmotionSelect={handleEmotionSelect}
            />
          );
        }
        return (
          <GamePromptScreen
            key="game-prompt"
            selectedEmotion={flowState.selectedEmotion}
            onPlayGame={handlePlayGame}
            onSkipGame={handleSkipGame}
          />
        );

      case "game":
        if (!flowState.selectedEmotion) {
          // Fallback to emotion selection if no emotion selected
          return (
            <EmotionSelectionScreen
              key="emotion-selection-fallback"
              onEmotionSelect={handleEmotionSelect}
            />
          );
        }
        return (
          <FlowGameSection
            key="game"
            emotion={flowState.selectedEmotion}
            onGameComplete={handleGameComplete}
            onRewardEarned={() => {}}
            onSkip={handleSkipGame}
          />
        );

      case "journaling":
        return <JournalingStep key="journaling" onComplete={onComplete} />;

      case "feedback":
        return <JournalingStep key="feedback" onComplete={onComplete} />;

      default:
        console.warn("Unknown flow step:", flowState.currentStep);
        return <WelcomeScreen key="fallback" />;
    }
  };

  return (
    <div className="relative z-10 min-h-screen w-full">
      <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
    </div>
  );
};

export default FlowRouter;
