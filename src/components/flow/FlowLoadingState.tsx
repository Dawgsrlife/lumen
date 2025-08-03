import React from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../ui';

type LoadingStage = 'initializing' | 'checking-progress' | 'loading-game' | 'processing' | 'checking-daily-status';

interface FlowLoadingStateProps {
  stage: LoadingStage;
}

const FlowLoadingState: React.FC<FlowLoadingStateProps> = ({ stage }) => {
  const messages = {
    'initializing': 'Setting up your experience...',
    'checking-progress': 'Checking your progress...',
    'loading-game': 'Preparing your personalized activity...',
    'processing': 'Processing your response...',
    'checking-daily-status': 'Checking your daily status...'
  };

  const descriptions = {
    'initializing': 'We\'re getting everything ready for you',
    'checking-progress': 'Checking if you\'ve already logged today',
    'loading-game': 'Loading your personalized therapeutic activity',
    'processing': 'Saving your reflection and insights',
    'checking-daily-status': 'Checking if you\'ve already logged emotions today'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        className="text-center max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <LoadingSpinner size="lg" />
        </div>
        
        <motion.h3
          className="text-xl font-semibold text-gray-900 mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {messages[stage]}
        </motion.h3>
        
        <motion.p
          className="text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {descriptions[stage]}
        </motion.p>
        
        {/* Optional: Add progress dots for longer loading states */}
        {stage === 'loading-game' && (
          <motion.div
            className="flex justify-center space-x-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FlowLoadingState; 