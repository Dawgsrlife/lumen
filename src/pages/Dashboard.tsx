import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui';
import { UnityGame, PostGameFeedback } from '../components/games';
import GameCompletion from '../components/games/GameCompletion';
import { useAppContext } from '../context/AppContext';
import WelcomeScreen from '../components/WelcomeScreen';
import EmotionSelectionScreen from '../components/EmotionSelectionScreen';
import GamePromptScreen from '../components/GamePromptScreen';
import DashboardScreen from '../components/DashboardScreen';
import type { UnityGameData, UnityReward } from '../services/unity';

// Map emotions to working Unity games
const emotionToGame: Record<string, { gameId: string; gameName: string; title: string; description: string }> = {
  // Breathing game for anger, frustration, stress
  frustration: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Release frustration with structured breathing patterns'
  },
  stress: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Unwind stress through calming breath work'
  },
  anxiety: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Calm anxiety with focused breathing techniques'
  },
  // Color bloom for sadness
  sad: {
    gameId: 'lumen-minigames',
    gameName: 'colorbloom',
    title: 'Color Bloom',
    description: 'Nurture flowers and watch colors bloom to lift your spirits'
  },
  // Memory lantern for grief
  grief: {
    gameId: 'lumen-minigames',
    gameName: 'memorylantern',
    title: 'Memory Lantern',
    description: 'Honor memories and find peace through guided reflection'
  },
  // Rhythm grow for lethargy
  lethargy: {
    gameId: 'lumen-minigames',
    gameName: 'rythmgrow',
    title: 'Rhythm Grow',
    description: 'Energize yourself with rhythmic growth activities'
  },
  // Default mappings for other emotions (use appropriate games)
  happy: {
    gameId: 'lumen-minigames',
    gameName: 'colorbloom',
    title: 'Color Bloom',
    description: 'Celebrate your happiness by creating beautiful blooms'
  },
  loneliness: {
    gameId: 'lumen-minigames',
    gameName: 'memorylantern',
    title: 'Memory Lantern',
    description: 'Connect with meaningful memories to ease loneliness'
  },
  fear: {
    gameId: 'lumen-minigames',
    gameName: 'boxbreathing',
    title: 'Box Breathing',
    description: 'Find courage through mindful breathing practices'
  }
};

