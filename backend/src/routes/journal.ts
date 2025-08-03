import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import { UserModel } from '../models/User.js';
import { aiService } from '../services/ai.js';
import type { CreateJournalRequest, JournalEntry } from '../types/index.js';

const router = Router();

// Validation middleware
const validateJournalEntry = [
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  body('mood')
    .isIn(['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'])
    .withMessage('Invalid mood type'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  body('emotionEntryId')
    .optional()
    .isString()
    .withMessage('emotionEntryId must be a string')
];

/**
 * POST /api/journal
 * Create a new journal entry
 */
router.post('/', 
  authenticateToken, 
  requireAuth,
  validateJournalEntry,
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

      const { content, mood, tags = [], isPrivate = true, emotionEntryId }: CreateJournalRequest = req.body;
      const clerkId = req.clerkId!;

      // Find user
      const user = await UserModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Create journal entry
      const journalEntry = new JournalEntryModel({
        userId: user.id,
        clerkId,
        content,
        mood,
        tags,
        isPrivate,
        emotionEntryId
      });

      await journalEntry.save();

      // Generate AI analysis for the entry
      try {
        const analysis = await aiService.analyzeJournalEntry(journalEntry);
        
        res.status(201).json({
          success: true,
          data: {
            journalEntry,
            analysis
          },
          message: 'Journal entry created successfully'
        });
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        res.status(201).json({
          success: true,
          data: journalEntry,
          message: 'Journal entry created successfully (AI analysis unavailable)'
        });
      }

    } catch (error) {
      console.error('Error creating journal entry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create journal entry'
      });
    }
  }
);

/**
 * GET /api/journal
 * Get user's journal entries with optional filtering
 */
router.get('/', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { 
        page = 1, 
        limit = 20, 
        mood, 
        startDate, 
        endDate,
        sort = 'createdAt',
        includePrivate = 'true'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;
      const includePrivateBool = includePrivate === 'true';

      // Build query
      const query: any = { clerkId };
      
      if (mood) {
        query.mood = mood;
      }
      
      if (!includePrivateBool) {
        query.isPrivate = false;
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
      const [entries, total] = await Promise.all([
        JournalEntryModel.find(query)
          .sort({ [sort as string]: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        JournalEntryModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: {
          entries,
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
      console.error('Error fetching journal entries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch journal entries'
      });
    }
  }
);

/**
 * GET /api/journal/daily
 * Get journal entries grouped by day
 */
router.get('/daily', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { days = 30, includePrivate = 'true' } = req.query;
      const daysNum = parseInt(days as string);
      const includePrivateBool = includePrivate === 'true';

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const query: any = {
        clerkId,
        createdAt: { $gte: startDate }
      };

      if (!includePrivateBool) {
        query.isPrivate = false;
      }

      const entries = await JournalEntryModel.find(query)
        .sort({ createdAt: -1 })
        .lean();

      // Group by date
      const dailyEntries: Record<string, JournalEntry[]> = {};
      
      entries.forEach(entry => {
        const date = entry.createdAt.toISOString().split('T')[0];
        if (!dailyEntries[date]) {
          dailyEntries[date] = [];
        }
        dailyEntries[date].push(entry);
      });

      res.json({
        success: true,
        data: {
          dailyEntries,
          totalDays: Object.keys(dailyEntries).length,
          totalEntries: entries.length
        }
      });

    } catch (error) {
      console.error('Error fetching daily journal entries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch daily journal entries'
      });
    }
  }
);

/**
 * GET /api/journal/:id
 * Get a specific journal entry
 */
router.get('/:id', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const clerkId = req.clerkId!;

      const entry = await JournalEntryModel.findOne({
        _id: id,
        clerkId
      }).lean();

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Journal entry not found'
        });
      }

      res.json({
        success: true,
        data: entry
      });

    } catch (error) {
      console.error('Error fetching journal entry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch journal entry'
      });
    }
  }
);

/**
 * PUT /api/journal/:id
 * Update a journal entry
 */
router.put('/:id', 
  authenticateToken, 
  requireAuth,
  validateJournalEntry,
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

      const entry = await JournalEntryModel.findOneAndUpdate(
        { _id: id, clerkId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Journal entry not found'
        });
      }

      res.json({
        success: true,
        data: entry,
        message: 'Journal entry updated successfully'
      });

    } catch (error) {
      console.error('Error updating journal entry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update journal entry'
      });
    }
  }
);

/**
 * DELETE /api/journal/:id
 * Delete a journal entry
 */
router.delete('/:id', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const clerkId = req.clerkId!;

      const entry = await JournalEntryModel.findOneAndDelete({
        _id: id,
        clerkId
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: 'Journal entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Journal entry deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting journal entry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete journal entry'
      });
    }
  }
);

/**
 * GET /api/journal/search
 * Search journal entries by content
 */
router.get('/search', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { q, page = 1, limit = 20 } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const query = {
        clerkId,
        $text: { $search: q }
      };

      const [entries, total] = await Promise.all([
        JournalEntryModel.find(query)
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        JournalEntryModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: {
          entries,
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
      console.error('Error searching journal entries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search journal entries'
      });
    }
  }
);

export default router; 