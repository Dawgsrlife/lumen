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
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);

  console.log('LoginRedirectHandler: Auth state', { isSignedIn, isLoaded });

  // Check if user should see welcome screen (new login)
  useEffect(() => {
    if (!isSignedIn || !user) return;

    // Check if this is a new login session (no welcome shown in localStorage for this user)
    const welcomeShownKey = `lumen-welcome-shown-${user.id}`;
    const welcomeShown = localStorage.getItem(welcomeShownKey);
    
    if (!welcomeShown) {
      console.log('LoginRedirectHandler: First login detected, showing welcome screen');
      setShouldShowWelcome(true);
      // Mark welcome as shown for this user
      localStorage.setItem(welcomeShownKey, 'true');
    }
  }, [isSignedIn, user]);

  // Check daily status when user is signed in
  useEffect(() => {
    const checkDailyStatus = async () => {
      if (!isSignedIn || !user) return;

      console.log('LoginRedirectHandler: Checking daily status for user:', user.id);
      setIsCheckingDailyStatus(true);
      
      try {
        const response = await apiService.getTodayEmotion();
        const hasLogged = response.hasLoggedToday;
        setHasLoggedToday(hasLogged);
        
        console.log('LoginRedirectHandler: Daily status result:', { hasLogged });
      } catch (error) {
        console.error('LoginRedirectHandler: Error checking daily status:', error);
        // On API error, default to flow (safer option)
        setHasLoggedToday(false);
      } finally {
        setIsCheckingDailyStatus(false);
      }
    };

    if (isSignedIn && user && !shouldShowWelcome) {
      checkDailyStatus();
    }
  }, [isSignedIn, user, shouldShowWelcome]);

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

  // If should show welcome screen (new login), redirect to welcome
  if (shouldShowWelcome) {
    console.log('LoginRedirectHandler: New login detected, redirecting to welcome');
    return <Navigate to="/welcome" replace />;
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