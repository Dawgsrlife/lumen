import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, LoadingSpinner } from '../components/ui';
import { AIFeedback } from '../components/ai';
import { useClerkUser } from '../hooks/useClerkUser';

const Dashboard: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>('😊');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(5);
  const [showAIFeedback, setShowAIFeedback] = useState(false);

  const moods = [
    { emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😕', label: 'Confused', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😐', label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
    { emoji: '🙂', label: 'Happy', color: 'bg-green-100 text-green-800' },
    { emoji: '😊', label: 'Very Happy', color: 'bg-lumen-primary/20 text-lumen-primary' },
  ];

  const recentEmotions = [
    { date: 'Today', mood: '😊', note: 'Feeling great after morning workout' },
    { date: 'Yesterday', mood: '😐', note: 'Had a stressful day at work' },
    { date: '2 days ago', mood: '🙂', note: 'Good conversation with friends' },
    { date: '3 days ago', mood: '😕', note: 'Feeling a bit overwhelmed' },
  ];

  const aiInsights = [
    {
      type: 'pattern',
      title: 'Weekly Pattern Detected',
      content: 'You tend to feel happier on weekends. Consider what activities boost your mood.',
      icon: '📈',
    },
    {
      type: 'suggestion',
      title: 'Mindfulness Suggestion',
      content: 'Try a 5-minute breathing exercise when you feel stressed.',
      icon: '🧘',
    },
    {
      type: 'achievement',
      title: '7-Day Streak!',
      content: 'You\'ve tracked your emotions for 7 consecutive days. Great consistency!',
      icon: '🏆',
    },
  ];

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentEmotion(selectedMood);
    setSelectedMood(null);
    setShowAIFeedback(true);
    setIsSubmitting(false);
  };

  if (!user) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="min-h-screen bg-lumen-light">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-lumen-dark mb-2">
            Welcome back, {user.firstName || user.email.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            How are you feeling today? Take a moment to check in with yourself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emotion Tracking */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card title="Today's Mood Check-in" className="mb-6">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">How are you feeling right now?</p>
                  <div className="grid grid-cols-5 gap-3">
                    {moods.map((mood, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedMood(mood.emoji)}
                        className={`p-4 rounded-lg transition-all duration-200 ${
                          selectedMood === mood.emoji
                            ? 'bg-lumen-primary text-white scale-110'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <div className="text-sm font-medium">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                                        {selectedMood && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div className="bg-lumen-primary/5 rounded-lg p-4">
                              <p className="text-sm text-lumen-dark">
                                "Your emotions are valid. Thank you for taking the time to acknowledge how you're feeling."
                              </p>
                            </div>
                            
                            {/* Intensity Slider */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                How intense is this feeling? ({emotionIntensity}/10)
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={emotionIntensity}
                                onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Mild</span>
                                <span>Moderate</span>
                                <span>Intense</span>
                              </div>
                            </div>
                            
                            <Button
                              onClick={handleMoodSubmit}
                              loading={isSubmitting}
                              className="w-full"
                            >
                              {isSubmitting ? 'Saving...' : 'Save My Mood'}
                            </Button>
                          </motion.div>
                        )}
              </div>
            </Card>

            {/* Recent Emotions */}
            <Card title="Recent Emotions" subtitle="Your mood history">
              <div className="space-y-4">
                {recentEmotions.map((emotion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl">{emotion.mood}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-lumen-dark">{emotion.date}</span>
                        <span className="text-sm text-gray-500">{emotion.note}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* AI Insights Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Current Mood Display */}
            <Card title="Current Mood">
              <div className="text-center">
                <div className="text-6xl mb-4">{currentEmotion}</div>
                <p className="text-gray-600">You're feeling good today!</p>
              </div>
            </Card>

            {/* AI Feedback */}
            {showAIFeedback && currentEmotion && (
              <AIFeedback
                emotion={currentEmotion}
                intensity={emotionIntensity}
                context="Daily mood check-in"
                onFeedbackGenerated={(feedback) => {
                  console.log('AI Feedback generated:', feedback);
                }}
              />
            )}

            {/* Fallback AI Insights */}
            {!showAIFeedback && (
              <Card title="AI Insights" subtitle="Personalized for you">
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-lumen-primary/5 to-lumen-secondary/5 rounded-lg border border-lumen-primary/20"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{insight.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lumen-dark mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {insight.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/analytics'}
                >
                  📊 View Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/games'}
                >
                  🎮 Play Games
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/profile'}
                >
                  👤 Update Profile
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 