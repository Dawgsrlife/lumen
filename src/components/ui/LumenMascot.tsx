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
      '/': "Hey there! I'm Foxie, your clever companion. Ready to brighten your mind?",
      '/about': "Learning about Lumen? Smart choice! I'm here to guide you through it all.",
      '/features': "Ooh, exploring features? I love showing off what we can do together!",
      '/contact': "Want to meet the team? They're as awesome as you'd expect!"
    };
    return greetings[page as keyof typeof greetings] || "Hi! I'm Foxie, your friendly Lumen guide!";
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
        {/* Foxie the Fox */}
        <animated.div 
          style={bodySpring}
          className="relative w-24 h-24 cursor-pointer group"
          onClick={() => {
            setShowGreeting(true);
            setIsWaving(true);
            setTimeout(() => setIsWaving(false), 2000);
            setTimeout(() => setShowGreeting(false), 3000);
          }}
        >
          {/* Soft ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Fox Head */}
          <div className="relative w-18 h-16 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
            {/* Head shine */}
            <div className="absolute top-2 left-3 w-3 h-2 bg-white/50 rounded-full blur-sm"></div>
            
            {/* Pointed Fox Ears */}
            <div className="absolute -top-2 left-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-600 transform -rotate-12"></div>
            <div className="absolute -top-2 right-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-600 transform rotate-12"></div>
            
            {/* Inner ear pink */}
            <div className="absolute -top-1 left-4 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-pink-300 transform -rotate-12"></div>
            <div className="absolute -top-1 right-4 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-pink-300 transform rotate-12"></div>
            
            {/* Clever Eyes */}
            <div className="absolute top-4 left-3 flex space-x-3">
              <div 
                className="bg-gray-800 rounded-full transition-all duration-300 relative"
                style={getEyeStyle(eyeExpression)}
              >
                {/* Eye shine */}
                <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full opacity-80"></div>
              </div>
              <div 
                className="bg-gray-800 rounded-full transition-all duration-300 relative"
                style={getEyeStyle(eyeExpression)}
              >
                {/* Eye shine */}
                <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full opacity-80"></div>
              </div>
            </div>
            
            {/* Fox Snout */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full"></div>
            
            {/* Black nose */}
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"></div>
            
            {/* Mouth */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-2 border-b-2 border-gray-800 rounded-full"></div>
            
            {/* White chest marking */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-white/80 rounded-full"></div>
          </div>
          
          {/* Fox Body */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-14 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-md">
            {/* Body highlight */}
            <div className="absolute top-1 left-2 w-2 h-2 bg-white/40 rounded-full blur-sm"></div>
          </div>
          
          {/* Bushy Fox Tail (wagging) */}
          <animated.div 
            style={tailSpring}
            className="absolute -right-2 top-8 w-4 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full origin-bottom shadow-md"
          >
            {/* Tail tip (white) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-white rounded-full"></div>
          </animated.div>
          
          {/* Fox Paw (waving) */}
          <animated.div 
            style={waveSpring}
            className="absolute -left-1 top-14 w-3 h-4 bg-orange-400 rounded-full origin-bottom"
          ></animated.div>
          
          {/* Other front paw */}
          <div className="absolute left-2 top-16 w-2 h-3 bg-orange-400 rounded-full"></div>
          
          {/* Back paws */}
          <div className="absolute right-2 top-16 w-2 h-3 bg-orange-400 rounded-full"></div>
          <div className="absolute right-4 top-16 w-2 h-3 bg-orange-400 rounded-full"></div>
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
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-orange-300 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 140, 0, 0.1) 100%)'
              }}
            >
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {greetingText}
              </p>
              
              {/* Speech bubble tail */}
              <div 
                className="absolute -bottom-2 left-10 w-4 h-4 bg-white/95 transform rotate-45 border-r border-b border-orange-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LumenMascot;