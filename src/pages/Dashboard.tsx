import React from 'react';
import { Navigate } from 'react-router-dom';
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

  if (!state.user.currentEmotion) {
    console.log('Dashboard: No current emotion, redirecting to flow');
    // Redirect to flow if no emotion is set
    return <Navigate to="/flow" replace />;
  }

  console.log('Dashboard: Rendering dashboard');

  return (
    <DashboardScreen
      selectedEmotion={state.user.currentEmotion}
      currentStreak={state.user.currentStreak}
      weeklyData={state.user.weeklyData}
      onReset={resetToEmotionSelection}
    />
  );
};

export default Dashboard; 