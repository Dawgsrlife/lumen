import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/ui';
import { useClerkUser } from '../hooks/useClerkUser';
import type { EmotionType } from '../types';

// Emotion data with colors from the design
const emotionData: Record<EmotionType, { emoji: string; color: string; label: string }> = {
  happy: { emoji: '😊', color: '#7ED8A9', label: 'Happy' },
  sad: { emoji: '😢', color: '#6B9BD2', label: 'Sad' },
  loneliness: { emoji: '😔', color: '#A78BCA', label: 'Loneliness' },
  anxiety: { emoji: '😰', color: '#E6D45A', label: 'Anxiety' },
  frustration: { emoji: '😤', color: '#D89B5A', label: 'Frustration' },
  stress: { emoji: '😵', color: '#5A9B9B', label: 'Stress' },
  lethargy: { emoji: '😴', color: '#9B9B9B', label: 'Lethargy' },
  fear: { emoji: '😨', color: '#8B5A9B', label: 'Fear' },
  grief: { emoji: '💔', color: '#C4909B', label: 'Grief' },
};

// Generate dummy mood history data (GitHub contributions style)
const generateMoodHistory = () => {
  const history: Array<{ date: string; emotion: EmotionType | null; intensity: number }> = [];
  const emotions = Object.keys(emotionData) as EmotionType[];
  const today = new Date();
  
  // Generate data for the past 365 days
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 30% chance of no emotion logged
    const hasEmotion = Math.random() > 0.3;
    const emotion = hasEmotion ? emotions[Math.floor(Math.random() * emotions.length)] : null;
    const intensity = hasEmotion ? Math.floor(Math.random() * 5) + 1 : 0;
    
    history.push({
      date: date.toISOString().split('T')[0],
      emotion,
      intensity,
    });
  }
  
  return history;
};

const Dashboard: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [moodHistory] = useState(generateMoodHistory());

  const handleMoodSelect = (emotion: EmotionType) => {
    setSelectedMood(emotion);
  };

  if (!user) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Iowan Old Style, serif' }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            Welcome back, {user.firstName || user.email.split('@')[0]}
          </h1>
          <p className="text-xl text-gray-600 font-light">
            How are you feeling today?
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-16">
            {/* Emotion Selection Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
                Select Your Current Mood
              </h2>
              <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                {(Object.keys(emotionData) as EmotionType[]).map((emotion) => (
                  <motion.button
                    key={emotion}
                    onClick={() => handleMoodSelect(emotion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative p-6 rounded-3xl transition-all duration-300 shadow-sm
                      ${selectedMood === emotion 
                        ? 'shadow-xl ring-4 ring-gray-200' 
                        : 'hover:shadow-lg'
                      }
                    `}
                    style={{
                      backgroundColor: emotionData[emotion].color,
                      color: '#000',
                    }}
                  >
                    <div className="text-3xl mb-2">{emotionData[emotion].emoji}</div>
                    <div className="text-sm font-medium">{emotionData[emotion].label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Mood History Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-3xl font-light text-gray-900 mb-8 text-center">
                Your Mood History
              </h3>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-53 gap-1 mb-6 max-w-4xl mx-auto">
                {moodHistory.map((day, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-sm transition-all duration-200 hover:scale-150 cursor-pointer"
                    style={{
                      backgroundColor: day.emotion 
                        ? `${emotionData[day.emotion].color}${Math.round(day.intensity * 51).toString(16).padStart(2, '0')}` // Add opacity based on intensity
                        : '#f1f5f9'
                    }}
                    title={day.emotion ? `${day.date}: ${emotionData[day.emotion].label} (${day.intensity}/5)` : `${day.date}: No mood logged`}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                  <span>No mood</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gray-400"></div>
                  <span>Low intensity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gray-700"></div>
                  <span>High intensity</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Current Mood Display */}
            <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Current Mood</h3>
              <div className="text-6xl mb-4">
                {selectedMood ? emotionData[selectedMood].emoji : '🤔'}
              </div>
              <p className="text-lg text-gray-700 font-light">
                {selectedMood ? `Feeling ${emotionData[selectedMood].label.toLowerCase()}` : 'No mood selected'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">This Week</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days logged</span>
                  <span className="font-medium">5/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most frequent</span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg">😊</span>
                    <span className="font-medium">Happy</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current streak</span>
                  <span className="font-medium">3 days</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  className="w-full text-left p-3 rounded-xl hover:bg-white transition-colors duration-200 text-gray-700"
                  onClick={() => window.location.href = '/analytics'}
                >
                  📊 View Analytics
                </button>
                <button 
                  className="w-full text-left p-3 rounded-xl hover:bg-white transition-colors duration-200 text-gray-700"
                  onClick={() => window.location.href = '/games'}
                >
                  🎮 Play Games
                </button>
                <button 
                  className="w-full text-left p-3 rounded-xl hover:bg-white transition-colors duration-200 text-gray-700"
                  onClick={() => window.location.href = '/profile'}
                >
                  👤 Profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 