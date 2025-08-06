import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import { UserModel } from '../models/User.js';
import type { CreateEmotionRequest, EmotionEntry } from '../types/index.js';
import type { Document } from 'mongoose';

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

// Helper function to calculate streak
const calculateStreak = async (clerkId: string): Promise<number> => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  let streak = 0;
  const currentDate = new Date(startOfDay);
  
  while (true) {
    const entry = await EmotionEntryModel.findOne({
      clerkId,
      createdAt: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (entry) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Helper function to update weekly data
const updateWeeklyData = async (clerkId: string, user: Document): Promise<boolean[]> => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Check if we need to reset weekly data (new week)
  const lastEmotion = user.lastEmotionDate ? new Date(user.lastEmotionDate) : null;
  if (!lastEmotion || isNewWeek(lastEmotion, today)) {
    user.weeklyData = [false, false, false, false, false, false, false];
  }
  
  // Update today's entry
  user.weeklyData[dayOfWeek] = true;
  await user.save();
  
  return user.weeklyData;
};

// Helper function to check if it's a new week
const isNewWeek = (lastDate: Date, currentDate: Date): boolean => {
  const lastWeek = getWeekNumber(lastDate);
  const currentWeek = getWeekNumber(currentDate);
  return lastWeek !== currentWeek;
};

// Helper function to get week number
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * POST /api/emotions
 * Create a new emotion entry with enhanced data integration
 */
router.post('/', 
  authenticateToken, 
  requireAuth,
  validateEmotionEntry,
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

      const { emotion, intensity, context, surveyResponses }: CreateEmotionRequest = req.body;
      const clerkId = req.clerkId!;

      // Find or create user
      const user = await UserModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if user has already logged an emotion today
      const today = new Date();
      const hasLoggedToday = user.hasLoggedToday();
      
      if (hasLoggedToday) {
        return res.status(400).json({
          success: false,
          error: 'You have already logged an emotion today'
        });
      }

      // Get the most recent journal entry to associate with
      const latestJournalEntry = await JournalEntryModel.findOne({ clerkId })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean();

      // Create emotion entry
      const emotionEntry = new EmotionEntryModel({
        userId: user.id,
        clerkId,
        emotion,
        intensity: intensity || 5,
        context,
        surveyResponses
      });

      await emotionEntry.save();

      // Update user data
      user.lastEmotionDate = today;
      user.currentEmotion = emotion;
      user.totalEmotionEntries += 1;
      
      // Update favorite emotions
      if (!user.favoriteEmotions.includes(emotion)) {
        user.favoriteEmotions.push(emotion);
        if (user.favoriteEmotions.length > 5) {
          user.favoriteEmotions = user.favoriteEmotions.slice(-5); // Keep last 5
        }
      }
      
      // Update weekly data
      await updateWeeklyData(clerkId, user);
      
      // Calculate new streak
      const newStreak = await calculateStreak(clerkId);
      user.currentStreak = newStreak;
      if (newStreak > user.longestStreak) {
        user.longestStreak = newStreak;
      }
      
      // Update average mood (simplified calculation)
      const recentEmotions = await EmotionEntryModel.find({ clerkId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      
      if (recentEmotions.length > 0) {
        const totalIntensity = recentEmotions.reduce((sum, entry) => sum + entry.intensity, 0);
        user.averageMood = Math.round(totalIntensity / recentEmotions.length);
      }
      
      await user.save();

      // If there's a recent journal entry, associate it with this emotion
      if (latestJournalEntry) {
        await JournalEntryModel.findByIdAndUpdate(
          latestJournalEntry._id,
          { emotionEntryId: emotionEntry.id }
        );
      }

      res.status(201).json({
        success: true,
        data: {
          emotionEntry,
          userData: {
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            weeklyData: user.weeklyData,
            totalEmotionEntries: user.totalEmotionEntries,
            averageMood: user.averageMood
          }
        },
        message: 'Emotion logged successfully'
      });

    } catch (error) {
      console.error('Error creating emotion entry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create emotion entry'
      });
    }
  }
);

/**
 * GET /api/emotions
 * Get user's emotion entries with enhanced data
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
        emotion, 
        startDate, 
        endDate,
        sort = 'createdAt' 
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: Record<string, unknown> = { clerkId };
      
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

      // Get user data for enhanced response
      const user = await UserModel.findOne({ clerkId }).lean();
      const userData = user ? {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        weeklyData: user.weeklyData,
        totalEmotionEntries: user.totalEmotionEntries,
        averageMood: user.averageMood,
        hasLoggedToday: user.hasLoggedToday()
      } : null;

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: {
          emotions,
          userData,
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
        success: false,
        error: 'Failed to fetch emotion entries'
      });
    }
  }
);

/**
 * GET /api/emotions/today
 * Check if user has logged emotion today and get today's data
 */
router.get('/today', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const todayEntry = await EmotionEntryModel.findOne({
        clerkId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }).lean();

      const user = await UserModel.findOne({ clerkId }).lean();

      res.json({
        success: true,
        data: {
          hasLoggedToday: !!todayEntry,
          todayEntry,
          userData: user ? {
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            weeklyData: user.weeklyData,
            currentEmotion: user.currentEmotion,
            hasPlayedGameToday: user.hasPlayedGameToday
          } : null
        }
      });

    } catch (error) {
      console.error('Error checking today\'s emotion:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check today\'s emotion'
      });
    }
  }
);

/**
 * GET /api/emotions/daily
 * Get emotion entries grouped by day
 */
router.get('/daily', 
  authenticateToken, 
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
        success: false,
        error: 'Failed to fetch daily emotions'
      });
    }
  }
);

/**
 * GET /api/emotions/:id
 * Get a specific emotion entry
 */
router.get('/:id', 
  authenticateToken, 
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
          success: false,
          error: 'Emotion entry not found'
        });
      }

      res.json({
        success: true,
        data: emotion
      });

    } catch (error) {
      console.error('Error fetching emotion entry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch emotion entry'
      });
    }
  }
);

/**
 * PUT /api/emotions/:id
 * Update an emotion entry
 */
router.put('/:id', 
  authenticateToken, 
  requireAuth,
  validateEmotionEntry,
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

      const emotion = await EmotionEntryModel.findOneAndUpdate(
        { _id: id, clerkId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!emotion) {
        return res.status(404).json({
          success: false,
          error: 'Emotion entry not found'
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
        success: false,
        error: 'Failed to update emotion entry'
      });
    }
  }
);

/**
 * DELETE /api/emotions/:id
 * Delete an emotion entry
 */
router.delete('/:id', 
  authenticateToken, 
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
          success: false,
          error: 'Emotion entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Emotion entry deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting emotion entry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete emotion entry'
      });
    }
  }
);

export default router; 