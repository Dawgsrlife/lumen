import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LumenIntroProps {
  show: boolean;
}

const LumenIntro: React.FC<LumenIntroProps> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-white/90 via-[var(--lumen-gradient-start)]/80 to-[var(--lumen-gradient-end)]/85"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Soft glow background */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-[var(--lumen-primary)]/15 via-[var(--lumen-secondary)]/12 to-transparent blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          {/* Main Lumen wordmark */}
          <motion.div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut",
                delay: 0.2
              }}
              className="text-[5rem] sm:text-[7rem] md:text-[8rem] font-serif tracking-widest select-none"
              style={{ 
                fontFamily: 'Playfair Display, Georgia, serif',
                background: `linear-gradient(135deg, var(--lumen-primary) 0%, var(--lumen-secondary) 70%, var(--lumen-primary) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Lumen
            </motion.h1>
            
            {/* Subtle tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                delay: 0.8
              }}
              className="text-center text-lg sm:text-xl font-light tracking-wide mt-4"
              style={{ 
                color: 'var(--lumen-text-secondary)',
                fontFamily: 'Inter, system-ui, sans-serif' 
              }}
            >
              Built to brighten your inner world
            </motion.p>
          </motion.div>
          
          {/* Gentle particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[var(--lumen-primary)]/30 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  y: [0, -20, -40]
                }}
                transition={{
                  duration: 3,
                  delay: 1 + i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LumenIntro;