import React from "react";
import { motion } from "framer-motion";
import type { EmotionType } from "../../types";

// Simplified emotion data
const emotionData: Record<EmotionType, { emoji: string; label: string }> = {
  happy: { emoji: "😊", label: "Happy" },
  sad: { emoji: "😢", label: "Sad" },
  loneliness: { emoji: "😔", label: "Lonely" },
  anxiety: { emoji: "😰", label: "Anxious" },
  frustration: { emoji: "😤", label: "Frustrated" },
  stress: { emoji: "😵", label: "Stressed" },
  lethargy: { emoji: "😴", label: "Tired" },
  fear: { emoji: "😨", label: "Fearful" },
  grief: { emoji: "💔", label: "Grieving" },
};

interface EmotionSelectorProps {
  selectedMood: EmotionType | null;
  onMoodSelect: (emotion: EmotionType) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedMood,
  onMoodSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
      {(Object.keys(emotionData) as EmotionType[]).map((emotion, index) => (
        <motion.button
          key={emotion}
          onClick={() => onMoodSelect(emotion)}
          className={`
            p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
            ${
              selectedMood === emotion
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }
            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-3xl mb-2">{emotionData[emotion].emoji}</div>
          <div className="text-sm font-medium text-gray-900">
            {emotionData[emotion].label}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default EmotionSelector;
