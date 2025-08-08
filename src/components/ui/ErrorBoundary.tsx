import React, { Component, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.8),transparent_50%)]" />

          <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
            <motion.div
              className="max-w-lg w-full bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl shadow-slate-900/10 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Error Icon Section */}
              <div className="relative p-12 text-center">
                <motion.div
                  className="relative mb-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  className="text-3xl font-light text-slate-900 mb-4 tracking-wide"
                  style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Oops! Something went wrong
                </motion.h2>

                <motion.div
                  className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mb-8"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 64, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                />

                <motion.p
                  className="text-slate-600 mb-10 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  We're sorry, but something unexpected happened. Your mindful
                  journey is important to us, so let's get you back on track.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="w-full px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-medium text-lg shadow-xl shadow-slate-900/25 hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-500 cursor-pointer"
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        🔄
                      </motion.div>
                      <span>Refresh Page</span>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="w-full px-8 py-4 bg-white/60 backdrop-blur-sm text-slate-700 rounded-2xl font-medium text-lg border-2 border-slate-200/50 hover:bg-white/80 hover:border-slate-300/50 hover:shadow-lg hover:shadow-slate-900/10 transition-all duration-300 cursor-pointer"
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ x: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🏠
                      </motion.div>
                      <span>Go to Dashboard</span>
                    </div>
                  </motion.button>
                </motion.div>

                {/* Development Error Details */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <motion.details
                    className="mt-8 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700 font-medium mb-3 transition-colors">
                      🔧 Error Details (Development)
                    </summary>
                    <motion.pre
                      className="text-xs text-red-700 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl overflow-auto border border-red-200/50 shadow-sm"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {this.state.error.toString()}
                    </motion.pre>
                  </motion.details>
                )}

                {/* Encouraging Message */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <p className="text-sm text-slate-500 font-light">
                    Your mindful progress is safe and will be here when you
                    return ✨
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
