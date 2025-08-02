import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedBallProps {
  onAnimationComplete?: () => void;
}

const AnimatedBall: React.FC<AnimatedBallProps> = ({ onAnimationComplete }) => {
  const ballRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ballRef.current || !containerRef.current) return;

    // Create the 3D ball animation timeline
    const tl = gsap.timeline({
      onComplete: onAnimationComplete
    });

    // Initial state - ball high above screen
    gsap.set(ballRef.current, {
      y: '-100vh',
      scale: 0.2,
      opacity: 0.9,
      rotation: 0
    });

    // Drop animation - Perfect opacity to center
    tl.to(ballRef.current, {
      y: '50vh',
      scale: 1.3,
      opacity: 0.8,
      duration: 1.2,
      ease: "power2.out"
    })
    // Bounce effect
    .to(ballRef.current, {
      y: '48vh',
      scale: 1.2,
      opacity: 0.75,
      duration: 0.3,
      ease: "power2.out"
    })
    // Start dissolving
    .to(ballRef.current, {
      scale: 2,
      opacity: 0.6,
      duration: 0.5,
      ease: "power2.in"
    })
    // Dissolve into particles
    .to(ballRef.current, {
      scale: 2.5,
      opacity: 0,
      duration: 1,
      ease: "power2.in"
    });

  }, [onAnimationComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {/* HUGE 3D Ball with gradient and shadow */}
      <div
        ref={ballRef}
        className="absolute left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.85) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(59, 130, 246, 0.75) 100%)',
          boxShadow: `
            inset -8px -8px 16px rgba(0, 0, 0, 0.2),
            inset 8px 8px 16px rgba(255, 255, 255, 0.15),
            0 20px 40px rgba(0, 0, 0, 0.2)
          `,
          filter: 'blur(0.5px)'
        }}
      >
        {/* Inner glow */}
        <div 
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
          }}
        />
        
        {/* Highlight */}
        <div 
          className="absolute top-3 left-4 w-4 h-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBall; 