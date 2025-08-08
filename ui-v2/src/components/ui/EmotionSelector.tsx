import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Emotion {
  id: string;
  label: string;
  emoji: string;
  color: string;
  preview: string;
}

const emotions: Emotion[] = [
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    color: 'from-blue-400 to-purple-500',
    preview: 'Gentle breathing exercises and calming activities'
  },
  {
    id: 'anxious',
    label: 'Anxious', 
    emoji: '😰',
    color: 'from-yellow-400 to-orange-500',
    preview: 'Grounding techniques and stress relief games'
  },
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    color: 'from-green-400 to-teal-500',
    preview: 'Celebration and gratitude practices'
  },
  {
    id: 'tired',
    label: 'Tired',
    emoji: '😴',
    color: 'from-indigo-400 to-purple-500',
    preview: 'Restorative activities and gentle movement'
  }
];

interface EmotionSelectorProps {
  onEmotionSelect?: (emotion: Emotion) => void;
  className?: string;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ 
  onEmotionSelect,
  className = ''
}) => {
  const [hoveredEmotion, setHoveredEmotion] = useState<Emotion | null>(null);

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {emotions.map((emotion) => (
        <motion.div
          key={emotion.id}
          className="relative group"
          onHoverStart={() => setHoveredEmotion(emotion)}
          onHoverEnd={() => setHoveredEmotion(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Emotion button */}
          <motion.button
            className={`
              w-16 h-16 rounded-full bg-gradient-to-br ${emotion.color} 
              text-white text-2xl shadow-lg border-2 border-white/20
              hover:shadow-xl transition-all duration-300
              flex items-center justify-center
            `}
            onClick={() => onEmotionSelect?.(emotion)}
            whileHover={{ 
              scale: 1.1,
              rotate: 5
            }}
          >
            {emotion.emoji}
          </motion.button>

          {/* Hover preview */}
          {hoveredEmotion?.id === emotion.id && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 text-sm text-gray-700 whitespace-nowrap z-50"
            >
              <div className="font-medium text-gray-900">{emotion.label}</div>
              <div className="text-xs text-gray-600 mt-1">{emotion.preview}</div>
              
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default EmotionSelector; 