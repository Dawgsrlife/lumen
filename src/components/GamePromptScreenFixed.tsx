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
    emoji: "😤",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Soft background gradient - matching welcome screen */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-yellow-400/5 via-purple-600/8 to-transparent blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* Emotion Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.2,
            }}
          >
            <div className="text-6xl mb-6">{emotion.emoji}</div>
            <h2
              className="text-2xl md:text-3xl font-light text-gray-600 mb-8 leading-tight tracking-tight"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              {emotion.encouragingMessage}
            </h2>
          </motion.div>

          {/* Simple Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.4,
            }}
          >
            <h1
              className="text-3xl md:text-4xl font-light text-gray-900 mb-12 leading-tight tracking-tight"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Ready for a mindful moment?
            </h1>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.6,
            }}
          >
            <button
              onClick={onPlayGame}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 min-w-[140px]"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Let's begin
            </button>

            <button
              onClick={onSkipGame}
              className="px-8 py-3 bg-transparent text-gray-600 font-light border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 min-w-[140px]"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Skip for now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamePromptScreen;
