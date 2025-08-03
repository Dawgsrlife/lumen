import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { GameSessionModel } from '../models/GameSession.js';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { UserModel } from '../models/User.js';
import type { CreateGameSessionRequest, GameSession } from '../types/index.js';

const router = Router();

// Validation middleware
const validateGameSession = [
  body('gameType')
    .isIn(['mindfulness', 'breathing', 'meditation', 'gratitude', 'mood_tracker'])
    .withMessage('Invalid game type'),
  body('duration')
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('emotionBefore')
    .optional()
    .isIn(['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'])
    .withMessage('Invalid emotion type'),
  body('emotionAfter')
    .optional()
    .isIn(['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'])
    .withMessage('Invalid emotion type'),
  body('completionStatus')
    .optional()
    .isIn(['completed', 'incomplete', 'abandoned'])
    .withMessage('Invalid completion status')
];

/**
 * POST /api/games
 * Create a new game session
 */
router.post('/', 
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

      const { gameType, duration, score, notes, emotionBefore, emotionAfter, completionStatus }: CreateGameSessionRequest = req.body;
      const clerkId = req.clerkId!;

      // Find user
      const user = await UserModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get the most recent emotion entry for emotionBefore if not provided
      let beforeEmotion = emotionBefore;
      if (!beforeEmotion) {
        const latestEmotion = await EmotionEntryModel.findOne({ clerkId })
          .sort({ createdAt: -1 })
          .limit(1)
          .lean();
        beforeEmotion = latestEmotion?.emotion || 'happy';
      }

      // Create game session
      const gameSession = new GameSessionModel({
        userId: user.id,
        clerkId,
        gameType,
        duration,
        score,
        notes,
        emotionBefore: beforeEmotion,
        emotionAfter,
        completionStatus: completionStatus || 'completed'
      });

      await gameSession.save();

      res.status(201).json({
        success: true,
        data: gameSession,
        message: 'Game session created successfully'
      });

    } catch (error) {
      console.error('Error creating game session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create game session'
      });
    }
  }
);

/**
 * GET /api/games
 * Get user's game sessions with optional filtering
 */
router.get('/', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { 
        page = 1, 
        limit = 50, 
        gameType, 
        startDate, 
        endDate,
        sort = 'createdAt',
        days
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = { clerkId };
      
      if (gameType) {
        query.gameType = gameType;
      }
      
      if (days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days as string));
        query.createdAt = { $gte: startDate };
      } else if (startDate || endDate) {
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
          .sort({ [sort as string]: -1 })
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
 * GET /api/games/:id
 * Get a specific game session
 */
router.get('/:id', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const clerkId = req.clerkId!;

      const session = await GameSessionModel.findOne({
        _id: id,
        clerkId
      }).lean();

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Game session not found'
        });
      }

      res.json({
        success: true,
        data: session
      });

    } catch (error) {
      console.error('Error fetching game session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game session'
      });
    }
  }
);

/**
 * PUT /api/games/:id
 * Update a game session
 */
router.put('/:id', 
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

      const { id } = req.params;
      const clerkId = req.clerkId!;
      const updateData = req.body;

      const session = await GameSessionModel.findOneAndUpdate(
        { _id: id, clerkId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Game session not found'
        });
      }

      res.json({
        success: true,
        data: session,
        message: 'Game session updated successfully'
      });

    } catch (error) {
      console.error('Error updating game session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update game session'
      });
    }
  }
);

/**
 * DELETE /api/games/:id
 * Delete a game session
 */
router.delete('/:id', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const clerkId = req.clerkId!;

      const session = await GameSessionModel.findOneAndDelete({
        _id: id,
        clerkId
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Game session not found'
        });
      }

      res.json({
        success: true,
        message: 'Game session deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting game session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete game session'
      });
    }
  }
);

/**
 * GET /api/games/stats
 * Get game session statistics
 */
router.get('/stats', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { days = 30 } = req.query;
      const daysNum = parseInt(days as string);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const sessions = await GameSessionModel.find({
        clerkId,
        createdAt: { $gte: startDate }
      }).lean();

      // Calculate statistics
      const totalSessions = sessions.length;
      const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
      const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
      const averageScore = sessions.length > 0 
        ? Math.round(sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length)
        : 0;

      // Group by game type
      const gameTypeStats: Record<string, {
        count: number;
        totalDuration: number;
        averageScore: number;
      }> = {};

      sessions.forEach(session => {
        const type = session.gameType;
        if (!gameTypeStats[type]) {
          gameTypeStats[type] = {
            count: 0,
            totalDuration: 0,
            averageScore: 0
          };
        }
        gameTypeStats[type].count++;
        gameTypeStats[type].totalDuration += session.duration;
        gameTypeStats[type].averageScore += session.score || 0;
      });

      // Calculate averages for each game type
      Object.values(gameTypeStats).forEach(stats => {
        stats.averageScore = Math.round(stats.averageScore / stats.count);
      });

      res.json({
        success: true,
        data: {
          totalSessions,
          totalDuration,
          averageDuration,
          averageScore,
          gameTypeStats,
          dateRange: {
            start: startDate.toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        }
      });

    } catch (error) {
      console.error('Error fetching game stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game stats'
      });
    }
  }
);

export default router; 