import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface AnimatedBackgroundProps {
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  const location = useLocation();
  
  // Determine background style based on current page
  const getBackgroundStyle = () => {
    if (location.pathname === '/dashboard') {
      return {
        particles: 15,
        colors: ['#fbbf24', '#8b5cf6'],
        animation: 'float',
        opacity: 0.4
      };
    } else if (location.pathname === '/analytics') {
      return {
        particles: 20,
        colors: ['#e5e7eb', '#d1d5db'],
        animation: 'drift',
        opacity: 0.3
      };
    } else if (location.pathname === '/chat') {
      return {
        particles: 12,
        colors: ['#fef3c7', '#f3e8ff'],
        animation: 'bounce',
        opacity: 0.5
      };
    } else if (location.pathname === '/profile') {
      return {
        particles: 18,
        colors: ['#f3f4f6', '#e5e7eb'],
        animation: 'pulse',
        opacity: 0.25
      };
    } else {
      return {
        particles: 10,
        colors: ['#f3f4f6', '#e5e7eb'],
        animation: 'pulse',
        opacity: 0.3
      };
    }
  };

  const style = getBackgroundStyle();

  const getAnimationVariants = (animationType: string) => {
    switch (animationType) {
      case 'float':
        return {
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4]
        };
      case 'drift':
        return {
          y: [0, -15, 0],
          x: [0, -8, 0],
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3]
        };
      case 'bounce':
        return {
          y: [0, -25, 0],
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        };
      case 'pulse':
        return {
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.5, 0.25]
        };
      default:
        return {
          y: [0, -10, 0],
          opacity: [0.3, 0.5, 0.3]
        };
    }
  };

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <div className="absolute inset-0">
        {[...Array(style.particles)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: style.colors[i % style.colors.length],
              opacity: style.opacity
            }}
            animate={getAnimationVariants(style.animation)}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}
        
        {/* Subtle connecting lines for Dashboard */}
        {location.pathname === '/dashboard' && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 100 + 50}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: 0.2
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </>
        )}

        {/* Gentle waves for Analytics */}
        {location.pathname === '/analytics' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 200 + 100}px`,
                  opacity: 0.1
                }}
                animate={{
                  x: [0, 50, 0],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3
                }}
              />
            ))}
          </>
        )}

        {/* Soft circles for Chat */}
        {location.pathname === '/chat' && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`circle-${i}`}
                className="absolute rounded-full border border-yellow-200"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 40 + 20}px`,
                  height: `${Math.random() * 40 + 20}px`,
                  opacity: 0.1
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </>
        )}

        {/* Subtle dots for Profile */}
        {location.pathname === '/profile' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className="absolute w-1 h-1 bg-gray-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.15
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.15, 0.3, 0.15]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};