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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Soft background gradient - matching welcome screen */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-yellow-400/5 via-purple-600/8 to-transparent blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* Simple Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.2,
            }}
          >
            <h1
              className="text-3xl md:text-4xl font-light text-gray-900 mb-12 leading-tight tracking-tight"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              How are you feeling today?
            </h1>
            <div className="mb-12"></div>
          </motion.div>

          {/* Emotion Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.4,
            }}
          >
            <EmotionSelector
              selectedMood={null}
              onMoodSelect={onEmotionSelect}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmotionSelectionScreen;
