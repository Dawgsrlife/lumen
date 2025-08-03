import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { GameSessionModel } from '../models/GameSession.js';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { UserModel } from '../models/User.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// Emotion to game mapping
const EMOTION_TO_GAME: Record<string, string> = {
  happy: 'colorbloom',
  sad: 'colorbloom', 
  loneliness: 'memorylantern',
  anxiety: 'boxbreathing',
  frustration: 'boxbreathing',
  stress: 'boxbreathing',
  lethargy: 'rythmgrow',
  fear: 'placeholderGame_fear',
  grief: 'memorylantern'
};

// Game metadata
const GAME_METADATA: Record<string, {
  name: string;
  description: string;
  therapeuticGoal: string;
  techniques: string[];
  duration: number;
}> = {
  boxbreathing: {
    name: 'Box Breathing',
    description: 'Guided breathing exercise with visual feedback',
    therapeuticGoal: 'Stress reduction, anxiety management, emotional regulation',
    techniques: ['Diaphragmatic breathing', 'Mindfulness', 'Grounding'],
    duration: 5
  },
  colorbloom: {
    name: 'Color Bloom',
    description: 'Restore color to a grayscale world through gentle interaction',
    therapeuticGoal: 'Mood elevation, mindfulness, positive focus',
    techniques: ['Mindfulness', 'Positive psychology', 'Sensory engagement'],
    duration: 8
  },
  memorylantern: {
    name: 'Memory Lantern',
    description: 'Release memories into the sky with melancholic music',
    therapeuticGoal: 'Grief processing, emotional release, acceptance',
    techniques: ['Narrative therapy', 'Acceptance and commitment therapy', 'Emotional processing'],
    duration: 10
  },
  rythmgrow: {
    name: 'Rhythm Grow',
    description: 'Rhythm-based interaction to match clicks with moving sun',
    therapeuticGoal: 'Energy activation, focus improvement, engagement',
    techniques: ['Behavioral activation', 'Attention training', 'Rhythm therapy'],
    duration: 6
  },
  placeholderGame_fear: {
    name: 'Fear Management',
    description: 'Placeholder game for fear management',
    therapeuticGoal: 'Fear reduction, safety building, exposure therapy',
    techniques: ['Exposure therapy', 'Safety planning', 'Grounding'],
    duration: 7
  },
  placeholderGame_anxiety: {
    name: 'Anxiety Relief',
    description: 'Placeholder game for anxiety relief',
    therapeuticGoal: 'Anxiety reduction, relaxation, coping skills',
    techniques: ['Progressive relaxation', 'Cognitive restructuring', 'Mindfulness'],
    duration: 8
  },
  placeholderGame_loneliness: {
    name: 'Connection Building',
    description: 'Placeholder game for loneliness and connection',
    therapeuticGoal: 'Social connection, self-compassion, belonging',
    techniques: ['Interpersonal effectiveness', 'Self-compassion', 'Social skills'],
    duration: 9
  }
};

// Validation middleware
const validateGameSession = [
  body('gameType')
    .isIn(Object.keys(GAME_METADATA))
    .withMessage('Invalid game type'),
  body('mappedEmotion')
    .isIn(['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'])
    .withMessage('Invalid emotion type'),
  body('duration')
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('completionStatus')
    .optional()
    .isIn(['completed', 'incomplete', 'abandoned'])
    .withMessage('Invalid completion status')
];

/**
 * POST /api/games/start
 * Start a new game session based on emotion
 */
router.post('/start',
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { emotion } = req.body;

      if (!emotion || !EMOTION_TO_GAME[emotion]) {
        return res.status(400).json({
          success: false,
          error: 'Valid emotion is required'
        });
      }

      // Find user
      const user = await UserModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const gameType = EMOTION_TO_GAME[emotion];
      const gameInfo = GAME_METADATA[gameType];

      // Create game session
      const gameSession = new GameSessionModel({
        userId: user.id,
        clerkId,
        gameType,
        mappedEmotion: emotion,
        emotionBefore: emotion,
        duration: 0, // Will be updated when completed
        completionStatus: 'incomplete',
        metadata: {
          sessionStartTime: new Date(),
          interactionCount: 0,
          achievements: [],
          therapeuticTechniques: gameInfo.techniques
        }
      });

      await gameSession.save();

      res.status(201).json({
        success: true,
        data: {
          sessionId: gameSession.id,
          gameType,
          gameInfo,
          emotion,
          sessionStartTime: gameSession.metadata.sessionStartTime
        },
        message: 'Game session started successfully'
      });

    } catch (error) {
      console.error('Error starting game session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start game session'
      });
    }
  }
);

