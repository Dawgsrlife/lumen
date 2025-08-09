import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unity, useUnityContext } from "react-unity-webgl";
import { LoadingSpinner } from "../ui";
import type { UnityGameData, UnityReward } from "../../services/unity";

interface UnityGameProps {
  gameId: string;
  gameTitle: string;
  description: string;
  buildUrl: string;
  gameName?: string;
  emotionData?: {
    emotion: string;
    intensity: number;
    context?: unknown;
  };
  onGameComplete?: (data: UnityGameData) => void;
  onRewardEarned?: (reward: UnityReward) => void;
  className?: string;
}

// Game theme configurations for sophisticated styling
const gameThemes: Record<
  string,
  {
    gradient: string;
    accentColor: string;
    bgPattern: string;
    icon: string;
    completionMessage: string;
  }
> = {
  colorbloom: {
    gradient: "from-pink-400 via-rose-300 to-orange-300",
    accentColor: "text-rose-600",
    bgPattern:
      "bg-[radial-gradient(circle_at_30%_20%,rgba(251,113,133,0.1),transparent_50%)]",
    icon: "🌸",
    completionMessage: "Beautiful blooms flourish from your care",
  },
  rythmgrow: {
    gradient: "from-green-400 via-emerald-300 to-teal-300",
    accentColor: "text-emerald-600",
    bgPattern:
      "bg-[radial-gradient(circle_at_70%_30%,rgba(52,211,153,0.1),transparent_50%)]",
    icon: "🌳",
    completionMessage: "Your rhythm nurtures growth and vitality",
  },
  boxbreathing: {
    gradient: "from-blue-400 via-cyan-300 to-sky-300",
    accentColor: "text-blue-600",
    bgPattern:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]",
    icon: "🫁",
    completionMessage: "Peace flows through your mindful breathing",
  },
  memorylantern: {
    gradient: "from-amber-400 via-yellow-300 to-orange-300",
    accentColor: "text-amber-600",
    bgPattern:
      "bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.1),transparent_50%)]",
    icon: "🏮",
    completionMessage: "Your memories shine with loving light",
  },
  balancingact: {
    gradient: "from-slate-400 via-gray-300 to-stone-300",
    accentColor: "text-slate-600",
    bgPattern:
      "bg-[radial-gradient(circle_at_60%_40%,rgba(100,116,139,0.1),transparent_50%)]",
    icon: "🪨",
    completionMessage: "Balance restored through patient practice",
  },
  default: {
    gradient: "from-indigo-400 via-purple-300 to-pink-300",
    accentColor: "text-indigo-600",
    bgPattern:
      "bg-[radial-gradient(circle_at_40%_60%,rgba(129,140,248,0.1),transparent_50%)]",
    icon: "✨",
    completionMessage: "Journey completed with mindful presence",
  },
};

