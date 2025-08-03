import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmotionType } from '../../types';

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

// View modes for different visualizations
type ViewMode = 'heatmap' | 'calendar' | 'river';

// Generate dummy mood history data (GitHub contributions style)
const generateMoodHistory = () => {
  const history: Array<{ date: string; emotion: EmotionType | null; intensity: number }> = [];
  const emotions = Object.keys(emotionData) as EmotionType[];
  const today = new Date();
  
  // Generate data for the past 365 days
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 30% chance of no emotion logged
    const hasEmotion = Math.random() > 0.3;
    const emotion = hasEmotion ? emotions[Math.floor(Math.random() * emotions.length)] : null;
    const intensity = hasEmotion ? Math.floor(Math.random() * 5) + 1 : 0;
    
    history.push({
      date: date.toISOString().split('T')[0],
      emotion,
      intensity,
    });
  }
  
  return history;
};

interface MoodHistoryCalendarProps {
  moodHistory?: Array<{ date: string; emotion: EmotionType | null; intensity: number }>;
}

interface TooltipData {
  date: string;
  emotion: EmotionType | null;
  intensity: number;
  x: number;
  y: number;
}

const MoodHistoryCalendar: React.FC<MoodHistoryCalendarProps> = ({ 
  moodHistory = generateMoodHistory() 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');
  const [hoveredDay, setHoveredDay] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get recent 3 months of data for better visualization
  const recentHistory = moodHistory.slice(-90);
  
  // Group data by weeks for calendar view
  const groupByWeeks = (data: typeof moodHistory) => {
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
    return weeks;
  };

  const handleDayHover = (day: { date: string; emotion: EmotionType | null; intensity: number }, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setHoveredDay({
      date: day.date,
      emotion: day.emotion,
      intensity: day.intensity,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const renderHeatmapView = () => {
    const weeks = groupByWeeks(recentHistory);
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-10 sm:grid-cols-13 gap-2 sm:gap-3 max-w-4xl mx-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-2">
            {week.map((day, dayIndex) => (
              <motion.div
                key={`${weekIndex}-${dayIndex}`}
                className="relative w-3 h-3 sm:w-4 sm:h-4 rounded-lg cursor-pointer group"
                style={{
                  background: day.emotion 
                    ? `${emotionData[day.emotion].glowColor}${Math.round(day.intensity * 51).toString(16).padStart(2, '0')}`
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                whileHover={{ 
                  scale: 2.5,
                  zIndex: 10,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={(event) => handleDayHover(day, event as unknown as React.MouseEvent)}
                onHoverEnd={() => setHoveredDay(null)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
              >
                {day.emotion && (
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    style={{ 
                      background: emotionData[day.emotion].glowColor,
                      filter: 'blur(8px)',
                      transform: 'scale(1.5)'
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        ))}
        </div>
      </div>
    );
  };

  const renderRiverView = () => {
    return (
      <div className="relative h-64 max-w-5xl mx-auto overflow-hidden rounded-3xl"
           style={{
             background: 'rgba(255, 255, 255, 0.05)',
             backdropFilter: 'blur(20px)',
             border: '1px solid rgba(255, 255, 255, 0.1)'
           }}>
        <svg className="w-full h-full" viewBox="0 0 800 200">
          <defs>
            <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {recentHistory.map((day, index) => (
                <stop
                  key={index}
                  offset={`${(index / recentHistory.length) * 100}%`}
                  stopColor={day.emotion ? emotionData[day.emotion].glowColor : '#333'}
                  stopOpacity={day.emotion ? day.intensity * 0.2 : 0.1}
                />
              ))}
            </linearGradient>
          </defs>
          
          {/* River Flow */}
          <motion.path
            d={`M 0,100 Q 200,${80 + Math.sin(Date.now() * 0.001) * 20} 400,100 T 800,100`}
            fill="none"
            stroke="url(#riverGradient)"
            strokeWidth="40"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          
          {/* Mood Bubbles */}
          {recentHistory.slice(-20).map((day, index) => 
            day.emotion && (
              <motion.circle
                key={index}
                cx={40 + index * 37}
                cy={100 + Math.sin(index * 0.5) * 30}
                r={day.intensity * 3 + 2}
                fill={emotionData[day.emotion].glowColor}
                opacity={0.7}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            )
          )}
        </svg>
        
        {/* Floating Emotion Indicators */}
        <div className="absolute inset-0 pointer-events-none">
          {recentHistory.slice(-8).map((day, index) => 
            day.emotion && (
              <motion.div
                key={index}
                className="absolute text-2xl"
                style={{
                  left: `${10 + index * 12}%`,
                  top: `${30 + Math.sin(index) * 20}%`
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                {emotionData[day.emotion].emoji}
              </motion.div>
            )
          )}
        </div>
      </div>
    );
  };
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      <div className="text-center mb-16">
        <motion.h3 
          className="text-4xl font-light text-white py-12 mb-16 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Your Mood History
        </motion.h3>
        
        {/* View Mode Selector */}
        <motion.div 
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {(['heatmap', 'river'] as ViewMode[]).map((mode) => (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-6 py-3 pt-8 rounded-2xl font-medium transition-all duration-300 cursor-pointer ${
                viewMode === mode
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={{
                background: viewMode === mode 
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode === 'heatmap' ? '📅 Heat Map' : '🌊 River Flow'}
            </motion.button>
          ))}
        </motion.div>
      </div>
      
      {/* Visualization Container */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        {viewMode === 'heatmap' && renderHeatmapView()}
        {viewMode === 'river' && renderRiverView()}
      </motion.div>

      {/* Enhanced Legend */}
      <motion.div 
        className="flex flex-wrap justify-center gap-8 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
             style={{
               background: 'rgba(255, 255, 255, 0.05)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.1)'
             }}>
          <div className="w-4 h-4 rounded-lg bg-white/20"></div>
          <span className="text-white/70">No mood logged</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
             style={{
               background: 'rgba(255, 255, 255, 0.05)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.1)'
             }}>
          <div className="w-4 h-4 rounded-lg bg-gradient-to-r from-purple-400/30 to-blue-400/30"></div>
          <span className="text-white/70">Low intensity</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
             style={{
               background: 'rgba(255, 255, 255, 0.05)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.1)'
             }}>
          <div className="w-4 h-4 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400"></div>
          <span className="text-white/70">High intensity</span>
        </div>
      </motion.div>
      
      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: hoveredDay.x,
              top: hoveredDay.y,
              transform: 'translateX(-50%) translateY(-100%)'
            }}
          >
            <div 
              className="px-4 py-3 rounded-2xl shadow-2xl border"
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-white text-sm font-medium mb-1">
                {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              {hoveredDay.emotion ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{emotionData[hoveredDay.emotion].emoji}</span>
                  <span className="text-white/80 text-sm">
                    {emotionData[hoveredDay.emotion].label}
                  </span>
                  <span className="text-white/60 text-xs">
                    ({hoveredDay.intensity}/5)
                  </span>
                </div>
              ) : (
                <span className="text-white/60 text-sm">No mood logged</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MoodHistoryCalendar;