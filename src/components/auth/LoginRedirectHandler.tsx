import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui';

const LoginRedirectHandler: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();

  console.log('LoginRedirectHandler: Auth state', { isSignedIn, isLoaded });

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    console.log('LoginRedirectHandler: Loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mb-4"></div>
          <p className="text-gray-600">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  // If not signed in, redirect to landing
  if (!isSignedIn) {
    console.log('LoginRedirectHandler: User not signed in, redirecting to landing');
    return <Navigate to="/landing" replace />;
  }

  // Always redirect to flow page first
  console.log('LoginRedirectHandler: User signed in, redirecting to flow');
  return <Navigate to="/flow" replace />;
};

export default LoginRedirectHandler; 