const Dashboard: React.FC = () => {
  const { state, logEmotion, completeGame, resetToEmotionSelection } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFeedbackPrompt, setShowFeedbackPrompt] = React.useState(false);
  const [showGameCompletion, setShowGameCompletion] = React.useState(false);
  const [feedbackResponse, setFeedbackResponse] = React.useState<boolean | null>(null);
  const [gameData, setGameData] = React.useState<UnityGameData | null>(null);
  const [gameRewards, setGameRewards] = React.useState<UnityReward[]>([]);
  
  // Debug logging
  console.log('Dashboard: Current state', {
    currentView: state.currentView,
    user: state.user,
    isLoading: state.isLoading,
    showHeader: state.showHeader,
    showFeedbackPrompt,
    showGameCompletion,
    gameData: !!gameData
  });
  
  // Get game parameter from URL
  const gameParam = searchParams.get('game');

  // Handle URL parameter for direct game access
  React.useEffect(() => {
    if (gameParam && state.user?.currentEmotion) {
      const emotion = Object.entries(emotionToGame).find(
        ([_, game]) => game.gameName === gameParam
      )?.[0];
      
      if (emotion && emotion === state.user.currentEmotion) {
        console.log('Dashboard: Direct game access detected', { gameParam, emotion });
      }
    }
  }, [gameParam, state.user?.currentEmotion]);

  const handleEmotionSelect = async (emotion: string) => {
    console.log('Dashboard: Emotion selected', emotion);
    await logEmotion(emotion as any);
  };

  const handlePlayGame = () => {
    console.log('Dashboard: Play game clicked');
    if (state.user?.currentEmotion) {
      const gameName = emotionToGame[state.user.currentEmotion]?.gameName;
      if (gameName) {
        setSearchParams({ game: gameName });
      }
    }
  };

  const handleSkipGame = () => {
    console.log('Dashboard: Skip game clicked');
    completeGame();
  };

  const handleGameComplete = (data: UnityGameData) => {
    console.log('Dashboard: Game completed', data);
    setGameData(data);
    setShowGameCompletion(true);
  };

  const handleGameReward = (reward: UnityReward) => {
    console.log('Dashboard: Game reward earned', reward);
    setGameRewards(prev => [...prev, reward]);
  };

  const handleGameCompletionContinue = () => {
    console.log('Dashboard: Continuing from game completion');
    setShowGameCompletion(false);
    setShowFeedbackPrompt(true);
  };

  const handleFeedbackResponse = async (feeling: boolean) => {
    console.log('Dashboard: Feedback response', feeling);
    setFeedbackResponse(feeling);
    setShowFeedbackPrompt(false);
    
    // Save feedback to API if available
    try {
      if (state.user?.currentEmotion && gameData) {
        const feedbackData = {
          gameId: emotionToGame[state.user.currentEmotion].gameId,
          gameName: emotionToGame[state.user.currentEmotion].gameName,
          emotion: state.user.currentEmotion,
          feelsBetter: feeling,
          gameData: gameData,
          rewards: gameRewards
        };
        
        // Try to save feedback to API
        console.log('Dashboard: Saving feedback data', feedbackData);
        // await apiService.createFeedback(feedbackData);
      }
    } catch (error) {
      console.warn('Dashboard: Failed to save feedback', error);
    }
    
    await completeGame();
  };

  const handleSkipFeedback = () => {
    console.log('Dashboard: Skipping feedback');
    setShowFeedbackPrompt(false);
    completeGame();
  };

  // Mock weekly data - in real app, this would come from API
  const weeklyData = [true, true, false, true, true, false, true]; // 5/7 days

  if (state.isLoading) {
    console.log('Dashboard: Showing loading spinner');
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (!state.user) {
    console.log('Dashboard: No user, showing loading spinner');
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  console.log('Dashboard: Rendering view', state.currentView);

  return (
    <div className="w-full min-h-screen">
      <AnimatePresence mode="wait">
        {state.currentView === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            username={state.user.username}
          />
        )}

        {state.currentView === 'emotion-selection' && (
          <EmotionSelectionScreen
            key="emotion-selection"
            onEmotionSelect={handleEmotionSelect}
          />
        )}

        {state.currentView === 'game-prompt' && state.user.currentEmotion && (
          <GamePromptScreen
            key="game-prompt"
            selectedEmotion={state.user.currentEmotion}
            onPlayGame={handlePlayGame}
            onSkipGame={handleSkipGame}
          />
        )}

        {state.currentView === 'game' && state.user.currentEmotion && (
          <motion.div
            key="game"
            className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Game Header */}
            <div className="text-center mb-8 max-w-2xl">
              <motion.h2
                className="text-3xl font-light text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {emotionToGame[state.user.currentEmotion]?.title || 'Calming Game'}
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {emotionToGame[state.user.currentEmotion]?.description || 'Take a moment to relax'}
              </motion.p>
            </div>
            
            {/* Unity Game */}
            <motion.div
              className="w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <UnityGame
                gameId={emotionToGame[state.user.currentEmotion]?.gameId || 'lumen-minigames'}
                gameTitle={emotionToGame[state.user.currentEmotion]?.title || 'Calming Game'}
                description={emotionToGame[state.user.currentEmotion]?.description || 'Take a moment to relax'}
                buildUrl="/unity-builds/lumen-minigames"
                gameName={emotionToGame[state.user.currentEmotion]?.gameName || 'boxbreathing'}
                emotionData={{
                  emotion: state.user.currentEmotion,
                  intensity: 5,
                  context: { source: 'dashboard', timestamp: new Date().toISOString() }
                }}
                onGameComplete={handleGameComplete}
                onRewardEarned={handleGameReward}
                className="w-full"
              />
            </motion.div>
            
            {/* Skip Button */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <button 
                onClick={handleSkipGame}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
              >
                Skip to dashboard
              </button>
            </motion.div>
          </motion.div>
        )}

        {showGameCompletion && gameData && state.user.currentEmotion && (
          <GameCompletion
            key="game-completion"
            gameTitle={emotionToGame[state.user.currentEmotion]?.title || 'Calming Game'}
            gameData={gameData}
            rewards={gameRewards}
            onContinue={handleGameCompletionContinue}
          />
        )}

        {showFeedbackPrompt && state.user.currentEmotion && (
          <PostGameFeedback
            key="feedback"
            emotion={state.user.currentEmotion}
            gameTitle={emotionToGame[state.user.currentEmotion]?.title || 'Calming Game'}
            onFeedback={handleFeedbackResponse}
            onSkip={handleSkipFeedback}
          />
        )}

        {state.currentView === 'dashboard' && state.user.currentEmotion && (
          <DashboardScreen
            key="dashboard"
            selectedEmotion={state.user.currentEmotion}
            currentStreak={state.user.currentStreak}
            weeklyData={state.user.weeklyData}
            onReset={resetToEmotionSelection}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 