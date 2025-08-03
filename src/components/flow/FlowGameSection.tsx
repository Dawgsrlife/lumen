import React from 'react';
import { motion } from 'framer-motion';
import { UnityGame } from '../games';
import type { UnityGameData, UnityReward } from '../../services/unity';
import type { EmotionType } from '../../types';

// Map emotions to working Unity games
const emotionToGame: Record<string, { gameId: string; gameName: string; title: string; description: string }> = {
  // Breathing game for anger, frustration, stress
  frustration: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Release frustration with structured breathing patterns'
  },
  stress: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Unwind stress through calming breath work'
  },
  anxiety: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Calm anxiety with focused breathing techniques'
  },
  // Color bloom for sadness
  sad: {
    gameId: 'lumen-minigames',
    gameName: 'colorbloom',
    title: 'Color Bloom',
    description: 'Nurture flowers and watch colors bloom to lift your spirits'
  },
  // Memory lantern for grief
  grief: {
    gameId: 'lumen-minigames',
    gameName: 'memorylantern',
    title: 'Memory Lantern',
    description: 'Honor memories and find peace through guided reflection'
  },
  // Rhythm grow for lethargy
  lethargy: {
    gameId: 'lumen-minigames',
    gameName: 'rythmgrow',
    title: 'Rhythm Grow',
    description: 'Energize yourself with rhythmic growth activities'
  },
  // Balancing act for emotional balance
  anger: {
    gameId: 'lumen-minigames',
    gameName: 'balancingact',
    title: 'Balancing Act',
    description: 'Find emotional balance through mindful interaction'
  },
  // Default mappings for other emotions (use appropriate games)
  happy: {
    gameId: 'lumen-minigames',
    gameName: 'colorbloom',
    title: 'Color Bloom',
    description: 'Celebrate your happiness by creating beautiful blooms'
  },
  loneliness: {
    gameId: 'lumen-minigames',
    gameName: 'memorylantern',
    title: 'Memory Lantern',
    description: 'Connect with meaningful memories to ease loneliness'
  },
  fear: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Find courage through mindful breathing practices'
  }
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
  onSkip
}) => {
  const gameConfig = emotionToGame[emotion];
  
  if (!gameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Game not found</h3>
          <p className="text-gray-600 mb-4">No game available for emotion: {emotion}</p>
          <button
            onClick={onSkip}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Skip to journaling
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Game Header */}
      <div className="text-center mb-8 max-w-2xl">
        <motion.h2
          className="text-3xl font-light text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {gameConfig.title}
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {gameConfig.description}
        </motion.p>
      </div>
      
      {/* Unity Game */}
      <motion.div
        className="w-full max-w-4xl mb-8"
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
            context: { source: 'flow', timestamp: new Date().toISOString() }
          }}
          onGameComplete={onGameComplete}
          onRewardEarned={onRewardEarned}
          className="w-full"
        />
      </motion.div>
      
      {/* Skip Button */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <button 
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
        >
          Skip to journaling
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FlowGameSection; 