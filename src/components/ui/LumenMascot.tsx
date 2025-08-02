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
  const [isWaving, setIsWaving] = useState(false);
  const [eyeExpression, setEyeExpression] = useState('happy');

  // Different greetings for different pages
  const getGreeting = (page: string) => {
    const greetings = {
      '/': "Woof! Welcome! Let's light up your mind together! 🌟",
      '/about': "Tail wagging! Learning about us? You're amazing! 🐕💙",
      '/features': "So excited! Ready to explore all the cool stuff? 🎮✨",
      '/contact': "Hey there! Want to chat? We love meeting new friends! 👋🐾"
    };
    return greetings[page as keyof typeof greetings] || "Woof woof! I'm Lumie, your happy companion! 😊🐕";
  };

  // Spring animation for floating movement with bounce
  const mascotSpring = useSpring({
    transform: `translate(${position.x}px, ${position.y + Math.sin(Date.now() * 0.003) * 5}px)`,
    config: { tension: 180, friction: 40 }
  });

  // Waving animation
  const waveSpring = useSpring({
    transform: isWaving ? 'rotate(-20deg)' : 'rotate(10deg)',
    config: { tension: 300, friction: 20 }
  });

  // Body wiggle animation
  const bodySpring = useSpring({
    from: { transform: 'rotate(-1deg)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'rotate(1deg)' });
        await next({ transform: 'rotate(-1deg)' });
      }
    },
    config: { duration: 1500 }
  });

  // Tail wagging
  const tailSpring = useSpring({
    from: { transform: 'rotate(-30deg)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'rotate(30deg)' });
        await next({ transform: 'rotate(-30deg)' });
      }
    },
    config: { duration: 400 }
  });

  // Position mascot on screen
  useEffect(() => {
    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Position in bottom right, but not too close to edges
      setPosition({
        x: viewportWidth - 140,
        y: viewportHeight - 160
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
      setIsWaving(true);
      
      // Stop waving after 2 seconds, hide greeting after 4 seconds
      setTimeout(() => setIsWaving(false), 2000);
      const timer = setTimeout(() => setShowGreeting(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, isVisible]);

  // Random eye expressions
  useEffect(() => {
    const expressions = ['happy', 'excited', 'cheerful'];
    const interval = setInterval(() => {
      setEyeExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't render if not visible
  if (!isVisible) return null;

  const getEyeStyle = (expression: string) => {
    switch (expression) {
      case 'excited':
        return { width: '6px', height: '6px', transform: 'scaleY(1.2)' };
      case 'cheerful':
        return { width: '4px', height: '7px', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' };
      default:
        return { width: '5px', height: '5px' };
    }
  };

  return (
    <div className="fixed z-50 pointer-events-auto">
      {/* Mascot Character */}
      <animated.div
        style={mascotSpring}
        className="relative"
      >
        {/* Dog Body */}
        <animated.div 
          style={bodySpring}
          className="relative w-20 h-20 cursor-pointer group"
          onClick={() => {
            setShowGreeting(true);
            setIsWaving(true);
            setTimeout(() => setIsWaving(false), 2000);
            setTimeout(() => setShowGreeting(false), 3000);
          }}
        >
          {/* Body glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300/30 to-yellow-300/30 rounded-full blur-lg animate-pulse"></div>
          
          {/* Main body (round, like a corgi) */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
            {/* Body shine */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white/60 rounded-full blur-sm"></div>
            
            {/* Ears */}
            <div className="absolute -top-1 left-2 w-3 h-4 bg-orange-600 rounded-full transform -rotate-12"></div>
            <div className="absolute -top-1 right-2 w-3 h-4 bg-orange-600 rounded-full transform rotate-12"></div>
            
            {/* Eyes */}
            <div className="absolute top-4 left-3 flex space-x-2">
              <div 
                className="bg-gray-800 rounded-full transition-all duration-300"
                style={getEyeStyle(eyeExpression)}
              ></div>
              <div 
                className="bg-gray-800 rounded-full transition-all duration-300"
                style={getEyeStyle(eyeExpression)}
              ></div>
            </div>
            
            {/* Nose */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-800 rounded-full"></div>
            
            {/* Mouth */}
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-800 rounded-full"></div>
            
            {/* Tongue (when excited) */}
            {eyeExpression === 'excited' && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full"></div>
            )}
          </div>
          
          {/* Tail (wagging) */}
          <animated.div 
            style={tailSpring}
            className="absolute -right-1 top-3 w-3 h-6 bg-orange-400 rounded-full origin-bottom"
          ></animated.div>
          
          {/* Paw (waving) */}
          <animated.div 
            style={waveSpring}
            className="absolute -left-2 top-6 w-3 h-4 bg-orange-400 rounded-full origin-bottom"
          ></animated.div>
          
          {/* Other paw */}
          <div className="absolute -right-1 top-8 w-2 h-3 bg-orange-400 rounded-full"></div>
          
          {/* Excitement particles */}
          <div className="absolute -top-3 -right-3 text-yellow-400 text-sm animate-bounce">💫</div>
          <div className="absolute -bottom-2 -left-3 text-orange-400 text-xs animate-ping" style={{ animationDelay: '0.5s' }}>🐾</div>
          <div className="absolute -top-2 left-6 text-yellow-300 text-xs animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
        </animated.div>
      </animated.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute -top-24 -left-48 max-w-xs"
          >
            <div 
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-orange-200 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 165, 0, 0.1) 100%)'
              }}
            >
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {greetingText}
              </p>
              
              {/* Speech bubble tail */}
              <div 
                className="absolute -bottom-2 left-10 w-4 h-4 bg-white/95 transform rotate-45 border-r border-b border-orange-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LumenMascot;