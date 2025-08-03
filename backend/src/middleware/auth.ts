import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import type { AuthUser } from '../types/index.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      clerkId?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY environment variable is required');
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

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { clerkId: string };
    const clerkId = decoded.clerkId;

    // Find or create user in our database
    let user = await UserModel.findOne({ clerkId });
    
    if (!user) {
      // Create new user if they don't exist
      // This will be handled by the user creation endpoint
      res.status(401).json({
        success: false,
        error: 'User not found. Please complete registration.'
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    req.user = {
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar
    };
    req.clerkId = clerkId;

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
      const decoded = jwt.verify(token, JWT_SECRET) as { clerkId: string };
      const user = await UserModel.findOne({ clerkId: decoded.clerkId });
      
      if (user) {
        req.user = {
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar
        };
        req.clerkId = decoded.clerkId;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}; 