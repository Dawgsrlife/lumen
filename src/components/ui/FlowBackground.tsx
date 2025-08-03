import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

export type BackgroundTheme = 'welcome' | 'emotions' | 'survey' | 'game' | 'insights' | 'none';

interface FlowBackgroundProps {
  theme: BackgroundTheme;
  className?: string;
}

// Welcome Background - Magical Sparkles & Wonder
const WelcomeBackground = () => {
  return (
    <>
      {/* Floating sparkles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-br from-yellow-300/60 to-orange-400/60 rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            rotate: 0
          }}
          animate={{
            y: [null, -30, 10, -20, 0],
            x: [null, Math.random() * 40 - 20],
            scale: [0, 1, 0.8, 1.2, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0.8, 1, 0]
          }}
          transition={{
            duration: Math.random() * 6 + 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4
          }}
        />
      ))}
      
      {/* Gentle light beams */}
      <motion.div
        className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-200/20 to-transparent"
        animate={{
          opacity: [0, 0.6, 0.3, 0.8, 0],
          scaleY: [0.8, 1, 0.9, 1, 0.8]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Wonder particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`wonder-${i}`}
          className="absolute w-1 h-1 bg-blue-300/40 rounded-full"
          animate={{
            y: [window.innerHeight + 20, -20],
            x: [null, Math.sin(i) * 50],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1.2, 0.5]
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 8
          }}
        />
      ))}
    </>
  );
};

// Emotions Background - Colorful Particles
const EmotionsBackground = () => {
  const emotionColors = [
    'from-pink-300/40 to-rose-400/40',     // Happy
    'from-blue-300/40 to-indigo-400/40',   // Sad
    'from-purple-300/40 to-violet-400/40', // Lonely
    'from-yellow-300/40 to-amber-400/40',  // Anxious
    'from-orange-300/40 to-red-400/40',    // Frustrated
    'from-teal-300/40 to-cyan-400/40',     // Stress
    'from-gray-300/40 to-slate-400/40',    // Lethargy
    'from-indigo-300/40 to-purple-500/40', // Fear
    'from-rose-300/40 to-pink-500/40'      // Grief
  ];

  return (
    <>
      {/* Color-shifting particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`emotion-particle-${i}`}
          className={`absolute w-3 h-3 rounded-full bg-gradient-to-br ${emotionColors[i % emotionColors.length]}`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{
            x: [null, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight],
            scale: [0.5, 1.5, 1, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.5, 0.9, 0.3]
          }}
          transition={{
            duration: Math.random() * 12 + 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
      
      {/* Emotion waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`emotion-wave-${i}`}
          className="absolute inset-0 border border-purple-200/10 rounded-full"
          style={{
            width: `${(i + 1) * 300}px`,
            height: `${(i + 1) * 300}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2
          }}
        />
      ))}
    </>
  );
};

// Survey Background - Writing & Reflection
const SurveyBackground = () => {
  return (
    <>
      {/* Gentle floating particles - journal/writing theme */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`journal-particle-${i}`}
          className="absolute w-1 h-1 bg-blue-200/40 rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [null, -20, 0, -15, 0],
            x: [null, Math.random() * 50 - 25, 0],
            opacity: [0.3, 0.8, 0.3, 0.6, 0.3],
            scale: [null, 1.2, 0.8, 1.1, 0.9]
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4
          }}
        />
      ))}
      
      {/* Subtle writing/pen strokes animation */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-200/20 to-transparent"
        animate={{
          scaleX: [0, 1, 0],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 6,
          ease: "easeInOut"
        }}
      />
      
      {/* Gentle page-like elements */}
      <motion.div
        className="absolute bottom-1/3 left-1/5 w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-200/15 to-transparent"
        animate={{
          scaleX: [0, 1, 0.7, 1, 0],
          opacity: [0, 0.4, 0.6, 0.3, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Floating thought bubbles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`thought-${i}`}
          className="absolute w-4 h-4 border border-gray-200/30 rounded-full"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + Math.random() * 40}%`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.4, 0],
            y: [0, -50, -100]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 2
          }}
        />
      ))}
    </>
  );
};

// Insights Background - Data Visualization Elements
const InsightsBackground = () => {
  return (
    <>
      {/* Subtle data points */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`data-point-${i}`}
          className="absolute w-0.5 h-0.5 bg-green-300/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4
          }}
        />
      ))}
      
      {/* Connecting lines - like a subtle network */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`connection-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-blue-200/20 to-transparent"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80 + 10}%`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scaleX: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 6
          }}
        />
      ))}
      
      {/* Gentle progress indicators */}
      <motion.div
        className="absolute bottom-20 right-20 w-16 h-1 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full"
        animate={{
          scaleX: [0, 1, 0.8, 1],
          opacity: [0.3, 0.8, 0.5, 0.8]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
};

// Main FlowBackground Component with Performance Optimization
const FlowBackground: React.FC<FlowBackgroundProps> = React.memo(({ theme, className = '' }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderBackground = () => {
    // Return null for reduced motion or game theme
    if (prefersReducedMotion || theme === 'game' || theme === 'none') {
      return null;
    }

    switch (theme) {
      case 'welcome':
        return <WelcomeBackground />;
      case 'emotions':
        return <EmotionsBackground />;
      case 'survey':
        return <SurveyBackground />;
      case 'insights':
        return <InsightsBackground />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {renderBackground()}
    </div>
  );
});

FlowBackground.displayName = 'FlowBackground';

export default FlowBackground; 