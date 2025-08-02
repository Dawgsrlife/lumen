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
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-[var(--lumen-primary)] to-[var(--lumen-secondary)]"></div>
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">HOME</a>
          <a href="/about" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">ABOUT</a>
          <a href="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">FEATURES</a>
          <a href="/contact" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Minimalist Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-16"
        >
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Contact
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Built by a passionate team of developers and designers.
            </p>
          </div>
          
          {/* Simple Team List */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.email}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <a 
                  href={`mailto:${member.email}`}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {member.email}
                </a>
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
              Try Lumen
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;