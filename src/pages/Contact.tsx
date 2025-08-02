import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/ui';

const Contact: React.FC = () => {
  const teamMembers = [
    { name: "Alex Meng", role: "Project Manager & Frontend Lead", email: "alex.meng@mail.utoronto.ca" },
    { name: "Nathan Espejo", role: "Game Developer", email: "hasnate618@gmail.com" },
    { name: "Zikora Chinedu", role: "Frontend Developer", email: "zikora.chinedu@yahoo.com" },
    { name: "Vishnu Sai", role: "Backend Architecture", email: "vishnukishan123@gmail.com" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-8 w-full">
        <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-[var(--lumen-primary)] to-[var(--lumen-secondary)]"></div>
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">HOME</a>
          <a href="/about" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">ABOUT</a>
          <a href="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">FEATURES</a>
          <a href="/contact" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">CONTACT</a>
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
          <div className="space-y-20 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mx-auto" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Contact
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mx-auto">
              Built by a passionate team of developers and designers.
            </p>
          </div>
          
          {/* Team Grid */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.email}
                className="bg-white/50 rounded-xl p-8 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-gray-600 font-medium">{member.role}</p>
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-block mt-2"
                  >
                    {member.email}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.a
              href="/sign-in"
              className="inline-block px-8 py-4 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-300"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: '#f3f4f6'
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Try Lumen
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;