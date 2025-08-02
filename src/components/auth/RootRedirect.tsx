import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui';

const RootRedirect: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If signed in, redirect to welcome page
  if (isSignedIn) {
    return <Navigate to="/welcome" replace />;
  }

  // If not signed in, show landing page
  return <Navigate to="/landing" replace />;
};

export default RootRedirect; 