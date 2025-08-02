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
  const [eyeExpression, setEyeExpression] = useState('happy');
  const [encouragingMessage, setEncouragingMessage] = useState('');
  const [showEncouragingBox, setShowEncouragingBox] = useState(true); // Open by default
  const textboxRef = useRef<HTMLDivElement>(null);

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

  // Random eye expressions
  useEffect(() => {
    const expressions = ['happy', 'excited', 'cheerful', 'joyful', 'smiling'];
    const interval = setInterval(() => {
      setEyeExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    }, 4000); // Slightly longer for better effect
    
    return () => clearInterval(interval);
  }, []);

  // Always show encouraging messages - cycle through the 5 messages randomly
  useEffect(() => {
    if (!isVisible) return;
    
    // Show first message immediately
    const showRandomMessage = () => {
      const randomMessage = sample(encouragingMessages) || encouragingMessages[0];
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
  }, [isVisible]);

  // Subtle breathing animation for textbox
  useEffect(() => {
    if (!textboxRef.current || !showEncouragingBox) return;
    
    const breathingAnimation = gsap.to(textboxRef.current, {
      scale: 1.02,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
    
    return () => breathingAnimation.kill();
  }, [showEncouragingBox]);

  // Removed duplicate encouraging message logic - handled above

  // Don't render if not visible
  if (!isVisible) return null;



  const getEyeStyle = (expression: string, isLeftEye: boolean = true) => {
    switch (expression) {
      case 'excited':
        return { width: '12px', height: '12px', transform: 'scaleY(1.1)' };
      case 'cheerful':
        return { width: '9px', height: '10px', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' };
      case 'joyful':
        // Replace winking with joyful squinty eyes (both eyes)
        return { width: '8px', height: '6px', borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', transform: 'scaleY(0.8)' };
      case 'smiling':
        return { width: '9px', height: '9px', borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%' };
      default: // happy
        return { width: '10px', height: '10px' };
    }
  };

  return (
    <div className="fixed z-[9998] pointer-events-auto">
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300/15 to-orange-400/15 rounded-full blur-lg"></div>
          
          {/* ACTUALLY CUTE Fox - Big head, big eyes, kawaii style! */}
          <div className="relative w-20 h-20 group-hover:scale-105 transition-transform duration-300">
            
            {/* Fox Head - Clean and proportional */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-lg">
              {/* Head highlight - subtle and clean */}
              <div className="absolute top-2 left-3 w-3 h-2 bg-white/60 rounded-full blur-[0.5px]"></div>
              
              {/* Clean Fox Ears */}
              <div className="absolute -top-2 left-4 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-500 transform -rotate-12"></div>
              <div className="absolute -top-2 right-4 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-500 transform rotate-12"></div>
              
              {/* Ear insides */}
              <div className="absolute -top-1 left-4.5 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-pink-400 transform -rotate-12"></div>
              <div className="absolute -top-1 right-4.5 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-pink-400 transform rotate-12"></div>
              
              {/* BIG ADORABLE EYES - Always sparkly and happy! */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {/* Left Eye */}
                <div 
                  className="bg-gray-900 rounded-full relative shadow-lg transition-all duration-300"
                  style={getEyeStyle(eyeExpression, true)}
                >
                  {/* Multiple highlights for sparkly eyes - always visible! */}
                  <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full opacity-95"></div>
                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-white rounded-full opacity-80"></div>
                  <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
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
              
              {/* Clean, visible smile */}
              <div className="absolute top-11 left-1/2 transform -translate-x-1/2 w-5 h-2">
                <div className="w-full h-full border-b-[2px] border-gray-800 rounded-full"></div>
              </div>
            
              {/* Subtle cheek blush */}
              <div className="absolute top-8 left-1 w-2 h-1.5 bg-pink-300/50 rounded-full blur-[0.5px]"></div>
              <div className="absolute top-8 right-1 w-2 h-1.5 bg-pink-300/50 rounded-full blur-[0.5px]"></div>
              
              {/* White chest marking - properly positioned */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-white/80 rounded-full"></div>
            </div>
            
            {/* Fox Body - Much lower positioned so you can see the mouth! */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-12 h-9 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full shadow-md">
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
            
            {/* Waving paw - properly shaped and positioned for lower body */}
            <animated.div 
              style={waveSpring}
              className="absolute -left-1 top-16 w-2.5 h-4 bg-orange-200 rounded-full origin-bottom shadow-md border border-orange-300"
            ></animated.div>
            
            {/* Other paws - positioned for much lower body (normal fox anatomy!) */}
            <div className="absolute left-2 top-19 w-2 h-3 bg-orange-200 rounded-full shadow-sm border border-orange-300"></div>
            <div className="absolute right-2 top-19 w-2 h-3 bg-orange-200 rounded-full shadow-sm border border-orange-300"></div>
            {/* Right front paw - where the fox should have it */}
            <div className="absolute right-1 top-16 w-2 h-3 bg-orange-200 rounded-full shadow-sm border border-orange-300"></div>
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
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
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
                  e.stopPropagation(); // Prevent triggering Foxie's click
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
              
              {/* Speech bubble tail pointing bottom-right to Foxie */}
              <div 
                className="absolute -bottom-2 -right-2 w-4 h-4 rotate-45 border-r border-b"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                  borderColor: 'rgba(203, 213, 225, 0.3)'
                }}
              />
              {/* Additional tail piece for better connection */}
              <div 
                className="absolute -bottom-1 -right-1 w-2 h-2 rotate-45"
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