const UnityGame: React.FC<UnityGameProps> = ({
  gameId,
  gameTitle,
  buildUrl,
  gameName,
  emotionData,
  onGameComplete,
  onRewardEarned,
}) => {
  const [gameData, setGameData] = useState<UnityGameData | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Get theme for current game
  const theme = gameThemes[gameName || "default"] || gameThemes.default;

  // Initialize Unity context with proper URLs and game parameter
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    addEventListener,
    removeEventListener,
    sendMessage,
    requestFullscreen,
  } = useUnityContext({
    loaderUrl: `${buildUrl}/Builds.loader.js${gameName ? `?game=${gameName}` : ""}`,
    dataUrl: `${buildUrl}/Builds.data.br`,
    frameworkUrl: `${buildUrl}/Builds.framework.js.br`,
    codeUrl: `${buildUrl}/Builds.wasm.br`,
  });

  const [error, setError] = useState<string | null>(null);

  // Enhanced loading error detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded && loadingProgression === 0) {
        setLoadingError(
          "Game files may not be loading correctly. Check console for network errors."
        );
        console.error(
          "Unity loading timeout - files may be missing or inaccessible:",
          {
            buildUrl,
            loaderUrl: `${buildUrl}/Builds.loader.js`,
            dataUrl: `${buildUrl}/Builds.data.br`,
            frameworkUrl: `${buildUrl}/Builds.framework.js.br`,
            codeUrl: `${buildUrl}/Builds.wasm.br`,
          }
        );
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoaded, loadingProgression, buildUrl]);

  // Handle game start event
  const handleGameStart = useCallback(() => {
    // Game started
  }, []);

  // Handle game end event
  const handleGameEnd = useCallback(
    (data: UnityGameData) => {
      setGameData(data);
      onGameComplete?.(data);
    },
    [onGameComplete]
  );

  // Handle achievement event
  const handleAchievement = useCallback(() => {
    // Achievement earned
  }, []);

  // Handle reward event
  const handleReward = useCallback(
    (data: UnityReward) => {
      onRewardEarned?.(data);
    },
    [onRewardEarned]
  );

  // Handle Unity errors
  const handleError = useCallback(() => {
    setError(`Unable to load the game`);
  }, []);

  // Handle Unity loaded event
  const handleLoaded = useCallback(() => {
    setError(null);
  }, []);

  // Inject custom CSS for Unity UI styling
  useEffect(() => {
    const styleId = "unity-ui-custom-styles";

    // Remove existing style if any
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new styles
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Custom Unity UI Styling */
      canvas {
        border-radius: 12px !important;
      }
      
      /* Try to target Unity's internal UI elements through canvas interaction */
      #unity-container button,
      .unity-canvas button,
      canvas + div button {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 8px !important;
        color: white !important;
        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        font-weight: 500 !important;
        padding: 8px 16px !important;
        font-size: 13px !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      }
      
      #unity-container button:hover,
      .unity-canvas button:hover,
      canvas + div button:hover {
        background: linear-gradient(135deg, #334155 0%, #475569 100%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
      }
    `;

    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // Setup event listeners including error handling
  useEffect(() => {
    // Game event listeners
    addEventListener("GameStart", handleGameStart);
    addEventListener("GameEnd", handleGameEnd);
    addEventListener("Achievement", handleAchievement);
    addEventListener("Reward", handleReward);

    // System event listeners
    addEventListener("error", handleError);
    addEventListener("loaded", handleLoaded);

    return () => {
      removeEventListener("GameStart", handleGameStart);
      removeEventListener("GameEnd", handleGameEnd);
      removeEventListener("Achievement", handleAchievement);
      removeEventListener("Reward", handleReward);
      removeEventListener("error", handleError);
      removeEventListener("loaded", handleLoaded);
    };
  }, [
    addEventListener,
    removeEventListener,
    handleGameStart,
    handleGameEnd,
    handleAchievement,
    handleReward,
    handleError,
    handleLoaded,
  ]);

  // Safe Unity message sending
  const sendUnityMessage = useCallback(
    (gameObject: string, method: string, parameter?: string) => {
      if (!isLoaded) return false;

      try {
        sendMessage(gameObject, method, parameter);
        return true;
      } catch {
        return false;
      }
    },
    [isLoaded, sendMessage]
  );

  // Send emotion data to Unity when loaded
  useEffect(() => {
    if (isLoaded && emotionData) {
      const emotionPayload = JSON.stringify({
        emotion: emotionData.emotion,
        intensity: emotionData.intensity,
        timestamp: new Date().toISOString(),
      });

      // Try different possible GameObject names
      const emotionSent =
        sendUnityMessage("GameManager", "ReceiveEmotionData", emotionPayload) ||
        sendUnityMessage("Main Camera", "ReceiveEmotionData", emotionPayload) ||
        sendUnityMessage("Canvas", "ReceiveEmotionData", emotionPayload);

      if (!emotionSent) {
        console.warn("Failed to send emotion data to Unity game");
      }
    }
  }, [isLoaded, emotionData, sendUnityMessage]);

  // Send game name to Unity when loaded
  useEffect(() => {
    if (isLoaded && gameName) {
      // Try different possible GameObject names and methods
      const gameSent =
        sendUnityMessage("GameManager", "LoadGame", gameName) ||
        sendUnityMessage("GameController", "LoadGame", gameName) ||
        sendUnityMessage("Main Camera", "LoadGame", gameName);

      if (!gameSent) {
        console.warn("Failed to send game name to Unity game");
      }
    }
  }, [isLoaded, gameName, sendUnityMessage]);

  const handleStopGame = () => {
    if (!isLoaded) return;

    // Try to send stop message to various possible GameObjects
    const stopSent =
      sendUnityMessage("GameManager", "EndGame") ||
      sendUnityMessage("GameController", "EndGame") ||
      sendUnityMessage("Main Camera", "EndGame");

    if (!stopSent) {
      console.warn("Failed to send stop message to Unity game");
    }
  };

  const handleFullscreen = () => {
    requestFullscreen(true);
  };

  return (
    <div className="w-full">
      {/* Sophisticated Game Container with Dynamic Theming */}
      <motion.div
        className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl shadow-slate-900/10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Dynamic background pattern based on game theme */}
        <div className={`absolute inset-0 ${theme.bgPattern}`} />

        {/* Subtle gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`}
        />

        {/* Premium Game Header */}
        <motion.div
          className="relative p-8 text-center border-b border-white/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="text-4xl mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {theme.icon}
          </motion.div>

          <h1
            className={`text-3xl font-light mb-2 tracking-wide ${theme.accentColor}`}
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            {gameTitle}
          </h1>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto" />
        </motion.div>

        {/* Enhanced Game Canvas Container */}
        <div className="relative">
          <motion.div
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Unity
              unityProvider={unityProvider}
              style={{
                width: "100%",
                height: "600px",
                maxWidth: "100%",
                aspectRatio: "16/9",
                backgroundColor: "#0f172a",
              }}
            />

            {/* Sophisticated Loading Overlay */}
            <AnimatePresence>
              {!isLoaded && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center max-w-md px-8">
                    <motion.div
                      className="relative mb-8"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <LoadingSpinner size="lg" />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-20 rounded-full blur-xl scale-150`}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3
                        className="text-2xl font-light text-white mb-4 tracking-wide"
                        style={{
                          fontFamily: "Playfair Display, Georgia, serif",
                        }}
                      >
                        Preparing {gameTitle}
                      </h3>

                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-48 h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full`}
                            style={{ width: `${loadingProgression * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className="text-slate-300 text-sm font-medium min-w-[3rem]">
                          {Math.round(loadingProgression * 100)}%
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm font-light leading-relaxed">
                        Creating your mindful sanctuary...
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Error Overlay */}
            <AnimatePresence>
              {(error || loadingError) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-red-800/95 to-red-900/95 backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center text-white p-8 max-w-md">
                    <motion.div
                      className="text-6xl mb-6"
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
                      ⚠️
                    </motion.div>

                    <h3
                      className="text-2xl font-light mb-4 tracking-wide"
                      style={{
                        fontFamily: "Playfair Display, Georgia, serif",
                      }}
                    >
                      Game Loading Issue
                    </h3>

                    <p className="text-red-200 text-sm mb-6 leading-relaxed">
                      {error || loadingError}
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setError(null);
                          setLoadingError(null);
                          window.location.reload();
                        }}
                        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
                      >
                        Retry Game
                      </button>

                      <button
                        onClick={() => {
                          if (onGameComplete) {
                            onGameComplete({
                              gameId: gameId,
                              score: 0,
                              duration: 0,
                              achievements: [],
                            });
                          }
                        }}
                        className="w-full px-6 py-3 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl font-light transition-all duration-300"
                      >
                        Skip Game
                      </button>
                    </div>

                    <p className="text-xs text-red-300 mt-4 opacity-70">
                      Check browser console for technical details
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Controls Overlay */}
            {isLoaded && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleFullscreen}
                  className="px-3 py-2 bg-black/50 text-white border border-white/20 rounded-lg text-sm hover:bg-black/70 transition-all duration-300"
                >
                  ⛶ Fullscreen
                </button>
                <button
                  onClick={() => {
                    handleStopGame();
                    if (onGameComplete) {
                      onGameComplete({
                        gameId: gameId,
                        score: 0,
                        duration: 0,
                        achievements: [],
                      });
                    }
                  }}
                  className="px-3 py-2 bg-red-600/50 text-white border border-red-400/20 rounded-lg text-sm hover:bg-red-600/70 transition-all duration-300"
                >
                  Stop
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Game Controls */}
        {isLoaded && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-center">
              <motion.div
                className="relative overflow-hidden rounded-lg inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background:
                    gameId === "colorbloom"
                      ? "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)" // Brighter pink for Color Bloom
                      : gameId === "rythmgrow"
                        ? "linear-gradient(135deg, #34d399 0%, #10b981 100%)"
                        : gameId === "boxbreathing"
                          ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
                          : gameId === "memorylantern"
                            ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                            : gameId === "balancingact"
                              ? "linear-gradient(135deg, #64748b 0%, #475569 100%)"
                              : "linear-gradient(135deg, #f472b6 50%, #ec4899 100%)", // Default to pink instead of purple
                }}
              >
                <button
                  onClick={() =>
                    onGameComplete &&
                    onGameComplete({
                      gameId,
                      score: gameData?.score || 0,
                      duration: 0,
                      achievements: gameData?.achievements || [],
                    })
                  }
                  className="px-8 py-3 bg-transparent text-white font-semibold border-0 shadow-lg hover:shadow-xl cursor-pointer relative z-10 transition-all duration-300"
                >
                  Finish
                </button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Game Results */}
        {gameData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-blue-50 border-t border-blue-200"
          >
            <h4 className="font-semibold text-gray-900 mb-3">Game Results</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Score:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {gameData.score}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2">
                  {Math.round(gameData.duration / 60)}m {gameData.duration % 60}
                  s
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Achievements:</span>
                <div className="mt-1">
                  {gameData.achievements.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {gameData.achievements.map((achievement, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-600 text-xs rounded-full"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs">
                      No achievements earned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <div className="mb-12"></div>
    </div>
  );
};

export default UnityGame;
