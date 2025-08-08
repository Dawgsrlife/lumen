import React, { useState } from "react";
import { motion } from "framer-motion";
import { UnityGame } from "../games";
import type { UnityGameData, UnityReward } from "../../services/unity";
import type { EmotionType } from "../../types";

// Game instructions data
const gameInstructions: Record<
  string,
  {
    emoji: string;
    title: string;
    mechanic: string;
    emotion: string;
    benefits: string[];
  }
> = {
  colorbloom: {
    emoji: "🌸",
    title: "Color Bloom",
    mechanic: "Hold and grow flowers to gradually restore color to the world.",
    emotion: "Sadness, hopelessness, emotional numbness",
    benefits: [
      "The act of nurturing something reinforces care and gentleness toward oneself",
      "Watching the world brighten visually represents emotional healing and hope",
      "Creates a sense of control and slow progress in a calming, peaceful space",
    ],
  },
  rythmgrow: {
    emoji: "🌳",
    title: "Rhythm Grow",
    mechanic: "Press space at the right time to help a tree grow strong.",
    emotion: "Fatigue, burnout, lack of motivation",
    benefits: [
      "The rhythmic input energizes users and promotes a flow state",
      "The tree growth symbolizes personal growth and vitality",
      "Encourages focus and presence without being overwhelming",
    ],
  },
  boxbreathing: {
    emoji: "🌬️",
    title: "Box Breathing",
    mechanic: "Visual and timed cues to breathe in, hold, and exhale.",
    emotion: "Anxiety, stress, panic",
    benefits: [
      "Guides users through controlled box (square) breathing, proven to reduce anxiety",
      "The visual guidance keeps focus on breath and promotes calm",
      "Nonverbal design makes it accessible and calming",
    ],
  },
  memorylantern: {
    emoji: "🏮",
    title: "Memory Lantern",
    mechanic:
      "Write a message to or about someone meaningful and release it as a floating lantern.",
    emotion: "Grief, loss, remembrance, longing",
    benefits: [
      "Writing allows emotional expression and personal reflection",
      "Letting go visually through the lantern offers symbolic closure and peace",
      "Seeing your message float among others conveys shared experience and connection",
    ],
  },
  balancingact: {
    emoji: "🪨",
    title: "Balancing Act",
    mechanic: "Stack fallen stones to rebuild a collapsed tower.",
    emotion: "Guilt, shame, self-blame, regret",
    benefits: [
      "Rebuilding represents self-forgiveness and resilience after failure",
      "Careful stacking encourages patience and presence",
      "Rebuilding a tower may symbolize mending or rebuilding of a relationship",
    ],
  },
};

// Map emotions to working Unity games
const emotionToGame: Record<
  string,
  { gameId: string; gameName: string; title: string; description: string }
> = {
  sad: {
    gameId: "lumen-minigames",
    gameName: "colorbloom",
    title: "🌸 Color Bloom",
    description:
      "When you feel numb or hopeless, nurture flowers and watch color return to a quiet world",
  },
  lethargy: {
    gameId: "lumen-minigames",
    gameName: "rythmgrow",
    title: "🌳 Rhythm Grow",
    description:
      "Energize yourself by pressing to the rhythm of upbeat music and regain your focus",
  },
  grief: {
    gameId: "lumen-minigames",
    gameName: "memorylantern",
    title: "🏮 Memory Lantern",
    description:
      "Write a message to someone you're remembering and release it as a glowing lantern",
  },
  stress: {
    gameId: "lumen-minigames",
    gameName: "balancingact",
    title: "🪨 Balancing Act",
    description:
      "Rebuild a tower by carefully stacking stones, symbolizing healing and resilience",
  },
  anxiety: {
    gameId: "lumen-minigames",
    gameName: "boxbreathing",
    title: "🫁 Box Breathing",
    description:
      "Calm your mind with structured breathing patterns and find inner peace",
  },
  frustration: {
    gameId: "lumen-minigames",
    gameName: "boxbreathing",
    title: "🫁 Box Breathing",
    description: "Release tension with focused breathing techniques",
  },
  loneliness: {
    gameId: "lumen-minigames",
    gameName: "colorbloom",
    title: "🌸 Color Bloom",
    description: "Find comfort in nurturing and watching life bloom around you",
  },
  fear: {
    gameId: "lumen-minigames",
    gameName: "boxbreathing",
    title: "🫁 Box Breathing",
    description: "Ground yourself with calming breath work and reduce fear",
  },
  happy: {
    gameId: "lumen-minigames",
    gameName: "rythmgrow",
    title: "🌳 Rhythm Grow",
    description:
      "Celebrate your positive energy with uplifting rhythmic activities",
  },
};

interface FlowGameSectionProps {
  emotion: EmotionType;
  onGameComplete: (data: UnityGameData) => void;
  onRewardEarned: (reward: UnityReward) => void;
  onSkip: () => void;
}

const FlowGameSection: React.FC<FlowGameSectionProps> = ({
  emotion,
  onGameComplete,
  onRewardEarned,
  onSkip,
}) => {
  const [showInstructions, setShowInstructions] = useState(true);

  // Debug logging for emotion and game mapping
  console.log("🎮 FlowGameSection - Emotion received:", emotion);

  const gameConfig = emotionToGame[emotion];
  console.log("🎮 FlowGameSection - Game config:", gameConfig);

  const instructions = gameConfig
    ? gameInstructions[gameConfig.gameName]
    : null;

  console.log("🎮 FlowGameSection - Instructions:", instructions);

  if (!gameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Game not found
          </h3>
          <p className="text-gray-600 mb-4">
            No game available for emotion: {emotion}
          </p>
          <button
            onClick={onSkip}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header with proper top margin */}
      <div className="pt-8 pb-4 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {instructions?.emoji} {gameConfig.title}
            </h1>
            <p className="text-gray-600">{gameConfig.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Game Instructions */}
      {instructions && showInstructions && (
        <motion.div
          className="px-6 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  How to Play
                </h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Mechanic:</span>
                  <span className="text-gray-700 ml-2">
                    {instructions.mechanic}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-900">Addresses:</span>
                  <span className="text-gray-700 ml-2">
                    {instructions.emotion}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-900">
                    How it helps:
                  </span>
                  <ul className="mt-2 space-y-1 ml-4">
                    {instructions.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-gray-700 text-xs leading-relaxed"
                      >
                        • {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Unity Game - Scaled appropriately */}
      <div className="px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <UnityGame
              gameId={gameConfig.gameId}
              gameTitle={gameConfig.title}
              description={gameConfig.description}
              buildUrl="/unity-builds/lumen-minigames"
              gameName={gameConfig.gameName}
              emotionData={{
                emotion: emotion,
                intensity: 5,
                context: {
                  source: "flow",
                  timestamp: new Date().toISOString(),
                },
              }}
              onGameComplete={onGameComplete}
              onRewardEarned={onRewardEarned}
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FlowGameSection;
