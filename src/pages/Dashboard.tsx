import React from 'react';
import { useAppContext } from '../context/hooks';
import DashboardScreen from '../components/DashboardScreen';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  
  // Debug logging
  console.log('Dashboard: Current state', {
    user: state.user,
    isLoading: state.isLoading,
    showHeader: state.showHeader,
  });

  // Removed automatic redirect to flow - this should only happen on initial login
  // The flow will be triggered automatically only once per session via LoginRedirectHandler

  // Skip loading screens - let content load naturally
  if (state.isLoading || !state.user) {
    // Return empty dashboard that will load content when ready
    return (
      <DashboardScreen
        selectedEmotion="happy"
        currentStreak={0}
        weeklyData={[false, false, false, false, false, false, false]}
      />
    );
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