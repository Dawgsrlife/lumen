import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { clerkService } from '../services/clerk.js';
import type { AuthUser } from '../types/index.js';

// Extend Express Request interface to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
      clerkId?: string;
    }
  }
}

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  console.warn('CLERK_SECRET_KEY not set - authentication will be disabled');
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    // Verify token with Clerk
    const authUser = await clerkService.verifyToken(token);
    
    if (!authUser) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
      return;
    }

    // Find or create user in our database
    let user = await UserModel.findOne({ clerkId: authUser.clerkId });
    
    if (!user) {
      // Create new user if they don't exist
      user = new UserModel({
        clerkId: authUser.clerkId,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        avatar: authUser.avatar,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'system',
          notifications: true,
          privacyLevel: 'private',
          language: 'en'
        }
      });
      await user.save();
    } else {
      // Update last login and user info
      user.lastLoginAt = new Date();
      user.email = authUser.email;
      user.firstName = authUser.firstName;
      user.lastName = authUser.lastName;
      user.avatar = authUser.avatar;
      await user.save();
    }

    req.user = authUser;
    req.clerkId = authUser.clerkId;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }
  next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const authUser = await clerkService.verifyToken(token);
      
      if (authUser) {
        const user = await UserModel.findOne({ clerkId: authUser.clerkId });
        
        if (user) {
          req.user = authUser;
          req.clerkId = authUser.clerkId;
        }
      }
    }
    
    next();
  } catch {
    // Continue without authentication
    next();
  }
}; 