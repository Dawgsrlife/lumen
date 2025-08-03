import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFlow } from '../context/FlowProvider';

interface JournalingStepProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const JournalingStep: React.FC<JournalingStepProps> = ({ onComplete, onSkip }) => {
  const { state, setJournalEntry } = useFlow();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [journalText, setJournalText] = useState('');

  const handleSubmit = async () => {
    if (!journalText.trim()) {
      onComplete();
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate saving journal entry to API
      const journalData = {
        content: journalText,
        mood: state.selectedEmotion,
        tags: ['daily-reflection', 'post-game'],
        isPrivate: true,
        emotionEntryId: state.gameData?.emotionEntryId,
      };

      console.log('JournalingStep: Saving journal entry (placeholder)', journalData);
      
      // Minimal delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setJournalEntry(journalText);
      console.log('JournalingStep: Journal entry saved successfully (placeholder)');
    } catch (error) {
      console.warn('JournalingStep: Failed to save journal entry, continuing anyway:', error);
      // Continue even if API fails
    } finally {
      setIsSubmitting(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(251,191,36,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center mb-6"
        >
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How are you feeling now?
          </h2>
          <p className="text-gray-600">
            Take a moment to reflect on your experience
          </p>
        </motion.div>

        {/* Journal Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mb-6"
        >
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Share your thoughts, feelings, or any insights from today's experience..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Save & Continue'
            )}
          </motion.button>

          {onSkip && (
            <motion.button
              onClick={handleSkip}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Skip for now
            </motion.button>
          )}
        </motion.div>

        {/* Encouraging Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500 italic">
            "Every reflection is a step toward self-awareness"
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default JournalingStep; 