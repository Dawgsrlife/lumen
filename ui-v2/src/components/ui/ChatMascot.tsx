import React from "react";
import { motion } from "framer-motion";

interface ChatMascotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const ChatMascot: React.FC<ChatMascotProps> = ({
  size = "md",
  className = "",
  animated = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const IconContent = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Cute anime-style bunny-fox mascot */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Main body - soft orange rounded shape */}
        <div className="relative w-full h-full">
          {/* Body */}
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-orange-200 to-orange-300 border border-orange-400 relative overflow-hidden"
            style={{
              boxShadow: "0 2px 6px rgba(251, 146, 60, 0.2)",
            }}
          >
            {/* Eyes - larger and more anime-style */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full relative">
                <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-white rounded-full"></div>
              </div>
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full relative">
                <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Cute blush marks */}
            <div className="absolute top-1/2 left-1/4 w-1 h-0.5 bg-pink-300 rounded-full opacity-60"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-0.5 bg-pink-300 rounded-full opacity-60"></div>

            {/* Small mouth */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1">
              <div className="w-1 h-0.5 bg-gray-700 rounded-full"></div>
            </div>
          </div>

          {/* Bunny-fox ears */}
          <div className="absolute -top-1 left-1/3 w-1.5 h-2.5 bg-orange-300 rounded-full transform -rotate-12"></div>
          <div className="absolute -top-1 right-1/3 w-1.5 h-2.5 bg-orange-300 rounded-full transform rotate-12"></div>

          {/* Ear highlights */}
          <div className="absolute -top-0.5 left-1/3 w-0.5 h-1 bg-pink-200 rounded-full transform -rotate-12"></div>
          <div className="absolute -top-0.5 right-1/3 w-0.5 h-1 bg-pink-200 rounded-full transform rotate-12"></div>
        </div>
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <IconContent />
      </motion.div>
    );
  }

  return <IconContent />;
};

export default ChatMascot;
