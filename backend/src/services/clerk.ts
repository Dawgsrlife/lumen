import { clerkClient } from '@clerk/clerk-sdk-node';
import { UserModel } from '../models/User.js';
import type { AuthUser } from '../types/index.js';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const HACKATHON_MODE = process.env.HACKATHON_MODE === 'true' || !process.env.MONGODB_URI;

if (!CLERK_SECRET_KEY) {
  console.warn('CLERK_SECRET_KEY not set - authentication will be disabled');
}

export class ClerkService {
  /**
   * Verify a JWT token from Clerk
   * Note: This is a simplified implementation for hackathon development
   * In production, you would implement proper JWT verification
   */
  async verifyToken(token: string): Promise<AuthUser | null> {
    if (!CLERK_SECRET_KEY) {
      console.warn('Clerk not configured, skipping token verification');
      return null;
    }

    try {
      // Note: This is a simplified implementation for hackathon
      // In production, you would extract sessionId from token and verify properly
      const sessionId = token; // Simplified for testing
      const session = await clerkClient.sessions.verifySession(sessionId, token);
      const user = await clerkClient.users.getUser(session.userId);
      
      return {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        avatar: user.imageUrl || undefined
      };
    } catch (error) {
      console.error('Clerk token verification failed:', error);
      return null;
    }
  }

  /**
   * Get user details from Clerk
   */
  async getUserDetails(clerkId: string): Promise<AuthUser | null> {
    if (!CLERK_SECRET_KEY) {
      console.warn('Clerk not configured, cannot fetch user details');
      return null;
    }

    try {
      const user = await clerkClient.users.getUser(clerkId);
      
      return {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        avatar: user.imageUrl || undefined
      };
    } catch (error) {
      console.error('Failed to fetch user details from Clerk:', error);
      return null;
    }
  }

  /**
   * Create or update user in our database from Clerk data
   */
  async syncUserFromClerk(clerkId: string): Promise<AuthUser | null> {
    try {
      const clerkUser = await this.getUserDetails(clerkId);
      if (!clerkUser) return null;

      // Find existing user or create new one
      let user = await UserModel.findOne({ clerkId });
      
      if (!user) {
        // Create new user
        user = new UserModel({
          clerkId: clerkUser.clerkId,
          email: clerkUser.email,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          avatar: clerkUser.avatar,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            theme: 'system',
            notifications: true,
            privacyLevel: 'private',
            language: 'en'
          }
        });
      } else {
        // Update existing user
        user.email = clerkUser.email;
        user.firstName = clerkUser.firstName;
        user.lastName = clerkUser.lastName;
        user.avatar = clerkUser.avatar;
        user.lastLoginAt = new Date();
      }

      await user.save();
      return clerkUser;
    } catch (error) {
      console.error('Failed to sync user from Clerk:', error);
      
      // In hackathon mode, continue with degraded functionality
      if (HACKATHON_MODE) {
        console.log('🔧 Hackathon mode: continuing without user sync');
        return null;
      }
      
      return null;
    }
  }

  /**
   * Get primary email from user's email addresses
   * Uses first email address as primary for hackathon simplicity
   */
  private getPrimaryEmail(emailAddresses: any[]): string {
    if (!emailAddresses || emailAddresses.length === 0) {
      return '';
    }
    
    // For hackathon: use first email address as primary
    // In production, you'd check for primary email flag
    return emailAddresses[0]?.emailAddress || '';
  }
}

export const clerkService = new ClerkService(); 