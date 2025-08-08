import React from "react";
import { motion } from "framer-motion";
import EmotionSelector from "./emotion/EmotionSelector";
import type { EmotionType } from "../types";

interface EmotionSelectionScreenProps {
  onEmotionSelect: (emotion: EmotionType) => void;
}

const EmotionSelectionScreen: React.FC<EmotionSelectionScreenProps> = ({
  onEmotionSelect,
}) => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How are you feeling today?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a moment to check in with yourself
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <EmotionSelector selectedMood={null} onMoodSelect={onEmotionSelect} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmotionSelectionScreen;
