import React from 'react';
import { motion } from 'framer-motion';
import { LumenIcon } from './ui';

interface WelcomeScreenProps {
  username: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username }) => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="text-center">
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        >
          <LumenIcon size={80} className="text-blue-600" />
        </motion.div>
        
        <motion.h1
          className="text-4xl font-light text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Welcome
        </motion.h1>
        
        <motion.h2
          className="text-4xl font-light text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {username}!
        </motion.h2>
        
        <motion.div
          className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        />
      </div>
    </motion.div>
  );
};

export default WelcomeScreen; 