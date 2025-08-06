import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useClerkUser } from '../hooks/useClerkUser';
import { apiService } from '../services/api';
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
  const [totalCheckIns, setTotalCheckIns] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simplified mock data for charts
  const moodData = [
    { date: 'Mon', mood: 4 },
    { date: 'Tue', mood: 3 },
    { date: 'Wed', mood: 5 },
    { date: 'Thu', mood: 2 },
    { date: 'Fri', mood: 4 },
    { date: 'Sat', mood: 5 },
    { date: 'Sun', mood: 4 },
  ];

  // Fetch total check-ins from journal entries
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Calculate date range based on selected time range
        let limit = 1000; // Default to fetch all entries
        let startDate: string | undefined;
        const now = new Date();
        
        switch (selectedTimeRange) {
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case '3months':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case 'alltime':
          default:
            // No date filter for all time
            break;
        }
        
        // Fetch journal entries to count total check-ins
        const journalResponse = await apiService.getJournalEntries({
          limit,
          startDate,
          includePrivate: true
        });
        
        setTotalCheckIns(journalResponse.entries.length);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, selectedTimeRange]);

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
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Beautiful Header - Inspired by Landing Page */}
        <motion.div 
          className="text-center mb-20 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.h1 
            className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6 text-center"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Beautiful Journey
          </motion.h1>
          
          <motion.p 
            className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto font-light text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A gentle look at your emotional patterns and growth over time
          </motion.p>
        </motion.div>

        {/* Simple Time Range Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {[
            { key: '7days', label: 'Last 7 Days' },
            { key: 'month', label: 'Last Month' },
            { key: '3months', label: 'Last 3 Months' },
            { key: 'alltime', label: 'All Time' }
          ].map((range) => (
            <motion.button
              key={range.key}
              onClick={() => setSelectedTimeRange(range.key as '7days' | 'month' | '3months' | 'alltime')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                selectedTimeRange === range.key
                  ? 'bg-gradient-to-r from-yellow-400 to-purple-600 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {range.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Simple Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 mb-16"
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
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
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
                  fill: '#fbbf24', 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: '#ffffff'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#8b5cf6', 
                  strokeWidth: 3,
                  fill: '#ffffff'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Simple Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.href = '/check-ins'}
          >
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Check-ins</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                totalCheckIns
              )}
            </div>
            <p className="text-gray-600 mb-2">
              {selectedTimeRange === '7days' && 'Last 7 days'}
              {selectedTimeRange === 'month' && 'Last month'}
              {selectedTimeRange === '3months' && 'Last 3 months'}
              {selectedTimeRange === 'alltime' && 'All time'}
            </p>
            <p className="text-sm text-purple-600 font-medium">
              👆 Click to view details
            </p>
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

        {/* Beautiful Action Buttons - Inspired by Landing Page */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            onClick={() => window.location.href = '/flow?manual=true'}
            className="relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white text-base tracking-normal transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Minimal shimmer effect - subtle and elegant */}
            <div 
              className="absolute inset-0 rounded-xl opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            ></div>
            
            {/* Clean, minimal button text */}
            <span className="relative z-10">
              💭 Log Today's Emotion
            </span>
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
  );
};

export default Analytics; 