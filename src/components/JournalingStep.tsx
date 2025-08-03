import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFlow } from '../context/FlowProvider';

interface JournalingStepProps {
  onComplete: () => void;
  onSkip?: () => void;
}

// JournalingStep now uses the centralized FlowBackground system

const JournalingStep: React.FC<JournalingStepProps> = ({ onComplete, onSkip }) => {
  const { state, setJournalEntry } = useFlow();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Detect typing for subtle feedback
    if (journalText.length > 0) {
      setIsTyping(true);
      const typingTimer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(typingTimer);
    }
  }, [journalText]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        
        {/* Header Section - Much More Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 max-w-lg"
        >
          <h1 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
            How are you feeling?
          </h1>
          <p className="text-gray-500 text-sm font-light">
            Take a moment to reflect
          </p>
        </motion.div>

        {/* Journal Input - Clean & Focused */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-2xl mb-12"
        >
          <div className="relative">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Share your thoughts, feelings, or insights..."
              className={`
                w-full h-48 p-6 rounded-2xl border-0 
                bg-white/80 backdrop-blur-sm
                shadow-sm hover:shadow-md focus:shadow-lg
                text-gray-700 text-lg leading-relaxed
                placeholder-gray-400 font-light
                resize-none outline-none
                transition-all duration-300
                ${isTyping ? 'ring-2 ring-blue-200/50' : ''}
              `}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
            
            {/* Subtle character count */}
            {journalText.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-3 right-4 text-xs text-gray-400"
              >
                {journalText.length} characters
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          {/* Primary Action */}
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 px-8 rounded-xl font-medium text-white
                       bg-gradient-to-r from-blue-500 to-purple-500
                       shadow-lg hover:shadow-xl
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Continue'
            )}
          </motion.button>
          
          {/* Secondary Action */}
          {onSkip && (
            <motion.button
              onClick={handleSkip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 px-8 rounded-xl font-medium text-gray-600
                         bg-white/60 backdrop-blur-sm border border-gray-200
                         hover:bg-white/80 hover:shadow-md
                         transition-all duration-200"
            >
              Skip
            </motion.button>
          )}
        </motion.div>

        {/* Inspirational Quote - Subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm font-light italic">
            "Every reflection is a step toward self-awareness"
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JournalingStep; 