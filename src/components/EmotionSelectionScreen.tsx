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
      className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 flex items-center justify-center px-6 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-5xl w-full mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight tracking-tight"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            How are you feeling today?
          </motion.h1>
          <div className="mb-4"></div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-xl text-gray-600 font-light leading-relaxed tracking-wide">
              Take a moment to check in with yourself
            </p>
          </motion.div>

          {/* Subtle decorative element */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </motion.div>
        </motion.div>

        {/* Emotion Selector */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          <EmotionSelector selectedMood={null} onMoodSelect={onEmotionSelect} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmotionSelectionScreen;
