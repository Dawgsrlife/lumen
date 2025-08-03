import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useClerkUser } from '../hooks/useClerkUser';
import { apiService } from '../services/api';
import DashboardScreen from '../components/DashboardScreen';

const Dashboard: React.FC = () => {
  const { state, resetToEmotionSelection } = useAppContext();
  const { user } = useClerkUser();
  
  // Debug logging
  console.log('Dashboard: Current state', {
    user: state.user,
    isLoading: state.isLoading,
    showHeader: state.showHeader,
  });

  // Check if user has logged emotions today
  useEffect(() => {
    const checkDailyStatus = async () => {
      if (!user) return;

      try {
        const response = await apiService.getTodayEmotion();
        const hasLogged = response.hasLoggedToday;
        
        if (!hasLogged) {
          // If user hasn't logged today, redirect to flow
          console.log('Dashboard: User has not logged today, redirecting to flow');
          window.location.href = '/flow';
        }
      } catch (error) {
        console.error('Error checking daily status:', error);
        // On error, stay on dashboard
      }
    };

    checkDailyStatus();
  }, [user]);

  if (state.isLoading) {
    console.log('Dashboard: Showing loading spinner');
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>;
  }

  if (!state.user) {
    console.log('Dashboard: No user, showing loading spinner');
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mb-4"></div>
        <p className="text-gray-600">Loading user data...</p>
      </div>
    </div>;
  }

  // Default to 'happy' if no current emotion is set
  const currentEmotion = state.user.currentEmotion || 'happy';
  const currentStreak = state.user.currentStreak || 0;
  const weeklyData = state.user.weeklyData || [false, false, false, false, false, false, false];

  console.log('Dashboard: Rendering dashboard');

  return (
    <DashboardScreen
      selectedEmotion={currentEmotion}
      currentStreak={currentStreak}
      weeklyData={weeklyData}
      onReset={resetToEmotionSelection}
    />
  );
};

export default Dashboard; 