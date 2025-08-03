import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LumenIcon } from './ui';
import { useAppContext } from '../context/AppContext';
import { useUserFlowState } from '../hooks/useUserFlowState';

interface WelcomeScreenProps {
  username?: string;
  onComplete?: () => void;
}

// WelcomeScreen now uses the centralized FlowBackground system

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username, onComplete }) => {
  const { state } = useAppContext();
  const { state: userFlowState } = useUserFlowState();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
      {/* Content Container - True Center */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Icon Animation */}
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.3, 
            duration: 1.2, 
            type: "spring",
            bounce: 0.4
          }}
        >
          <LumenIcon size="xl" className="text-blue-600 drop-shadow-lg" />
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-light text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {userFlowState.isFirstTime ? 'Welcome to Lumen,' : 'Welcome back,'}
          </motion.h1>
          
          <motion.h2
            className="text-5xl md:text-6xl font-light text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <div className="mb-2"></div>
            {username}!
          </motion.h2>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          className="mt-12 mb-8 w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-lg"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 128, opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2, ease: "easeOut" }}
        />

        {/* Subtle Subtitle */}
        <motion.p
          className="mb-8 text-lg text-gray-600 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {userFlowState.isFirstTime 
            ? 'Let\'s start by understanding how you\'re feeling today.'
            : 'Ready to check in with your emotions?'
          }
        </motion.p>
      </div>

      {/* Bottom Gradient Fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default WelcomeScreen; 