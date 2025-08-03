import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui';

const RootRedirect: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();

  console.log('RootRedirect: Auth state', { isSignedIn, isLoaded });

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    console.log('RootRedirect: Clerk not loaded, showing loading');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If signed in, redirect to dashboard
  if (isSignedIn) {
    console.log('RootRedirect: User signed in, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If not signed in, show landing page
  console.log('RootRedirect: User not signed in, redirecting to landing');
  return <Navigate to="/landing" replace />;
};

export default RootRedirect; 