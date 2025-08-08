import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button, LoadingSpinner } from "../ui";
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Game Canvas - More compact */}
        <div className="relative bg-gray-900 overflow-hidden">
          <Unity
            unityProvider={unityProvider}
            style={{
              width: "100%",
              height: "500px", // Reduced from 720px
              maxWidth: "100%",
              aspectRatio: "16/10", // More widescreen friendly
              backgroundColor: "#000000",
            }}
          />

          {/* Loading Overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-white mt-4">
                  Loading {gameTitle}... {Math.round(loadingProgression * 100)}%
                </p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <div className="text-2xl mb-2">⚠️</div>
                <p className="font-semibold">Unity Loading Error</p>
                <p className="text-sm mt-2 max-w-md">
                  Unable to load the game. Please try refreshing the page.
                </p>
                <Button
                  onClick={() => {
                    setError(null);
                    window.location.reload();
                  }}
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Game Controls Overlay */}
          {isLoaded && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={handleFullscreen}
                size="sm"
                variant="outline"
                className="bg-black/50 text-white border-white/20 hover:bg-black/70"
              >
                ⛶ Fullscreen
              </Button>
              <Button
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
                size="sm"
                variant="outline"
                className="bg-red-600/50 text-white border-red-400/20 hover:bg-red-600/70"
              >
                Stop
              </Button>
            </div>
          )}
        </div>

        {/* Game Controls */}
        {isLoaded && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-center">
              <div
                className="relative overflow-hidden rounded-lg inline-block"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #8b5cf6 100%)",
                }}
              >
                <Button
                  onClick={() =>
                    onGameComplete &&
                    onGameComplete({
                      gameId,
                      score: gameData?.score || 0,
                      duration: 0,
                      achievements: gameData?.achievements || [],
                    })
                  }
                  size="lg"
                  className="bg-transparent text-white font-semibold border-0 shadow-lg hover:shadow-xl cursor-pointer relative z-10"
                >
                  Finish
                </Button>
              </div>
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
      </div>
    </div>
  );
};

export default UnityGame;
