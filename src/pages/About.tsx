import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground, LumenMascot } from '../components/ui';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Cute Mascot */}
      <LumenMascot currentPage="/about" />

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-8 w-full">
        <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-[var(--lumen-primary)] to-[var(--lumen-secondary)]"></div>
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">HOME</a>
          <a href="/about" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">ABOUT</a>
          <a href="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">FEATURES</a>
          <a href="/contact" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Full Width Content - Properly Centered */}
      <div className="relative z-10 w-full px-8 py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-32 max-w-none force-center-text"
        >
          <div className="space-y-24">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mx-auto" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              About Lumen
            </h1>
            
            {/* Emotionally Resonant Description */}
            <div className="space-y-12 max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                We know what it feels like when the world seems too heavy, when your thoughts spiral, or when you just need someone to understand. Lumen is here for those moments when no one else is.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                You deserve a space where your feelings matter, where you're not judged, and where healing happens at your own pace. Lumen creates that space for you. Every word you share, every emotion you express is met with genuine understanding and gentle guidance tailored just for what you're experiencing right now.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                When you're feeling overwhelmed, our calming games help you breathe again. When sadness feels endless, gentle activities bring color back to your world. When anxiety takes over, soothing exercises guide you back to peace. You're never alone in this journey.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Your progress isn't measured by perfection, but by small, meaningful steps forward. Every login, every moment you choose to care for yourself, every game you play is a victory worth celebrating. Lumen sees your strength, even when you don't.
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-8"
          >
            <motion.a
              href="/features"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 shadow-sm"
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Explore Features
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;