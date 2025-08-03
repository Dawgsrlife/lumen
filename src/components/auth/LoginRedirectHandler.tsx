import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui';
import { apiService } from '../../services/api';

const LoginRedirectHandler: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isCheckingDailyStatus, setIsCheckingDailyStatus] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  console.log('LoginRedirectHandler: Auth state', { isSignedIn, isLoaded });

  // Check daily status when user is signed in
  useEffect(() => {
    const initializeUserSession = async () => {
      if (!isSignedIn || !user) return;

      console.log('LoginRedirectHandler: Initializing session for user:', user.id);
      setIsCheckingDailyStatus(true);
      
      try {
        // Set the user ID for API authentication (fallback for hackathon)
        console.log('LoginRedirectHandler: Setting up auth for user:', user.id);
        apiService.setClerkUserId(user.id);
        
        // Test API connectivity first
        console.log('LoginRedirectHandler: Testing API connectivity...');
        await apiService.healthCheck();
        console.log('LoginRedirectHandler: API health check passed');
        
        // Check daily status
        console.log('LoginRedirectHandler: Checking today emotion status...');
        const response = await apiService.getTodayEmotion();
        const hasLogged = response.hasLoggedToday;
        setHasLoggedToday(hasLogged);
        
        console.log('LoginRedirectHandler: Daily status result:', { 
          hasLogged, 
          userId: user.id,
          response 
        });
      } catch (error) {
        console.error('LoginRedirectHandler: Error checking daily status:', error);
        // On API error, default to flow (safer option)
        setHasLoggedToday(false);
      } finally {
        setIsCheckingDailyStatus(false);
      }
    };

    if (isSignedIn && user) {
      initializeUserSession();
    }
  }, [isSignedIn, user]);

  // Show loading while Clerk is initializing or checking daily status
  if (!isLoaded || isCheckingDailyStatus) {
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

  // If user has already logged today, go to dashboard
  if (hasLoggedToday) {
    console.log('LoginRedirectHandler: User has already logged today, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If user hasn't logged today, go to flow
  console.log('LoginRedirectHandler: User has not logged today, redirecting to flow');
  return <Navigate to="/flow" replace />;
};

export default LoginRedirectHandler; 