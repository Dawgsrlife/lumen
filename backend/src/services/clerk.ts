import { clerkClient } from "@clerk/clerk-sdk-node";
import type { AuthUser } from "../types/index.js";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  console.warn("CLERK_SECRET_KEY not set - authentication will be disabled");
}

export class ClerkService {
  /**
   * Verify a Clerk session using either a sessionId+sessionToken pair or a JWT alone.
   */
  async verifyToken(
    token: string,
    sessionId?: string
  ): Promise<AuthUser | null> {
    if (!CLERK_SECRET_KEY) {
      console.warn("Clerk not configured, skipping token verification");
      return null;
    }

    try {
      if (sessionId) {
        const session = await clerkClient.sessions.verifySession(
          sessionId,
          token
        );
        const user = await clerkClient.users.getUser(session.userId);
        return {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          avatar: user.imageUrl || undefined,
        };
      }

      // Fallback: try verifying token directly (JWT)
      // @ts-expect-error - older SDKs expose verifyToken at root
      const verified = await (clerkClient as unknown).verifyToken?.(token);
      if (verified?.sub) {
        const user = await clerkClient.users.getUser(verified.sub);
        return {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          avatar: user.imageUrl || undefined,
        };
      }
      return null;
    } catch (error) {
      console.error("Clerk token verification failed:", error);
      return null;
    }
  }

  /**
   * Get user details from Clerk
   */
  async getUserDetails(clerkId: string): Promise<AuthUser | null> {
    if (!CLERK_SECRET_KEY) {
      console.warn("Clerk not configured, cannot fetch user details");
      return null;
    }

    try {
      const user = await clerkClient.users.getUser(clerkId);

      return {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        avatar: user.imageUrl || undefined,
      };
    } catch (error) {
      console.error("Failed to fetch user details from Clerk:", error);
      return null;
    }
  }

  /**
   * Create or update user in our database from Clerk data
   */
  async syncUserFromClerk(clerkId: string): Promise<AuthUser | null> {
    const clerkUser = await this.getUserDetails(clerkId);
    if (!clerkUser) return null;

    // This would typically update our User model
    // For now, we'll just return the Clerk user data
    return clerkUser;
  }
}

export const clerkService = new ClerkService();
