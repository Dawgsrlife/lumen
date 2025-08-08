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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(120,119,198,0.05),transparent_50%)]" />

      <motion.div
        className="relative min-h-screen flex items-center justify-center px-8 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -50 }}
      >
        <div className="max-w-3xl w-full mx-auto">
          {/* Header Section */}
          <motion.div className="text-center mb-20" variants={itemVariants}>
            {/* Emotion Icon with Enhanced Animation */}
            <motion.div
              className="relative mb-12"
              initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 1.2,
                ease: "backOut",
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl scale-150" />
              <div className="relative text-9xl mb-8 filter drop-shadow-lg">
                {emotion.emoji}
              </div>
            </motion.div>

            {/* Emotion Title with Sophisticated Typography */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <h1
                className="text-5xl md:text-7xl font-extralight text-slate-900 tracking-tight leading-none"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                {emotion.label}
              </h1>

              <div className="flex justify-center">
                <motion.div
                  className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </div>

              <motion.p
                className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed mx-auto tracking-wide text-center"
                variants={itemVariants}
              >
                {emotion.encouragingMessage}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Activity Card with Premium Design */}
          <motion.div className="relative mb-16" variants={itemVariants}>
            {/* Card Background with Sophisticated Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl shadow-slate-900/5" />

            <div className="relative p-10 md:p-12">
              {/* Activity Header */}
              <motion.div className="text-center mb-10" variants={itemVariants}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-6">
                  <span className="text-3xl">🎮</span>
                </div>
                <h2 className="text-3xl font-medium text-slate-900 mb-2 tracking-wide">
                  Mindful Activity
                </h2>
                <div className="mb-2"></div>
                <p className="text-slate-500 font-light">
                  Designed specifically for your emotional state
                </p>
              </motion.div>

              {/* Activity Metrics Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
                variants={itemVariants}
              >
                <div className="text-center group">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 transition-all duration-300 group-hover:bg-slate-100">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-medium mb-2">
                      Duration
                    </div>
                    <div className="text-xl font-semibold text-slate-900">
                      {emotion.gameInfo.duration}
                    </div>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 transition-all duration-300 group-hover:bg-slate-100">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-medium mb-2">
                      Intensity
                    </div>
                    <div className="text-xl font-semibold text-slate-900">
                      {emotion.gameInfo.difficulty}
                    </div>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 transition-all duration-300 group-hover:bg-slate-100">
                    <div className="text-2xl mb-2">✨</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-medium mb-2">
                      Benefits
                    </div>
                    <div className="text-xl font-semibold text-slate-900">
                      {emotion.gameInfo.benefits.length}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Benefits Tags with Enhanced Design */}
              <motion.div className="text-center" variants={itemVariants}>
                <h3 className="text-lg font-medium text-slate-700 mb-6">
                  What you'll experience
                </h3>
                <div className="mb-6"></div>
                <div className="flex flex-wrap justify-center gap-3">
                  {emotion.gameInfo.benefits.map((benefit, index) => (
                    <motion.span
                      key={index}
                      className="px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      {benefit}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div className="space-y-5" variants={itemVariants}>
            <motion.button
              onClick={onPlayGame}
              className="w-full group relative px-8 py-6 bg-slate-900 text-white rounded-2xl font-medium text-xl overflow-hidden shadow-xl shadow-slate-900/25 hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 cursor-pointer"
              whileHover={{
                y: -4,
                scale: 1.01,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-3">
                <span>Begin Your Journey</span>
                <motion.div
                  className="text-2xl"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  →
                </motion.div>
              </div>
            </motion.button>

            <motion.button
              onClick={onSkipGame}
              className="w-full px-8 py-6 bg-white/50 backdrop-blur-sm text-slate-600 rounded-2xl font-medium text-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-white/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 shadow-lg hover:shadow-xl cursor-pointer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue Without Activity
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamePromptScreen;
