import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full opacity-5" style={{ background: 'var(--lumen-primary)' }}></div>
        <div className="absolute bottom-32 left-16 w-16 h-16 rounded-full opacity-5" style={{ background: 'var(--lumen-secondary)' }}></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto">
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

      {/* Minimalist Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            About Lumen
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A minimalist mental health web app designed to transform emotions into healing through personalized games and AI-powered insights.
          </p>
          
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
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(251, 191, 36, 0.4), 0 6px 20px rgba(139, 92, 246, 0.25)'
              }}
              whileTap={{ scale: 0.98 }}
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