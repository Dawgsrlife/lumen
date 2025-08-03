import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireAuth, hackathonAuth } from '../middleware/auth.js';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import { UserModel } from '../models/User.js';
import mockDataService from '../services/mockData.js';
import type { CreateEmotionRequest, EmotionEntry, ApiResponse } from '../types/index.js';

const HACKATHON_MODE = process.env.HACKATHON_MODE === 'true' || !process.env.MONGODB_URI;

const router = Router();

// Validation middleware
const validateEmotionEntry = [
  body('emotion')
    .isIn(['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'])
    .withMessage('Invalid emotion type'),
  body('intensity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be between 1 and 10'),
  body('context')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Context must be less than 1000 characters'),
  body('surveyResponses')
    .optional()
    .isArray()
    .withMessage('Survey responses must be an array')
];

/**
 * POST /api/emotions
 * Create a new emotion entry
 */
router.post('/', 
  HACKATHON_MODE ? hackathonAuth : authenticateToken, 
  requireAuth,
  validateEmotionEntry,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { emotion, intensity, context, surveyResponses }: CreateEmotionRequest = req.body;
      const clerkId = req.clerkId!;
      const associateJournal = req.query.associateJournal === 'true';

      if (HACKATHON_MODE) {
        // Use mock data service for hackathon mode
        const emotionEntry = await mockDataService.createEmotionEntry(clerkId, {
          emotion,
          intensity: intensity || 5,
          context,
          surveyResponses
        });

        res.status(201).json({
          success: true,
          data: { emotionEntry },
          message: 'Emotion logged successfully (hackathon mode)'
        });
        return;
      }

      // Find user
      const user = await UserModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          details: {}
        });
      }

      // Get the most recent journal entry to associate with (if requested)
      let latestJournalEntry = null;
      if (associateJournal) {
        latestJournalEntry = await JournalEntryModel.findOne({ clerkId })
          .sort({ createdAt: -1 })
          .limit(1)
          .lean();
      }

      // Create emotion entry with auto-assigned intensity if not provided
      const emotionEntry = new EmotionEntryModel({
        userId: user.id,
        clerkId,
        emotion,
        intensity: intensity || 5, // Auto-assign 5 if not provided
        context,
        surveyResponses
      });

      await emotionEntry.save();

      // If there's a recent journal entry and association was requested, associate it with this emotion
      if (latestJournalEntry && associateJournal) {
        await JournalEntryModel.findByIdAndUpdate(
          latestJournalEntry._id,
          { emotionEntryId: emotionEntry.id }
        );
      }

      res.status(201).json({
        success: true,
        data: { emotionEntry },
        message: 'Emotion logged successfully'
      });

    } catch (error) {
      console.error('Error creating emotion entry:', error);
      res.status(500).json({
        error: 'Failed to create emotion entry',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * GET /api/emotions
 * Get user's emotion entries with optional filtering
 */
router.get('/', 
  HACKATHON_MODE ? hackathonAuth : authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { 
        page = 1, 
        limit = 50, 
        emotion, 
        startDate, 
        endDate,
        sort = 'createdAt',
        days = 30
      } = req.query;

      if (HACKATHON_MODE) {
        // Use mock data service for hackathon mode
        const emotions = await mockDataService.getEmotionEntries(clerkId, parseInt(days as string));
        
        // Simple filtering for hackathon mode
        let filteredEmotions = emotions;
        if (emotion) {
          filteredEmotions = emotions.filter((e: EmotionEntry) => e.emotion === emotion);
        }
        
        // Simple pagination for hackathon mode
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;
        const total = filteredEmotions.length;
        const totalPages = Math.ceil(total / limitNum);
        
        const paginatedEmotions = filteredEmotions
          .sort((a: EmotionEntry, b: EmotionEntry) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(skip, skip + limitNum);

        res.json({
          success: true,
          data: {
            emotions: paginatedEmotions,
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
        return;
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = { clerkId };
      
      if (emotion) {
        query.emotion = emotion;
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
      const [emotions, total] = await Promise.all([
        EmotionEntryModel.find(query)
          .sort({ [sort as string]: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        EmotionEntryModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: {
          emotions,
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
      console.error('Error fetching emotion entries:', error);
      res.status(500).json({
        error: 'Failed to fetch emotion entries',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * GET /api/emotions/daily
 * Get emotion entries grouped by day
 */
router.get('/daily', 
  HACKATHON_MODE ? hackathonAuth : authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { days = 30 } = req.query;
      const daysNum = parseInt(days as string);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const emotions = await EmotionEntryModel.find({
        clerkId,
        createdAt: { $gte: startDate }
      })
      .sort({ createdAt: -1 })
      .lean();

      // Group by date
      const dailyEntries: Record<string, EmotionEntry[]> = {};
      
      emotions.forEach(emotion => {
        const date = emotion.createdAt.toISOString().split('T')[0];
        if (!dailyEntries[date]) {
          dailyEntries[date] = [];
        }
        dailyEntries[date].push(emotion);
      });

      res.json({
        success: true,
        data: {
          dailyEntries,
          totalDays: Object.keys(dailyEntries).length,
          totalEntries: emotions.length
        }
      });

    } catch (error) {
      console.error('Error fetching daily emotions:', error);
      res.status(500).json({
        error: 'Failed to fetch daily emotions',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * GET /api/emotions/:id
 * Get a specific emotion entry
 */
router.get('/:id', 
  HACKATHON_MODE ? hackathonAuth : authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const clerkId = req.clerkId!;

      const emotion = await EmotionEntryModel.findOne({
        _id: id,
        clerkId
      }).lean();

      if (!emotion) {
        return res.status(404).json({
          error: 'Emotion entry not found',
          code: 'NOT_FOUND',
          details: {}
        });
      }

      res.json({
        success: true,
        data: emotion
      });

    } catch (error) {
      console.error('Error fetching emotion entry:', error);
      res.status(500).json({
        error: 'Failed to fetch emotion entry',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * PUT /api/emotions/:id
 * Update an emotion entry
 */
router.put('/:id', 
  HACKATHON_MODE ? hackathonAuth : authenticateToken, 
  requireAuth,
  validateEmotionEntry,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const clerkId = req.clerkId!;
      const updateData = req.body;

      const emotion = await EmotionEntryModel.findOneAndUpdate(
        { _id: id, clerkId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!emotion) {
        return res.status(404).json({
          error: 'Emotion entry not found',
          code: 'NOT_FOUND',
          details: {}
        });
      }

      res.json({
        success: true,
        data: emotion,
        message: 'Emotion entry updated successfully'
      });

    } catch (error) {
      console.error('Error updating emotion entry:', error);
      res.status(500).json({
        error: 'Failed to update emotion entry',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

/**
 * DELETE /api/emotions/:id
 * Delete an emotion entry
 */
router.delete('/:id', 
  HACKATHON_MODE ? hackathonAuth : authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const clerkId = req.clerkId!;

      const emotion = await EmotionEntryModel.findOneAndDelete({
        _id: id,
        clerkId
      });

      if (!emotion) {
        return res.status(404).json({
          error: 'Emotion entry not found',
          code: 'NOT_FOUND',
          details: {}
        });
      }

      res.json({
        success: true,
        message: 'Emotion entry deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting emotion entry:', error);
      res.status(500).json({
        error: 'Failed to delete emotion entry',
        code: 'INTERNAL_ERROR',
        details: {}
      });
    }
  }
);

export default router; 