import React from 'react';
import { useAppContext } from '../context/AppContext';
import DashboardScreen from '../components/DashboardScreen';

const Dashboard: React.FC = () => {
  const { state, resetToEmotionSelection } = useAppContext();
  
  // Debug logging
  console.log('Dashboard: Current state', {
    user: state.user,
    isLoading: state.isLoading,
    showHeader: state.showHeader,
  });

  // Removed automatic redirect to flow - this should only happen on initial login
  // The flow will be triggered automatically only once per session via LoginRedirectHandler

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
    />
  );
};

export default Dashboard; 