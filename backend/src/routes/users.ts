import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
// JWT import removed - using Clerk authentication instead
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { UserModel } from '../models/User.js';
import type { User, UserPreferences } from '../types/index.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;

// Validation middleware
const validateUserUpdate = [
  body('firstName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object')
];

/**
 * POST /api/users/register
 * Register a new user (called after Clerk authentication)
 */
router.post('/register', 
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, avatar } = req.body;
      const clerkId = req.clerkId!;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ clerkId });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists'
        });
      }

      // Create new user
      const user = new UserModel({
        clerkId,
        email,
        firstName,
        lastName,
        avatar,
        preferences: {
          theme: 'system',
          notifications: true,
          privacyLevel: 'private',
          language: 'en'
        }
      });

      await user.save();

      // Using Clerk authentication instead of JWT
      const token = clerkId; // Simplified for Clerk integration

      res.status(201).json({
        success: true,
        data: {
          user,
          token
        },
        message: 'User registered successfully'
      });

    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  }
);

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get('/profile', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;

      const user = await UserModel.findOne({ clerkId }).lean();
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user profile'
      });
    }
  }
);

/**
 * PUT /api/users/profile
 * Update current user's profile
 */
router.put('/profile', 
  authenticateToken, 
  requireAuth,
  validateUserUpdate,
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
      const updateData = req.body;

      const user = await UserModel.findOneAndUpdate(
        { clerkId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user profile'
      });
    }
  }
);

/**
 * PUT /api/users/preferences
 * Update user preferences
 */
router.put('/preferences', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { preferences }: { preferences: Partial<UserPreferences> } = req.body;
      const clerkId = req.clerkId!;

      // Validate preferences
      if (preferences.theme && !['light', 'dark', 'system'].includes(preferences.theme)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid theme preference'
        });
      }

      if (preferences.privacyLevel && !['public', 'private', 'friends'].includes(preferences.privacyLevel)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid privacy level'
        });
      }

      const existingUser = await UserModel.findOne({ clerkId });
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const user = await UserModel.findOneAndUpdate(
        { clerkId },
        { 
          $set: { 
            'preferences': { ...existingUser.preferences, ...preferences },
            updatedAt: new Date() 
          } 
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user.preferences,
        message: 'Preferences updated successfully'
      });

    } catch (error) {
      console.error('Error updating user preferences:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user preferences'
      });
    }
  }
);

/**
 * DELETE /api/users/profile
 * Delete user account
 */
router.delete('/profile', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;

      const user = await UserModel.findOneAndDelete({ clerkId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Note: In a real application, you would also delete all associated data
      // (emotions, journals, games, etc.) or mark them as deleted

      res.json({
        success: true,
        message: 'User account deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user account'
      });
    }
  }
);

/**
 * POST /api/users/login
 * Login user (generate new JWT token)
 */
router.post('/login', 
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;

      const user = await UserModel.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Using Clerk authentication instead of JWT
      const token = clerkId; // Simplified for Clerk integration

      res.json({
        success: true,
        data: {
          user,
          token
        },
        message: 'Login successful'
      });

    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login user'
      });
    }
  }
);

export default router; 