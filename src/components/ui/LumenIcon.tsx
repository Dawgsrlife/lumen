import React from 'react';
import { motion } from 'framer-motion';

interface LumenIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const LumenIcon: React.FC<LumenIconProps> = ({ 
  size = 'md', 
  className = '', 
  animated = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const IconContent = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Clean minimalist design - representing "light" */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Simple light bulb outline */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-gray-800"
        >
          {/* Bulb shape */}
          <path 
            d="M9 21h6m-6 0v-1a2 2 0 002-2h2a2 2 0 002 2v1m-6 0H7m8 0h2M12 3a6 6 0 00-6 6c0 1.887.71 3.61 1.875 4.919A2.992 2.992 0 009 16h6a2.992 2.992 0 001.125-2.081A7.993 7.993 0 0018 9a6 6 0 00-6-6z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="rgba(251, 191, 36, 0.1)"
          />
          
          {/* Light rays */}
          <path 
            d="M12 1v2m0 0L10.5 4.5M12 3l1.5 1.5M3.5 10.5L1 12m2.5-1.5L5 9M20.5 10.5L23 12m-2.5-1.5L19 9" 
            stroke="rgba(251, 191, 36, 0.6)" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
        
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <IconContent />
      </motion.div>
    );
  }

  return <IconContent />;
};

export default LumenIcon; 