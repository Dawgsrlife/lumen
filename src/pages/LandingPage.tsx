import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Placeholder for Figma design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6">
            Lumen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your journey to mental wellness starts here
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <Button 
            size="lg"
            className="text-lg px-8 py-4 bg-lumen-primary text-white hover:bg-lumen-primary/90 transition-colors"
            onClick={() => window.location.href = '/sign-up'}
          >
            Get Started
          </Button>
          
          <p className="text-sm text-gray-500">
            Track emotions • Get AI insights • Play therapeutic games
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage; 