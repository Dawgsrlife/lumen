import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../components/ui';
import UnityGame from '../components/games/UnityGame';
import { useClerkUser } from '../hooks/useClerkUser';
import { apiService } from '../services/api';
// import { unityService } from '../services/unity'; // Will be used for Unity integration
import type { UnityGameData, UnityReward } from '../services/unity';

const Games: React.FC = () => {
  const { user } = useClerkUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const [gameMetadata, setGameMetadata] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  // const [gameResults, setGameResults] = useState<UnityGameData[]>([]); // Will be used for game analytics
  // const [rewards, setRewards] = useState<UnityReward[]>([]); // Will be used for rewards system

  // Check for game parameter from URL (set by dashboard)
  useEffect(() => {
    const gameFromUrl = searchParams.get('game');
    const sessionIdFromUrl = searchParams.get('sessionId');
    
    if (gameFromUrl) {
      setSelectedGame(gameFromUrl);
      if (sessionIdFromUrl) {
        setCurrentSessionId(sessionIdFromUrl);
      }
    }
  }, [searchParams]);

  // Load game mapping on component mount
  useEffect(() => {
    const loadGameMapping = async () => {
      try {
        const mapping = await apiService.getGameMapping();
        setGameMetadata(mapping.gameMetadata);
      } catch (error) {
        console.error('Error loading game mapping:', error);
      }
    };

    loadGameMapping();
  }, []);

  // Set up authentication token when user is available
  useEffect(() => {
    if (user?.id) {
      apiService.setClerkUserId(user.id);
    }
  }, [user]);

  const games = [
    {
      id: 'boxbreathing',
      title: 'Box Breathing',
      description: 'Guided breathing exercise with visual feedback for stress reduction',
      icon: '🫁',
      difficulty: 'Easy',
      duration: '5 min',
      benefits: ['Reduces stress', 'Improves focus', 'Calms mind'],
      type: 'react',
      mappedEmotions: ['anxiety', 'frustration', 'stress', 'fear']
    },
    {
      id: 'colorbloom',
      title: 'Color Bloom',
      description: 'Restore color to a grayscale world through gentle interaction',
      icon: '🌸',
      difficulty: 'Easy',
      duration: '8 min',
      benefits: ['Mood elevation', 'Mindfulness', 'Positive focus'],
      type: 'react',
      mappedEmotions: ['happy', 'sad']
    },
    {
      id: 'memorylantern',
      title: 'Memory Lantern',
      description: 'Release memories into the sky with melancholic music',
      icon: '🏮',
      difficulty: 'Medium',
      duration: '10 min',
      benefits: ['Grief processing', 'Emotional release', 'Acceptance'],
      type: 'react',
      mappedEmotions: ['loneliness', 'grief']
    },
    {
      id: 'rythmgrow',
      title: 'Rhythm Grow',
      description: 'Rhythm-based interaction to match clicks with moving sun',
      icon: '🌞',
      difficulty: 'Medium',
      duration: '6 min',
      benefits: ['Energy activation', 'Focus improvement', 'Engagement'],
      type: 'react',
      mappedEmotions: ['lethargy']
    },
    {
      id: 'placeholderGame_fear',
      title: 'Fear Management',
      description: 'Placeholder game for fear management and safety building',
      icon: '🛡️',
      difficulty: 'Medium',
      duration: '7 min',
      benefits: ['Fear reduction', 'Safety building', 'Exposure therapy'],
      type: 'react',
      mappedEmotions: ['fear']
    },
    {
      id: 'placeholderGame_anxiety',
      title: 'Anxiety Relief',
      description: 'Placeholder game for anxiety relief and relaxation',
      icon: '🧘',
      difficulty: 'Easy',
      duration: '8 min',
      benefits: ['Anxiety reduction', 'Relaxation', 'Coping skills'],
      type: 'react',
      mappedEmotions: ['anxiety']
    },
    {
      id: 'placeholderGame_loneliness',
      title: 'Connection Building',
      description: 'Placeholder game for loneliness and connection',
      icon: '🤝',
      difficulty: 'Medium',
      duration: '9 min',
      benefits: ['Social connection', 'Self-compassion', 'Belonging'],
      type: 'react',
      mappedEmotions: ['loneliness']
    }
  ];

  const handleGameComplete = async (gameId: string, duration: number, gameScore: number = 0) => {
    if (!currentSessionId) {
      console.warn('No session ID found for game completion');
      return;
    }

    setScore(gameScore); // Update the score state
    setIsLoading(true);
    try {
      // Complete the game session
      await apiService.completeGameSession({
        sessionId: currentSessionId,
        duration,
        score: gameScore,
        emotionAfter: 'neutral', // Could be determined by post-game assessment
        notes: `Completed ${gameMetadata[gameId]?.name || gameId} game`,
        interactionCount: Math.floor(Math.random() * 50) + 10, // Placeholder
        achievements: ['Completed session', 'Engaged fully']
      });

      // Redirect to clinic after a short delay
      setTimeout(() => {
        navigate('/clinic');
      }, 3000);

    } catch (error) {
      console.error('Error completing game session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const BreathingGame: React.FC = () => {
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [countdown, setCountdown] = useState(4);
    const [round, setRound] = useState(1);
    const [startTime] = useState(Date.now());

    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 4;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 6;
            } else {
              setBreathPhase('inhale');
              setRound((prev) => prev + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [breathPhase]);

    if (round > 5) {
      const duration = Math.round((Date.now() - startTime) / 60000); // minutes
      handleGameComplete('boxbreathing', duration, 85);
      
      return (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Great job! You've completed your breathing exercise.
          </h2>
          <p className="text-gray-600">
            You should feel more relaxed and centered now.
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Redirecting to voice therapy...</span>
            </div>
          ) : (
            <Button onClick={() => navigate('/clinic')}>
              Continue to Voice Therapy
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-4">{breathPhase === 'inhale' ? '🫁' : '😌'}</div>
        <h2 className="text-2xl font-bold text-lumen-dark capitalize">
          {breathPhase} for {countdown} seconds
        </h2>
        <div className="text-6xl font-bold text-lumen-primary mb-4">
          {countdown}
        </div>
        <div className="text-gray-600">
          Round {round} of 5
        </div>
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? [1, 1.2, 1] : [1.2, 1, 1],
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-32 h-32 bg-lumen-primary/20 rounded-full mx-auto"
        />
      </div>
    );
  };

  const ColorBloomGame: React.FC = () => {
    const [coloredSections, setColoredSections] = useState(0);
    const [startTime] = useState(Date.now());
    const totalSections = 12;

    const handleColorSection = () => {
      if (coloredSections < totalSections) {
        setColoredSections(coloredSections + 1);
      }
    };

    if (coloredSections >= totalSections) {
      const duration = Math.round((Date.now() - startTime) / 60000); // minutes
      handleGameComplete('colorbloom', duration, 90);
      
      return (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🌈
          </motion.div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Beautiful! You've restored color to the world.
          </h2>
          <p className="text-gray-600">
            Remember that beauty and color are always within reach.
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Redirecting to voice therapy...</span>
            </div>
          ) : (
            <Button onClick={() => navigate('/clinic')}>
              Continue to Voice Therapy
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🌸</div>
          <h2 className="text-xl font-semibold text-lumen-dark mb-2">
            Restore color to this world by gently interacting
          </h2>
          <p className="text-gray-600">
            Progress: {coloredSections}/{totalSections} sections colored
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={handleColorSection}
              disabled={index >= coloredSections}
              className={`w-16 h-16 rounded-lg transition-all duration-300 ${
                index < coloredSections 
                  ? 'bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <div className="text-center text-sm text-gray-600">
          Click each section to bring back its color
        </div>
      </div>
    );
  };

  const MemoryLanternGame: React.FC = () => {
    const [memory, setMemory] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [startTime] = useState(Date.now());

    const handleComplete = () => {
      setIsComplete(true);
      const duration = Math.round((Date.now() - startTime) / 60000); // minutes
      handleGameComplete('memorylantern', duration, 75);
    };

    if (isComplete) {
      return (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="text-6xl mb-4"
          >
            🏮
          </motion.div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Your memory has been released into the sky.
          </h2>
          <p className="text-gray-600">
            May it bring you peace and acceptance.
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Redirecting to voice therapy...</span>
            </div>
          ) : (
            <Button onClick={() => navigate('/clinic')}>
              Continue to Voice Therapy
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🏮</div>
          <h2 className="text-xl font-semibold text-lumen-dark mb-2">
            Write a memory you'd like to release
          </h2>
          <p className="text-gray-600">
            This memory will be sent into the sky like a lantern
          </p>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lumen-primary focus:border-transparent"
            rows={4}
            placeholder="Write your memory here..."
          />
        </div>
        
        <Button
          onClick={handleComplete}
          disabled={memory.trim() === ''}
          className="w-full"
        >
          Release Memory
        </Button>
      </div>
    );
  };

  const RhythmGrowGame: React.FC = () => {
    const [clicks, setClicks] = useState(0);
    const [targetClicks] = useState(20);
    const [startTime] = useState(Date.now());

    const handleClick = () => {
      if (clicks < targetClicks) {
        setClicks(clicks + 1);
      }
    };

    if (clicks >= targetClicks) {
      const duration = Math.round((Date.now() - startTime) / 60000); // minutes
      handleGameComplete('rythmgrow', duration, 80);
      
      return (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🌞
          </motion.div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Excellent rhythm! You've grown with the sun.
          </h2>
          <p className="text-gray-600">
            Your energy and focus have been activated.
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Redirecting to voice therapy...</span>
            </div>
          ) : (
            <Button onClick={() => navigate('/clinic')}>
              Continue to Voice Therapy
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="text-center space-y-8">
        <div className="text-6xl mb-4">🌞</div>
        <h2 className="text-2xl font-bold text-lumen-dark">
          Match your clicks with the moving sun
        </h2>
        <div className="text-4xl font-bold text-lumen-primary mb-4">
          {clicks}/{targetClicks}
        </div>
        
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 bg-yellow-400 rounded-full mx-auto cursor-pointer"
          onClick={handleClick}
        />
        
        <div className="text-gray-600">
          Click the sun to match the rhythm
        </div>
      </div>
    );
  };

  // Placeholder games
  const PlaceholderGame: React.FC<{ gameId: string; title: string; description: string; icon: string }> = ({ 
    gameId, title, description, icon 
  }) => {
    const [startTime] = useState(Date.now());

    const handleComplete = () => {
      const duration = Math.round((Date.now() - startTime) / 60000); // minutes
      handleGameComplete(gameId, duration, 70);
    };

    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-lumen-dark">
          {title}
        </h2>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          This therapeutic game is coming soon. For now, you can proceed to voice therapy.
        </p>
        <Button onClick={handleComplete}>
          Continue to Voice Therapy
        </Button>
      </div>
    );
  };

  // Unity game handlers
  const handleUnityGameComplete = (data: UnityGameData) => {
    // setGameResults(prev => [...prev, data]); // Will be used for game analytics
    console.log('Unity game completed:', data);
  };

  const handleUnityRewardEarned = (reward: UnityReward) => {
    // setRewards(prev => [...prev, reward]); // Will be used for rewards system
    console.log('Unity reward earned:', reward);
  };

  const renderGame = () => {
    const selectedGameData = games.find(game => game.id === selectedGame);
    
    if (!selectedGameData) {
      return (
        <div className="text-center space-y-6">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-xl font-semibold text-lumen-dark">
            Game not found!
          </h2>
          <p className="text-gray-600">
            This game is not available.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      );
    }

    // Render Unity games
    if (selectedGameData.type === 'unity') {
      return (
        <UnityGame
          gameId={selectedGameData.id}
          gameTitle={selectedGameData.title}
          description={selectedGameData.description}
          buildUrl="/unity-builds/lumen-minigames"
          onGameComplete={handleUnityGameComplete}
          onRewardEarned={handleUnityRewardEarned}
        />
      );
    }

    // Render React games
    switch (selectedGame) {
      case 'boxbreathing':
        return <BreathingGame />;
      case 'colorbloom':
        return <ColorBloomGame />;
      case 'memorylantern':
        return <MemoryLanternGame />;
      case 'rythmgrow':
        return <RhythmGrowGame />;
      case 'placeholderGame_fear':
        return <PlaceholderGame 
          gameId="placeholderGame_fear"
          title="Fear Management"
          description="Placeholder game for fear management and safety building"
          icon="🛡️"
        />;
      case 'placeholderGame_anxiety':
        return <PlaceholderGame 
          gameId="placeholderGame_anxiety"
          title="Anxiety Relief"
          description="Placeholder game for anxiety relief and relaxation"
          icon="🧘"
        />;
      case 'placeholderGame_loneliness':
        return <PlaceholderGame 
          gameId="placeholderGame_loneliness"
          title="Connection Building"
          description="Placeholder game for loneliness and connection"
          icon="🤝"
        />;
      default:
        return (
          <div className="text-center space-y-6">
            <div className="text-4xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold text-lumen-dark">
              Game coming soon!
            </h2>
            <p className="text-gray-600">
              This therapeutic game is under development.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        );
    }
  };

  if (!user) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="min-h-screen bg-lumen-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-lumen-dark mb-2">
                Therapeutic Games
              </h1>
              <p className="text-gray-600">
                Engage with mindful activities designed to support your mental wellness.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-lumen-primary">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
            </div>
          </div>
        </motion.div>

        {selectedGame ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl mx-auto">
              {renderGame()}
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 h-full"
                    onClick={() => setSelectedGame(game.id)}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-4xl">{game.icon}</div>
                      <h3 className="text-xl font-semibold text-lumen-dark">
                        {game.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {game.description}
                      </p>
                      
                      <div className="flex justify-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-lumen-primary/20 text-lumen-primary rounded">
                          {game.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-lumen-secondary/20 text-lumen-secondary rounded">
                          {game.duration}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Benefits:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {game.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="text-lumen-primary mr-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                ← Back to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/clinic')}
              >
                🧠 Voice Therapy
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games; 