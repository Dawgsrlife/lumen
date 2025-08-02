import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, LoadingSpinner } from '../ui';
import { unityService } from '../../services/unity';
import type { UnityGameData, UnityReward } from '../../services/unity';

interface UnityGameProps {
  gameId: string;
  gameTitle: string;
  description: string;
  buildUrl?: string;
  onGameComplete?: (data: UnityGameData) => void;
  onRewardEarned?: (reward: UnityReward) => void;
  className?: string;
}

const UnityGame: React.FC<UnityGameProps> = ({
  gameId,
  gameTitle,
  description,
  // buildUrl, // Will be used for Unity WebGL loading
  onGameComplete,
  onRewardEarned,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameData, setGameData] = useState<UnityGameData | null>(null);

  useEffect(() => {
    // Setup Unity message handlers
    unityService.onMessageFromUnity('gameStart', (data) => {
      setIsPlaying(true);
      console.log('Game started:', data);
    });

    unityService.onMessageFromUnity('gameEnd', (data: UnityGameData) => {
      setIsPlaying(false);
      setGameData(data);
      onGameComplete?.(data);
      console.log('Game ended:', data);
    });

    unityService.onMessageFromUnity('achievement', (data) => {
      console.log('Achievement earned:', data);
    });

    unityService.onMessageFromUnity('reward', (data: UnityReward) => {
      onRewardEarned?.(data);
      console.log('Reward earned:', data);
    });

    // Setup global message handler
    unityService.setupGlobalMessageHandler();

    return () => {
      unityService.cleanup();
    };
  }, [onGameComplete, onRewardEarned]);

  const handleStartGame = () => {
    setIsLoading(true);
    setError(null);
    
    // Initialize Unity WebGL
    if (canvasRef.current) {
      try {
        // This would be replaced with actual Unity WebGL initialization
        // For now, we'll simulate the process
        setTimeout(() => {
          setIsLoading(false);
          setIsPlaying(true);
          unityService.startGame(gameId);
        }, 2000);
      } catch (err) {
        setError('Failed to load Unity game');
        setIsLoading(false);
      }
    }
  };

  const handleStopGame = () => {
    setIsPlaying(false);
    unityService.endGame();
  };

  const handleFullscreen = () => {
    if (canvasRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        canvasRef.current.requestFullscreen();
      }
    }
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
            <canvas
              ref={canvasRef}
              className="w-full h-96 bg-black"
              style={{ aspectRatio: '16/9' }}
            />
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-white mt-4">Loading Unity Game...</p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {error && (
              <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p className="font-semibold">Game Error</p>
                  <p className="text-sm">{error}</p>
                  <Button
                    onClick={handleStartGame}
                    className="mt-4"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Game Controls Overlay */}
            {isPlaying && !isLoading && (
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
          {!isPlaying && !isLoading && !error && (
            <div className="flex justify-center">
              <Button onClick={handleStartGame} size="lg">
                🎮 Start Game
              </Button>
            </div>
          )}

          {/* Game Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Game Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Game ID:</span>
                <span className="ml-2 font-mono">{gameId}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 ${isPlaying ? 'text-green-600' : 'text-gray-600'}`}>
                  {isPlaying ? 'Playing' : 'Ready'}
                </span>
              </div>
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