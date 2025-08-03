import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { clerkService } from '../services/clerk.js';
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

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const HACKATHON_MODE = process.env.HACKATHON_MODE === 'true' || !process.env.MONGODB_URI;

if (!CLERK_SECRET_KEY) {
  console.warn('CLERK_SECRET_KEY not set - authentication will be disabled');
}

// Hackathon authentication middleware
export const hackathonAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
        details: {}
      });
      return;
    }

    // Simple validation: token must be 1-50 characters
    if (token.length < 1 || token.length > 50) {
      res.status(401).json({
        error: 'Invalid token format',
        code: 'INVALID_TOKEN',
        details: {}
      });
      return;
    }

    // Create consistent mock user for hackathon
    const mockUser: AuthUser = {
      clerkId: token,
      email: 'demo@lumen.com',
      firstName: 'Demo',
      lastName: 'User',
      avatar: 'https://via.placeholder.com/150'
    };
    
    req.user = mockUser;
    req.clerkId = token;
    next();
  } catch (error) {
    console.error('Hackathon auth error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      code: 'AUTH_FAILED',
      details: {}
    });
  }
};

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
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
        details: {}
      });
      return;
    }

    // Hackathon mode: use simplified authentication
    if (HACKATHON_MODE) {
      console.log('🔧 Hackathon mode: using simplified authentication');
      
      // Simple validation: token must be 1-50 characters
      if (token.length < 1 || token.length > 50) {
        res.status(401).json({
          error: 'Invalid token format',
          code: 'INVALID_TOKEN',
          details: {}
        });
        return;
      }

      // Create consistent mock user for hackathon
      const mockUser: AuthUser = {
        clerkId: token,
        email: 'demo@lumen.com',
        firstName: 'Demo',
        lastName: 'User',
        avatar: 'https://via.placeholder.com/150'
      };
      
      req.user = mockUser;
      req.clerkId = token;
      next();
      return;
    }

    // For hackathon: if token looks like a user ID (not a JWT), use it directly
    if (token.length < 50 && !token.includes('.')) {
      // This is likely a user ID, not a JWT token
      const user = await UserModel.findOne({ clerkId: token });
      
      if (!user) {
        res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          details: {}
        });
        return;
      }

      req.user = {
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      };
      req.clerkId = user.clerkId;
      next();
      return;
    }

    // Normal Clerk token verification
    const authUser = await clerkService.verifyToken(token);
    
    if (!authUser) {
      res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
        details: {}
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
    
    // In hackathon mode, continue with mock user
    if (HACKATHON_MODE) {
      console.log('🔧 Hackathon mode: continuing with mock user after auth error');
      const mockUser: AuthUser = {
        clerkId: 'hackathon_user',
        email: 'demo@lumen.com',
        firstName: 'Demo',
        lastName: 'User',
        avatar: 'https://via.placeholder.com/150'
      };
      
      req.user = mockUser;
      req.clerkId = 'hackathon_user';
      next();
      return;
    }
    
    res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
      details: {}
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
      error: 'Authentication required',
      code: 'AUTH_REQUIRED',
      details: {}
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
      // Hackathon mode: create mock user
      if (HACKATHON_MODE) {
        if (token.length >= 1 && token.length <= 50) {
          const mockUser: AuthUser = {
            clerkId: token,
            email: 'demo@lumen.com',
            firstName: 'Demo',
            lastName: 'User',
            avatar: 'https://via.placeholder.com/150'
          };
          
          req.user = mockUser;
          req.clerkId = token;
        }
        next();
        return;
      }

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
  } catch (error) {
    // Continue without authentication
    next();
  }
}; 