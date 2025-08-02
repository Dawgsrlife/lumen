import React from 'react';
import { motion } from 'framer-motion';
import { EmotionSelector, MinigameCard } from '../ui';

interface HeroLayoutProps {
  headline: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
  showEmotionSelector?: boolean;
  showMinigamePreview?: boolean;
  className?: string;
}

const HeroLayout: React.FC<HeroLayoutProps> = ({
  headline,
  subtitle,
  ctaText,
  onCtaClick,
  showEmotionSelector = true,
  showMinigamePreview = true,
  className = ''
}) => {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lumen-gradient-start)] to-[var(--lumen-gradient-end)]" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lumen-primary)]/5 via-[var(--lumen-secondary)]/3 to-[var(--lumen-primary)]/4" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 sm:px-10 py-[clamp(4rem,10vh,10rem)]">
        <div className="text-center max-w-6xl mx-auto space-y-16">
          
          {/* Headline Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-gray-900 leading-tight tracking-wide">
              {headline}
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-gray-700 leading-relaxed max-w-4xl mx-auto">
              {subtitle}
            </p>
          </motion.div>
          
          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--lumen-primary)]/30 to-[var(--lumen-secondary)]/30 backdrop-blur-sm border border-white/30"></div>
          </motion.div>
          
          {/* Emotion Selector */}
          {showEmotionSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-600">
                How are you feeling today?
              </h3>
              <EmotionSelector 
                onEmotionSelect={(emotion) => console.log('Selected:', emotion)}
                className="mt-4"
              />
            </motion.div>
          )}
          
          {/* Minigame Preview */}
          {showMinigamePreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-600">
                Featured Experience
              </h3>
              <div className="flex justify-center">
                <MinigameCard
                  title="Color Bloom"
                  description="Transform a gray world into vibrant colors through gentle interactions"
                  emotion="Sadness"
                  color="from-blue-400 to-purple-500"
                  icon="🌸"
                  onClick={() => console.log('Play Color Bloom')}
                  className="max-w-sm"
                />
              </div>
            </motion.div>
          )}
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="flex justify-center"
          >
            <button
              onClick={onCtaClick}
              className="
                px-10 py-5 text-white rounded-full shadow-xl hover:shadow-2xl
                transition-all duration-300 ease-out font-semibold tracking-wide
                text-xl hover:scale-105 hover:brightness-110
                border border-white/20 backdrop-blur-sm
                focus:outline-none focus:ring-4 focus:ring-[var(--lumen-primary)]/50
              "
              style={{
                background: 'linear-gradient(to right, var(--lumen-primary), var(--lumen-secondary), var(--lumen-primary))'
              }}
            >
              {ctaText}
            </button>
          </motion.div>
          
          {/* Floating Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
            className="mt-16"
          >
            <blockquote className="text-gray-500 italic text-lg">
              "Awareness is the first step to change."
            </blockquote>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2, ease: "easeOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroLayout; 