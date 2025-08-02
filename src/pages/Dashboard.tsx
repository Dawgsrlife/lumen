import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../components/ui';
import { EmotionSelector } from '../components/emotion';
import { useClerkUser } from '../hooks/useClerkUser';
import type { EmotionType } from '../types';

// Premium emotion data with glassmorphism design
const emotionData: Record<EmotionType, { 
  emoji: string; 
  gradient: string; 
  label: string; 
  description: string;
  glowColor: string;
}> = {
  happy: { 
    emoji: '😊', 
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', 
    label: 'Happy', 
    description: 'Feeling joyful and content',
    glowColor: '#FFD700'
  },
  sad: { 
    emoji: '😢', 
    gradient: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)', 
    label: 'Sad', 
    description: 'Feeling down or melancholy',
    glowColor: '#4169E1'
  },
  loneliness: { 
    emoji: '😔', 
    gradient: 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)', 
    label: 'Loneliness', 
    description: 'Feeling isolated or disconnected',
    glowColor: '#8A2BE2'
  },
  anxiety: { 
    emoji: '😰', 
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)', 
    label: 'Anxiety', 
    description: 'Feeling worried or nervous',
    glowColor: '#FF6B6B'
  },
  frustration: { 
    emoji: '😤', 
    gradient: 'linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)', 
    label: 'Frustration', 
    description: 'Feeling annoyed or irritated',
    glowColor: '#FF4500'
  },
  stress: { 
    emoji: '😵', 
    gradient: 'linear-gradient(135deg, #20B2AA 0%, #48D1CC 100%)', 
    label: 'Stress', 
    description: 'Feeling overwhelmed or pressured',
    glowColor: '#20B2AA'
  },
  lethargy: { 
    emoji: '😴', 
    gradient: 'linear-gradient(135deg, #708090 0%, #A9A9A9 100%)', 
    label: 'Lethargy', 
    description: 'Feeling tired or lacking energy',
    glowColor: '#708090'
  },
  fear: { 
    emoji: '😨', 
    gradient: 'linear-gradient(135deg, #663399 0%, #9966CC 100%)', 
    label: 'Fear', 
    description: 'Feeling scared or apprehensive',
    glowColor: '#663399'
  },
  grief: { 
    emoji: '💔', 
    gradient: 'linear-gradient(135deg, #CD5C5C 0%, #F08080 100%)', 
    label: 'Grief', 
    description: 'Feeling loss or sorrow',
    glowColor: '#CD5C5C'
  },
};

const Dashboard: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const handleMoodSelect = (emotion: EmotionType) => {
    setSelectedMood(emotion);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const getGreeting = () => {
    const firstName = user?.firstName || user?.email?.split('@')[0] || 'there';
    const greetings = {
      morning: `Good morning, ${firstName}`,
      afternoon: `Good afternoon, ${firstName}`,
      evening: `Good evening, ${firstName}`
    };
    return greetings[timeOfDay as keyof typeof greetings] || `Welcome back, ${firstName}`;
  };

  if (!user) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div 
      className="w-full min-h-screen relative bg-white"
      style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        backgroundColor: '#FFFFFF'
      }}
    >

      <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight"
          >
            {getGreeting()}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 font-light mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            How are you feeling today?
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </motion.div>

        {/* Mood Selection Confirmation */}
        <AnimatePresence>
          {showConfirmation && selectedMood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div 
                className="px-8 py-4 rounded-2xl border shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 text-gray-900">
                  <span className="text-2xl">{emotionData[selectedMood].emoji}</span>
                  <span className="font-medium">Mood logged: {emotionData[selectedMood].label}</span>
                  <span className="text-green-500">✓</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-3 lg:col-span-2 flex flex-col items-center justify-center">
            {/* Emotion Selection */}
            <div className="w-full max-w-4xl">
              <EmotionSelector 
                selectedMood={selectedMood} 
                onMoodSelect={handleMoodSelect} 
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="xl:col-span-1 lg:col-span-1 space-y-8 lg:space-y-10"
          >
            {/* Current Mood Display */}
            <motion.div 
              className="group relative rounded-3xl p-8 text-center overflow-hidden bg-white"
              style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Mood</h3>
                <motion.div 
                  className="text-7xl mb-6 relative"
                  animate={selectedMood ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {selectedMood ? emotionData[selectedMood].emoji : '🤔'}
                  {selectedMood && (
                    <div 
                      className="absolute inset-0 rounded-full blur-xl opacity-50"
                      style={{ 
                        background: emotionData[selectedMood].glowColor,
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  )}
                </motion.div>
                <p className="text-lg text-gray-700 font-medium mb-2">
                  {selectedMood ? `Feeling ${emotionData[selectedMood].label.toLowerCase()}` : 'No mood selected'}
                </p>
                {selectedMood && (
                  <p className="text-sm text-gray-500">
                    {emotionData[selectedMood].description}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="relative rounded-3xl px-12 py-10 overflow-hidden bg-white"
              style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
                minHeight: '280px'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">This Week</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 items-center">
                  <span className="text-gray-600">Days logged</span>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="flex gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i < 5 ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">5/7</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <span className="text-gray-600">Most frequent</span>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 justify-self-end">
                    <span className="text-lg">😊</span>
                    <span className="font-semibold text-gray-900">Happy</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <span className="text-gray-600">Current streak</span>
                  <div className="flex items-center gap-2 justify-end">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔥
                    </motion.div>
                    <span className="font-semibold text-gray-900">3 days</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="relative rounded-3xl p-8 overflow-hidden bg-white"
              style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button 
                  className="w-full text-left p-4 rounded-xl transition-all duration-300 text-gray-700 relative overflow-hidden group bg-gray-50 hover:bg-gray-100"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/analytics'}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <span className="font-semibold">View Analytics</span>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full text-left p-4 rounded-xl transition-all duration-300 text-gray-700 relative overflow-hidden group bg-gray-50 hover:bg-gray-100"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/games'}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎮</span>
                    <span className="font-semibold">Play Games</span>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full text-left p-4 rounded-xl transition-all duration-300 text-gray-700 relative overflow-hidden group bg-gray-50 hover:bg-gray-100"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/profile'}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <span className="font-semibold">Profile</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 