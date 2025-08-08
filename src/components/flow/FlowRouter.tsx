import React, { useEffect } from "react";
import { useFlow } from "../../context/hooks";
import WelcomePage from "../../pages/WelcomePage";
import EmotionSelectionScreen from "../EmotionSelectionScreen";
import GamePromptScreen from "../GamePromptScreen";
import FlowGameSection from "./FlowGameSection";
import JournalingStep from "../JournalingStep";
import DashboardScreen from "../DashboardScreen";
import type { EmotionType } from "../../types";

interface FlowRouterProps {
  onComplete: () => void;
}

const FlowRouter: React.FC<FlowRouterProps> = ({ onComplete }) => {
  const { state: flowState, setEmotion, nextStep } = useFlow();

  // Handle dashboard step completion
  useEffect(() => {
    if (flowState.currentStep === "dashboard") {
      onComplete();
    }
  }, [flowState.currentStep, onComplete]);

  const renderCurrentStep = () => {
    switch (flowState.currentStep) {
      case "welcome":
        return <WelcomePage />;

      case "emotion-selection":
        return (
          <EmotionSelectionScreen
            onEmotionSelect={(emotion: EmotionType) => {
              setEmotion(emotion);
              nextStep();
            }}
          />
        );

      case "game-prompt":
        return (
          <GamePromptScreen
            selectedEmotion={
              (flowState.selectedEmotion as EmotionType) ||
              ("happy" as EmotionType)
            }
            onPlayGame={() => nextStep()}
            onSkipGame={() => {
              // Skip to journaling or next appropriate step
              nextStep();
            }}
          />
        );

      case "game":
        return (
          <FlowGameSection
            emotion={
              (flowState.selectedEmotion as EmotionType) ||
              ("happy" as EmotionType)
            }
            onGameComplete={() => nextStep()}
            onRewardEarned={() => {}}
            onSkip={() => nextStep()}
          />
        );

      case "game-completion":
        // Handle game completion - could show results or move to next step
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Game Completed!</h2>
              <button
                onClick={() => nextStep()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case "feedback":
        // Handle feedback step
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Feedback Step</h2>
              <button
                onClick={() => nextStep()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case "journaling":
        return <JournalingStep onComplete={() => nextStep()} />;

      case "dashboard":
        return (
          <DashboardScreen
            selectedEmotion={
              (flowState.selectedEmotion as EmotionType) ||
              ("happy" as EmotionType)
            }
            currentStreak={1}
            weeklyData={[]}
          />
        );

      default:
        console.warn(`Unknown flow step: ${flowState.currentStep}`);
        return <WelcomePage />;
    }
  };

  return <div className="flow-router">{renderCurrentStep()}</div>;
};

export default FlowRouter;
