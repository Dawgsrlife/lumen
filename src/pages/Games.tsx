import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, LoadingSpinner } from '../components/ui';
import UnityGame from '../components/games/UnityGame';
import { useClerkUser } from '../hooks/useClerkUser';
// import { unityService } from '../services/unity'; // Will be used for Unity integration
import type { UnityGameData, UnityReward } from '../services/unity';

const Games: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  // const [gameResults, setGameResults] = useState<UnityGameData[]>([]); // Will be used for game analytics
  // const [rewards, setRewards] = useState<UnityReward[]>([]); // Will be used for rewards system

  const games = [
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Practice mindful breathing to reduce stress and anxiety',
      icon: '🫁',
      difficulty: 'Easy',
      duration: '5 min',
      benefits: ['Reduces stress', 'Improves focus', 'Calms mind'],
      type: 'react',
    },
    {
      id: 'gratitude',
      title: 'Gratitude Journal',
      description: 'Write down things you&apos;re thankful for to boost mood',
      icon: '📝',
      difficulty: 'Easy',
      duration: '3 min',
      benefits: ['Boosts mood', 'Increases positivity', 'Reduces anxiety'],
      type: 'react',
    },
    {
      id: 'meditation',
      title: 'Guided Meditation',
      description: 'Follow a guided meditation session for inner peace',
      icon: '🧘',
      difficulty: 'Medium',
      duration: '10 min',
      benefits: ['Inner peace', 'Mental clarity', 'Emotional balance'],
      type: 'react',
    },
    {
      id: 'coloring',
      title: 'Digital Coloring',
      description: 'Color beautiful mandalas to relax and express creativity',
      icon: '🎨',
      difficulty: 'Easy',
      duration: '8 min',
      benefits: ['Reduces anxiety', 'Promotes creativity', 'Mindfulness'],
      type: 'react',
    },
    {
      id: 'puzzle',
      title: 'Mindful Puzzle',
      description: 'Solve calming puzzles to improve focus and concentration',
      icon: '🧩',
      difficulty: 'Medium',
      duration: '7 min',
      benefits: ['Improves focus', 'Reduces stress', 'Mental exercise'],
      type: 'react',
    },
    {
      id: 'music',
      title: 'Sound Therapy',
      description: 'Listen to calming sounds and nature ambience',
      icon: '🎵',
      difficulty: 'Easy',
      duration: '6 min',
      benefits: ['Relaxation', 'Better sleep', 'Stress relief'],
      type: 'react',
    },
    // Unity Games
    {
      id: 'unity-meditation',
      title: 'Unity Meditation Game',
      description: 'Immersive 3D meditation experience with Unity',
      icon: '🎮',
      difficulty: 'Easy',
      duration: '10 min',
      benefits: ['Deep relaxation', 'Immersive experience', '3D visualization'],
      type: 'unity',
      buildUrl: '/unity-builds/meditation-game',
    },
    {
      id: 'unity-breathing',
      title: 'Unity Breathing Game',
      description: '3D breathing exercise with visual feedback',
      icon: '🫁',
      difficulty: 'Easy',
      duration: '5 min',
      benefits: ['Visual breathing guide', '3D environment', 'Immersive experience'],
      type: 'unity',
      buildUrl: '/unity-builds/breathing-game',
    },
  ];

  const BreathingGame: React.FC = () => {
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [countdown, setCountdown] = useState(4);
    const [round, setRound] = useState(1);

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
            Great job! You&apos;ve completed your breathing exercise.
          </h2>
          <p className="text-gray-600">
            You should feel more relaxed and centered now.
          </p>
          <Button onClick={() => setSelectedGame(null)}>
            Back to Games
          </Button>
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

  const GratitudeGame: React.FC = () => {
    const [entries, setEntries] = useState<string[]>(['', '', '']);
    const [isComplete, setIsComplete] = useState(false);

    const handleEntryChange = (index: number, value: string) => {
      const newEntries = [...entries];
      newEntries[index] = value;
      setEntries(newEntries);
    };

    const handleComplete = () => {
      setIsComplete(true);
      setScore(score + 50);
    };

    if (isComplete) {
      return (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            ✨
          </motion.div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Wonderful! You&apos;ve practiced gratitude.
          </h2>
          <p className="text-gray-600">
            Remember these things when you&apos;re feeling down.
          </p>
          <Button onClick={() => setSelectedGame(null)}>
            Back to Games
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-lumen-dark mb-2">
            Write down 3 things you&apos;re grateful for today:
          </h2>
        </div>
        
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Thing {index + 1}:
              </label>
              <textarea
                value={entry}
                onChange={(e) => handleEntryChange(index, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lumen-primary focus:border-transparent"
                rows={2}
                placeholder={`I'm grateful for...`}
              />
            </div>
          ))}
        </div>
        
        <Button
          onClick={handleComplete}
          disabled={entries.some(entry => entry.trim() === '')}
          className="w-full"
        >
          Complete Gratitude Exercise
        </Button>
      </div>
    );
  };

  const ColoringGame: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState('#FBBF24');
    const [isComplete, setIsComplete] = useState(false);

    const colors = ['#FBBF24', '#8B5CF6', '#EF4444', '#10B981', '#3B82F6', '#F59E0B'];

    const handleComplete = () => {
      setIsComplete(true);
      setScore(score + 30);
    };

    if (isComplete) {
      return (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🎨
          </motion.div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Beautiful! You&apos;ve created something wonderful.
          </h2>
          <p className="text-gray-600">
            Coloring is a great way to relax and express creativity.
          </p>
          <Button onClick={() => setSelectedGame(null)}>
            Back to Games
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🎨</div>
          <h2 className="text-xl font-semibold text-lumen-dark mb-2">
            Color this mandala to relax and express yourself:
          </h2>
        </div>
        
        <div className="flex justify-center gap-2 mb-6">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-gray-600 mb-4">
            Click to color different sections
          </p>
          <Button onClick={handleComplete}>
            Complete Coloring
          </Button>
        </div>
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
          <Button onClick={() => setSelectedGame(null)}>
            Back to Games
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
          buildUrl={selectedGameData.buildUrl || '/unity-builds/lumen-minigames'}
          onGameComplete={handleUnityGameComplete}
          onRewardEarned={handleUnityRewardEarned}
        />
      );
    }

    // Render React games
    switch (selectedGame) {
      case 'breathing':
        return <BreathingGame />;
      case 'gratitude':
        return <GratitudeGame />;
      case 'coloring':
        return <ColoringGame />;
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
            <Button onClick={() => setSelectedGame(null)}>
              Back to Games
            </Button>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
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
                onClick={() => window.location.href = '/dashboard'}
              >
                ← Back to Dashboard
              </Button>
              <Button
                onClick={() => window.location.href = '/analytics'}
              >
                📊 View Analytics
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games; 