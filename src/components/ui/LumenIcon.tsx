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
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full blur-md opacity-30"
           style={{
             background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(139, 92, 246, 0.4) 70%, transparent 100%)'
           }} />
      
      {/* Main circular orb */}
      <div 
        className="relative w-full h-full rounded-full shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #8B5CF6 100%)'
        }}
      >
        {/* Inner highlight */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60 blur-[1px]" />
        
        {/* Subtle inner glow */}
        <div className="absolute inset-1 rounded-full opacity-20"
             style={{
               background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)'
             }} />
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          duration: 1.2, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          scale: 1.05,
          rotate: 5,
          transition: { duration: 0.3 }
        }}
      >
        <IconContent />
      </motion.div>
    );
  }

  return <IconContent />;
};

export default LumenIcon; 