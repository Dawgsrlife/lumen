import React, { useEffect } from "react";
import WelcomeScreen from "../WelcomeScreen";
import EmotionSelectionScreen from "../EmotionSelectionScreen";
import GamePromptScreen from "../GamePromptScreen";
import FlowGameSection from "./FlowGameSection";
import JournalingStep from "../JournalingStep";
import { useFlowState } from "../../hooks/useFlowState";
import { LumenMascot } from "../ui";
import type { EmotionType } from "../../types";
import type { UnityGameData } from "../../services/unity";

interface FlowRouterProps {
  onComplete?: () => void;
}

const FlowRouter: React.FC<FlowRouterProps> = ({ onComplete }) => {
  const flowState = useFlowState(); // Use the unified hook

  // Debug logging for step changes
  useEffect(() => {
    console.log("FlowRouter: Step changed to:", flowState.currentStep);
  }, [flowState.currentStep]);

  const handleWelcomeComplete = () => {
    console.log("Welcome completed, advancing to emotion selection");
    flowState.actions.setCurrentStep("emotion-selection");
  };

  const handleEmotionSelected = (emotion: EmotionType) => {
    console.log("🎯 FlowRouter - Emotion selected:", emotion);
    flowState.actions.selectEmotion(emotion);
    console.log(
      "🎯 FlowRouter - Flow state after emotion selection:",
      flowState.selectedEmotion
    );
    // Don't auto-advance to game - go to game-prompt first
    flowState.actions.setCurrentStep("game-prompt");
  };

  const handleGamePromptContinue = () => {
    console.log("Game prompt continue");

    // Update URL with game parameter based on selected emotion
    const emotionToGameName: Record<string, string> = {
      frustration: "boxbreathing",
      stress: "balancingact",
      anxiety: "boxbreathing",
      sad: "colorbloom",
      grief: "memorylantern",
      lethargy: "rythmgrow",
      anger: "boxbreathing",
      happy: "rythmgrow", // Fixed: should be rythmgrow not colorbloom
      loneliness: "colorbloom", // Fixed: should be colorbloom not memorylantern
      fear: "boxbreathing",
    };

    const selectedEmotion = flowState.selectedEmotion;
    const gameName = selectedEmotion
      ? emotionToGameName[selectedEmotion]
      : null;

    if (gameName) {
      // Update URL without page refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("game", gameName);
      window.history.replaceState({}, "", newUrl.toString());
      console.log("Updated URL with game parameter:", gameName);
    }

    flowState.actions.setCurrentStep("game");
  };

  const handleGameComplete = (data: UnityGameData) => {
    console.log("Game completed");

    // Remove game parameter from URL when moving to journaling
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("game");
    window.history.replaceState({}, "", newUrl.toString());

    flowState.actions.completeGame(data);
    flowState.actions.setCurrentStep("journaling");
  };

  const handleJournalingComplete = () => {
    console.log("Journaling completed");
    // Save journal entry and complete flow
    flowState.actions.completeFlow();
    if (onComplete) {
      onComplete();
    }
  };

  // Check if user has already logged today and redirect to dashboard
  useEffect(() => {
    if (flowState.hasLoggedToday && flowState.currentStep !== "journaling" && flowState.currentStep !== "feedback") {
      console.log("User has already logged today, redirecting to dashboard");
      // Redirect to dashboard
      window.location.href = "/dashboard";
      return;
    }
  }, [flowState.hasLoggedToday, flowState.currentStep]);

  const renderStep = () => {
    console.log("Rendering step:", flowState.currentStep, "hasLoggedToday:", flowState.hasLoggedToday);

    // Show loading while checking daily status
    if (flowState.isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumen-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Checking today's progress...</p>
          </div>
        </div>
      );
    }

    // If user has already logged today, show completion message
    if (flowState.hasLoggedToday && flowState.currentStep !== "journaling" && flowState.currentStep !== "feedback") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Already Logged Today!</h2>
            <p className="text-slate-600 mb-6">
              You've already logged your emotion today. Check your dashboard to see your progress.
            </p>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="bg-lumen-primary text-white px-6 py-3 rounded-lg hover:bg-lumen-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    switch (flowState.currentStep) {
      case "welcome":
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;

      case "emotion-selection":
        return (
          <EmotionSelectionScreen
            onEmotionSelect={handleEmotionSelected} // ✅ CORRECT prop name
          />
        );

      case "game-prompt":
        return (
          <GamePromptScreen
            selectedEmotion={flowState.selectedEmotion || "happy"}
            onPlayGame={handleGamePromptContinue}
            onSkipGame={() => {
              flowState.actions.completeFlow();
              if (onComplete) onComplete();
            }}
          />
        );

      case "game":
        console.log(
          "🎮 FlowRouter - Rendering game section with emotion:",
          flowState.selectedEmotion
        );
        return (
          <FlowGameSection
            emotion={flowState.selectedEmotion || "happy"}
            onGameComplete={handleGameComplete}
            onRewardEarned={(reward) => console.log("Reward earned:", reward)}
            onSkip={() => {
              flowState.actions.setCurrentStep("journaling");
            }}
          />
        );

      case "journaling":
        return (
          <JournalingStep
            selectedEmotion={flowState.selectedEmotion || "happy"}
            gameCompleted={
              typeof flowState.gameData?.gameId === "string"
                ? flowState.gameData.gameId
                : undefined
            }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Unknown Step: {flowState.currentStep}
              </h1>
              <button
                onClick={() => flowState.actions.setCurrentStep("welcome")}
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
      {flowState.currentStep !== "welcome" &&
        flowState.currentStep !== "game" && <LumenMascot currentPage="/flow" />}
      {renderStep()}
    </div>
  );
};

export default FlowRouter;
