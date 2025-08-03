import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner, LumenMascot } from '../components/ui';
import { UnityGame, PostGameFeedback } from '../components/games';
import GameCompletion from '../components/games/GameCompletion';
import JournalingStep from '../components/JournalingStep';
import { useAppContext } from '../context/AppContext';
import { useFlow } from '../context/FlowProvider';
import WelcomeScreen from '../components/WelcomeScreen';
import EmotionSelectionScreen from '../components/EmotionSelectionScreen';
import GamePromptScreen from '../components/GamePromptScreen';
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

const FlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, logEmotion, completeGame } = useAppContext();
  const { state: flowState, nextStep, setEmotion, setGameData: setFlowGameData, skipToJournaling, skipToDashboard, skipToEmotionSelection } = useFlow();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFeedbackPrompt, setShowFeedbackPrompt] = React.useState(false);
  const [showGameCompletion, setShowGameCompletion] = React.useState(false);
  const [showJournaling, setShowJournaling] = React.useState(false);
  const [feedbackResponse, setFeedbackResponse] = React.useState<boolean | null>(null);
  const [gameData, setGameData] = React.useState<UnityGameData | null>(null);
  const [gameRewards, setGameRewards] = React.useState<UnityReward[]>([]);
  const [hasCheckedDailyStatus, setHasCheckedDailyStatus] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean | null>(null);
  
  // Debug logging
  console.log('FlowPage: Current state', {
    flowStep: flowState.currentStep,
    selectedEmotion: flowState.selectedEmotion,
    appState: {
      currentView: state.currentView,
      user: state.user,
      isLoading: state.isLoading,
      showHeader: state.showHeader,
    },
    showFeedbackPrompt,
    showGameCompletion,
    showJournaling,
    gameData: !!gameData
  });

  // Simplified daily status check - using placeholder data
  useEffect(() => {
    const checkDailyStatus = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use placeholder data - always assume user hasn't logged today for demo
      console.log('FlowPage: Using placeholder daily status data');
      setHasLoggedToday(false);
      setHasCheckedDailyStatus(true);
    };

    checkDailyStatus();
  }, []);

  // Auto-transition based on daily status
  useEffect(() => {
    if (hasCheckedDailyStatus) {
      const timer = setTimeout(() => {
        console.log('FlowPage: Auto-transitioning based on daily status', { hasLoggedToday });
        if (hasLoggedToday) {
          console.log('FlowPage: User has logged today, going to dashboard');
          navigate('/dashboard');
        } else {
          console.log('FlowPage: User has not logged today, going to emotion selection');
          skipToEmotionSelection();
        }
      }, 1000); // 1 second delay for flow initialization

      return () => clearTimeout(timer);
    }
  }, [hasCheckedDailyStatus, hasLoggedToday, navigate, skipToEmotionSelection]);
  
  // Get game parameter from URL
  const gameParam = searchParams.get('game');

  // Handle URL parameter for direct game access
  React.useEffect(() => {
    if (gameParam && flowState.selectedEmotion) {
      const emotion = Object.entries(emotionToGame).find(
        ([_, game]) => game.gameName === gameParam
      )?.[0];
      
      if (emotion && emotion === flowState.selectedEmotion) {
        console.log('FlowPage: Direct game access detected', { gameParam, emotion });
      }
    }
  }, [gameParam, flowState.selectedEmotion]);

  const handleEmotionSelect = async (emotion: string) => {
    console.log('FlowPage: Emotion selected', emotion);
    setEmotion(emotion);
    
    // Simulate API call for logging emotion
    try {
      await logEmotion(emotion as any);
      console.log('FlowPage: Emotion logged successfully');
    } catch (error) {
      console.warn('FlowPage: Failed to log emotion, continuing anyway:', error);
    }
    
    nextStep();
  };

  const handlePlayGame = () => {
    console.log('FlowPage: Play game clicked');
    if (flowState.selectedEmotion) {
      const gameName = emotionToGame[flowState.selectedEmotion]?.gameName;
      if (gameName) {
        setSearchParams({ game: gameName });
      }
    }
    nextStep();
  };

  const handleSkipGame = () => {
    console.log('FlowPage: Skip game clicked');
    skipToJournaling();
    setShowJournaling(true);
  };

  const handleGameComplete = (data: UnityGameData) => {
    console.log('FlowPage: Game completed', data);
    setGameData(data);
    setShowGameCompletion(true);
  };

  const handleGameReward = (reward: UnityReward) => {
    console.log('FlowPage: Game reward earned', reward);
    setGameRewards(prev => [...prev, reward]);
  };

  const handleGameCompletionContinue = () => {
    console.log('FlowPage: Continuing from game completion');
    setShowGameCompletion(false);
    setShowFeedbackPrompt(true);
  };

  const handleFeedbackResponse = async (feeling: boolean) => {
    console.log('FlowPage: Feedback response', feeling);
    setFeedbackResponse(feeling);
    setShowFeedbackPrompt(false);
    
    // Simulate saving feedback to API
    try {
      if (flowState.selectedEmotion && gameData) {
        const feedbackData = {
          gameId: emotionToGame[flowState.selectedEmotion]?.gameId,
          gameName: emotionToGame[flowState.selectedEmotion]?.gameName,
          emotion: flowState.selectedEmotion,
          feelsBetter: feeling,
          gameData: gameData,
          rewards: gameRewards
        };
        
        console.log('FlowPage: Saving feedback data (placeholder)', feedbackData);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.warn('FlowPage: Failed to save feedback, continuing anyway:', error);
    }
    
    // Move to journaling step
    setShowJournaling(true);
  };

  const handleSkipFeedback = () => {
    console.log('FlowPage: Skipping feedback');
    setShowFeedbackPrompt(false);
    setShowJournaling(true);
  };

  const handleJournalingComplete = () => {
    console.log('FlowPage: Journaling completed');
    setShowJournaling(false);
    
    // Simulate completing the flow
    try {
      completeGame();
      console.log('FlowPage: Flow completed successfully');
    } catch (error) {
      console.warn('FlowPage: Failed to complete game, continuing anyway:', error);
    }
    
    navigate('/dashboard');
  };

  const handleJournalingSkip = () => {
    console.log('FlowPage: Skipping journaling');
    setShowJournaling(false);
    
    // Simulate completing the flow
    try {
      completeGame();
      console.log('FlowPage: Flow completed successfully (skipped)');
    } catch (error) {
      console.warn('FlowPage: Failed to complete game, continuing anyway:', error);
    }
    
    navigate('/dashboard');
  };

  if (state.isLoading) {
    console.log('FlowPage: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mb-4"></div>
          <p className="text-gray-600">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    console.log('FlowPage: No user, showing loading spinner');
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

  console.log('FlowPage: Rendering view', flowState.currentStep);

  return (
    <div className="w-full min-h-screen">
      {/* Luna Mascot */}
      <LumenMascot currentPage="/flow" />
      
      <AnimatePresence mode="wait">
        {flowState.currentStep === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            username={state.user.username}
          />
        )}

        {flowState.currentStep === 'emotion-selection' && (
          <EmotionSelectionScreen
            key="emotion-selection"
            onEmotionSelect={handleEmotionSelect}
          />
        )}

        {flowState.currentStep === 'game-prompt' && flowState.selectedEmotion && (
          <GamePromptScreen
            key="game-prompt"
            selectedEmotion={flowState.selectedEmotion as any}
            onPlayGame={handlePlayGame}
            onSkipGame={handleSkipGame}
          />
        )}

        {flowState.currentStep === 'game' && flowState.selectedEmotion && (
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
                {emotionToGame[flowState.selectedEmotion]?.title || 'Calming Game'}
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {emotionToGame[flowState.selectedEmotion]?.description || 'Take a moment to relax'}
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
                gameId={emotionToGame[flowState.selectedEmotion]?.gameId || 'lumen-minigames'}
                gameTitle={emotionToGame[flowState.selectedEmotion]?.title || 'Calming Game'}
                description={emotionToGame[flowState.selectedEmotion]?.description || 'Take a moment to relax'}
                buildUrl="/unity-builds/lumen-minigames"
                gameName={emotionToGame[flowState.selectedEmotion]?.gameName || 'boxbreathing'}
                emotionData={{
                  emotion: flowState.selectedEmotion as any,
                  intensity: 5,
                  context: { source: 'flow', timestamp: new Date().toISOString() }
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
                Skip to journaling
              </button>
            </motion.div>
          </motion.div>
        )}

        {showGameCompletion && gameData && flowState.selectedEmotion && (
          <GameCompletion
            key="game-completion"
            gameTitle={emotionToGame[flowState.selectedEmotion]?.title || 'Calming Game'}
            gameData={gameData}
            rewards={gameRewards}
            onContinue={handleGameCompletionContinue}
          />
        )}

        {showFeedbackPrompt && flowState.selectedEmotion && (
          <PostGameFeedback
            key="feedback"
            emotion={flowState.selectedEmotion as any}
            gameTitle={emotionToGame[flowState.selectedEmotion]?.title || 'Calming Game'}
            onFeedback={handleFeedbackResponse}
            onSkip={handleSkipFeedback}
          />
        )}

        {showJournaling && (
          <JournalingStep
            key="journaling"
            onComplete={handleJournalingComplete}
            onSkip={handleJournalingSkip}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlowPage; 