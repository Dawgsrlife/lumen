import React from 'react';
import { motion } from 'framer-motion';
import { useClerkUser } from '../hooks/useClerkUser';
import { Button } from '../components/ui';

const WelcomePage: React.FC = () => {
  const { user } = useClerkUser();
  
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6">
            Welcome back,
          </h1>
          <h2 className="text-6xl md:text-7xl font-light text-lumen-primary mb-8">
            {displayName}!
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ready to continue your mental wellness journey?
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          <Button 
            size="lg"
            className="text-lg px-8 py-4 bg-lumen-primary text-white hover:bg-lumen-primary/90 transition-colors mr-4"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </Button>
          
          <Button 
            size="lg"
            variant="ghost"
            className="text-lg px-8 py-4 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => window.location.href = '/onboarding'}
          >
            Complete Onboarding
          </Button>
        </motion.div>

        {/* Quick Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-2xl font-semibold text-lumen-primary">0</div>
            <div className="text-sm text-gray-600">Emotions Tracked</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-2xl font-semibold text-lumen-primary">0</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-2xl font-semibold text-lumen-primary">0</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage; 