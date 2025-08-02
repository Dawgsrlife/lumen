import { useAuth } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Mock auth hook for development mode
const useMockAuth = () => ({
  isSignedIn: true,
  isLoaded: true,
  user: {
    id: 'dev-user-123',
    email: 'dev@lumen.com',
    firstName: 'Developer',
    lastName: 'User',
  },
});

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/login' 
}) => {
  const isDevelopment = import.meta.env.DEV;
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // Use mock auth in development when Clerk is not configured
  const auth = (!publishableKey && isDevelopment) ? useMockAuth() : useAuth();
  const { isSignedIn, isLoaded } = auth;
  const location = useLocation();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumen-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isSignedIn) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}; 