import React from 'react';
import { motion } from 'framer-motion';
import EmotionSelector from './emotion/EmotionSelector';
import type { EmotionType } from '../types';

interface EmotionSelectionScreenProps {
  onEmotionSelect: (emotion: EmotionType) => void;
}

const EmotionSelectionScreen: React.FC<EmotionSelectionScreenProps> = ({ onEmotionSelect }) => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-cream-50 to-purple-50 px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl font-light text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            How are you feeling today?
          </motion.h1>
          
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Take a moment to check in with yourself
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <EmotionSelector
            selectedMood={null}
            onMoodSelect={onEmotionSelect}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmotionSelectionScreen; 