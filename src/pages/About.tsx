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
      <div className="relative z-10 w-full px-8 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-24 max-w-none force-center-text"
        >
          <div className="space-y-20">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mx-auto" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              About Lumen
            </h1>
            
            {/* Emotionally Resonant Description */}
            <div className="space-y-8 max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
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
              className="inline-block px-8 py-4 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-300"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: '#f3f4f6'
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Explore Features
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;