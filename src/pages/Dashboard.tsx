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

  // Mock mood entries for demonstration
  const mockMoodEntries = React.useMemo(() => {
    const entries = [];
    const emotions: EmotionType[] = ['happy', 'sad', 'anxiety', 'stress', 'frustration'];
    
    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (Math.random() > 0.3) { // 70% chance of having an entry
        entries.push({
          date: date.toISOString().split('T')[0],
          emotion: emotions[Math.floor(Math.random() * emotions.length)],
          intensity: Math.floor(Math.random() * 10) + 1
        });
      }
    }
    
    return entries;
  }, []);

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

      <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-2"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight"
          >
            {getGreeting()}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 font-light mb-4"
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

        {/* Single Column Center Layout */}
        <div className="flex flex-col items-center space-y-12 mt-8">
          {/* Primary: Emotion Selection */}
          <motion.div 
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <EmotionSelector 
              selectedMood={selectedMood} 
              onMoodSelect={handleMoodSelect} 
            />
          </motion.div>
          
          {/* Consolidated Stats Section */}
          <motion.div
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Mood */}
              <div 
                className="relative rounded-2xl p-6 text-center bg-white"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Mood</h3>
                <div className="text-5xl mb-3">
                  {selectedMood ? emotionData[selectedMood].emoji : '🤔'}
                </div>
                <p className="text-base text-gray-700 font-medium">
                  {selectedMood ? emotionData[selectedMood].label : 'No mood selected'}
                </p>
              </div>

              {/* This Week Stats */}
              <div 
                className="relative rounded-2xl p-6 bg-white"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">This Week</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Days logged</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full ${
                              i < 5 ? 'bg-green-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-gray-900">5/7</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Streak</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔥</span>
                      <span className="font-medium text-gray-900">3 days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div 
                className="relative rounded-2xl p-6 bg-white"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => window.location.href = '/analytics'}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📊</span>
                      <span className="font-medium text-gray-700">Analytics</span>
                    </div>
                  </button>
                  <button 
                    className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => window.location.href = '/games'}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎮</span>
                      <span className="font-medium text-gray-700">Games</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Mood Activity Graph - Full Width (placeholder) */}
          <motion.div 
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mood Activity</h3>
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Mood analytics coming soon...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 