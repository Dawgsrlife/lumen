import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, LoadingSpinner } from '../components/ui';
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
    { name: 'Happy', value: 45, color: '#FBBF24' },
    { name: 'Neutral', value: 25, color: '#6B7280' },
    { name: 'Stressed', value: 20, color: '#EF4444' },
    { name: 'Sad', value: 10, color: '#3B82F6' },
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
    <div className="min-h-screen bg-lumen-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-lumen-dark mb-2">
                Your Analytics
              </h1>
              <p className="text-gray-600">
                Track your mental health journey with detailed insights and patterns.
              </p>
            </div>
            
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodChange(period)}
                  disabled={isLoading}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>
          </div>
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
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { label: 'Average Mood', value: '4.2', change: '+0.8', icon: '😊' },
                { label: 'Check-ins', value: '28', change: '+5', icon: '📊' },
                { label: 'Streak', value: '7 days', change: '+2', icon: '🔥' },
                { label: 'Goals Met', value: '4/5', change: '80%', icon: '🎯' },
              ].map((metric, index) => (
                <Card key={index} className="text-center">
                  <div className="text-3xl mb-2">{metric.icon}</div>
                  <h3 className="text-2xl font-bold text-lumen-dark mb-1">
                    {metric.value}
                  </h3>
                  <p className="text-gray-600 mb-2">{metric.label}</p>
                  <span className="text-sm text-green-600 font-medium">
                    {metric.change}
                  </span>
                </Card>
              ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mood Trend Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card title="Mood Trend" subtitle="Your emotional journey over time">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#FBBF24"
                        strokeWidth={3}
                        name="Mood"
                      />
                      <Line
                        type="monotone"
                        dataKey="stress"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Stress"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Emotion Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card title="Emotion Breakdown" subtitle="Distribution of your emotions">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={emotionBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emotionBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Weekly Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <Card title="Weekly Progress" subtitle="Your consistency and growth">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="checkins" fill="#FBBF24" name="Check-ins" />
                      <Bar dataKey="avgMood" fill="#8B5CF6" name="Avg Mood" />
                      <Bar dataKey="goals" fill="#10B981" name="Goals Met" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Insights Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card title="AI Insights" subtitle="Personalized recommendations">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-lumen-primary/5 to-lumen-secondary/5 rounded-lg border border-lumen-primary/20"
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
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
              >
                ← Back to Dashboard
              </Button>
              <Button
                onClick={() => window.location.href = '/games'}
              >
                🎮 Play Therapeutic Games
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/profile'}
              >
                📊 Export Data
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 