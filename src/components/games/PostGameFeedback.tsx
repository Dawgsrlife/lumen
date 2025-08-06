import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { apiService } from '../../services/api';
import type { EmotionType } from '../../types';

interface PostGameFeedbackProps {
  emotion: EmotionType;
  gameTitle: string;
  gameId?: string;
  onFeedback: (feelsBetter: boolean) => void;
  onSkip?: () => void;
}

const PostGameFeedback: React.FC<PostGameFeedbackProps> = ({
  emotion,
  gameTitle,
  onFeedback,
  onSkip,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (feelsBetter: boolean) => {
    setIsLoading(true);
    
    try {
      // Create a journal entry with the post-game feedback
      const feelingText = feelsBetter ? "better" : "about the same";
      const journalContent = `After playing ${gameTitle}, I feel ${feelingText}. This game was designed to help with ${emotion} and it was a meaningful experience in my wellness journey.`;
      
      await apiService.createJournalEntry({
        title: `Post-Game Reflection: ${gameTitle}`,
        content: journalContent,
        mood: feelsBetter ? 7 : 5, // Higher mood if they feel better
        tags: [emotion, 'game', 'wellness', gameTitle.toLowerCase().replace(/\s+/g, '-')],
        isPrivate: false
      });
      
      // Call the original onFeedback to maintain existing flow
      onFeedback(feelsBetter);
      
      // Wait 3 seconds then redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      // Even if save fails, continue with the original flow
      onFeedback(feelsBetter);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(251,191,36,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Loading Spinner */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', bounce: 0.6 }}
            className="text-6xl mb-6"
          >
            ⏳
          </motion.div>

          {/* Loading Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-3"
          >
            Saving your reflection...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-lg text-gray-700"
          >
            Taking you to the dashboard...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(251,191,36,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Celebration Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring', bounce: 0.6 }}
          className="text-6xl mb-6"
        >
          🎉
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          Great job completing {gameTitle}!
        </motion.h2>

        {/* Main Question */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-lg text-gray-700 mb-8"
        >
          Do you feel better after this game?
        </motion.p>

        {/* Response Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <Button
            onClick={() => handleSave(true)}
            size="lg"
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-xl">😊</span>
              Yes, I feel better!
            </span>
          </Button>

          <Button
            onClick={() => handleSave(false)}
            size="lg"
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-xl">😐</span>
              Not really different
            </span>
          </Button>
        </motion.div>

        {/* Skip Option */}
        {onSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
          >
            Skip this question
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PostGameFeedback;