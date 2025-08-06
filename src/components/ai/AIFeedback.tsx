import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, LoadingSpinner } from '../ui';
import { aiService } from '../../services/ai';
import type { AIFeedbackResponse } from '../../services/ai';

interface AIFeedbackProps {
  emotion: string;
  intensity: number;
  context?: string;
  onFeedbackGenerated?: (feedback: AIFeedbackResponse) => void;
  className?: string;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({
  emotion,
  intensity,
  context,
  onFeedbackGenerated,
  className = '',
}) => {
  const [feedback, setFeedback] = useState<AIFeedbackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.generateFeedback({
        emotion,
        intensity,
        context,
      });

      setFeedback(response);
      onFeedbackGenerated?.(response);
    } catch (err) {
      setError('Unable to generate AI feedback at this time.');
      console.error('AI feedback error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [emotion, intensity, context, onFeedbackGenerated]);

  useEffect(() => {
    if (emotion && intensity > 0) {
      generateFeedback();
    }
  }, [emotion, intensity, context, generateFeedback]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <LoadingSpinner size="md" />
            <div className="mb-4"></div>
            <p className="text-gray-600">Generating personalized insights...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className}`}>
        <div className="text-center py-6">
          <div className="text-2xl mb-2">🤖</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={generateFeedback} size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!feedback) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lumen-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lumen-primary text-lg">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-lumen-dark">
                  AI Insights
                </h3>
                <p className="text-sm text-gray-600">
                  Personalized for your emotional state
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMoodColor(feedback.mood)}`}>
                {feedback.mood.charAt(0).toUpperCase() + feedback.mood.slice(1)}
              </div>
              <div className={`text-xs mt-1 ${getConfidenceColor(feedback.confidence)}`}>
                {Math.round(feedback.confidence * 100)}% confidence
              </div>
            </div>
          </div>

          {/* Main Insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-lumen-primary/5 to-lumen-secondary/5 rounded-lg p-4 border border-lumen-primary/20">
              <p className="text-lumen-dark leading-relaxed">
                "{feedback.insight}"
              </p>
            </div>
          </motion.div>

          {/* Advice Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h4 className="font-semibold text-lumen-dark mb-3 flex items-center">
              <span className="text-lumen-primary mr-2">💡</span>
              Suggestions for You
            </h4>
            <div className="space-y-2">
              {feedback.advice.map((advice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-lumen-primary/30 transition-colors"
                >
                  <span className="text-lumen-primary text-sm mt-0.5">•</span>
                  <p className="text-gray-700 text-sm flex-1">{advice}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Activities Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="font-semibold text-lumen-dark mb-3 flex items-center">
              <span className="text-lumen-primary mr-2">🎯</span>
              Try These Activities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feedback.activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-3 bg-gradient-to-r from-lumen-primary/10 to-lumen-secondary/10 rounded-lg border border-lumen-primary/20 hover:border-lumen-primary/40 transition-colors cursor-pointer"
                >
                  <p className="text-sm text-lumen-dark font-medium">{activity}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-4 border-t border-gray-100"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={generateFeedback}
              className="w-full"
            >
              <span className="mr-2">🔄</span>
              Get New Insights
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIFeedback; 