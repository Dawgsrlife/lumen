import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmotionType } from '../../types';

interface MoodEntry {
  date: string;
  emotion: EmotionType;
  intensity: number;
}

interface MoodContributionGraphProps {
  entries?: MoodEntry[];
  className?: string;
}

const emotionColors: Record<EmotionType, string> = {
  happy: '#FFD700',
  sad: '#4169E1', 
  loneliness: '#8A2BE2',
  anxiety: '#FF6B6B',
  frustration: '#FF4500',
  stress: '#20B2AA',
  lethargy: '#708090',
  fear: '#663399',
  grief: '#CD5C5C',
};

const emotionLabels: Record<EmotionType, string> = {
  happy: 'Happy',
  sad: 'Sad',
  loneliness: 'Loneliness', 
  anxiety: 'Anxiety',
  frustration: 'Frustration',
  stress: 'Stress',
  lethargy: 'Lethargy',
  fear: 'Fear',
  grief: 'Grief',
};

export const MoodContributionGraph: React.FC<MoodContributionGraphProps> = ({ 
  entries = [], 
  className = '' 
}) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; emotion: EmotionType; intensity: number } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { weeks } = useMemo(() => {
    const dateList = [];
    const today = new Date();
    
    // Generate exactly 365 days
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dateList.push(date.toISOString().split('T')[0]);
    }
    
    // Create weeks array - exactly 53 weeks to cover 365 days
    const weeksList = [];
    for (let i = 0; i < 53; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const dayIndex = i * 7 + j;
        if (dayIndex < 365) {
          week.push(dateList[dayIndex]);
        }
      }
      if (week.length > 0) {
        weeksList.push(week);
      }
    }
    
    return { weeks: weeksList };
  }, []);

  const entryMap = useMemo(() => {
    const map = new Map<string, MoodEntry>();
    entries.forEach(entry => {
      map.set(entry.date, entry);
    });
    return map;
  }, [entries]);

  const getIntensityOpacity = (intensity: number) => {
    return Math.max(0.2, intensity / 10);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <motion.div 
      className={`relative p-6 bg-white rounded-3xl ${className}`}
      style={{
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Mood Activity</h3>
      
      <div className="flex items-center">
        {/* Days grid */}
        <div className="flex gap-0.5 overflow-hidden">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const date = week[dayIndex];
                if (!date) return <div key={dayIndex} className="w-2.5 h-2.5" />;
                
                const entry = entryMap.get(date);
                const hasEntry = Boolean(entry);
                
                return (
                  <motion.div
                    key={date}
                    className="w-2.5 h-2.5 rounded-sm cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: hasEntry 
                        ? emotionColors[entry!.emotion]
                        : '#f3f4f6',
                      opacity: hasEntry 
                        ? getIntensityOpacity(entry!.intensity)
                        : 1
                    }}
                    whileHover={{ scale: 1.8 }}
                    onMouseEnter={() => {
                      if (hasEntry) {
                        setHoveredDay({
                          date,
                          emotion: entry!.emotion,
                          intensity: entry!.intensity
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    onMouseMove={handleMouseMove}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>


      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 40,
            }}
          >
            <div 
              className="px-3 py-2 rounded-lg text-sm font-medium text-white shadow-lg"
              style={{
                backgroundColor: emotionColors[hoveredDay.emotion],
                background: `linear-gradient(135deg, ${emotionColors[hoveredDay.emotion]} 0%, ${emotionColors[hoveredDay.emotion]}CC 100%)`
              }}
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{emotionLabels[hoveredDay.emotion]}</span>
                <span className="text-xs opacity-90">{formatDate(hoveredDay.date)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};