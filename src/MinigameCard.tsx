import React from 'react';
import { motion } from 'framer-motion';

interface MinigameCardProps {
  title: string;
  description: string;
  emotion: string;
  color: string;
  icon: string;
  onClick?: () => void;
  className?: string;
}

const MinigameCard: React.FC<MinigameCardProps> = ({
  title,
  description,
  emotion,
  color,
  icon,
  onClick,
  className = ''
}) => {
  return (
    <motion.div
      className={`
        relative group cursor-pointer ${className}
        bg-white/80 backdrop-blur-sm rounded-2xl p-6
        border border-white/20 shadow-lg hover:shadow-xl
        transition-all duration-300
      `}
      whileHover={{ 
        scale: 1.02,
        y: -5
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 rounded-2xl`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-4">
          <div className={`text-4xl ${color.includes('blue') ? 'text-blue-500' : 'text-purple-500'}`}>
            {icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>
        
        {/* Emotion tag */}
        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
          {emotion}
        </div>
      </div>
      
      {/* Hover glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 rounded-2xl`}
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default MinigameCard; 