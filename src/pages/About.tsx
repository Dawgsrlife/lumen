import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/ui';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-8 w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-[var(--lumen-primary)] to-[var(--lumen-secondary)]"></div>
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">HOME</a>
          <a href="/about" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">ABOUT</a>
          <a href="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">FEATURES</a>
          <a href="/contact" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Full Width Content - Properly Centered */}
      <div className="relative z-10 w-full px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-16 max-w-none"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mx-auto" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            About Lumen
          </h1>
          
          {/* Comprehensive Description */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
              Lumen listens when no one else does. It understands your words and feelings, then gently guides you with calming games and health insights tailored just for what you're going through.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Built on three core principles that make mental health support truly meaningful: <strong>Emotional Connection</strong> – our app feels human and engaging, like having a caring companion by your side. <strong>Usefulness</strong> – every interaction provides genuine value that impacts your daily life and mental wellbeing. <strong>Incentive</strong> – through thoughtful gamification and personalized experiences, you'll find yourself drawn back to continue your healing journey.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              When you open Lumen, you're welcomed into a carefully crafted space that never overwhelms. You'll share your current emotional state, and our AI-powered insights provide personalized feedback and gentle suggestions. Depending on how you're feeling, Lumen presents therapeutic mini-games designed to lift your spirits – from nurturing flowers that bring color to gray worlds when you're sad, to controlled breathing exercises that guide glowing orbs when you're anxious.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Every element is designed with minimalist beauty, satisfying animations, and emotional resonance. Your progress is tracked meaningfully, showing login streaks and emotional patterns over time, helping you understand your mental health journey without information overload.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-8"
          >
            <motion.a
              href="/features"
              className="inline-block px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, var(--lumen-primary) 0%, var(--lumen-secondary) 100%)',
                boxShadow: '0 8px 32px rgba(251, 191, 36, 0.25), 0 4px 16px rgba(139, 92, 246, 0.15)'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 12px 40px rgba(251, 191, 36, 0.35), 0 6px 20px rgba(139, 92, 246, 0.2)'
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