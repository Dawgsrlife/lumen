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
      {/* Outer glow ring */}
      <div className="absolute inset-0 bg-gradient-to-r from-lumen-primary/20 to-lumen-secondary/20 rounded-full blur-sm"></div>
      
      {/* Main icon container */}
      <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-full shadow-lg border border-gray-100 flex items-center justify-center">
        {/* Inner light rays */}
        <div className="absolute inset-2 bg-gradient-to-br from-lumen-primary/10 via-transparent to-lumen-secondary/10 rounded-full"></div>
        
        {/* Central light source */}
        <div className="relative z-10">
          {/* Light bulb base */}
          <div className="w-3/5 h-3/5 bg-gradient-to-br from-lumen-primary to-lumen-secondary rounded-full relative">
            {/* Light bulb glow */}
            <div className="absolute inset-1 bg-white/80 rounded-full"></div>
            
            {/* Light rays emanating */}
            <div className="absolute -inset-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-4 bg-gradient-to-t from-lumen-primary/60 to-transparent"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-8px)`,
                  }}
                />
              ))}
            </div>
            
            {/* Filament */}
            <div className="absolute inset-2 flex items-center justify-center">
              <div className="w-1 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          
          {/* Base stand */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-400 rounded-full"></div>
        </div>
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