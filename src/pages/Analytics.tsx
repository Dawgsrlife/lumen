import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Card, Button, LoadingSpinner, AnimatedBackground, LumenIcon } from '../components/ui';
import { useClerkUser } from '../hooks/useClerkUser';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Analytics: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(false);
  
  const analyticsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 30
      });

      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    return () => ctx.revert();
  }, []);

  // Mock data for charts
  const moodData = [
    { date: 'Mon', mood: 4, stress: 2, energy: 3 },
    { date: 'Tue', mood: 3, stress: 3, energy: 4 },
    { date: 'Wed', mood: 5, stress: 1, energy: 5 },
    { date: 'Thu', mood: 2, stress: 4, energy: 2 },
    { date: 'Fri', mood: 4, stress: 2, energy: 4 },
    { date: 'Sat', mood: 5, stress: 1, energy: 5 },
    { date: 'Sun', mood: 4, stress: 2, energy: 4 },
  ];

  const emotionBreakdown = [
    { name: 'Happy', value: 45, color: '#8B5CF6' },
    { name: 'Neutral', value: 25, color: '#6B7280' },
    { name: 'Stressed', value: 20, color: '#F59E0B' },
    { name: 'Sad', value: 10, color: '#10B981' },
  ];

  const weeklyProgress = [
    { week: 'Week 1', checkins: 5, avgMood: 3.2, goals: 2 },
    { week: 'Week 2', checkins: 7, avgMood: 3.8, goals: 3 },
    { week: 'Week 3', checkins: 6, avgMood: 4.1, goals: 4 },
    { week: 'Week 4', checkins: 7, avgMood: 4.3, goals: 5 },
  ];

  const insights = [
    {
      type: 'improvement',
      title: 'Mood Improvement',
      description: 'Your average mood has improved by 23% this month',
      icon: '📈',
      color: 'text-green-600',
    },
    {
      type: 'pattern',
      title: 'Weekly Pattern',
      description: 'You tend to feel better on weekends',
      icon: '📅',
      color: 'text-blue-600',
    },
    {
      type: 'goal',
      title: 'Goal Achievement',
      description: 'You\'ve completed 80% of your monthly goals',
      icon: '🎯',
      color: 'text-lumen-primary',
    },
    {
      type: 'streak',
      title: 'Consistency',
      description: '7-day check-in streak! Keep it up!',
      icon: '🔥',
      color: 'text-orange-600',
    },
  ];

  const handlePeriodChange = (period: 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!user) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lumen-gradient-start)]/3 via-white/40 to-[var(--lumen-gradient-end)]/3 z-5"></div>

      {/* Floating blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(2px)' }}></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full opacity-10" style={{ background: 'var(--lumen-secondary)', filter: 'blur(2px)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(1px)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full opacity-10" style={{ background: 'var(--lumen-secondary)', filter: 'blur(1px)' }}></div>
      </div>



      {/* Main content */}
      <div className="relative z-50 flex items-center justify-center min-h-[calc(100vh-120px)] px-8 pb-16">
        <div ref={contentRef} className="w-full max-w-7xl mx-auto">
          
          {/* Analytics Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-16"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Your Analytics
            </h1>
            <div className="mb-4"></div>
            <p className="text-lg text-gray-600 leading-relaxed text-center">
              Track your mental health journey with detailed insights and patterns
            </p>
            <div className="mb-4"></div>
            {/* Period Selector */}
            <div className="flex justify-center gap-2 mb-8">
              {(['week', 'month', 'year'] as const).map((period) => (
                <motion.button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-[var(--lumen-primary)] to-[var(--lumen-secondary)] text-white shadow-lg'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </motion.button>
              ))}
            </div>
            
                         <div className="w-32 h-1.5 mx-auto bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer" 
                  title="Your wellness journey" />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Key Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  { label: 'Average Mood', value: '4.2', change: '+0.8', icon: '😊' },
                  { label: 'Check-ins', value: '28', change: '+5', icon: '📊' },
                  { label: 'Streak', value: '7 days', change: '+2', icon: '🔥' },
                  { label: 'Goals Met', value: '4/5', change: '80%', icon: '🎯' },
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-6 text-center"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl mb-3">{metric.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {metric.value}
                    </h3>
                    <p className="text-gray-600 mb-3">{metric.label}</p>
                    <span className="text-sm text-green-600 font-medium">
                      {metric.change}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mood Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mood Trend</h3>
                  <p className="text-gray-600 mb-6">Your emotional journey over time</p>
                                     <ResponsiveContainer width="100%" height={300}>
                     <LineChart data={moodData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                       <CartesianGrid strokeDasharray="0" stroke="#f8fafc" />
                       <XAxis 
                         dataKey="date" 
                         stroke="#94a3b8" 
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                       />
                       <YAxis 
                         stroke="#94a3b8" 
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                         tickFormatter={(value) => `${value}`}
                       />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: 'rgba(255, 255, 255, 0.98)',
                           border: 'none',
                           borderRadius: '12px',
                           boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                           fontSize: '12px'
                         }}
                         cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                       />
                       <Legend 
                         wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                       />
                       <Line
                         type="monotone"
                         dataKey="mood"
                         stroke="#8B5CF6"
                         strokeWidth={2.5}
                         name="Mood"
                         dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                         activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                       />
                       <Line
                         type="monotone"
                         dataKey="stress"
                         stroke="#F59E0B"
                         strokeWidth={2}
                         name="Stress"
                         dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                         activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                       />
                     </LineChart>
                   </ResponsiveContainer>
                </motion.div>

                {/* Emotion Breakdown */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Emotion Breakdown</h3>
                  <p className="text-gray-600 mb-6">Distribution of your emotions</p>
                                     <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                       <Pie
                         data={emotionBreakdown}
                         cx="50%"
                         cy="50%"
                         labelLine={false}
                         label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                         outerRadius={90}
                         innerRadius={30}
                         fill="#8884d8"
                         dataKey="value"
                         paddingAngle={2}
                       >
                         {emotionBreakdown.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: 'rgba(255, 255, 255, 0.98)',
                           border: 'none',
                           borderRadius: '12px',
                           boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                           fontSize: '12px'
                         }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                </motion.div>

                {/* Weekly Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="lg:col-span-2 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Weekly Progress</h3>
                  <p className="text-gray-600 mb-6">Your consistency and growth</p>
                                     <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={weeklyProgress} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                       <CartesianGrid strokeDasharray="0" stroke="#f8fafc" />
                       <XAxis 
                         dataKey="week" 
                         stroke="#94a3b8" 
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                       />
                       <YAxis 
                         stroke="#94a3b8" 
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                       />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: 'rgba(255, 255, 255, 0.98)',
                           border: 'none',
                           borderRadius: '12px',
                           boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                           fontSize: '12px'
                         }}
                         cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                       />
                       <Legend 
                         wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                       />
                       <Bar 
                         dataKey="checkins" 
                         fill="#8B5CF6" 
                         name="Check-ins"
                         radius={[4, 4, 0, 0]}
                       />
                       <Bar 
                         dataKey="avgMood" 
                         fill="#F59E0B" 
                         name="Avg Mood"
                         radius={[4, 4, 0, 0]}
                       />
                       <Bar 
                         dataKey="goals" 
                         fill="#10B981" 
                         name="Goals Met"
                         radius={[4, 4, 0, 0]}
                       />
                     </BarChart>
                   </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Insights Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Insights</h3>
                <p className="text-gray-600 mb-6">Personalized recommendations</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-gradient-to-r from-[var(--lumen-primary)]/5 to-[var(--lumen-secondary)]/5 rounded-lg border border-[var(--lumen-primary)]/20"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{insight.icon}</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${insight.color}`}>
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-3 bg-white/80 text-gray-700 rounded-xl border border-gray-200 hover:bg-white hover:text-gray-900 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Back to Dashboard
                </motion.button>
                <motion.button
                  onClick={() => window.location.href = '/games'}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--lumen-primary)] to-[var(--lumen-secondary)] text-white rounded-xl hover:from-[var(--lumen-primary)]/90 hover:to-[var(--lumen-secondary)]/90 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎮 Play Therapeutic Games
                </motion.button>
                <motion.button
                  onClick={() => window.location.href = '/profile'}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📊 Export Data
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 