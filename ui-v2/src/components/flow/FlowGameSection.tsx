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

  const gameConfig = emotionToGame[emotion];
  const instructions = gameConfig
    ? gameInstructions[gameConfig.gameName]
    : null;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
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
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.08),transparent_70%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%),radial-gradient(circle_at_90%_10%,rgba(120,119,198,0.05),transparent_50%)]" />

      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Elegant Header Section */}
        <motion.div className="pt-16 pb-8 px-8" variants={itemVariants}>
          <div className="max-w-4xl mx-auto text-center">
            {/* Game Icon with Enhanced Animation */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 1.4,
                ease: "backOut",
                type: "spring",
                stiffness: 80,
                damping: 12,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl scale-150" />
              <div className="relative text-8xl mb-6 filter drop-shadow-lg">
                {instructions?.emoji}
              </div>
            </motion.div>

            {/* Game Title with Premium Typography */}
            <motion.h1
              className="text-4xl md:text-6xl font-extralight text-slate-900 mb-6 tracking-tight leading-none"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              variants={itemVariants}
            >
              {gameConfig.title}
            </motion.h1>

            {/* Decorative divider */}
            <motion.div
              className="flex justify-center mb-8"
              variants={itemVariants}
            >
              <motion.div
                className="w-32 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1.2 }}
              />
            </motion.div>

            {/* Game Description */}
            <motion.p
              className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto tracking-wide"
              variants={itemVariants}
            >
              {gameConfig.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Premium Game Instructions Card */}
        {instructions && showInstructions && (
          <motion.div className="px-8 pb-8" variants={itemVariants}>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl shadow-slate-900/5" />

                <div className="relative p-8 md:p-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📖</span>
                      </div>
                      <h2 className="text-2xl font-medium text-slate-900 tracking-wide">
                        How to Play
                      </h2>
                    </div>
                    <motion.button
                      onClick={() => setShowInstructions(false)}
                      className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✕
                    </motion.button>
                  </div>

                  {/* Instructions Grid */}
                  <div className="grid md:grid-cols-1 gap-8">
                    {/* Mechanic */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm">⚡</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          Mechanic
                        </h3>
                      </div>
                      <p className="text-slate-700 leading-relaxed pl-11">
                        {instructions.mechanic}
                      </p>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm">🎯</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          Addresses
                        </h3>
                      </div>
                      <p className="text-slate-700 leading-relaxed pl-11">
                        {instructions.emotion}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm">✨</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          How it helps
                        </h3>
                      </div>
                      <div className="pl-11 space-y-3">
                        {instructions.benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start gap-3 text-slate-700 leading-relaxed"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            <p>{benefit}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Unity Game Container */}
        <motion.div className="px-8 pb-16" variants={itemVariants}>
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Enhanced container with subtle shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-sm rounded-[2rem] border border-white/50 shadow-2xl shadow-slate-900/8" />

              <div className="relative p-2">
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
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlowGameSection;
