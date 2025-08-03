import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { sample } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface LumenMascotProps {
  currentPage: string;
}

const LumenMascot: React.FC<LumenMascotProps> = ({ currentPage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState('');
  const [isWaving, setIsWaving] = useState(false);
  const [earTwitch, setEarTwitch] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeExpression, setEyeExpression] = useState('happy');
  const [encouragingMessage, setEncouragingMessage] = useState('');
  const [showEncouragingBox, setShowEncouragingBox] = useState(true); // Open by default
  const textboxRef = useRef<HTMLDivElement>(null);

  // Pool of encouraging messages (Duolingo style!)
  const encouragingMessages = [
    "You're doing amazing! Every step counts towards better mental health! 🌟",
    "I believe in you! Your journey to wellness is inspiring! 💪",
    "Small steps lead to big changes. So, keep going, because you've got this! 🌱",
    "Your commitment to self-care is beautiful. I'm proud of you! 🦋",
    "Remember: progress, not perfection. You're exactly where you need to be! ✨"
  ];

  // Welcoming messages for landing page
  const welcomingMessages = [
    "Welcome to Lumen! I'm Luna, your magical companion on this journey! ✨",
    "Ready to explore mindful gaming? Let's discover what we can do together! 🌟",
    "I'm so excited to be your guide! Every emotion is valid and every step matters! 💫",
    "Together we'll create a beautiful journey of self-discovery and growth! 🦋",
    "Your mental wellness journey starts here. I believe in you! 🌱"
  ];

  // Different greetings for different pages
  const getGreeting = (page: string) => {
    const greetings = {
      '/': "Hey there! I'm Luna, your magical companion. Ready to brighten your mind? ✨",
      '/about': "Learning about Lumen? Smart choice! I'm here to guide you through it all. 🌟",
      '/features': "Ooh, exploring features? I love showing off what we can do together! 💫",
      '/contact': "Want to meet the team? They're as awesome as you'd expect! 🌈",
      '/sign-in': "Welcome back! I'm so excited to see you again. Let's continue your journey! ✨",
    };
    return greetings[page as keyof typeof greetings] || "Hi! I'm Luna, your friendly Lumen guide! ✨";
  };

  // Get appropriate messages based on current page
  const getMessagesForPage = (page: string) => {
    // Welcoming messages for landing page
    if (page === '/') {
      return welcomingMessages;
    }
    // Encouraging messages for dashboard, analytics, and other app pages
    if (page === '/dashboard' || page === '/analytics' || page === '/flow') {
      return encouragingMessages;
    }
    // Default to encouraging messages
    return encouragingMessages;
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

  // Random eye expressions - FIXED to keep consistent size
  useEffect(() => {
    const expressions = ['happy', 'excited', 'cheerful', 'joyful', 'smiling'];
    const interval = setInterval(() => {
      setEyeExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    }, 4000); // Slightly longer for better effect
    
    return () => clearInterval(interval);
  }, []);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000); // Blink every 3 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Show appropriate messages based on current page
  useEffect(() => {
    if (!isVisible) return;
    
    // Show first message immediately
    const showRandomMessage = () => {
      const messages = getMessagesForPage(currentPage);
      const randomMessage = sample(messages) || messages[0];
      setEncouragingMessage(randomMessage);
      
      // Add a subtle pulse animation when new message appears
      if (textboxRef.current && showEncouragingBox) {
        gsap.fromTo(textboxRef.current, 
          { scale: 1 },
          { 
            scale: 1.08, 
            duration: 0.2, 
            ease: "back.out(1.7)",
            yoyo: true,
            repeat: 1
          }
        );
      }
    };
    
    // Set initial message RIGHT NOW (no delay)
    showRandomMessage();
    
    // Rotate through random messages every 8 seconds
    const encouragingTimer = setInterval(showRandomMessage, 8000);
    
    return () => {
      clearInterval(encouragingTimer);
    };
  }, [isVisible, currentPage]);

  // Don't render if not visible
  if (!isVisible) return null;

  // FIXED eye style function - cute anime cat-like expressions
  const getEyeStyle = (expression: string) => {
    switch (expression) {
      case 'excited':
        return { 
          borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
          transform: 'scaleY(1.2)' 
        }; // Wide excited eyes
      case 'cheerful':
        return { 
          borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
        }; // Happy almond shape
      case 'joyful':
        return { 
          borderRadius: '50% 50% 50% 50% / 90% 90% 10% 10%',
          transform: 'scaleY(0.7)' 
        }; // Squinting from joy
      case 'smiling':
        return { 
          borderRadius: '50% 50% 50% 50% / 75% 75% 25% 25%',
        }; // Content smile eyes
      default: // happy
        return { 
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }; // Default cute almond shape
    }
  };

  return (
    <div className="fixed z-[9998] pointer-events-auto">
      {/* Mascot Character */}
      <animated.div
        style={mascotSpring}
        className="relative"
      >
        {/* Luna - Ultra Cute Anime Fox */}
        <animated.div 
          style={bodySpring}
          className="relative w-20 h-20 cursor-pointer group"
          onClick={() => {
            // Toggle encouraging message box
            setShowEncouragingBox(!showEncouragingBox);
            // Also show greeting and wave
            setShowGreeting(true);
            setIsWaving(true);
            setTimeout(() => setIsWaving(false), 2000);
            setTimeout(() => setShowGreeting(false), 3000);
          }}
        >
          {/* Soft ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300/15 to-purple-400/15 rounded-full blur-lg scale-125"></div>
          
          {/* Luna - Main Character Body */}
          <div className="relative w-20 h-20 group-hover:scale-105 transition-transform duration-300">
            
            {/* Main head - perfectly round */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 shadow-lg">
              
              {/* Subtle highlight on head */}
              <div className="absolute top-2 left-3 w-6 h-4 bg-white/30 rounded-full blur-sm"></div>
              
              {/* Cute Fox Ears */}
              <div className={`absolute -top-3 left-2 w-5 h-7 transform -rotate-12 transition-transform duration-300 ${earTwitch ? 'scale-110' : ''}`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-orange-500 shadow-sm"></div>
                <div className="absolute inset-1 w-3 h-5 rounded-full bg-gradient-to-br from-purple-200 to-purple-300"></div>
              </div>
              
              <div className={`absolute -top-3 right-2 w-5 h-7 transform rotate-12 transition-transform duration-300 ${earTwitch ? 'scale-110' : ''}`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-orange-500 shadow-sm"></div>
                <div className="absolute inset-1 w-3 h-5 rounded-full bg-gradient-to-br from-purple-200 to-purple-300"></div>
              </div>
              
              {/* Face markings - clean white patches */}
              <div className="absolute top-3 left-1 w-6 h-6 bg-white/90 rounded-full"></div>
              <div className="absolute top-3 right-1 w-6 h-6 bg-white/90 rounded-full"></div>
              
              {/* Adorable anime cat-like eyes */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {/* Left Eye */}
                <div className="relative">
                  <div 
                    className={`w-4 h-5 bg-gray-900 transition-all duration-150 ${isBlinking ? 'scale-y-0' : 'scale-y-100'}`}
                    style={{
                      ...getEyeStyle(eyeExpression)
                    }}
                  >
                    {/* Main highlight - large and positioned for cuteness */}
                    <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full opacity-90"></div>
                    {/* Secondary smaller highlight */}
                    <div className="absolute top-1.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
                  </div>
                </div>
                
                {/* Right Eye */}
                <div className="relative">
                  <div 
                    className={`w-4 h-5 bg-gray-900 transition-all duration-150 ${isBlinking ? 'scale-y-0' : 'scale-y-100'}`}
                    style={{
                      ...getEyeStyle(eyeExpression)
                    }}
                  >
                    <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full opacity-90"></div>
                    <div className="absolute top-1.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
                  </div>
                </div>
              </div>
              
              {/* Cute little nose */}
              <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-1.5 h-1 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-sm"></div>
              
              {/* Adorable cat-like mouth */}
              <div className="absolute top-10.5 left-1/2 transform -translate-x-1/2">
                {/* Main mouth shape - cute cat smile */}
                <div className="relative">
                  <div className="w-0.5 h-1.5 bg-gray-700 rounded-full"></div>
                  <div className="absolute -left-1 top-1 w-2 h-0.5 border-b-2 border-gray-700 rounded-full transform -rotate-12"></div>
                  <div className="absolute -right-1 top-1 w-2 h-0.5 border-b-2 border-gray-700 rounded-full transform rotate-12"></div>
                </div>
              </div>
              
              {/* Rosy cheeks */}
              <div className="absolute top-9 left-0 w-3 h-2 bg-pink-300/60 rounded-full blur-sm"></div>
              <div className="absolute top-9 right-0 w-3 h-2 bg-pink-300/60 rounded-full blur-sm"></div>
            </div>
            
            {/* Waving Paw */}
            <animated.div
              style={waveSpring}
              className="absolute -top-2 -right-4 w-6 h-8 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-md origin-bottom"
            >
              {/* Paw pad details */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1.5 bg-pink-400 rounded-full opacity-80"></div>
              <div className="absolute bottom-3 left-0.5 w-1 h-1 bg-pink-300 rounded-full opacity-70"></div>
              <div className="absolute bottom-3 right-0.5 w-1 h-1 bg-pink-300 rounded-full opacity-70"></div>
            </animated.div>
            
            {/* Magical sparkles around Luna */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-2 -right-2 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-70 animate-bounce"></div>
            <div className="absolute bottom-0 -left-2 w-1 h-1 bg-blue-400 rounded-full opacity-80 animate-pulse"></div>
            
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
        {encouragingMessage && showEncouragingBox && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 30, y: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 30, y: 30 }}
            className="fixed bottom-45 right-35 w-48"
            style={{ zIndex: 999999 }}
          >
            <div 
              ref={textboxRef}
              className="speech-bubble backdrop-blur-sm rounded-2xl px-4 py-4 shadow-2xl border relative"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                borderColor: 'rgba(203, 213, 225, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
              }}
              onMouseEnter={() => {
                gsap.to(textboxRef.current, {
                  scale: 1.05,
                  y: -5,
                  duration: 0.3,
                  ease: "back.out(1.7)"
                });
              }}
              onMouseLeave={() => {
                gsap.to(textboxRef.current, {
                  scale: 1,
                  y: 0,
                  duration: 0.3,
                  ease: "back.out(1.7)"
                });
              }}
            >
              {/* X Close button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering Luna's click
                  setShowEncouragingBox(false);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.9) 0%, rgba(239, 68, 68, 0.9) 100%)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.15,
                    duration: 0.2,
                    ease: "back.out(1.7)"
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.2,
                    ease: "back.out(1.7)"
                  });
                }}
              >
                <span className="text-white text-xs font-bold">✕</span>
              </button>
              
              <p className="text-sm text-gray-800 font-semibold leading-relaxed pr-4">
                {encouragingMessage}
              </p>
              
              {/* Speech bubble tail pointing bottom-right to Luna */}
              <div 
                className="absolute -bottom-2 -right-2 w-4 h-4 rotate-[135deg] border-r border-b"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                  borderColor: 'rgba(203, 213, 225, 0.3)'
                }}
              />
              {/* Additional tail piece for better connection */}
              <div 
                className="absolute -bottom-1 -right-1 w-2 h-2 rotate-[135deg]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LumenMascot;
