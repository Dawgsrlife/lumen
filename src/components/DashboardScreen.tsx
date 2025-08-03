import React from 'react';
import { motion } from 'framer-motion';
import type { EmotionType } from '../types';
import { LumenMascot } from './ui';

// Emotion data with premium styling
const emotionData: Record<EmotionType, { 
  emoji: string; 
  label: string; 
  encouragingMessage: string;
  gradient: string;
}> = {
  happy: { 
    emoji: '😊', 
    label: 'Happy', 
    encouragingMessage: 'Your joy is beautiful!',
    gradient: 'from-yellow-400 to-orange-500'
  },
  sad: { 
    emoji: '😢', 
    label: 'Sad', 
    encouragingMessage: 'It\'s okay to feel this way',
    gradient: 'from-blue-400 to-purple-500'
  },
  loneliness: { 
    emoji: '😔', 
    label: 'Loneliness', 
    encouragingMessage: 'You\'re not alone',
    gradient: 'from-purple-400 to-pink-500'
  },
  anxiety: { 
    emoji: '😰', 
    label: 'Anxiety', 
    encouragingMessage: 'Take deep breaths',
    gradient: 'from-yellow-400 to-red-500'
  },
  frustration: { 
    emoji: '😤', 
    label: 'Frustration', 
    encouragingMessage: 'This feeling will pass',
    gradient: 'from-orange-400 to-red-500'
  },
  stress: { 
    emoji: '😵', 
    label: 'Stress', 
    encouragingMessage: 'You\'re doing great',
    gradient: 'from-teal-400 to-blue-500'
  },
  lethargy: { 
    emoji: '😴', 
    label: 'Lethargy', 
    encouragingMessage: 'Be gentle with yourself',
    gradient: 'from-gray-400 to-slate-500'
  },
  fear: { 
    emoji: '😨', 
    label: 'Fear', 
    encouragingMessage: 'You\'re safe here',
    gradient: 'from-indigo-400 to-purple-500'
  },
  grief: { 
    emoji: '💔', 
    label: 'Grief', 
    encouragingMessage: 'Your feelings are valid',
    gradient: 'from-rose-400 to-pink-500'
  },
};

// Simple Weekly Progress Component
const WeeklyProgress: React.FC<{ weeklyData: boolean[] }> = ({ weeklyData }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const loggedDays = weeklyData.filter(Boolean).length;
  
  const getProgressMessage = (loggedDays: number) => {
    if (loggedDays === 0) return 'Start your journey today';
    if (loggedDays === 7) return 'Perfect week! 🌟';
    if (loggedDays >= 5) return 'Great progress! 💪';
    if (loggedDays >= 3) return 'Good start! 👍';
    return 'Keep going! 💫';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">This Week</h4>
        <p className="text-sm text-gray-600">{loggedDays}/7 days</p>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {weeklyData.map((logged, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 mb-1 font-medium">{days[index]}</div>
            <motion.div
              className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center ${
                logged 
                  ? 'bg-gray-900 shadow-md' 
                  : 'bg-gray-100 border border-gray-200'
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              {logged && (
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <span className="text-white text-xs font-medium">✓</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
      
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <p className="text-sm text-gray-600 font-medium">
          {getProgressMessage(loggedDays)}
        </p>
      </motion.div>
    </div>
  );
};

// Simple Streak Counter Component
const StreakCounter: React.FC<{ currentStreak: number }> = ({ currentStreak }) => {
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your journey';
    if (streak === 1) return 'Great start!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 30) return 'Amazing consistency!';
    return 'Incredible dedication!';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🌟';
    if (streak < 3) return '🔥';
    if (streak < 7) return '⚡';
    if (streak < 30) return '🏆';
    return '👑';
  };

  return (
    <div className="text-center space-y-4">
      <motion.div
        className="text-5xl mb-2"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
      >
        {getStreakEmoji(currentStreak)}
      </motion.div>
      
      <div>
        <motion.div
          className="text-4xl font-bold text-gray-900 mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {currentStreak}
        </motion.div>
        <div className="text-sm text-gray-600 font-medium">day streak</div>
      </div>
      
      <motion.p
        className="text-sm text-gray-700 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        {getStreakMessage(currentStreak)}
      </motion.p>
    </div>
  );
};

interface DashboardScreenProps {
  selectedEmotion: EmotionType;
  currentStreak: number;
  weeklyData: boolean[];
  onReset: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  selectedEmotion, 
  currentStreak, 
  weeklyData, 
  onReset 
}) => {
  const emotion = emotionData[selectedEmotion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Luna Mascot */}
      <LumenMascot currentPage="/dashboard" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Clean Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Welcome back
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Here's your gentle overview for today
          </motion.p>
        </motion.div>

        {/* Clean Three-card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Current Mood Card - Primary Focus */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="text-8xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.0, duration: 0.6, type: "spring" }}
            >
              {emotion.emoji}
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Current Mood
            </h3>
            
            <p className="text-xl text-gray-700 mb-6 font-semibold">{emotion.label}</p>
            
            <motion.p
              className="text-gray-600 mb-8 italic font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              "{emotion.encouragingMessage}"
            </motion.p>
            
            <motion.button
              onClick={onReset}
              className="w-full py-4 px-6 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Track New Feeling
            </motion.button>
          </motion.div>

          {/* Weekly Progress Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <WeeklyProgress weeklyData={weeklyData} />
          </motion.div>

          {/* Streak Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Your Streak
            </h3>
            <StreakCounter currentStreak={currentStreak} />
          </motion.div>
        </div>

        {/* Simple Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.button
            onClick={() => window.location.href = '/flow?manual=true'}
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            💭 Log Today's Emotion
          </motion.button>
          
          <motion.button
            onClick={() => window.location.href = '/analytics'}
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📊 View Analytics
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardScreen; 