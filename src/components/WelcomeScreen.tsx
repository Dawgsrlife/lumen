import React from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  username?: string;
  onComplete?: () => void | Promise<void>;
  onNext?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  username,
  onComplete,
  onNext,
}) => {
  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <div className="text-6xl mb-6">🌟</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Lumen{username ? `, ${username}` : ""}
        </h1>
        <p className="text-gray-600 mb-8">
          Your journey to emotional wellbeing starts here. Let's begin with
          understanding how you're feeling today.
        </p>
        {(onComplete || onNext) && (
          <button
            onClick={handleContinue}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Get Started
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
