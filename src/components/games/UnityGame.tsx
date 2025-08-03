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
    dataUrl: `${buildUrl}/Builds.data`,
    frameworkUrl: `${buildUrl}/Builds.framework.js`,
    codeUrl: `${buildUrl}/Builds.wasm`,
  });

  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle game start event
  const handleGameStart = useCallback((data: unknown) => {
    console.log('Game started:', data);
  }, []);

  // Handle game end event
  const handleGameEnd = useCallback((data: UnityGameData) => {
    setGameData(data);
    onGameComplete?.(data);
    console.log('Game ended:', data);
  }, [onGameComplete]);

  // Handle achievement event
  const handleAchievement = useCallback((data: unknown) => {
    console.log('Achievement earned:', data);
  }, []);

  // Handle reward event
  const handleReward = useCallback((data: UnityReward) => {
    onRewardEarned?.(data);
    console.log('Reward earned:', data);
  }, [onRewardEarned]);

  // Handle Unity errors
  const handleError = useCallback((message: string) => {
    console.error('Unity Error:', message);
    setError(`Unity Error: ${message}`);
  }, []);

  // Handle Unity loaded event
  const handleLoaded = useCallback(() => {
    console.log('Unity application loaded successfully');
    setIsInitialized(true);
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

  // Debug Unity context initialization
  useEffect(() => {
    console.log('Unity Context Debug Info:', {
      buildUrl,
      gameName,
      files: {
        loader: `${buildUrl}/Builds.loader.js${gameName ? `?game=${gameName}` : ''}`,
        data: `${buildUrl}/Builds.data`,
        framework: `${buildUrl}/Builds.framework.js`,
        wasm: `${buildUrl}/Builds.wasm`,
      },
      isLoaded,
      loadingProgression,
      error,
      isInitialized,
    });
  }, [buildUrl, gameName, isLoaded, loadingProgression, error, isInitialized]);

  // Safe Unity message sending with error handling
  const sendUnityMessage = useCallback((gameObject: string, method: string, parameter?: string) => {
    if (!isLoaded) {
      console.warn('Unity not loaded yet, message queued for later');
      return false;
    }

    try {
      console.log(`Sending Unity message: ${gameObject}.${method}(${parameter || 'no params'})`);
      sendMessage(gameObject, method, parameter);
      return true;
    } catch (err) {
      console.warn(`Unity message failed: ${gameObject}.${method} - ${err}`);
      // Don't set error for missing GameObjects, just log warning
      return false;
    }
  }, [isLoaded, sendMessage]);

  // Send emotion data to Unity when loaded
  useEffect(() => {
    if (isLoaded && emotionData) {
      console.log('Sending emotion data to Unity:', emotionData);
      
      const emotionPayload = JSON.stringify({
        emotion: emotionData.emotion,
        intensity: emotionData.intensity,
        timestamp: new Date().toISOString(),
      });

      // Try different possible GameObject names
      const success = sendUnityMessage('GameManager', 'ReceiveEmotionData', emotionPayload) ||
                     sendUnityMessage('Main Camera', 'ReceiveEmotionData', emotionPayload) ||
                     sendUnityMessage('Canvas', 'ReceiveEmotionData', emotionPayload);
      
      if (!success) {
        console.log('No GameObject found to receive emotion data - Unity game may handle this internally');
      }
    }
  }, [isLoaded, emotionData, sendUnityMessage]);

  // Send game name to Unity when loaded
  useEffect(() => {
    if (isLoaded && gameName) {
      console.log('Requesting Unity to load game:', gameName);
      
      // Try different possible GameObject names and methods
      const success = sendUnityMessage('GameManager', 'LoadGame', gameName) ||
                     sendUnityMessage('GameController', 'LoadGame', gameName) ||
                     sendUnityMessage('Main Camera', 'LoadGame', gameName);
      
      if (!success) {
        console.log('No GameObject found to handle game loading - Unity game may use URL parameter');
      }
    }
  }, [isLoaded, gameName, sendUnityMessage]);

  const handleStartGame = () => {
    console.log('Starting Unity game:', { gameId, buildUrl, gameName });
    
    if (!isLoaded) {
      console.warn('Unity not loaded yet, cannot start game');
      return;
    }

    const gameData = JSON.stringify({
      gameId,
      gameName,
      userData: { emotionData }
    });

    // Try to send start message to various possible GameObjects
    const success = sendUnityMessage('GameManager', 'StartGame', gameData) ||
                   sendUnityMessage('GameController', 'StartGame', gameData) ||
                   sendUnityMessage('Main Camera', 'StartGame', gameData);
    
    if (!success) {
      console.log('Unity game started without explicit messaging - game may auto-start');
    }
  };

  const handleStopGame = () => {
    if (!isLoaded) {
      console.warn('Unity not loaded, cannot stop game');
      return;
    }

    // Try to send stop message to various possible GameObjects
    const success = sendUnityMessage('GameManager', 'EndGame') ||
                   sendUnityMessage('GameController', 'EndGame') ||
                   sendUnityMessage('Main Camera', 'EndGame');
    
    if (!success) {
      console.log('Unity game may not have explicit stop handling - this is normal');
    }
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
      <Card title={gameTitle} subtitle={description}>
        <div className="space-y-4">
          {/* Game Canvas */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <Unity 
              unityProvider={unityProvider}
              style={{ 
                width: '960px', 
                height: '720px', 
                maxWidth: '100%',
                aspectRatio: '4/3',
                backgroundColor: '#000000'
              }}
            />
            
            {/* Loading Overlay */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-white mt-4">
                    Loading Unity Game... {Math.round(loadingProgression * 100)}%
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    Build URL: {buildUrl}
                  </p>
                  {loadingProgression === 0 && (
                    <p className="text-yellow-400 text-sm mt-2">
                      ⚠️ Loading not started - Check console for errors
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {error && (
              <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p className="font-semibold">Unity Loading Error</p>
                  <p className="text-sm mt-2 max-w-md">{error}</p>
                  <p className="text-xs mt-2 text-white/70">Check browser console for details</p>
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
                  onClick={handleStopGame}
                  size="sm"
                  variant="outline"
                  className="bg-red-600/50 text-white border-red-400/20 hover:bg-red-600/70"
                >
                  ⏹ Stop
                </Button>
              </div>
            )}
          </div>

          {/* Game Controls */}
          {isLoaded && (
            <div className="flex justify-center">
              <Button onClick={handleStartGame} size="lg">
                🎮 Start Game
              </Button>
            </div>
          )}

          {/* Game Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Game Information & Debug</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Game ID:</span>
                <span className="ml-2 font-mono">{gameId}</span>
              </div>
              <div>
                <span className="text-gray-600">Game Name:</span>
                <span className="ml-2 font-mono">{gameName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 ${isLoaded ? 'text-green-600' : error ? 'text-red-600' : 'text-yellow-600'}`}>
                  {error ? 'Error' : isLoaded ? 'Ready' : 'Loading'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Progress:</span>
                <span className="ml-2">{Math.round(loadingProgression * 100)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Initialized:</span>
                <span className={`ml-2 ${isInitialized ? 'text-green-600' : 'text-gray-600'}`}>
                  {isInitialized ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="col-span-full">
                <span className="text-gray-600">Build Path:</span>
                <div className="ml-2 font-mono text-xs break-all bg-gray-100 p-2 rounded mt-1">
                  {buildUrl}
                </div>
              </div>
              <div className="col-span-full">
                <span className="text-gray-600">Loader URL:</span>
                <div className="ml-2 font-mono text-xs break-all bg-gray-100 p-2 rounded mt-1">
                  {buildUrl}/Builds.loader.js{gameName ? `?game=${gameName}` : ''}
                </div>
              </div>
              {error && (
                <div className="col-span-full">
                  <span className="text-red-600">Error:</span>
                  <div className="ml-2 text-xs text-red-700 bg-red-50 p-2 rounded mt-1">
                    {error}
                  </div>
                </div>
              )}
              {isLoaded && !error && (
                <div className="col-span-full">
                  <span className="text-green-600">Unity Status:</span>
                  <div className="ml-2 text-xs text-green-700 bg-green-50 p-2 rounded mt-1">
                    ✅ Unity game loaded successfully! If nothing appears, the game may need:
                    <br />• Proper lighting setup in Unity scene
                    <br />• Camera positioned correctly  
                    <br />• GameObjects with renderers enabled
                    <br />• Check Unity console for runtime errors
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Results */}
          {gameData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-lumen-primary/10 to-lumen-secondary/10 rounded-lg p-4 border border-lumen-primary/20"
            >
              <h4 className="font-semibold text-lumen-dark mb-3">Game Results</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Score:</span>
                  <span className="ml-2 font-bold text-lumen-primary">{gameData.score}</span>
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
                            className="px-2 py-1 bg-lumen-primary/20 text-lumen-primary text-xs rounded-full"
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
      </Card>
    </motion.div>
  );
};

export default UnityGame; 