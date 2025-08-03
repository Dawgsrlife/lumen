import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { LoadingSpinner, AnimatedBackground } from '../components/ui';
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

  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7days' | 'month' | '3months' | 'alltime'>('7days');
  
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
    { date: 'Mon', mood: 4, stress: 2, energy: 3, journal: 'Feeling productive today' },
    { date: 'Tue', mood: 3, stress: 3, energy: 4, journal: 'A bit overwhelmed but managing' },
    { date: 'Wed', mood: 5, stress: 1, energy: 5, journal: 'Amazing day! Everything clicked' },
    { date: 'Thu', mood: 2, stress: 4, energy: 2, journal: 'Struggling with anxiety today' },
    { date: 'Fri', mood: 4, stress: 2, energy: 4, journal: 'Found some peace in meditation' },
    { date: 'Sat', mood: 5, stress: 1, energy: 5, journal: 'Wonderful time with friends' },
    { date: 'Sun', mood: 4, stress: 2, energy: 4, journal: 'Reflecting on a good week' },
  ];

  const detailedMoodData = [
    { date: 'Jan 1', mood: 4, journal: 'Started the year with hope' },
    { date: 'Jan 2', mood: 3, journal: 'Feeling a bit anxious about work' },
    { date: 'Jan 3', mood: 5, journal: 'Had a breakthrough moment' },
    { date: 'Jan 4', mood: 2, journal: 'Struggling with sleep' },
    { date: 'Jan 5', mood: 4, journal: 'Found comfort in routine' },
    { date: 'Jan 6', mood: 5, journal: 'Amazing day with family' },
    { date: 'Jan 7', mood: 4, journal: 'Feeling grateful for support' },
    { date: 'Jan 8', mood: 3, journal: 'Processing some difficult emotions' },
    { date: 'Jan 9', mood: 5, journal: 'Achieved a personal goal' },
    { date: 'Jan 10', mood: 4, journal: 'Finding balance in daily life' },
  ];

  const emotionBreakdown = [
    { emotion: 'Content', percentage: 45, color: '#a855f7' },
    { emotion: 'Anxious', percentage: 23, color: '#f59e0b' },
    { emotion: 'Energized', percentage: 32, color: '#ec4899' },
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
      <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] via-[#fdf2f8] to-[#fef7ed] relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your analytics</p>
          <Link to="/sign-in" className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] via-[#fdf2f8] to-[#fef7ed] relative">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/3 to-purple-500/5 z-5"></div>

      {/* Floating blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-8" style={{ background: 'var(--lumen-primary)', filter: 'blur(3px)' }}></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full opacity-8" style={{ background: 'var(--lumen-secondary)', filter: 'blur(3px)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-6" style={{ background: 'var(--lumen-primary)', filter: 'blur(2px)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full opacity-6" style={{ background: 'var(--lumen-secondary)', filter: 'blur(2px)' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-50 flex items-center justify-center min-h-[calc(100vh-120px)] px-6 pb-16">
        <div ref={contentRef} className="w-full max-w-4xl mx-auto">
          
                     {/* Primary: How are you feeling today? */}
           <motion.div 
             className="text-center mb-16"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
           >
             <div className="mb-16"></div>
             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
               How are you feeling today?
             </h1>
             <div className="mb-6"></div>
                                                       <p className="text-xl text-gray-600 leading-relaxed text-center w-full">
                 Your emotional journey is beautiful. Let's take a gentle look at your progress.
               </p>
             <div className="mb-8"></div>
             <div className="w-32 h-1.5 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60" />
           </motion.div>


            <div className="space-y-12">
              {/* Secondary: Simple Mood Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl border border-white/40 p-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your Mood Journey</h2>
                  <p className="text-gray-600">A gentle look at your emotional patterns over the past week</p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart 
                    data={moodData} 
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        fontSize: '13px',
                        padding: '10px 12px'
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
                      strokeWidth={2}
                      name="Mood"
                      dot={{ 
                        fill: '#a855f7', 
                        strokeWidth: 2, 
                        r: 4,
                        stroke: '#ffffff'
                      }}
                      activeDot={{ 
                        r: 6, 
                        stroke: '#a855f7', 
                        strokeWidth: 2,
                        fill: '#ffffff'
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Tertiary: Current Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🔥</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">7 Day Streak!</h2>
                  <div className="mb-4"></div>
                  <p className="text-gray-600 mb-6">You're building beautiful consistency. Keep shining! ✨</p>
                  <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                    <span>Average mood: 4.2/5</span>
                    <span>•</span>
                    <span>28 check-ins this month</span>
                  </div>
                </div>
              </motion.div>

                             {/* Hidden: Detailed Insights (Progressive Disclosure) */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
                 className="text-center"
               >
                 <motion.button
                   onClick={() => setShowDetailedView(!showDetailedView)}
                   className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   View Full History & Insights
                 </motion.button>
               </motion.div>

               {/* Expanded Detailed View */}
               <AnimatePresence>
                 {showDetailedView && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.3, ease: 'easeInOut' }}
                     className="space-y-8"
                   >
                     {/* Time Range Filters */}
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.4, delay: 0.1 }}
                       className="text-center"
                     >
                       <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Beautiful Journey Over Time</h3>
                       <div className="flex flex-wrap justify-center gap-2">
                         {[
                           { key: '7days', label: 'Last 7 Days' },
                           { key: 'month', label: 'Last Month' },
                           { key: '3months', label: 'Last 3 Months' },
                           { key: 'alltime', label: 'All Time' }
                         ].map((range) => (
                           <motion.button
                             key={range.key}
                             onClick={() => setSelectedTimeRange(range.key as any)}
                             className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                               selectedTimeRange === range.key
                                 ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                                 : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                             }`}
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                           >
                             {range.label}
                           </motion.button>
                         ))}
                       </div>
                     </motion.div>

                     {/* Enhanced Chart View */}
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.4, delay: 0.2 }}
                       className="bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl border border-white/40 p-8"
                     >
                       <div className="text-center mb-8">
                         <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your Detailed Mood Journey</h2>
                         <p className="text-gray-600">A deeper look at your emotional patterns and growth</p>
                       </div>
                       <ResponsiveContainer width="100%" height={300}>
                         <LineChart 
                           data={detailedMoodData} 
                           margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                         >
                           <defs>
                             <linearGradient id="detailedMoodGradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                               <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" opacity={0.5} />
                           <XAxis 
                             dataKey="date" 
                             stroke="#94a3b8" 
                             fontSize={12}
                             tickLine={false}
                             axisLine={false}
                             tick={{ fill: '#94a3b8', fontSize: 12 }}
                           />
                           <YAxis 
                             stroke="#94a3b8" 
                             fontSize={12}
                             tickLine={false}
                             axisLine={false}
                             tick={{ fill: '#94a3b8', fontSize: 12 }}
                           />
                           <Tooltip 
                             contentStyle={{ 
                               backgroundColor: 'rgba(255, 255, 255, 0.95)',
                               border: 'none',
                               borderRadius: '12px',
                               boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                               fontSize: '13px',
                               padding: '10px 12px'
                             }}
                                                           formatter={(value, _name, props) => {
                                const data = props.payload;
                                return [
                                  <div key="tooltip">
                                    <div className="font-semibold">{data.journal}</div>
                                    <div className="text-sm text-gray-500">{data.date}</div>
                                    <div className="text-sm">Mood: {value}/5 😊</div>
                                  </div>
                                ];
                              }}
                           />
                           <Area
                             type="monotone"
                             dataKey="mood"
                             stroke="url(#detailedMoodGradient)"
                             fill="url(#detailedMoodGradient)"
                             strokeWidth={2}
                             name="Mood"
                             dot={{ 
                               fill: '#a855f7', 
                               strokeWidth: 2, 
                               r: 4,
                               stroke: '#ffffff'
                             }}
                             activeDot={{ 
                               r: 6, 
                               stroke: '#a855f7', 
                               strokeWidth: 2,
                               fill: '#ffffff'
                             }}
                           />
                         </LineChart>
                       </ResponsiveContainer>
                     </motion.div>

                     {/* Emotion Breakdown */}
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.4, delay: 0.3 }}
                       className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100"
                     >
                       <div className="text-center mb-6">
                         <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Emotional Landscape</h3>
                         <p className="text-gray-600">Understanding your emotional patterns helps you grow</p>
                       </div>
                       <div className="space-y-4">
                         {emotionBreakdown.map((emotion, index) => (
                           <motion.div
                             key={emotion.emotion}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                             className="flex items-center space-x-4"
                           >
                             <div className="w-24 text-sm font-medium text-gray-700">{emotion.emotion}</div>
                             <div className="flex-1 bg-white/60 rounded-full h-3 overflow-hidden">
                               <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${emotion.percentage}%` }}
                                 transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                                 className="h-full rounded-full"
                                 style={{ backgroundColor: emotion.color }}
                               />
                             </div>
                             <div className="w-12 text-sm font-medium text-gray-600">{emotion.percentage}%</div>
                           </motion.div>
                         ))}
                       </div>
                     </motion.div>

                     {/* Journal Highlights */}
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.4, delay: 0.4 }}
                       className="space-y-4"
                     >
                       <div className="text-center mb-6">
                         <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Reflections</h3>
                         <p className="text-gray-600">Beautiful moments from your journey</p>
                       </div>
                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                         {journalHighlights.map((entry, index) => (
                           <motion.div
                             key={entry.date}
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                             className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-sm"
                           >
                             <div className="flex items-center justify-between mb-3">
                               <span className="text-sm text-gray-500">{entry.date}</span>
                               <span className="text-lg">{entry.mood === 5 ? '😊' : entry.mood === 3 ? '😐' : '😔'}</span>
                             </div>
                             <h4 className="font-semibold text-gray-800 mb-2">{entry.title}</h4>
                             <p className="text-sm text-gray-600 leading-relaxed">{entry.snippet}</p>
                           </motion.div>
                         ))}
                       </div>
                     </motion.div>

                     {/* Collapse Button */}
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.4, delay: 0.5 }}
                       className="text-center"
                     >
                       <motion.button
                         onClick={() => setShowDetailedView(false)}
                         className="px-6 py-3 bg-white/80 text-gray-700 rounded-2xl border border-gray-200 hover:bg-white hover:text-gray-900 transition-all duration-300 cursor-pointer shadow-sm flex items-center space-x-2 mx-auto"
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                         </svg>
                         <span>Show Less</span>
                       </motion.button>
                     </motion.div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 