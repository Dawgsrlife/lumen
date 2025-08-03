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
  disabled?: boolean;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedMood, onMoodSelect, disabled = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full"
    >
      <div className="grid grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        {(Object.keys(emotionData) as EmotionType[]).map((emotion, index) => (
          <motion.button
            key={emotion}
            onClick={() => onMoodSelect(emotion)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-6 rounded-2xl cursor-pointer
              ${selectedMood === emotion 
                ? 'shadow-lg ring-4 ring-blue-200 scale-105' 
                : 'shadow-sm hover:shadow-md'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              backgroundColor: emotionData[emotion].color,
              color: '#1f2937',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.05 + index * 0.05,
              ease: "easeOut"
            }}

          >
            <div className="text-4xl mb-4">{emotionData[emotion].emoji}</div>
            <div className="text-lg font-medium">{emotionData[emotion].label}</div>
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