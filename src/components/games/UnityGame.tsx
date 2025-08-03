import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Card, Button, LoadingSpinner } from '../ui';
import type { UnityGameData, UnityReward } from '../../services/unity';

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
  description,
  buildUrl,
  gameName,
  emotionData,
  onGameComplete,
  onRewardEarned,
  className = '',
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
    loaderUrl: `${buildUrl}/Builds.loader.js${gameName ? `?game=${gameName}` : ''}`,
    dataUrl: `${buildUrl}/Builds.data.br`,
    frameworkUrl: `${buildUrl}/Builds.framework.js.br`,
    codeUrl: `${buildUrl}/Builds.wasm.br`,
  });

  const [error, setError] = useState<string | null>(null);

  // Handle game start event
  const handleGameStart = useCallback((_data: unknown) => {
    // Game started
  }, []);

  // Handle game end event
  const handleGameEnd = useCallback((data: UnityGameData) => {
    setGameData(data);
    onGameComplete?.(data);
  }, [onGameComplete]);

  // Handle achievement event
  const handleAchievement = useCallback((_data: unknown) => {
    // Achievement earned
  }, []);

  // Handle reward event
  const handleReward = useCallback((data: UnityReward) => {
    onRewardEarned?.(data);
  }, [onRewardEarned]);

  // Handle Unity errors
  const handleError = useCallback((_message: string) => {
    setError(`Unable to load the game`);
  }, []);

  // Handle Unity loaded event
  const handleLoaded = useCallback(() => {
    setError(null);
  }, []);

  // Setup event listeners including error handling
  useEffect(() => {
    // Game event listeners
    addEventListener('GameStart', handleGameStart);
    addEventListener('GameEnd', handleGameEnd);
    addEventListener('Achievement', handleAchievement);
    addEventListener('Reward', handleReward);
    
    // System event listeners
    addEventListener('error', handleError);
    addEventListener('loaded', handleLoaded);

    return () => {
      removeEventListener('GameStart', handleGameStart);
      removeEventListener('GameEnd', handleGameEnd);
      removeEventListener('Achievement', handleAchievement);
      removeEventListener('Reward', handleReward);
      removeEventListener('error', handleError);
      removeEventListener('loaded', handleLoaded);
    };
  }, [addEventListener, removeEventListener, handleGameStart, handleGameEnd, handleAchievement, handleReward, handleError, handleLoaded]);



  // Safe Unity message sending
  const sendUnityMessage = useCallback((gameObject: string, method: string, parameter?: string) => {
    if (!isLoaded) return false;

    try {
      sendMessage(gameObject, method, parameter);
      return true;
    } catch {
      return false;
    }
  }, [isLoaded, sendMessage]);

  // Send emotion data to Unity when loaded
  useEffect(() => {
    if (isLoaded && emotionData) {
      const emotionPayload = JSON.stringify({
        emotion: emotionData.emotion,
        intensity: emotionData.intensity,
        timestamp: new Date().toISOString(),
      });

      // Try different possible GameObject names
      sendUnityMessage('GameManager', 'ReceiveEmotionData', emotionPayload) ||
      sendUnityMessage('Main Camera', 'ReceiveEmotionData', emotionPayload) ||
      sendUnityMessage('Canvas', 'ReceiveEmotionData', emotionPayload);
    }
  }, [isLoaded, emotionData, sendUnityMessage]);

  // Send game name to Unity when loaded
  useEffect(() => {
    if (isLoaded && gameName) {
      // Try different possible GameObject names and methods
      sendUnityMessage('GameManager', 'LoadGame', gameName) ||
      sendUnityMessage('GameController', 'LoadGame', gameName) ||
      sendUnityMessage('Main Camera', 'LoadGame', gameName);
    }
  }, [isLoaded, gameName, sendUnityMessage]);

  const handleStartGame = () => {
    if (!isLoaded) return;

    const gameData = JSON.stringify({
      gameId,
      gameName,
      userData: { emotionData }
    });

    // Try to send start message to various possible GameObjects
    sendUnityMessage('GameManager', 'StartGame', gameData) ||
    sendUnityMessage('GameController', 'StartGame', gameData) ||
    sendUnityMessage('Main Camera', 'StartGame', gameData);
  };

  const handleStopGame = () => {
    if (!isLoaded) return;

    // Try to send stop message to various possible GameObjects
    sendUnityMessage('GameManager', 'EndGame') ||
    sendUnityMessage('GameController', 'EndGame') ||
    sendUnityMessage('Main Camera', 'EndGame');
  };

  const handleFullscreen = () => {
    requestFullscreen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="mb-4"></div>
      {/* Clean game container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Game canvas */}
        <div className="relative bg-gray-900 rounded-t-2xl overflow-hidden">
          <Unity 
            unityProvider={unityProvider}
            style={{ 
              width: '100%', 
              height: '500px',
              display: 'block'
            }}
          />
          
          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <div className="mb-4"></div>
                <p className="text-white text-lg mb-4">
                  Loading {gameTitle}...
                </p>
                <div className="w-64 h-2 bg-gray-700 rounded-full mb-4 mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(loadingProgression * 100)}%` }}
                  />
                </div>
                <p className="text-gray-300 text-sm">
                  {Math.round(loadingProgression * 100)}%
                </p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center">
              <div className="text-center text-white p-6 max-w-md">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold mb-3">Unable to Load Game</h3>
                <p className="text-sm mb-4 text-red-100">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-white text-red-900 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Game controls */}
          {isLoaded && (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleFullscreen}
                className="px-3 py-2 bg-black/60 text-white text-sm rounded-lg hover:bg-black/80 transition-colors backdrop-blur-sm cursor-pointer"
              >
                ⛶ Fullscreen
              </button>
            </div>
          )}
        </div>

        {/* Game info panel */}
        <div className="p-6 bg-gray-50">
          <div className="mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{gameTitle}</h3>
          <div className="mb-4"></div>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <div className="mb-4"></div>

          {/* Status indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <span className="text-gray-700">
                  {error ? 'Error' : isLoaded ? 'Ready' : 'Loading'}
                </span>
              </div>
              
              {gameName && (
                <div className="text-gray-500">
                  Playing: <span className="font-mono text-gray-700">{gameName}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                // Trigger game completion and move to journaling
                if (onGameComplete) {
                  onGameComplete({
                    gameId: gameId,
                    score: 0,
                    duration: 0,
                    achievements: []
                  });
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-purple-600 text-white text-sm rounded-lg hover:from-yellow-500 hover:to-purple-700 transition-all duration-200 cursor-pointer font-medium"
            >
              Skip Game
            </button>
          </div>
          <div className="mb-4"></div>

          {/* Game Results */}
          {gameData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20"
            >
              <h4 className="font-semibold text-gray-900 mb-3">Game Results</h4>
              <div className="mb-4"></div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Score:</span>
                  <span className="ml-2 font-bold text-blue-600">{gameData.score}</span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2">{Math.round(gameData.duration / 60)}m {gameData.duration % 60}s</span>
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
                      <span className="text-gray-500 text-xs">No achievements earned</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <div className="mb-4"></div>
    </motion.div>
  );
};

export default UnityGame;