import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

import { LumenIntro, AnimatedBackground, LumenMascot, LumenIcon } from '../components/ui';

const LandingPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const startLandingAnimations = () => {
    // GSAP animations for hero text to make it pop sharply
    const ctx = gsap.context(() => {
      // Set initial states for content and main container
      gsap.set("#main-content", { opacity: 0 });
      gsap.set(".hero-line", { 
        y: 100, 
        opacity: 0, 
        scale: 0.8,
        rotationX: 45,
        transformOrigin: "center bottom"
      });
      gsap.set(".hero-word", { 
        y: 80, 
        opacity: 0, 
        scale: 0.7,
        rotationY: 90,
        transformOrigin: "center"
      });
      gsap.set(".hero-subtext", { 
        y: 60, 
        opacity: 0, 
        scale: 0.9
      });
      gsap.set(".hero-button", { 
        y: 40, 
        opacity: 0, 
        scale: 0.8
      });

      // Create timeline for dramatic entrance
      const tl = gsap.timeline();

      // First, fade in the main content container
      tl.to("#main-content", {
        opacity: 1,
        duration: 0.1,
        ease: "none"
      });

      // Hero headline container animation
      tl.to(".hero-line", {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.3,
      })
      // Word-by-word dramatic reveal
      .to(".hero-word", {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(2.5)",
        stagger: 0.08,
      }, "-=1")

      // Subtitle with elastic bounce
      .to(".hero-subtext", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)",
      }, "-=0.6")
      // Button with satisfying pop
      .to(".hero-button", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
      }, "-=0.4")
      // Add sparkle burst effect
      .to(".text-sparkle", {
        scale: "random(1.2, 1.8)",
        opacity: "random(0.7, 1)",
        rotation: "random(-180, 180)",
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true
      }, "-=1")
      // Keep text clean and readable - no gradient effects

      // Logo/brand animation - clean and professional
      gsap.from(".logo", {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
      });

      // Nav links animation - same style as logo with slight stagger
      gsap.from(".nav-link", {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.3,
        stagger: 0.1, // Each link animates 0.1s after the previous
      });

      // Floating particles animation - smooth, minimalist movement
      gsap.to(".floating-particle", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-180, 180)",
        duration: "random(4, 8)",
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 2,
          from: "random"
        }
      });

      // Subtle floating motion for particles
      gsap.to(".floating-particle", {
        scale: "random(0.8, 1.2)",
        opacity: "random(0.3, 0.7)",
        duration: "random(3, 6)",
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 1
      });

      // Flying element that crosses the screen - minimalist and elegant
      gsap.to(".flying-element", {
        x: "100vw",
        duration: 15,
        ease: "none",
        repeat: -1,
        delay: 2
      });

      // Add subtle rotation and scale to flying element
      gsap.to(".flying-element", {
        rotation: 360,
        scale: "random(0.8, 1.2)",
        duration: 8,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });

      // Gentle background element animation
      gsap.to(".animated-bg-element", {
        y: "random(-20, 20)",
        x: "random(-15, 15)",
        scale: "random(0.9, 1.1)",
        duration: "random(8, 12)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 2
      });
    });

    // Background elements fade in
    gsap.to(".animated-bg-element", {
      opacity: 0.1,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.5
    });

    return () => ctx.revert();
  };

  useEffect(() => {
    if (!isLoaded) return;

    console.log('🚀 Landing page loaded, starting intro sequence');
    
    // Show intro for 3.5 seconds, then start fade-out
    const introTimeout = setTimeout(() => {
      console.log('✨ Starting intro fade-out');
      setShowIntro(false);
      
      // Wait for intro to completely fade out (1.2s) before showing content
      setTimeout(() => {
        console.log('✨ Intro fully faded, showing content');
        setShowContent(true);
        
        // Start landing animations shortly after content appears
        setTimeout(() => {
          console.log('🎨 Starting landing animations');
          const cleanup = startLandingAnimations();
          // Store cleanup function for later use if needed
          return cleanup;
        }, 300);
      }, 1200); // Wait for LumenIntro exit animation to complete
    }, 3500);

    return () => clearTimeout(introTimeout);
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

  console.log('🔍 Render state:', { showIntro, showContent, isLoaded, isSignedIn });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Lumen Brand Intro */}
      <LumenIntro show={showIntro} />
      
      {/* Cute Mascot - only show after intro */}
      {showContent && <LumenMascot currentPage="/" />}
      
      {/* Landing Page Content - show directly after intro */}
      {showContent && (
        <>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--lumen-gradient-start)]/3 via-white/40 to-[var(--lumen-gradient-end)]/3 z-5"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
            <div className="animated-bg-element absolute top-20 left-20 w-32 h-32 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(2px)' }}></div>
            <div className="animated-bg-element absolute bottom-32 right-16 w-24 h-24 rounded-full opacity-10" style={{ background: 'var(--lumen-secondary)', filter: 'blur(2px)' }}></div>
            <div className="animated-bg-element absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(1px)' }}></div>
          </div>
          
          {/* Minimalist Layout - Inspired by modern design */}
          <div className="relative z-50 min-h-screen opacity-0" id="main-content">
            {/* Readable Header Navigation */}
            <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
              <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer logo">
                <LumenIcon size="sm" />
                <span className="text-xl font-bold text-gray-900">Lumen</span>
              </a>
              
              <div className="hidden md:flex space-x-8">
                <a href="/" className="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">HOME</a>
                <a href="/about" className="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">ABOUT</a>
                <a href="/features" className="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">FEATURES</a>
                <a href="/contact" className="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">CONTACT</a>
              </div>
            </nav>

            {/* Clean Grid Layout - Left Content, Right Visual */}
            <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto px-8 py-24 lg:py-32">
              
              {/* Left Content */}
              <div className="space-y-24">
                {/* Main Headline */}
                <div className="space-y-16">
                  <div className="relative">
                    <h1 
                      ref={headingRef}
                      className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 relative"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      <span className="block hero-line relative">
                        <span className="hero-word">Light</span> <span className="hero-word">the</span> <span className="hero-word">Mind.</span>
                        <span className="text-sparkle absolute -top-2 -right-2 text-2xl">✨</span>
                        <span className="text-sparkle absolute top-0 left-8 text-xl opacity-70">⭐</span>
                      </span>
                      <span className="block hero-line relative">
                        <span className="hero-word">Feel,</span> <span className="hero-word">Heal,</span> <span className="hero-word">and</span> <span className="hero-word">Grow.</span>
                        <span className="text-sparkle absolute -top-1 right-12 text-xl">💫</span>
                        <span className="text-sparkle absolute bottom-2 -left-3 text-lg opacity-80">✨</span>
                      </span>
                    </h1>
                  </div>
                  
                  {/* Elevator Pitch */}
                  <p 
                    ref={textRef}
                    className="text-xl leading-relaxed text-gray-600 max-w-lg hero-subtext"
                  >
                    Lumen listens when no one else does. It understands your words and feelings, then gently guides you with calming games and health insights tailored just for what you're going through.
                  </p>
                </div>
                
                {/* CTA Button - INSANE ATTENTION-GRABBING MASTERPIECE */}
                <div ref={buttonRef}>
                  <button
                    onClick={() => {
                      // Simple, clean navigation
                      window.location.href = '/sign-in';
                    }}
                    className="hero-button relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white text-base tracking-normal transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, var(--lumen-primary) 0%, var(--lumen-secondary) 100%)',
                      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
                    }}

                  >
                    {/* Minimal shimmer effect - subtle and elegant */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-30"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)',
                        backgroundSize: '200% 200%',
                        animation: 'shimmer 3s ease-in-out infinite'
                      }}
                    ></div>
                    
                    {/* Clean, minimal button text */}
                    <span className="relative z-10">
                      Begin Your Journey
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Visual - Minimal Floating Elements */}
              <div 
                ref={iconRef}
                className="relative flex items-center justify-center lg:justify-end"
              >
                {/* Clean visual space with floating particles */}
                <div className="relative w-80 h-80 flex items-center justify-center">
                  {/* Floating particles using GSAP */}
                  <div className="floating-particle absolute top-16 right-20 w-6 h-6 rounded-full opacity-80" 
                       style={{ background: 'var(--lumen-primary)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)' }}></div>
                  <div className="floating-particle absolute bottom-20 left-16 w-5 h-5 rounded-full opacity-70" 
                       style={{ background: 'var(--lumen-secondary)', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}></div>
                  <div className="floating-particle absolute top-32 left-20 w-4 h-4 rounded-full opacity-75" 
                       style={{ background: 'var(--lumen-primary)', boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}></div>
                  
                  {/* Central focus element */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--lumen-primary)]/20 to-[var(--lumen-secondary)]/20 backdrop-blur-sm border border-white/30"></div>
                </div>
                
                {/* Flying element that crosses screen */}
                <div 
                  className="flying-element fixed top-1/3 -left-20 w-8 h-8 rounded-full opacity-60 pointer-events-none"
                  style={{ 
                    background: 'linear-gradient(45deg, var(--lumen-primary), var(--lumen-secondary))',
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LandingPage; 