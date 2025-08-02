import { useUser as useClerkUserHook, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { User } from '../types';

export const useClerkUser = () => {
  const { user: clerkUser, isLoaded } = useClerkUserHook();
  const { isSignedIn } = useClerkAuth();
  const { state, dispatch } = useApp();

  // Sync Clerk user data with our app context
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      const user: User = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        avatar: clerkUser.imageUrl,
        createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt) : new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'system',
          notifications: true,
          privacyLevel: 'private',
          language: 'en',
        },
      };

      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } else if (isLoaded && !isSignedIn) {
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    }
  }, [clerkUser, isLoaded, isSignedIn, dispatch]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: !isLoaded,
    clerkUser,
  };
}; 