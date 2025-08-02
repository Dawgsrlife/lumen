import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { sample } from 'lodash';
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
  const [encouragingMessage, setEncouragingMessage] = useState('');

  // Pool of encouraging messages (Duolingo style!)
  const encouragingMessages = [
    "You're doing amazing! Every step counts towards better mental health! 🌟",
    "I believe in you! Your journey to wellness is inspiring! 💪",
    "Small steps lead to big changes. Keep going, you've got this! 🌱",
    "Your commitment to self-care is beautiful. I'm proud of you! 🦋",
    "Remember: progress, not perfection. You're exactly where you need to be! ✨"
  ];

  // Different greetings for different pages
  const getGreeting = (page: string) => {
    const greetings = {
      '/': "Hey there! I'm Foxie, your clever companion. Ready to brighten your mind?",
      '/about': "Learning about Lumen? Smart choice! I'm here to guide you through it all.",
      '/features': "Ooh, exploring features? I love showing off what we can do together!",
      '/contact': "Want to meet the team? They're as awesome as you'd expect!",
      '/sign-in': "Welcome back! I'm so excited to see you again. Let's continue your journey!",
      '/sign-up': "Hey there, new friend! I'm Foxie, and I can't wait to be your wellness companion!"
    };
    return greetings[page as keyof typeof greetings] || "Hi! I'm Foxie, your friendly Lumen guide!";
  };

  // Spring animation for floating movement with bounce
  const mascotSpring = useSpring({
    transform: `translate(${position.x}px, ${position.y + Math.sin(Date.now() * 0.003) * 5}px)`,
    config: { tension: 180, friction: 40 }
  });

  // Dynamic waving animation with curves and rhythm changes
  const waveSpring = useSpring({
    from: { transform: 'rotate(10deg)' },
    to: async (next) => {
      if (isWaving) {
        // Sudden energetic wave sequence
        await next({ transform: 'rotate(-45deg)', config: { tension: 400, friction: 10 } });
        await next({ transform: 'rotate(25deg)', config: { tension: 200, friction: 15 } });
        await next({ transform: 'rotate(-35deg)', config: { tension: 350, friction: 12 } });
        await next({ transform: 'rotate(15deg)', config: { tension: 150, friction: 20 } });
        // Slow settle
        await next({ transform: 'rotate(-15deg)', config: { tension: 100, friction: 25 } });
        await next({ transform: 'rotate(5deg)', config: { tension: 80, friction: 30 } });
        // Rest position
        await next({ transform: 'rotate(10deg)', config: { tension: 120, friction: 35 } });
      } else {
        await next({ transform: 'rotate(10deg)' });
      }
    },
    config: { tension: 200, friction: 20 }
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

  // Random eye expressions including winking!
  useEffect(() => {
    const expressions = ['happy', 'excited', 'cheerful', 'winking', 'smiling'];
    const interval = setInterval(() => {
      setEyeExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    }, 4000); // Slightly longer for better effect
    
    return () => clearInterval(interval);
  }, []);

  // Duolingo-style encouraging messages that appear randomly
  useEffect(() => {
    if (!isVisible) return;
    
    const encouragingTimer = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance each interval
        const randomMessage = sample(encouragingMessages) || encouragingMessages[0];
        setEncouragingMessage(randomMessage);
        setTimeout(() => setEncouragingMessage(''), 5000); // Hide after 5 seconds
      }
    }, Math.random() * 15000 + 10000); // Between 10-25 seconds
    
    return () => clearInterval(encouragingTimer);
  }, [isVisible]);

  // Random encouraging messages (Duolingo style!)
  useEffect(() => {
    if (isVisible) {
      // Set initial encouraging message
      setEncouragingMessage(sample(encouragingMessages) || encouragingMessages[0]);
      
      // Show encouraging message after initial greeting
      const encouragingTimeout = setTimeout(() => {
        setGreetingText(sample(encouragingMessages) || encouragingMessages[0]);
        setShowGreeting(true);
        setIsWaving(true);
        
        setTimeout(() => setIsWaving(false), 2000);
        setTimeout(() => setShowGreeting(false), 5000);
      }, 15000); // Show after 15 seconds
      
      // Then show random encouraging messages every 30 seconds
      const encouragingInterval = setInterval(() => {
        const randomMessage = sample(encouragingMessages) || encouragingMessages[0];
        setEncouragingMessage(randomMessage);
        setGreetingText(randomMessage);
        setShowGreeting(true);
        setIsWaving(true);
        
        setTimeout(() => setIsWaving(false), 2000);
        setTimeout(() => setShowGreeting(false), 4000);
      }, 30000);
      
      return () => {
        clearTimeout(encouragingTimeout);
        clearInterval(encouragingInterval);
      };
    }
  }, [isVisible, encouragingMessages]);

  // Don't render if not visible
  if (!isVisible) return null;

  const getEyeStyle = (expression: string, isLeftEye: boolean = true) => {
    switch (expression) {
      case 'excited':
        return { width: '10px', height: '12px', transform: 'scaleY(1.2)' };
      case 'cheerful':
        return { width: '8px', height: '11px', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' };
      case 'winking':
        // Left eye winks, right eye stays open
        return isLeftEye 
          ? { width: '10px', height: '3px', borderRadius: '50%', transform: 'scaleY(0.3)' }
          : { width: '10px', height: '10px' };
      case 'smiling':
        return { width: '8px', height: '8px', borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%' };
      default: // happy
        return { width: '10px', height: '10px' };
    }
  };

  return (
    <div className="fixed z-50 pointer-events-auto">
      {/* Mascot Character */}
      <animated.div
        style={mascotSpring}
        className="relative"
      >
        {/* Foxie the Fox - Professional & Adorable */}
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
          {/* Soft ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300/15 to-orange-400/15 rounded-full blur-lg"></div>
          
          {/* ACTUALLY CUTE Fox - Big head, big eyes, kawaii style! */}
          <div className="relative w-20 h-20 group-hover:scale-105 transition-transform duration-300">
            
            {/* Fox Head - BIGGER and cuter proportions (anime style) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-full shadow-lg">
              {/* Head highlight - more prominent */}
              <div className="absolute top-3 left-4 w-4 h-3 bg-white/80 rounded-full blur-[1px]"></div>
              
              {/* Cute Fox Ears - Perfect proportions */}
              <div className="absolute -top-3 left-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-orange-400 transform -rotate-12"></div>
              <div className="absolute -top-3 right-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-orange-400 transform rotate-12"></div>
              
              {/* Ear insides - pink and adorable */}
              <div className="absolute -top-2 left-4 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-pink-300 transform -rotate-12"></div>
              <div className="absolute -top-2 right-4 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-pink-300 transform rotate-12"></div>
              
              {/* BIG ADORABLE EYES - The key to cuteness! Now with winking! */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {/* Left Eye */}
                <div 
                  className="bg-gray-900 rounded-full relative shadow-lg transition-all duration-300"
                  style={getEyeStyle(eyeExpression, true)}
                >
                  {/* Multiple highlights for sparkly eyes - hide when winking */}
                  {eyeExpression !== 'winking' && (
                    <>
                      <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full opacity-95"></div>
                      <div className="absolute top-0.5 left-1 w-1 h-1 bg-white rounded-full opacity-80"></div>
                      <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                    </>
                  )}
                </div>
                {/* Right Eye */}
                <div 
                  className="bg-gray-900 rounded-full relative shadow-lg transition-all duration-300"
                  style={getEyeStyle(eyeExpression, false)}
                >
                  {/* Multiple highlights for sparkly eyes */}
                  <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full opacity-95"></div>
                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-white rounded-full opacity-80"></div>
                  <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                </div>
              </div>
              
              {/* Cute little snout */}
              <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-b from-orange-100 to-orange-200 rounded-full shadow-sm"></div>
              
              {/* Perfect little nose */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1.5 h-1 bg-gray-800 rounded-full"></div>
              
              {/* DYNAMIC HAPPY SMILE - Changes with expression! */}
              <div className={`absolute top-11.5 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                eyeExpression === 'excited' ? 'w-7 h-4' : 
                eyeExpression === 'winking' ? 'w-5 h-2' : 
                'w-6 h-3'
              }`}>
                <div className={`border-b-2 border-gray-800 rounded-full absolute left-0 ${
                  eyeExpression === 'excited' ? 'w-3.5 h-2' : 
                  eyeExpression === 'winking' ? 'w-2.5 h-1' : 
                  'w-3 h-1.5'
                }`}></div>
                <div className={`border-b-2 border-gray-800 rounded-full absolute right-0 ${
                  eyeExpression === 'excited' ? 'w-3.5 h-2' : 
                  eyeExpression === 'winking' ? 'w-2.5 h-1' : 
                  'w-3 h-1.5'
                }`}></div>
              </div>
              
              {/* Little tongue for extra cuteness - shows more when excited */}
              <div className={`absolute top-12.5 left-1/2 transform -translate-x-1/2 bg-pink-400 rounded-full transition-all duration-300 ${
                eyeExpression === 'excited' ? 'w-2 h-1.5' : 'w-1.5 h-1'
              }`}></div>
              
              {/* PROMINENT cheek blush - kawaii style */}
              <div className="absolute top-7 left-0.5 w-3 h-2 bg-pink-300/60 rounded-full blur-[1px]"></div>
              <div className="absolute top-7 right-0.5 w-3 h-2 bg-pink-300/60 rounded-full blur-[1px]"></div>
              
              {/* White chest marking */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-4 bg-white/95 rounded-full"></div>
            </div>
            
            {/* Fox Body - Lower positioned and better proportioned */}
            <div className="absolute top-11 left-1/2 transform -translate-x-1/2 w-12 h-9 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full shadow-md">
              <div className="absolute top-1.5 left-2 w-2 h-2 bg-white/60 rounded-full blur-[0.5px]"></div>
            </div>
            
            {/* Fluffy tail - bigger and fluffier */}
            <animated.div 
              style={tailSpring}
              className="absolute -right-2 top-7 w-4 h-7 bg-gradient-to-b from-orange-300 to-orange-500 rounded-full origin-bottom shadow-md"
            >
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-white/95 rounded-full"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full blur-[0.5px]"></div>
            </animated.div>
            
            {/* Waving paw - properly shaped and positioned */}
            <animated.div 
              style={waveSpring}
              className="absolute -left-1 top-13 w-2.5 h-4 bg-orange-200 rounded-full origin-bottom shadow-md border border-orange-300"
            ></animated.div>
            
            {/* Other paws - better positioned for lower body */}
            <div className="absolute left-2 top-16 w-2 h-3 bg-orange-200 rounded-full shadow-sm border border-orange-300"></div>
            <div className="absolute right-2 top-16 w-2 h-3 bg-orange-200 rounded-full shadow-sm border border-orange-300"></div>
            <div className="absolute right-4 top-16 w-2 h-3 bg-orange-200 rounded-full shadow-sm border border-orange-300"></div>
          </div>
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

      {/* Duolingo-style Encouraging Text Box - Separate from speech bubble */}
      <AnimatePresence>
        {encouragingMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 100 }}
            className="absolute -top-24 -left-60 max-w-xs z-50"
          >
            <div 
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border-2 border-yellow-300 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.95) 0%, rgba(251, 191, 36, 0.2) 100%)'
              }}
            >
              {/* Sparkle icon */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs">✨</span>
              </div>
              
              <p className="text-sm text-gray-800 font-semibold leading-relaxed pr-4">
                {encouragingMessage}
              </p>
              
              {/* Encouraging box tail */}
              <div 
                className="absolute -bottom-2 right-8 w-4 h-4 bg-yellow-200 transform rotate-45 border-r-2 border-b-2 border-yellow-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LumenMascot;