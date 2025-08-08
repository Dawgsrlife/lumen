import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "../hooks/useFlowState";
import { useClerkUser } from "../hooks/useClerkUser";

interface WelcomeScreenProps {
  username?: string;
  onComplete?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  username,
  onComplete,
}) => {
  const { user } = useClerkUser();
  const flowState = useFlowState();

  // Use provided username or derive from user
  const displayName =
    username ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "there";

  useEffect(() => {
    // Mark welcome as shown in session storage
    if (user?.id) {
      const welcomeShownKey = `lumen-welcome-shown-${user.id}`;
      sessionStorage.setItem(welcomeShownKey, "true");
    }

    // Auto-advance after 3 seconds
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        flowState.actions.setCurrentStep("emotion-selection");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete, flowState.actions, user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Soft background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-yellow-400/5 via-purple-600/8 to-transparent blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* Yellow Circle Animation */}
          <motion.div
            className="mb-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.2,
            }}
          >
            <motion.div
              className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg"
              animate={{
                y: [-8, 8, -8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.6,
            }}
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight tracking-tight"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Welcome to Lumen,
              <br />
              <span className="text-gray-700">{displayName}!</span>
            </h1>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mt-12 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 1.0,
            }}
          >
            <div className="w-32 h-0.5 bg-gray-200 mx-auto rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  delay: 1.0,
                }}
              />
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
              delay: 1.2,
            }}
          >
            Let's start by understanding how you're feeling today.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
