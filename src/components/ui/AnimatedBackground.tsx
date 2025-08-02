import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any>(null);

  useEffect(() => {
    const loadParticles = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const Particles = (await import('particlesjs')).default;
        
        if (canvasRef.current && !particlesRef.current) {
          particlesRef.current = Particles.init({
            selector: canvasRef.current,
            maxParticles: 100,
            sizeVariations: 4,
            speed: 0.4,
            color: ['#FBBF24', '#8B5CF6', '#F59E0B'], // Lumen primary and secondary colors
            minDistance: 120,
            connectParticles: true,
            responsive: [
              {
                breakpoint: 768,
                options: {
                  maxParticles: 50,
                  speed: 0.2,
                  connectParticles: true
                }
              },
              {
                breakpoint: 425,
                options: {
                  maxParticles: 30,
                  speed: 0.15,
                  connectParticles: true
                }
              }
            ]
          });
        }
      } catch (error) {
        console.warn('Particles.js failed to load:', error);
      }
    };

    loadParticles();

    return () => {
      if (particlesRef.current && particlesRef.current.pauseAnimation) {
        particlesRef.current.pauseAnimation();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-1 ${className}`}
      style={{
        background: 'transparent',
      }}
    />
  );
};

export default AnimatedBackground;