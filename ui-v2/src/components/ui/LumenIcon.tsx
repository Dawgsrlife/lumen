import React from "react";
import { motion } from "framer-motion";

interface LumenIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}

const LumenIcon: React.FC<LumenIconProps> = ({
  size = "md",
  className = "",
  animated = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const IconContent = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Ultra-clean minimalist design */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Simple circle with subtle gradient - represents "lumen" (light unit) */}
        <div
          className="w-6 h-6 rounded-full border-2 border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-200"
          style={{
            boxShadow: "0 0 8px rgba(251, 191, 36, 0.3)",
          }}
        />
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
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
      >
        <IconContent />
      </motion.div>
    );
  }

  return <IconContent />;
};

export default LumenIcon;
