import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import multer, { FileFilterCallback } from 'multer';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { UserModel } from '../models/User.js';
import { aiService } from '../services/ai.js';
import type { CreateJournalRequest, JournalEntry } from '../types/index.js';

// Extend Request interface for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router();

// Multer configuration for audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for Gemini API
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// Validation middleware
const validateJournalEntry = [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  body('mood')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood must be between 1 and 10'),
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
 * POST /api/journal/audio
 * Create a journal entry from audio input with transcription and analysis
 */
router.post('/audio',
  authenticateToken,
  requireAuth,
  upload.single('audio'),
  body('mood')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood must be between 1 and 10'),
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
    .isMongoId()
    .withMessage('emotionEntryId must be a valid MongoDB ID'),
  async (req: MulterRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Audio file is required'
        });
      }

      const clerkId = req.clerkId!;
      const { mood = 5, tags = [], isPrivate = false, emotionEntryId } = req.body;

      // Convert audio file to base64 for Gemini API
      const audioBase64 = req.file.buffer.toString('base64');

      // Analyze audio with AI service
      let content = '';
      let audioAnalysis = undefined;
      
      try {
        audioAnalysis = await aiService.analyzeAudioJournal(audioBase64);
        content = audioAnalysis.transcription;
      } catch (audioError) {
        console.error('Audio analysis failed:', audioError);
        return res.status(500).json({
          success: false,
          message: 'Failed to process audio. Please try again or use text input.'
        });
      }

      // Find the most recent emotion entry if not provided
      let associatedEmotionEntryId = emotionEntryId;
      if (!associatedEmotionEntryId) {
        const latestEmotionEntry = await EmotionEntryModel
          .findOne({ clerkId })
          .sort({ createdAt: -1 });
        
        if (latestEmotionEntry) {
          associatedEmotionEntryId = latestEmotionEntry._id;
        }
      }

      // Create journal entry with transcribed content
      const journalEntry = new JournalEntryModel({
        clerkId,
        title: `Audio Journal - ${new Date().toLocaleDateString()}`,
        content,
        mood: 5, // Default mood for audio entries
        tags,
        isPrivate,
        emotionEntryId: associatedEmotionEntryId,
        source: 'voice_chat',
        metadata: {
          source: 'audio',
          audioAnalysis
        }
      });

      await journalEntry.save();

      // Perform AI analysis with audio context
      try {
        const analysis = await aiService.analyzeJournalEntry(journalEntry.toObject(), audioBase64);
        
        // Update emotion intensity if audio analysis suggests changes
        if (associatedEmotionEntryId && analysis.intensityAdjustment) {
          await EmotionEntryModel.findByIdAndUpdate(
            associatedEmotionEntryId,
            { 
              $inc: { intensity: analysis.intensityAdjustment },
              $set: { 
                metadata: { 
                  aiAdjusted: true,
                  source: 'audio_journal_analysis'
                }
              }
            }
          );
        }

        res.status(201).json({
          success: true,
          message: 'Audio journal entry created successfully',
          data: {
            journalEntry: journalEntry.toObject(),
            analysis,
            audioAnalysis
          }
        });
      } catch (analysisError) {
        console.error('AI analysis failed:', analysisError);
        // Still return success since journal entry was created
        res.status(201).json({
          success: true,
          message: 'Audio journal entry created (analysis unavailable)',
          data: {
            journalEntry: journalEntry.toObject(),
            audioAnalysis
          }
        });
      }
    } catch (error) {
      console.error('Audio journal creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create audio journal entry',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

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

      const { title, content, mood, tags = [], isPrivate = true, emotionEntryId }: CreateJournalRequest = req.body;
      const clerkId = req.clerkId!;

      // Find user
      const user = await UserModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get the most recent emotion entry to associate with if not provided
      let associatedEmotionEntryId = emotionEntryId;
      if (!associatedEmotionEntryId) {
        const latestEmotionEntry = await EmotionEntryModel.findOne({ clerkId })
          .sort({ createdAt: -1 })
          .limit(1)
          .lean();
        if (latestEmotionEntry) {
          associatedEmotionEntryId = latestEmotionEntry._id.toString();
        }
      }

      // Create journal entry
      const journalEntry = new JournalEntryModel({
        userId: user.id,
        clerkId,
        title,
        content,
        mood,
        tags,
        isPrivate,
        emotionEntryId: associatedEmotionEntryId
      });

      await journalEntry.save();

      // Generate AI analysis for the entry
      try {
        const analysis = await aiService.analyzeJournalEntry(journalEntry);
        
        // Apply intensity adjustment to the associated emotion entry if it exists
        if (journalEntry.emotionEntryId && analysis.intensityAdjustment) {
          const emotionEntry = await EmotionEntryModel.findById(journalEntry.emotionEntryId);
          if (emotionEntry) {
            const newIntensity = Math.max(1, Math.min(10, emotionEntry.intensity + analysis.intensityAdjustment));
            emotionEntry.intensity = newIntensity;
            await emotionEntry.save();
          }
        }
        
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