/**
 * POST /api/games/complete
 * Complete a game session
 */
router.post('/complete',
  authenticateToken,
  requireAuth,
  validateGameSession,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const clerkId = req.clerkId!;
      const { 
        sessionId, 
        duration, 
        score, 
        emotionAfter, 
        notes,
        interactionCount = 0,
        achievements = []
      } = req.body;

      // Find and update game session
      const gameSession = await GameSessionModel.findOne({
        _id: sessionId,
        clerkId
      });

      if (!gameSession) {
        return res.status(404).json({
          success: false,
          error: 'Game session not found'
        });
      }

      // Update session with completion data
      gameSession.duration = duration;
      gameSession.score = score;
      gameSession.emotionAfter = emotionAfter;
      gameSession.notes = notes;
      gameSession.completionStatus = 'completed';
      gameSession.metadata.sessionEndTime = new Date();
      gameSession.metadata.interactionCount = interactionCount;
      gameSession.metadata.achievements = achievements;

      await gameSession.save();

      res.json({
        success: true,
        data: gameSession,
        message: 'Game session completed successfully'
      });

    } catch (error) {
      console.error('Error completing game session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete game session'
      });
    }
  }
);

/**
 * GET /api/games/sessions
 * Get user's game sessions
 */
router.get('/sessions',
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { 
        page = 1, 
        limit = 20, 
        gameType, 
        emotion,
        startDate, 
        endDate 
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = { clerkId };
      
      if (gameType) {
        query.gameType = gameType;
      }
      
      if (emotion) {
        query.mappedEmotion = emotion;
      }
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate as string);
        }
      }

      // Execute query
      const [sessions, total] = await Promise.all([
        GameSessionModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        GameSessionModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: {
          sessions,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });

    } catch (error) {
      console.error('Error fetching game sessions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game sessions'
      });
    }
  }
);

/**
 * GET /api/games/mapping
 * Get emotion to game mapping
 */
router.get('/mapping',
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        data: {
          emotionToGame: EMOTION_TO_GAME,
          gameMetadata: GAME_METADATA
        }
      });
    } catch (error) {
      console.error('Error fetching game mapping:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game mapping'
      });
    }
  }
);

/**
 * GET /api/games/analytics
 * Get game analytics for user
 */
router.get('/analytics',
  authenticateToken,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { days = 30 } = req.query;
      const daysNum = parseInt(days as string);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      // Get game sessions in date range
      const sessions = await GameSessionModel.find({
        clerkId,
        createdAt: { $gte: startDate }
      }).lean();

      // Calculate analytics
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.completionStatus === 'completed').length;
      const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const averageScore = sessions.length > 0 ? 
        sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length : 0;

      // Game type distribution
      const gameTypeStats = sessions.reduce((acc, session) => {
        const gameType = session.gameType;
        if (!acc[gameType]) {
          acc[gameType] = { count: 0, totalDuration: 0, averageScore: 0 };
        }
        acc[gameType].count++;
        acc[gameType].totalDuration += session.duration || 0;
        acc[gameType].averageScore += session.score || 0;
        return acc;
      }, {} as Record<string, { count: number; totalDuration: number; averageScore: number }>);

      // Calculate averages
      Object.keys(gameTypeStats).forEach(gameType => {
        const stats = gameTypeStats[gameType];
        stats.averageScore = stats.count > 0 ? stats.averageScore / stats.count : 0;
      });

      // Emotion distribution
      const emotionStats = sessions.reduce((acc, session) => {
        const emotion = session.mappedEmotion;
        if (!acc[emotion]) {
          acc[emotion] = { count: 0, totalDuration: 0 };
        }
        acc[emotion].count++;
        acc[emotion].totalDuration += session.duration || 0;
        return acc;
      }, {} as Record<string, { count: number; totalDuration: number }>);

      res.json({
        success: true,
        data: {
          overview: {
            totalSessions,
            completedSessions,
            completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
            totalDuration,
            averageScore: Math.round(averageScore * 100) / 100
          },
          gameTypeStats,
          emotionStats,
          dateRange: {
            start: startDate.toISOString(),
            end: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Error fetching game analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game analytics'
      });
    }
  }
);

export default router; 