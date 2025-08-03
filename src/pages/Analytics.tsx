import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LumenMascot } from '../components/ui';
import { useClerkUser } from '../hooks/useClerkUser';
import {
  LineChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Analytics: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7days' | 'month' | '3months' | 'alltime'>('7days');

  // Mock data for charts
  const moodData = [
    { date: 'Mon', mood: 4, journal: 'Feeling productive today' },
    { date: 'Tue', mood: 3, journal: 'A bit overwhelmed but managing' },
    { date: 'Wed', mood: 5, journal: 'Amazing day! Everything clicked' },
    { date: 'Thu', mood: 2, journal: 'Struggling with anxiety today' },
    { date: 'Fri', mood: 4, journal: 'Found some peace in meditation' },
    { date: 'Sat', mood: 5, journal: 'Wonderful time with friends' },
    { date: 'Sun', mood: 4, journal: 'Reflecting on a good week' },
  ];

  const journalHighlights = [
    {
      date: 'Jan 10',
      title: 'Moments of Growth',
      snippet: 'Today I realized how far I\'ve come in managing my anxiety. The breathing exercises really help.',
      mood: 5
    },
    {
      date: 'Jan 8',
      title: 'Your Reflections',
      snippet: 'Sometimes the hardest days teach us the most about ourselves and our resilience.',
      mood: 3
    },
    {
      date: 'Jan 6',
      title: 'Beautiful Moments',
      snippet: 'Spent quality time with family today. These moments remind me what truly matters in life.',
      mood: 5
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Luna Mascot */}
      <LumenMascot currentPage="/analytics" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Clean Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Beautiful Journey
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A gentle look at your emotional patterns and growth over time
          </motion.p>
        </motion.div>

        {/* Time Range Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { key: '7days', label: 'Last 7 Days' },
            { key: 'month', label: 'Last Month' },
            { key: '3months', label: 'Last 3 Months' },
            { key: 'alltime', label: 'All Time' }
          ].map((range) => (
            <motion.button
              key={range.key}
              onClick={() => setSelectedTimeRange(range.key as any)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                selectedTimeRange === range.key
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {range.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="space-y-12">
          {/* Clean Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Mood Journey</h2>
              <p className="text-gray-600 text-lg">A gentle look at your emotional patterns over time</p>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={moodData} 
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    fontSize: '13px',
                    padding: '12px 16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value) => {
                    return [`${value}/5 😊`, 'Mood'];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="url(#moodGradient)"
                  fill="url(#moodGradient)"
                  strokeWidth={3}
                  name="Mood"
                  dot={{ 
                    fill: '#6b7280', 
                    strokeWidth: 2, 
                    r: 5,
                    stroke: '#ffffff'
                  }}
                  activeDot={{ 
                    r: 8, 
                    stroke: '#6b7280', 
                    strokeWidth: 3,
                    fill: '#ffffff'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Simple Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Average Mood Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
            >
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Average Mood</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                4.2
              </div>
              <p className="text-gray-600">Out of 5 stars</p>
            </motion.div>

            {/* Check-ins Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
            >
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Check-ins</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                28
              </div>
              <p className="text-gray-600">This month</p>
            </motion.div>

            {/* Streak Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
            >
              <div className="text-5xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Current Streak</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                7
              </div>
              <p className="text-gray-600">Days in a row</p>
            </motion.div>
          </div>

          {/* Simple Journal Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Reflections</h2>
              <p className="text-gray-600 text-lg">Beautiful moments from your journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {journalHighlights.map((entry, index) => (
                <motion.div
                  key={entry.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl">{entry.mood === 5 ? '😊' : entry.mood === 3 ? '😐' : '😔'}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">{entry.title}</h4>
                  <p className="text-gray-600 leading-relaxed mb-4">{entry.snippet}</p>
                  <span className="text-sm text-gray-500 font-medium">{entry.date}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Simple Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
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
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🏠 Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 