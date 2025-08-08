import React from 'react';
import { motion } from 'framer-motion';
import type { UnityGameData, UnityReward } from '../../services/unity';

interface GameCompletionProps {
  gameTitle: string;
  gameData: UnityGameData;
  rewards: UnityReward[];
  onContinue: () => void;
}

const GameCompletion: React.FC<GameCompletionProps> = ({
  gameTitle,
  gameData,
  rewards,
  onContinue
}) => {
  const score = gameData.score || 0;
  const duration = gameData.duration || 0;
  const achievements = gameData.achievements || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(251,191,36,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="text-6xl mb-6"
        >
          🎉
        </motion.div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              initial={{
                x: Math.random() * 400 - 200,
                y: -50,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: Math.random() * 400 - 200,
                y: 400,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          Amazing! You completed {gameTitle}!
        </motion.h2>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 mb-6"
        >
          <div className="text-3xl font-bold mb-1">{score}</div>
          <div className="text-sm opacity-90">Points Earned</div>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(duration / 60)}m {duration % 60}s
            </div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {achievements.length}
            </div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </motion.div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.3 }}
            className="mb-6"
          >
            <div className="text-sm text-gray-600 mb-2">Achievements Unlocked:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {achievements.map((achievement, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                  className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-medium"
                >
                  {achievement}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Rewards */}
        {rewards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.3 }}
            className="mb-6"
          >
            <div className="text-sm text-gray-600 mb-2">Rewards Earned:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {rewards.map((reward, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.3 }}
                  className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs rounded-full font-medium"
                >
                  {reward.type}: {reward.value}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.3 }}
          onClick={onContinue}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Continue to Feedback
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GameCompletion; 