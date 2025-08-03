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

  const getMoodColor = (mood: number) => {
    if (mood >= 7) return 'bg-green-500';
    if (mood >= 5) return 'bg-yellow-500';
    if (mood >= 3) return 'bg-orange-500';
    return 'bg-red-500';
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
            <p className="text-xl text-gray-600">
              Keep up the great work on your mental wellness journey
            </p>
          </motion.div>
          <div className="mb-4"></div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Mood Card */}
          <Card className="p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{mockData.currentMood.emotion}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {mockData.currentMood.label}
              </h3>
              <p className="text-gray-600 mb-4">
                {mockData.currentMood.description}
              </p>
              <div className="mb-4"></div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${getMoodColor(mockData.currentMood.intensity)}`}></div>
                <span className="text-sm text-gray-600">
                  Intensity: {mockData.currentMood.intensity}/10
                </span>
              </div>
            </div>
          </Card>

          {/* Weekly Progress Card */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              This Week's Progress
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {mockData.weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                  <div className={`w-8 h-8 rounded-lg mx-auto mb-1 ${
                    day.logged ? getMoodColor(day.mood) : 'bg-gray-200'
                  }`}></div>
                  <div className="text-xs text-gray-600">
                    {day.logged ? day.mood : '-'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4"></div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Average: {mockData.averageMood.toFixed(1)}/10
              </p>
            </div>
          </Card>

          {/* Streak Counter Card */}
          <Card className="p-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
                {mockData.streak}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Day Streak
              </h3>
              <p className="text-gray-600 mb-4">
                You've been consistent for {mockData.streak} days!
              </p>
              <div className="mb-4"></div>
              <div className="text-sm text-gray-500">
                Total entries: {mockData.totalEntries}
              </div>
            </div>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={handleLogEmotion}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-purple-600 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Log Today's Emotion
          </Button>
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