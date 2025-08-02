import React from 'react';
import { motion } from 'framer-motion';
import type { EmotionType } from '../../types';

// Emotion data with soft pastel colors for white background
const emotionData: Record<EmotionType, { emoji: string; color: string; label: string }> = {
  happy: { emoji: '😊', color: 'rgba(126, 216, 169, 0.3)', label: 'Happy' },
  sad: { emoji: '😢', color: 'rgba(107, 155, 210, 0.3)', label: 'Sad' },
  loneliness: { emoji: '😔', color: 'rgba(167, 139, 202, 0.3)', label: 'Loneliness' },
  anxiety: { emoji: '😰', color: 'rgba(230, 212, 90, 0.3)', label: 'Anxiety' },
  frustration: { emoji: '😤', color: 'rgba(216, 155, 90, 0.3)', label: 'Frustration' },
  stress: { emoji: '😵', color: 'rgba(90, 155, 155, 0.3)', label: 'Stress' },
  lethargy: { emoji: '😴', color: 'rgba(155, 155, 155, 0.3)', label: 'Lethargy' },
  fear: { emoji: '😨', color: 'rgba(139, 90, 155, 0.3)', label: 'Fear' },
  grief: { emoji: '💔', color: 'rgba(196, 144, 155, 0.3)', label: 'Grief' },
};

interface EmotionSelectorProps {
  selectedMood: EmotionType | null;
  onMoodSelect: (emotion: EmotionType) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h2 className="text-4xl md:text-5xl font-light text-gray-900 text-center mb-8">
        How are you feeling?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto px-4">
        {(Object.keys(emotionData) as EmotionType[]).map((emotion) => (
          <motion.button
            key={emotion}
            onClick={() => onMoodSelect(emotion)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative p-6 sm:p-8 lg:p-10 rounded-3xl transition-all duration-300 
              ${selectedMood === emotion 
                ? 'shadow-lg ring-4 ring-blue-200 scale-105' 
                : 'shadow-md hover:shadow-xl hover:scale-102'
              }
            `}
            style={{
              backgroundColor: emotionData[emotion].color,
              color: '#1f2937',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">{emotionData[emotion].emoji}</div>
            <div className="text-lg sm:text-xl font-semibold">{emotionData[emotion].label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Add custom styles for glassmorphism effects
const styles = `
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default EmotionSelector;