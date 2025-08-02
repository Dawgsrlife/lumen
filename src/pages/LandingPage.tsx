import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Button } from '../components/ui';

const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Animation Timeline
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate the main elements
    tl.fromTo(titleRef.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(circleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.7)" },
      "-=0.3"
    )
    .fromTo(ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    // Subtle floating animation for the circle
    gsap.to(circleRef.current, {
      y: -20,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-lumen-primary/5 to-lumen-secondary/5" />
      
      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Welcome text */}
        <motion.div
          ref={heroRef}
          className="mb-12"
        >
          <h1 
            ref={titleRef}
            className="text-6xl md:text-7xl font-light text-lumen-dark mb-6"
          >
            Welcome
          </h1>
          <h2 className="text-6xl md:text-7xl font-light text-lumen-dark mb-8">
            Alex!
          </h2>
          
          <p 
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Your journey to mental wellness starts here
          </p>
        </motion.div>

        {/* Animated circle */}
        <motion.div
          ref={circleRef}
          className="relative w-64 h-64 mx-auto mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full opacity-20" />
          <div className="absolute inset-4 bg-gradient-to-br from-teal-300 to-blue-400 rounded-full opacity-30" />
          <div className="absolute inset-8 bg-gradient-to-br from-teal-200 to-blue-300 rounded-full opacity-40" />
          <div className="absolute inset-12 bg-gradient-to-br from-teal-100 to-blue-200 rounded-full opacity-50" />
        </motion.div>

        {/* CTA */}
        <motion.div
          ref={ctaRef}
          className="space-y-6"
        >
          <Button 
            size="lg"
            className="text-lg px-8 py-4 bg-lumen-dark text-white hover:bg-gray-800 transition-colors"
            onClick={() => window.location.href = '/dashboard'}
          >
            Begin Your Journey
          </Button>
          
          <p className="text-sm text-gray-500">
            Track emotions • Get AI insights • Play therapeutic games
          </p>
        </motion.div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-lumen-primary rounded-full opacity-30" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-lumen-secondary rounded-full opacity-40" />
      <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-lumen-primary rounded-full opacity-30" />
      <div className="absolute bottom-20 right-20 w-1 h-1 bg-lumen-secondary rounded-full opacity-40" />
    </div>
  );
};

export default LandingPage; 