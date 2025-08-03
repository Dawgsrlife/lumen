import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner, MoodContributionGraph } from '../components/ui';
import { EmotionSelector } from '../components/emotion';
import { UnityGame, PostGameFeedback } from '../components/games';
import { useClerkUser } from '../hooks/useClerkUser';
import { apiService } from '../services/api';
import type { EmotionType } from '../types';
import type { UnityGameData, UnityReward } from '../services/unity';

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

// Map emotions to working Unity games
const emotionToGame: Record<EmotionType, { gameId: string; gameName: string; title: string; description: string }> = {
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

const Dashboard: React.FC = () => {
  const { user } = useClerkUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [feedbackResponse, setFeedbackResponse] = useState<boolean | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  
  // Get game parameter from URL
  const gameParam = searchParams.get('game');
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

  // Handle URL parameter for direct game access
  useEffect(() => {
    if (gameParam && !selectedMood) {
      // Find emotion that maps to this game
      const emotion = Object.entries(emotionToGame).find(
        ([_, game]) => game.gameName === gameParam
      )?.[0] as EmotionType;
      
      if (emotion) {
        setSelectedMood(emotion);
        setGameCompleted(false);
        setShowConfirmation(false);
      }
    }
  }, [gameParam, selectedMood]);

  const handleMoodSelect = (emotion: EmotionType) => {
    setSelectedMood(emotion);
    setGameCompleted(false);
    // Set URL parameter for the game
    const gameName = emotionToGame[emotion].gameName;
    setSearchParams({ game: gameName });
    // Show confirmation briefly then launch game
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 1500);
  };

  const handleGameComplete = (data: UnityGameData) => {
    console.log('Game completed:', data);
    setShowFeedbackPrompt(true);
  };

  const handleGameReward = (reward: UnityReward) => {
    console.log('Game reward earned:', reward);
  };

  const handleFeedbackResponse = async (feeling: boolean) => {
    setFeedbackResponse(feeling);
    setShowFeedbackPrompt(false);
    setGameCompleted(true);
    
    // Send feedback to API
    try {
      const feedbackData = {
        gameId: emotionToGame[selectedMood!].gameId,
        gameName: emotionToGame[selectedMood!].gameName,
        emotion: selectedMood!,
        feelsBetter: feeling,
      };
      
      await apiService.createFeedback(feedbackData);
      console.log('Post-game feedback saved successfully:', feedbackData);
    } catch (error) {
      console.error('Failed to save feedback:', error);
      // Continue with UI flow even if API call fails
    }
  };

  const resetToEmotionSelector = () => {
    setSelectedMood(null);
    setGameCompleted(false);
    setShowFeedbackPrompt(false);
    setFeedbackResponse(null);
    // Clear URL parameter
    setSearchParams({});
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

        {/* Corrected Flow: Emotion → Game → Dashboard */}
        <div className="flex flex-col items-center justify-center mt-8">
          <AnimatePresence mode="wait">
            {!selectedMood ? (
              /* Step 1: Emotion Selection */
              <motion.div 
                key="emotion-selector"
                className="w-full max-w-5xl flex flex-col items-center justify-center min-h-[60vh]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <EmotionSelector 
                  selectedMood={selectedMood} 
                  onMoodSelect={handleMoodSelect} 
                />
              </motion.div>
            ) : showFeedbackPrompt ? (
              /* Step 2: Post-Game Feedback */
              <motion.div
                key="feedback-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostGameFeedback
                  emotion={selectedMood}
                  gameTitle={emotionToGame[selectedMood].title}
                  onFeedback={handleFeedbackResponse}
                  onSkip={() => {
                    setShowFeedbackPrompt(false);
                    setGameCompleted(true);
                  }}
                />
              </motion.div>
            ) : !gameCompleted ? (
              /* Step 3: Unity Game Based on Emotion */
              <motion.div 
                key="unity-game"
                className="w-full max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-light text-gray-900 mb-2">
                    {emotionToGame[selectedMood].title}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {emotionToGame[selectedMood].description}
                  </p>
                </div>
                
                <UnityGame
                  gameId={emotionToGame[selectedMood].gameId}
                  gameTitle={emotionToGame[selectedMood].title}
                  description={emotionToGame[selectedMood].description}
                  buildUrl="/unity-builds/lumen-minigames"
                  gameName={emotionToGame[selectedMood].gameName}
                  emotionData={{
                    emotion: selectedMood,
                    intensity: 5,
                    context: { source: 'dashboard', timestamp: new Date().toISOString() }
                  }}
                  onGameComplete={handleGameComplete}
                  onRewardEarned={handleGameReward}
                />
                
                {/* Skip Game Option */}
                <div className="text-center mt-6">
                  <button 
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                    onClick={() => setGameCompleted(true)}
                  >
                    Skip to dashboard
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Step 4: Dashboard After Game Completion */
              <motion.div 
                key="dashboard-view"
                className="w-full flex flex-col items-center space-y-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                {/* Game Completion Celebration */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Great job completing your session!
                  </h2>
                  {feedbackResponse !== null ? (
                    <p className="text-gray-600">
                      {feedbackResponse 
                        ? "We're so glad you're feeling better! 😊" 
                        : "Thank you for your feedback. Keep taking care of yourself! 💙"
                      }
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      How are you feeling now?
                    </p>
                  )}
                </motion.div>

                {/* Consolidated Stats Section */}
                <div className="w-full max-w-6xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Current Mood */}
                    <div 
                      className="relative rounded-2xl p-6 text-center bg-white"
                      style={{
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Session Completed</h3>
                      <div className="text-5xl mb-3">
                        {emotionData[selectedMood].emoji}
                      </div>
                      <p className="text-base text-gray-700 font-medium">
                        {emotionData[selectedMood].label}
                      </p>
                      <button 
                        className="mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium"
                        onClick={resetToEmotionSelector}
                      >
                        Track another feeling
                      </button>
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
                          onClick={resetToEmotionSelector}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">🎮</span>
                            <span className="font-medium text-gray-700">Play Again</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mood Activity Graph - Full Width */}
                <div className="w-full max-w-6xl">
                  <MoodContributionGraph 
                    entries={mockMoodEntries}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 