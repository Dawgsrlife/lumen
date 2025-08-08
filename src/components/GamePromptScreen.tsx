import React from "react";
import { motion } from "framer-motion";
import type { EmotionType } from "../types";

// Emotion data with encouraging messages and game info
const emotionData: Record<
  EmotionType,
  {
    emoji: string;
    label: string;
    encouragingMessage: string;
    gameInfo: {
      duration: string;
      difficulty: string;
      benefits: string[];
    };
  }
> = {
  happy: {
    emoji: "😊",
    label: "Happy",
    encouragingMessage:
      "Your joy is beautiful! Let's celebrate this moment together.",
    gameInfo: {
      duration: "5-10 minutes",
      difficulty: "Easy",
      benefits: [
        "Celebrate positive emotions",
        "Create beautiful visual art",
        "Practice gratitude",
      ],
    },
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    encouragingMessage:
      "It's okay to feel sad. Let's find some gentle comfort together.",
    gameInfo: {
      duration: "8-12 minutes",
      difficulty: "Gentle",
      benefits: [
        "Nurture growth and beauty",
        "Find comfort in creation",
        "Practice self-care",
      ],
    },
  },
  loneliness: {
    emoji: "😔",
    label: "Loneliness",
    encouragingMessage:
      "You're not alone. Let's create a moment of connection.",
    gameInfo: {
      duration: "10-15 minutes",
      difficulty: "Gentle",
      benefits: [
        "Connect with meaningful memories",
        "Find inner peace",
        "Practice self-compassion",
      ],
    },
  },
  anxiety: {
    emoji: "😰",
    label: "Anxiety",
    encouragingMessage: "Let's find some calm together. You're doing great.",
    gameInfo: {
      duration: "10-15 minutes",
      difficulty: "Calming",
      benefits: ["Practice mindfulness", "Reduce tension", "Find inner peace"],
    },
  },
  stress: {
    emoji: "😤",
    label: "Stress",
    encouragingMessage:
      "Feeling overwhelmed is tough. Let's work through this together.",
    gameInfo: {
      duration: "8-15 minutes",
      difficulty: "Balancing",
      benefits: ["Restore balance", "Practice focus", "Build resilience"],
    },
  },
  frustration: {
    emoji: "",
    label: "Frustration",
    encouragingMessage:
      "Frustration can be exhausting. Let's find some relief together.",
    gameInfo: {
      duration: "10-15 minutes",
      difficulty: "Soothing",
      benefits: ["Release tension", "Practice breathing", "Find clarity"],
    },
  },
  lethargy: {
    emoji: "😴",
    label: "Lethargy",
    encouragingMessage:
      "Low energy is okay. Let's gently re-energize together.",
    gameInfo: {
      duration: "5-10 minutes",
      difficulty: "Energizing",
      benefits: ["Boost energy", "Practice rhythm", "Feel alive"],
    },
  },
  fear: {
    emoji: "😨",
    label: "Fear",
    encouragingMessage: "Fear is natural. Let's face it with courage together.",
    gameInfo: {
      duration: "10-15 minutes",
      difficulty: "Gentle",
      benefits: ["Build confidence", "Practice breathing", "Find courage"],
    },
  },
  grief: {
    emoji: "😭",
    label: "Grief",
    encouragingMessage:
      "Grief shows how much you care. Let's honor these feelings.",
    gameInfo: {
      duration: "12-18 minutes",
      difficulty: "Gentle",
      benefits: [
        "Honor your feelings",
        "Find peace",
        "Practice self-compassion",
      ],
    },
  },
};

interface GamePromptScreenProps {
  selectedEmotion: EmotionType;
  onPlayGame: () => void;
  onSkipGame: () => void;
}

const GamePromptScreen: React.FC<GamePromptScreenProps> = ({
  selectedEmotion,
  onPlayGame,
  onSkipGame,
}) => {
  const emotion = emotionData[selectedEmotion];

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center max-w-md">
        {/* Emotion Display */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-6xl mb-4">{emotion.emoji}</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {emotion.label}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {emotion.encouragingMessage}
          </p>
        </motion.div>

        {/* Simple Game Info */}
        <motion.div
          className="bg-white rounded-xl p-6 mb-8 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg">🎮</span>
            <span className="font-medium text-gray-900">Calming Activity</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              {emotion.gameInfo.duration} • {emotion.gameInfo.difficulty}
            </p>
            <p className="text-xs">{emotion.gameInfo.benefits.join(", ")}</p>
          </div>
        </motion.div>

        {/* Clean Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={onPlayGame}
            className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer"
          >
            Start Activity
          </button>

          <button
            onClick={onSkipGame}
            className="w-full px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer"
          >
            Skip for now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GamePromptScreen;
