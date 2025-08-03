import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { EmotionType } from '../types';

// Emotion data with encouraging messages and game info
const emotionData: Record<EmotionType, { 
  emoji: string; 
  label: string; 
  encouragingMessage: string;
  gameInfo: {
    duration: string;
    difficulty: string;
    benefits: string[];
  };
}> = {
  happy: { 
    emoji: '😊', 
    label: 'Happy', 
    encouragingMessage: 'Your joy is beautiful! Let\'s celebrate this moment together.',
    gameInfo: {
      duration: '5-10 minutes',
      difficulty: 'Easy',
      benefits: ['Celebrate positive emotions', 'Create beautiful visual art', 'Practice gratitude']
    }
  },
  sad: { 
    emoji: '😢', 
    label: 'Sad', 
    encouragingMessage: 'It\'s okay to feel sad. Let\'s find some gentle comfort together.',
    gameInfo: {
      duration: '8-12 minutes',
      difficulty: 'Gentle',
      benefits: ['Nurture growth and beauty', 'Find comfort in creation', 'Practice self-care']
    }
  },
  loneliness: { 
    emoji: '😔', 
    label: 'Loneliness', 
    encouragingMessage: 'You\'re not alone. Let\'s create a moment of connection.',
    gameInfo: {
      duration: '10-15 minutes',
      difficulty: 'Gentle',
      benefits: ['Connect with meaningful memories', 'Find inner peace', 'Practice self-compassion']
    }
  },
  anxiety: { 
    emoji: '😰', 
    label: 'Anxiety', 
    encouragingMessage: 'Let\'s find some calm together. You\'re doing great.',
    gameInfo: {
      duration: '5-8 minutes',
      difficulty: 'Easy',
      benefits: ['Calm your nervous system', 'Focus your attention', 'Practice mindfulness']
    }
  },
  frustration: { 
    emoji: '😤', 
    label: 'Frustration', 
    encouragingMessage: 'Let\'s release that tension and find some peace.',
    gameInfo: {
      duration: '5-8 minutes',
      difficulty: 'Easy',
      benefits: ['Release physical tension', 'Calm your mind', 'Practice patience']
    }
  },
  stress: { 
    emoji: '😵', 
    label: 'Stress', 
    encouragingMessage: 'Let\'s take a moment to breathe and unwind together.',
    gameInfo: {
      duration: '8-12 minutes',
      difficulty: 'Easy',
      benefits: ['Reduce stress hormones', 'Improve focus', 'Practice relaxation']
    }
  },
  lethargy: { 
    emoji: '😴', 
    label: 'Lethargy', 
    encouragingMessage: 'Let\'s gently awaken your energy with something soothing.',
    gameInfo: {
      duration: '10-15 minutes',
      difficulty: 'Gentle',
      benefits: ['Gently increase energy', 'Improve mood', 'Practice gentle movement']
    }
  },
  fear: { 
    emoji: '😨', 
    label: 'Fear', 
    encouragingMessage: 'You\'re safe here. Let\'s find courage together.',
    gameInfo: {
      duration: '5-10 minutes',
      difficulty: 'Easy',
      benefits: ['Calm your nervous system', 'Build courage', 'Practice safety']
    }
  },
  grief: { 
    emoji: '💔', 
    label: 'Grief', 
    encouragingMessage: 'Your feelings are valid. Let\'s honor them with gentle care.',
    gameInfo: {
      duration: '12-18 minutes',
      difficulty: 'Gentle',
      benefits: ['Honor your feelings', 'Find peace', 'Practice self-compassion']
    }
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
  onSkipGame 
}) => {
  const [isSkipLoading, setIsSkipLoading] = useState(false);

  const handleSkipGame = async () => {
    setIsSkipLoading(true);
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    onSkipGame();
  };
  const emotion = emotionData[selectedEmotion];

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center max-w-3xl">
        {/* Emotion Display */}
        <motion.div
          className="text-8xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          {emotion.emoji}
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl font-light text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {emotion.label}
        </motion.h2>

        <div className="mb-4"></div>

        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {emotion.encouragingMessage}
        </motion.p>

        <div className="mb-4"></div>

        {/* Game Information Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            🎮 Game Information
          </h3>

          <div className="mb-4"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-medium text-gray-900">{emotion.gameInfo.duration}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm text-gray-600">Difficulty</div>
              <div className="font-medium text-gray-900">{emotion.gameInfo.difficulty}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">✨</div>
              <div className="text-sm text-gray-600">Benefits</div>
              <div className="font-medium text-gray-900">{emotion.gameInfo.benefits.length} areas</div>
            </div>
          </div>

          <div className="mb-4"></div>
          
          <div className="text-left">
            <div className="text-sm text-gray-600 mb-2">What you'll gain:</div>
            <ul className="space-y-1">
              {emotion.gameInfo.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4"></div>
        </motion.div>

        <div className="mb-4"></div>

        <motion.h3
          className="text-2xl md:text-3xl font-light text-gray-900 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          Would you like to play a calming game?
        </motion.h3>

        <div className="mb-4"></div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.button
            onClick={onPlayGame}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl text-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center justify-center gap-2">
              <span>🎮</span>
              Yes, let's play
            </span>
          </motion.button>
          
          <motion.button
            onClick={handleSkipGame}
            disabled={isSkipLoading}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl text-lg font-medium hover:bg-gray-200 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSkipLoading ? 1 : 1.05 }}
            whileTap={{ scale: isSkipLoading ? 1 : 0.95 }}
          >
            <span className="flex items-center justify-center gap-2">
              {isSkipLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Taking you to dashboard...</span>
                </>
              ) : (
                <>
                  <span>⏭️</span>
                  Maybe later
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GamePromptScreen; 