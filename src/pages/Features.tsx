import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground, LumenMascot, LumenIcon } from '../components/ui';

const Features: React.FC = () => {
  const features = [
    { 
      icon: "🎭", 
      title: "Emotion Recognition", 
      description: "Lumen listens to your words and understands your feelings, providing a safe space to express yourself without judgment." 
    },
    { 
      icon: "🎮", 
      title: "Therapeutic Games", 
      description: "Calming, purposeful games tailored to your emotional state – from nurturing gray worlds into color when sad, to breathing exercises when anxious." 
    },
    { 
      icon: "🧠", 
      title: "AI-Powered Insights", 
      description: "Personalized health insights and gentle guidance from advanced AI, understanding exactly what you're going through in the moment." 
    },
    { 
      icon: "📈", 
      title: "Meaningful Progress", 
      description: "Track your emotional journey with beautiful visualizations that help you understand patterns and celebrate growth over time." 
    },
    { 
      icon: "🌱", 
      title: "Gentle Healing", 
      description: "Every interaction is designed to feel human and caring, creating an experience that feels like having a compassionate companion." 
    },
    { 
      icon: "✨", 
      title: "Minimalist Design", 
      description: "Clean, satisfying interfaces with thoughtful animations that never overwhelm – just the right amount of beauty to support your wellbeing." 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Cute Mascot */}
      <LumenMascot currentPage="/features" />

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-8 w-full">
        <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
          <LumenIcon size="sm" />
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">HOME</a>
          <a href="/about" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">ABOUT</a>
          <a href="/features" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">FEATURES</a>
          <a href="/contact" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Full Width Content */}
      <div className="relative z-10 w-full px-8 py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-32 force-center-text"
        >
          <div className="space-y-24 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Features
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              Lumen listens when no one else does. It understands your words and feelings, then gently guides you with calming games and health insights tailored just for what you're going through.
            </p>
          </div>
          
          {/* Enhanced Feature Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center space-y-4 p-6 bg-white/50 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <motion.a
              href="/contact"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 shadow-sm"
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Get In Touch
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

export default Features;