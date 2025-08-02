import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { motion, AnimatePresence } from 'framer-motion';

interface LumenMascotProps {
  currentPage: string;
}

const LumenMascot: React.FC<LumenMascotProps> = ({ currentPage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState('');

  // Different greetings for different pages
  const getGreeting = (page: string) => {
    const greetings = {
      '/': "Welcome! I'm here to brighten your journey! ✨",
      '/about': "Learning about us? You're in good hands! 💙",
      '/features': "Excited to explore? I can't wait to show you! 🎮",
      '/contact': "Want to say hello? Our team would love to hear from you! 👋"
    };
    return greetings[page as keyof typeof greetings] || "Hi there! I'm so glad you're here! 😊";
  };

  // Spring animation for floating movement
  const mascotSpring = useSpring({
    transform: `translate(${position.x}px, ${position.y + Math.sin(Date.now() * 0.002) * 3}px)`,
    config: { tension: 200, friction: 50 }
  });

  // Pulsing glow effect
  const glowSpring = useSpring({
    from: { scale: 1, opacity: 0.6 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.1, opacity: 0.8 });
        await next({ scale: 1, opacity: 0.6 });
      }
    },
    config: { duration: 2000 }
  });

  // Position mascot on screen
  useEffect(() => {
    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Position in bottom right, but not too close to edges
      setPosition({
        x: viewportWidth - 120,
        y: viewportHeight - 150
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // Show mascot after a brief delay
    const showTimer = setTimeout(() => setIsVisible(true), 1000);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(showTimer);
    };
  }, []);

  // Show greeting when page changes
  useEffect(() => {
    if (isVisible) {
      setGreetingText(getGreeting(currentPage));
      setShowGreeting(true);
      
      // Hide greeting after 4 seconds
      const timer = setTimeout(() => setShowGreeting(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, isVisible]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="fixed z-50 pointer-events-none">
      {/* Mascot Character */}
      <animated.div
        style={mascotSpring}
        className="relative"
      >
        {/* Glow Effect */}
        <animated.div
          style={glowSpring}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%)',
            filter: 'blur(8px)',
            width: '80px',
            height: '80px',
            transform: 'translate(-10px, -10px)'
          }}
        />
        
        {/* Main Mascot Body */}
        <div 
          className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
          style={{
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #8B5CF6 100%)',
            boxShadow: '0 8px 32px rgba(251, 191, 36, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
          }}
          onClick={() => {
            setShowGreeting(true);
            setTimeout(() => setShowGreeting(false), 3000);
          }}
        >
          {/* Eyes */}
          <div className="flex space-x-2 mb-1">
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
          </div>
          
          {/* Smile */}
          <div 
            className="absolute bottom-3 w-6 h-3 border-b-2 border-gray-800 rounded-full"
            style={{ borderBottomColor: '#1F2937' }}
          />
          
          {/* Sparkles around mascot */}
          <div className="absolute -top-2 -right-2 text-yellow-300 text-xs animate-ping">✨</div>
          <div className="absolute -bottom-1 -left-2 text-purple-300 text-xs animate-ping" style={{ animationDelay: '1s' }}>⭐</div>
        </div>
      </animated.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute -top-20 -left-40 max-w-xs"
          >
            <div 
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(251, 191, 36, 0.1) 100%)'
              }}
            >
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {greetingText}
              </p>
              
              {/* Speech bubble tail */}
              <div 
                className="absolute -bottom-2 left-8 w-4 h-4 bg-white/95 transform rotate-45 border-r border-b border-gray-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LumenMascot;