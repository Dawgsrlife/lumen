import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui';
import { apiService } from '../services/api';
import { useClerkUser } from '../hooks/useClerkUser';
import type { EmotionType } from '../types';

interface JournalingStepProps {
  onComplete: () => void;
  onSkip?: () => void;
  selectedEmotion?: EmotionType;
  gameCompleted?: string;
}

const JournalingStep: React.FC<JournalingStepProps> = ({ 
  onComplete, 
  onSkip, 
  selectedEmotion = 'happy',
  gameCompleted = null 
}) => {
  const { user } = useClerkUser();
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!journalEntry.trim()) {
      setError('Please share your thoughts before continuing.');
      return;
    }

    if (!user) {
      setError('User not authenticated.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Submit journal entry to MongoDB
      await apiService.createJournalEntry({
        title: `Daily Reflection - ${selectedEmotion}`,
        content: journalEntry.trim(),
        emotionEntryId: undefined,
        mood: 5, // Default mood value
        tags: [selectedEmotion, 'daily-reflection'],
        isPrivate: false
      });

      // Mark emotion as logged for today
      await apiService.createEmotionEntry({
        emotion: selectedEmotion,
        intensity: 5, // Default intensity
        context: 'daily-check-in',
        surveyResponses: []
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      setError('Failed to save your reflection. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <motion.div
        className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            How are you feeling now?
          </h1>
          <p className="text-gray-600 text-lg">
            Take a moment to reflect on your experience and share your thoughts.
          </p>
        </motion.div>

        {/* Journal Input */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <label htmlFor="journal-entry" className="block text-sm font-medium text-gray-700 mb-3">
            Your Reflection
          </label>
          <textarea
            id="journal-entry"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Share your thoughts, feelings, or any insights from today's experience..."
            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
            disabled={isSubmitting}
          />
          {error && (
            <motion.p
              className="text-red-600 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !journalEntry.trim()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
          
          <Button
            onClick={handleSkip}
            disabled={isSubmitting}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Skip for Now
          </Button>
        </motion.div>

        {/* Encouraging Message */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-sm text-gray-500 italic">
            Your reflections help you track your emotional journey and provide valuable insights over time.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JournalingStep; 