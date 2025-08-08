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
  const [showCompletionCelebration, setShowCompletionCelebration] =
    useState(false);

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
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
              {error && (
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
                      style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                    >
                      Connection Lost
                    </h3>
                    <p className="text-red-200 mb-8 leading-relaxed font-light">
                      We're having trouble connecting to your mindful
                      experience. This might be a temporary network issue.
                    </p>
                    <motion.button
                      onClick={() => {
                        setError(null);
                        window.location.reload();
                      }}
                      className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-medium border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Game Controls Overlay */}
            {isLoaded && (
              <motion.div
                className="absolute top-6 right-6 flex gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={handleFullscreen}
                  className="px-4 py-2 bg-black/60 backdrop-blur-sm text-white rounded-2xl text-sm font-medium border border-white/20 hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">⛶</span>
                  Fullscreen
                </motion.button>

                <motion.button
                  onClick={() => {
                    handleStopGame();
                    if (onGameComplete) {
                      setShowCompletionCelebration(true);
                      setTimeout(() => {
                        // Add a fade out transition before completing
                        setShowCompletionCelebration(false);
                        setTimeout(() => {
                          onGameComplete({
                            gameId: gameId,
                            score: gameData?.score || 0,
                            duration: 0,
                            achievements: [],
                          });
                        }, 500); // Small delay for smooth transition
                      }, 3000); // Reduced from 3500 to 3000 for better flow
                    }
                  }}
                  className="px-4 py-2 bg-red-600/60 backdrop-blur-sm text-white rounded-2xl text-sm font-medium border border-red-400/20 hover:bg-red-600/80 transition-all duration-300 cursor-pointer shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Complete Journey
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Elegant Game Completion Section */}
          {isLoaded && (
            <motion.div
              className="relative p-10 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <div className="text-center">
                <motion.button
                  onClick={() => {
                    setShowCompletionCelebration(true);
                    setTimeout(() => {
                      // Add a fade out transition before completing
                      setShowCompletionCelebration(false);
                      setTimeout(() => {
                        onGameComplete?.({
                          gameId,
                          score: gameData?.score || 0,
                          duration: 0,
                          achievements: gameData?.achievements || [],
                        });
                      }, 500); // Small delay for smooth transition
                    }, 3000); // Reduced from 3500 to 3000 for better flow
                  }}
                  className="group relative overflow-hidden px-12 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl font-medium text-lg shadow-xl shadow-slate-900/25 hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-500 cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    y: -4,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />

                  <div className="relative flex items-center gap-4">
                    <motion.span
                      className="text-2xl"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    >
                      {theme.icon}
                    </motion.span>
                    <span className="tracking-wide">Complete Experience</span>
                    <motion.div
                      className="text-xl"
                      animate={{ x: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      ✨
                    </motion.div>
                  </div>
                </motion.button>

                <motion.p
                  className="mt-6 text-slate-600 font-light text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Take your time and enjoy the mindful experience
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Completion Celebration Modal */}
          <AnimatePresence>
            {showCompletionCelebration && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center p-8 max-w-md">
                  <motion.div
                    className="text-8xl mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                  >
                    {theme.icon}
                  </motion.div>

                  <motion.h3
                    className={`text-2xl font-light mb-4 tracking-wide ${theme.accentColor}`}
                    style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Journey Complete
                  </motion.h3>

                  <motion.p
                    className="text-slate-700 leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {theme.completionMessage}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Game Results Display */}
          {gameData && (
            <motion.div
              className={`relative p-10 bg-gradient-to-br ${theme.gradient} bg-opacity-10 backdrop-blur-sm border-t border-white/50`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative background */}
              <div className={`absolute inset-0 ${theme.bgPattern}`} />

              <div className="relative">
                <motion.div
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-2xl">{theme.icon}</span>
                  </div>
                  <h3
                    className={`text-3xl font-light tracking-wide ${theme.accentColor}`}
                    style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                  >
                    Experience Results
                  </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">⭐</span>
                      <span className="text-slate-600 font-medium text-lg">
                        Mindfulness Score
                      </span>
                    </div>
                    <div className={`text-4xl font-bold ${theme.accentColor}`}>
                      {gameData.score}
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">⏱️</span>
                      <span className="text-slate-600 font-medium text-lg">
                        Time Spent
                      </span>
                    </div>
                    <div className="text-4xl font-bold text-slate-700">
                      {Math.round(gameData.duration / 60)}m{" "}
                      {gameData.duration % 60}s
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl">🏆</span>
                    <span className="text-slate-600 font-medium text-lg">
                      Mindful Achievements
                    </span>
                  </div>

                  {gameData.achievements.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {gameData.achievements.map((achievement, index) => (
                        <motion.span
                          key={index}
                          className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} bg-opacity-20 ${theme.accentColor} rounded-2xl text-sm font-medium border border-white/50 shadow-sm`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          {achievement}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm italic font-light">
                      Your mindful presence is achievement enough
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UnityGame;
