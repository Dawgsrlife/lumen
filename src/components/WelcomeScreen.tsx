import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LumenIcon } from './ui';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api';

interface WelcomeScreenProps {
  username: string;
}

// Animated Background Component for Welcome Screen
const WelcomeAnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, rgba(${120 + i * 15}, ${150 + i * 10}, ${255 - i * 20}, 0.3) 0%, rgba(${120 + i * 15}, ${150 + i * 10}, ${255 - i * 20}, 0.1) 70%, transparent 100%)`,
            left: `${20 + i * 10}%`,
            top: `${15 + i * 8}%`,
          }}
          initial={{
            scale: 0,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            scale: [0, 1.2, 0.8, 1],
            opacity: [0, 0.3, 0.2, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Gentle waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full h-full"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(147, 197, 253, 0.1) 50%, transparent 70%)`,
            top: `${i * 33}%`,
          }}
          initial={{
            x: '-100%',
            opacity: 0,
          }}
          animate={{
            x: '100%',
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
        />
      ))}

      {/* Subtle sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        }}
      />
    </div>
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username }) => {
  const navigate = useNavigate();
  const { state } = useAppContext();

  // Auto-transition after welcome animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('WelcomeScreen: Auto-transitioning to flow page');
      navigate('/flow');
    }, 3000); // 3 seconds for welcome animation

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <WelcomeAnimatedBackground />
      
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
          <LumenIcon size={100} className="text-blue-600 drop-shadow-lg" />
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
            Welcome
          </motion.h1>
          
          <motion.h2
            className="text-5xl md:text-6xl font-light text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
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
          Let's begin your mindful journey today
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