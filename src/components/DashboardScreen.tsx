import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from './ui';
import { useFlow } from '../context/FlowProvider';
import { LumenMascot } from './ui';
import { apiService } from '../services/api';

interface DashboardScreenProps {
  onReset?: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const navigate = useNavigate();
  const { state } = useFlow();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for dashboard
  const mockData = {
    currentMood: {
      emotion: '😊',
      label: 'Happy',
      intensity: 7,
      description: 'Feeling positive and energetic today!'
    },
    weeklyProgress: [
      { day: 'Mon', mood: 6, logged: true },
      { day: 'Tue', mood: 4, logged: true },
      { day: 'Wed', mood: 8, logged: true },
      { day: 'Thu', mood: 5, logged: true },
      { day: 'Fri', mood: 7, logged: true },
      { day: 'Sat', mood: 9, logged: true },
      { day: 'Sun', mood: 7, logged: false }
    ],
    streak: 23,
    totalEntries: 156,
    averageMood: 6.8,
    topEmotions: ['Happy', 'Calm', 'Excited', 'Grateful', 'Peaceful'],
    recentInsights: [
      'You tend to feel happier on weekends',
      'Your mood improves after exercise',
      'You\'ve been consistently logging for 3+ weeks'
    ]
  };

  const handleLogEmotion = () => {
    navigate('/flow?manual=true');
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 8) return 'Excellent';
    if (mood >= 6) return 'Good';
    if (mood >= 4) return 'Okay';
    if (mood >= 2) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Here's your gentle overview for today
            </h1>
            <div className="mb-4"></div>
            <p className="text-xl text-gray-600">
              Keep up the great work on your mental wellness journey
            </p>
          </motion.div>
          <div className="mb-4"></div>
        </div>

        {/* Key Metrics - Strategic Color Placement #1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {mockData.currentMood.intensity}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Current Mood
            </h3>
            <div className="text-4xl mb-3">{mockData.currentMood.emotion}</div>
            <p className="text-sm text-gray-600 mb-3">
              {mockData.currentMood.label} • {getMoodLabel(mockData.currentMood.intensity)}
            </p>
            <p className="text-xs text-gray-500">
              {mockData.currentMood.description}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {mockData.averageMood.toFixed(1)}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Weekly Average
            </h3>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {mockData.weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                  <div className={`w-6 h-6 rounded mx-auto mb-1 ${
                    day.logged ? 'bg-gray-300' : 'bg-gray-100'
                  }`}></div>
                  <div className="text-xs text-gray-600">
                    {day.logged ? day.mood : '-'}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {mockData.weeklyProgress.filter(d => d.logged).length}/7 days logged
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {mockData.streak}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Day Streak
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              You've been consistent for {mockData.streak} days!
            </p>
            <p className="text-xs text-gray-500">
              Total entries: {mockData.totalEntries}
            </p>
          </Card>
        </div>

        {/* Action Button - Strategic Color Placement #2 */}
        <div className="mt-12 text-center">
          <div className="mb-4"></div>
          <Button
            onClick={handleLogEmotion}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-purple-600 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Log Today's Emotion
          </Button>
          <div className="mb-4"></div>
        </div>

        {/* Mascot - only show if user has completed flow */}
        {state.hasCompletedToday && (
          <div className="fixed bottom-8 right-8 z-50">
            <LumenMascot currentPage="/dashboard" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen; 