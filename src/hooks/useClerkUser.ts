import { useUser as useClerkUserHook, useAuth as useClerkAuth } from '@clerk/clerk-react';

export const useClerkUser = () => {
  const { user: clerkUser, isLoaded } = useClerkUserHook();
  const { isSignedIn } = useClerkAuth();

  return {
    user: clerkUser,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
  };
}; 