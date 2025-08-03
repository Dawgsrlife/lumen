import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useClerkUser } from '../hooks/useClerkUser';
import { Card, Button, AnimatedBackground } from '../components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Animated background particles
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gray-200 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for analytics
  const mockData = {
    weekly: [
      { day: 'Mon', mood: 6, entries: 2, activities: 3 },
      { day: 'Tue', mood: 4, entries: 1, activities: 2 },
      { day: 'Wed', mood: 8, entries: 3, activities: 4 },
      { day: 'Thu', mood: 5, entries: 2, activities: 1 },
      { day: 'Fri', mood: 7, entries: 2, activities: 3 },
      { day: 'Sat', mood: 9, entries: 4, activities: 5 },
      { day: 'Sun', mood: 7, entries: 2, activities: 2 }
    ],
    monthly: [
      { week: 'Week 1', mood: 6.5, entries: 12, activities: 15 },
      { week: 'Week 2', mood: 7.2, entries: 14, activities: 18 },
      { week: 'Week 3', mood: 6.8, entries: 11, activities: 12 },
      { week: 'Week 4', mood: 8.1, entries: 16, activities: 20 }
    ],
    yearly: [
      { month: 'Jan', mood: 6.2, entries: 45, activities: 52 },
      { month: 'Feb', mood: 6.8, entries: 48, activities: 55 },
      { month: 'Mar', mood: 7.1, entries: 52, activities: 58 },
      { month: 'Apr', mood: 6.9, entries: 49, activities: 54 },
      { month: 'May', mood: 7.5, entries: 55, activities: 62 },
      { month: 'Jun', mood: 7.8, entries: 58, activities: 65 }
    ]
  };

  const stats = {
    totalEntries: 156,
    averageMood: 6.8,
    currentStreak: 23,
    totalActivities: 89,
    topEmotions: ['Happy', 'Calm', 'Excited', 'Grateful', 'Peaceful'],
    insights: [
      'You tend to feel happier on weekends',
      'Your mood improves after exercise',
      'You\'ve been consistently logging for 3+ weeks',
      'Your stress levels decrease after meditation'
    ]
  };

  const getData = () => {
    switch (selectedPeriod) {
      case 'week':
        return mockData.weekly;
      case 'month':
        return mockData.monthly;
      case 'year':
        return mockData.yearly;
      default:
        return mockData.weekly;
    }
  };

  const getXAxisKey = () => {
    switch (selectedPeriod) {
      case 'week':
        return 'day';
      case 'month':
        return 'week';
      case 'year':
        return 'month';
      default:
        return 'day';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-8 text-lg">Please sign in to view your analytics</p>
          <Link 
            to="/sign-in" 
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Beautiful Journey Over Time
            </h1>
            <div className="mb-4"></div>
            <p className="text-xl text-gray-600">
              Insights and patterns from your mental wellness journey
            </p>
          </motion.div>
          <div className="mb-4"></div>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {[
              { key: 'week', label: 'Week' },
              { key: 'month', label: 'Month' },
              { key: 'year', label: 'Year' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  selectedPeriod === period.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics - Strategic Color Placement #1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {stats.totalEntries}
            </div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {stats.averageMood}
            </div>
            <div className="text-sm text-gray-600">Average Mood</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {stats.totalActivities}
            </div>
            <div className="text-sm text-gray-600">Activities</div>
          </Card>
        </div>

        {/* Main Chart - Simplified */}
        <div className="mb-16">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Your Mood Journey
            </h3>
            <p className="text-gray-600 text-center mb-8">
              A gentle look at your emotional patterns over time
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={getXAxisKey()} 
                    stroke="#666" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    domain={[0, 10]}
                    tickCount={6}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="url(#moodGradient)"
                    strokeWidth={3}
                    dot={{ fill: 'url(#moodGradient)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'url(#moodGradient)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Gradient definitions */}
            <svg width="0" height="0">
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </Card>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Top Emotions
            </h3>
            <div className="mb-4"></div>
            <div className="space-y-4">
              {stats.topEmotions.map((emotion, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{emotion}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-purple-600 rounded-full"
                      style={{ width: `${85 - index * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Personal Insights
            </h3>
            <div className="mb-4"></div>
            <div className="space-y-4">
              {stats.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Action Button - Strategic Color Placement #2 */}
        <div className="mt-12 text-center">
          <div className="mb-4"></div>
          <Button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-purple-600 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Back to Dashboard
          </Button>
          <div className="mb-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 