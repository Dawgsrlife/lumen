import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { AnimatedBackground } from 'animated-backgrounds';
import { Button, LumenIcon, AnimatedBall } from '../components/ui';

const LandingPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const leftBorderRef = useRef<HTMLDivElement>(null);
  const rightBorderRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Start with ball animation, then show content
    const handleBallAnimationComplete = () => {
      setShowContent(true);
      
      // Start the landing page animations after ball dissolves
      setTimeout(() => {
        startLandingAnimations();
      }, 200);
    };

    const startLandingAnimations = () => {
      // GSAP Timeline for incredible animations
      const tl = gsap.timeline({ ease: "power3.out" });

      // Initial state - everything hidden
      gsap.set([headingRef.current, iconRef.current, textRef.current, buttonRef.current], {
        opacity: 0,
        y: 60
      });

      gsap.set([leftBorderRef.current, rightBorderRef.current], {
        scaleY: 0,
        transformOrigin: "top"
      });

      gsap.set(backgroundRef.current, {
        opacity: 0
      });

      // Background fade in
      tl.to(backgroundRef.current, {
        opacity: 1,
        duration: 2,
        ease: "power2.out"
      })
      // Side borders animate in
      .to([leftBorderRef.current, rightBorderRef.current], {
        scaleY: 1,
        duration: 1.2,
        ease: "power2.out"
      }, "-=1.5")
      // Heading appears with stagger
      .to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.8")
      // Icon appears with rotation
      .to(iconRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6")
      // Text fades in
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      // Button appears
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      // Icon floating animation
      .to(iconRef.current, {
        y: -10,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      }, "-=0.4");
    };

    // Start the ball animation immediately
    handleBallAnimationComplete();

  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumen-primary"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Ball Animation */}
      <AnimatedBall onAnimationComplete={() => setShowContent(true)} />
      
      {/* Landing Page Content - only show after ball animation */}
      {showContent && (
        <>
          {/* Subtle White Base */}
          <div className="absolute inset-0 bg-white"></div>
          
          {/* Interactive Stain Background */}
          <div className="absolute inset-0 z-5 pointer-events-auto">
            <AnimatedBackground 
              animationName="particleNetwork"
              interactive={true}
              interactionConfig={{
                effect: 'attract',
                strength: 0.8,
                radius: 300,
                continuous: true,
                multiTouch: true
              }}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.1,
                mixBlendMode: 'multiply',
                pointerEvents: 'auto',
                zIndex: 5
              }}
            />
          </div>
          
          {/* Ultra-subtle Stain Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 via-purple-50/3 to-pink-50/4"></div>
            
            {/* Stain-like blobs with irregular shapes */}
            <div className="absolute inset-0">
              <div 
                className="absolute w-[800px] h-[600px] bg-gradient-radial from-blue-100/8 via-purple-100/4 to-transparent blur-3xl"
                style={{
                  left: '-15%',
                  top: '-10%',
                  borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                  animation: 'stainFlow 60s ease-in-out infinite',
                }}
              />
              <div 
                className="absolute w-[700px] h-[900px] bg-gradient-radial from-purple-100/6 via-pink-100/4 to-transparent blur-3xl"
                style={{
                  right: '-10%',
                  bottom: '-15%',
                  borderRadius: '30% 60% 70% 40% / 40% 50% 60% 50%',
                  animation: 'stainFlow 80s ease-in-out infinite reverse',
                }}
              />
              <div 
                className="absolute w-[500px] h-[400px] bg-gradient-radial from-cyan-100/5 via-blue-100/3 to-transparent blur-3xl"
                style={{
                  left: '60%',
                  top: '70%',
                  borderRadius: '50% 60% 40% 70% / 30% 40% 60% 70%',
                  animation: 'stainFlow 100s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Side borders with subtle gradient */}
          <div 
            ref={leftBorderRef}
            className="fixed left-0 top-0 w-16 h-full bg-gradient-to-b from-slate-300/70 to-slate-400/50 backdrop-blur-sm transform origin-top z-10"
          ></div>
          <div 
            ref={rightBorderRef}
            className="fixed right-0 top-0 w-16 h-full bg-gradient-to-b from-slate-300/70 to-slate-400/50 backdrop-blur-sm transform origin-top z-10"
          ></div>
          
          {/* Main content container - perfectly centered with proper spacing */}
          <div 
            ref={containerRef}
            className="relative z-20 min-h-screen flex flex-col justify-center items-center px-8 pointer-events-none"
          >
            <div className="text-center w-full max-w-6xl">
              {/* Heading with proper vertical spacing and full width */}
              <motion.div
                ref={headingRef}
                className="mb-24 w-full"
              >
                <h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-slate-900 leading-tight tracking-wide w-full"
                  style={{ 
                    fontFamily: 'Iowan Old Style, serif'
                  }}
                >
                  Brighten Your<br />
                  Mind, One<br />
                  Feeling at a<br />
                  Time
                </h1>
              </motion.div>

              {/* Custom Lumen Icon - cleanly separated with proper margins */}
              <motion.div
                ref={iconRef}
                className="mb-24 flex justify-center"
              >
                <div className="relative">
                  {/* Shadow behind icon */}
                  <div className="absolute inset-0 bg-slate-400/20 rounded-full blur-xl transform scale-110"></div>
                  <LumenIcon size="xl" animated={true} />
                </div>
              </motion.div>

              {/* Descriptive text with better spacing and wider width */}
              <motion.div
                ref={textRef}
                className="mb-24 w-full"
              >
                <p 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-slate-800 leading-relaxed mx-auto"
                  style={{ 
                    fontFamily: 'Iowan Old Style, serif',
                    width: '95%'
                  }}
                >
                  Transform emotions into healing through<br />
                  personalized games and AI-powered<br />
                  insights
                </p>
              </motion.div>

              {/* Professional CTA button - properly spaced */}
              <motion.div
                ref={buttonRef}
                className="mb-16 pointer-events-auto"
              >
                <Button 
                  size="lg"
                  className="text-2xl px-20 py-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 shadow-2xl rounded-3xl border-0 font-bold tracking-wide pointer-events-auto"
                  onClick={() => window.location.href = '/sign-in'}
                >
                  Begin Your Journey
                </Button>
              </motion.div>
            </div>
          </div>
        </>
      )}

      {/* Custom CSS for stain-like flowing animations */}
      <style jsx>{`
        @keyframes stainFlow {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.03;
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%';
          }
          25% { 
            transform: translate(15px, -10px) scale(1.08) rotate(2deg);
            opacity: 0.06;
            borderRadius: '40% 60% 50% 50% / 30% 60% 40% 70%';
          }
          50% { 
            transform: translate(-8px, 12px) scale(0.95) rotate(-1deg);
            opacity: 0.04;
            borderRadius: '70% 30% 60% 40% / 50% 40% 60% 50%';
          }
          75% { 
            transform: translate(12px, 8px) scale(1.03) rotate(1deg);
            opacity: 0.07;
            borderRadius: '50% 50% 40% 60% / 70% 30% 50% 50%';
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 