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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.8),transparent_50%)]" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center w-full mx-auto">
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
            <div className="text-6xl mb-8">{emotion.emoji}</div>
            <h2
              className="text-xl md:text-2xl font-light text-gray-600 mb-12 leading-relaxed tracking-wide w-full"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              {emotion.encouragingMessage}
            </h2>
            <div className="mb-12"></div>
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
              className="text-2xl md:text-3xl font-light text-gray-800 mb-16 leading-tight tracking-wide"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Ready for a mindful moment?
            </h1>
            <div className="mb-16"></div>
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
            <motion.button
              onClick={onPlayGame}
              className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 min-w-[160px] cursor-pointer"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Begin Journey
            </motion.button>

            <motion.button
              onClick={onSkipGame}
              className="px-8 py-3 bg-white/80 text-slate-600 font-light border border-slate-200 rounded-full hover:bg-white hover:border-slate-300 transition-all duration-300 min-w-[160px] backdrop-blur-sm cursor-pointer"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Skip for now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamePromptScreen;
