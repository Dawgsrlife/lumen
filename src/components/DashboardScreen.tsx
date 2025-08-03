import React from 'react';
import { motion } from 'framer-motion';
import type { EmotionType } from '../types';
import { LumenMascot } from './ui';

// Emotion data for display with enhanced gradients
const emotionData: Record<EmotionType, { 
  emoji: string; 
  label: string; 
  gradient: string;
  color: string;
  encouragingMessage: string;
}> = {
  happy: { 
    emoji: '😊', 
    label: 'Happy', 
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#FFD700',
    encouragingMessage: 'Your joy is beautiful!'
  },
  sad: { 
    emoji: '😢', 
    label: 'Sad', 
    gradient: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)',
    color: '#4169E1',
    encouragingMessage: 'It\'s okay to feel this way'
  },
  loneliness: { 
    emoji: '😔', 
    label: 'Loneliness', 
    gradient: 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)',
    color: '#8A2BE2',
    encouragingMessage: 'You\'re not alone'
  },
  anxiety: { 
    emoji: '😰', 
    label: 'Anxiety', 
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    color: '#FF6B6B',
    encouragingMessage: 'Take deep breaths'
  },
  frustration: { 
    emoji: '😤', 
    label: 'Frustration', 
    gradient: 'linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)',
    color: '#FF4500',
    encouragingMessage: 'This feeling will pass'
  },
  stress: { 
    emoji: '😵', 
    label: 'Stress', 
    gradient: 'linear-gradient(135deg, #20B2AA 0%, #48D1CC 100%)',
    color: '#20B2AA',
    encouragingMessage: 'You\'re doing great'
  },
  lethargy: { 
    emoji: '😴', 
    label: 'Lethargy', 
    gradient: 'linear-gradient(135deg, #708090 0%, #A9A9A9 100%)',
    color: '#708090',
    encouragingMessage: 'Be gentle with yourself'
  },
  fear: { 
    emoji: '😨', 
    label: 'Fear', 
    gradient: 'linear-gradient(135deg, #663399 0%, #9966CC 100%)',
    color: '#663399',
    encouragingMessage: 'You\'re safe here'
  },
  grief: { 
    emoji: '💔', 
    label: 'Grief', 
    gradient: 'linear-gradient(135deg, #CD5C5C 0%, #F08080 100%)',
    color: '#CD5C5C',
    encouragingMessage: 'Your feelings are valid'
  },
};

// Enhanced Animated Particles Component
const AnimatedParticles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Weekly View Component
const WeeklyView: React.FC<{ weeklyData: boolean[] }> = ({ weeklyData }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const loggedDays = weeklyData.filter(Boolean).length;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-gray-700">Weekly Progress</h4>
        <span className="text-sm text-gray-500">{loggedDays}/7 days</span>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {weeklyData.map((logged, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{days[index]}</div>
            <motion.div
              className={`w-8 h-8 rounded-full mx-auto ${
                logged 
                  ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg' 
                  : 'bg-gray-200'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              {logged && (
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
      
      {loggedDays > 0 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <p className="text-sm text-gray-600">
            {loggedDays === 7 ? 'Perfect week! 🌟' : 
             loggedDays >= 5 ? 'Great progress! 💪' : 
             loggedDays >= 3 ? 'Good start! 👍' : 'Keep going! 💫'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Streak Component
const StreakDisplay: React.FC<{ currentStreak: number }> = ({ currentStreak }) => {
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
        <div className="text-sm text-gray-600 mb-3">day streak</div>
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
  const loggedDays = weeklyData.filter(Boolean).length;

  return (
    <motion.div
      className="w-full min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Animated Background */}
      <AnimatedParticles />

      {/* Luna Mascot */}
      <LumenMascot currentPage="/dashboard" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl font-light text-gray-800 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Welcome back
          </motion.h1>
          
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Here's your gentle overview for today
          </motion.p>
        </motion.div>

        {/* Enhanced Three-card layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Enhanced Current Mood Card */}
          <motion.div
            className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="text-7xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.0, duration: 0.6, type: "spring" }}
            >
              {emotion.emoji}
            </motion.div>
            
            <h3 className="text-2xl font-medium text-gray-900 mb-3">
              Current Mood
            </h3>
            
            <p className="text-lg text-gray-700 mb-4 font-medium">{emotion.label}</p>
            
            <motion.p
              className="text-sm text-gray-600 mb-6 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              "{emotion.encouragingMessage}"
            </motion.p>
            
            <motion.button
              onClick={onReset}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Track New Feeling
            </motion.button>
          </motion.div>

          {/* Enhanced Weekly View Card */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-2xl font-medium text-gray-900 mb-6 text-center">
              This Week
            </h3>
            <WeeklyView weeklyData={weeklyData} />
          </motion.div>

          {/* Enhanced Streak Card */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-2xl font-medium text-gray-900 mb-6 text-center">
              Your Streak
            </h3>
            <StreakDisplay currentStreak={currentStreak} />
          </motion.div>
        </div>

        {/* Enhanced Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.button
            onClick={() => window.location.href = '/analytics'}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 View Analytics
          </motion.button>
          
          <motion.button
            onClick={() => window.location.href = '/games'}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎮 Play Games
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardScreen; 