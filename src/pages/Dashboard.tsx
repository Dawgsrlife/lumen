import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAppContext } from "../context/hooks";
import { apiService } from "../services/api";
import DashboardScreen from "../components/DashboardScreen";
import type { UserAnalytics, EmotionType } from "../types";

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { getToken, isSignedIn } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  // Debug logging
  console.log("Dashboard: Current state", {
    user: state.user,
    isLoading: state.isLoading,
    showHeader: state.showHeader,
    isSignedIn,
  });

  // Fetch real dashboard data from the database
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!state.user || !isSignedIn) return;

      try {
        setIsLoadingAnalytics(true);

        // Ensure we have a valid token
        const token = await getToken();
        if (token) {
          apiService.setToken(token);
        }

        // Fetch user analytics data for the last 7 days
        const analyticsData = await apiService.getAnalyticsOverview(7);
        setAnalytics(analyticsData);

        console.log("Dashboard: Analytics loaded", analyticsData);
      } catch (error) {
        console.error("Dashboard: Failed to load analytics", error);

        // If API is unavailable, use default values but still show the dashboard
        setAnalytics({
          userId: state.user.userId,
          totalEntries: 0,
          averageMood: 5,
          emotionDistribution: {
            happy: 0,
            sad: 0,
            loneliness: 0,
            anxiety: 0,
            frustration: 0,
            stress: 0,
            lethargy: 0,
            fear: 0,
            grief: 0,
          },
          streakData: { current: 0, longest: 0 },
          weeklyProgress: [],
          gamesPlayed: 0,
          achievementsUnlocked: [],
          weeklyStats: {
            averageMood: 5,
            totalEntries: 0,
            moodTrend: [],
            topEmotions: [],
          },
          monthlyStats: {
            averageMood: 5,
            totalEntries: 0,
            streakData: { current: 0, longest: 0 },
            gameActivity: { gamesPlayed: 0, averageScore: 0 },
          },
          insights: [],
          lastUpdated: new Date(),
        });
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchDashboardData();
  }, [state.user, isSignedIn, getToken]);

  // Auto-refresh dashboard data when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && state.user && isSignedIn && !isLoadingAnalytics) {
        console.log("Dashboard: Page visible, refreshing data...");
        setIsLoadingAnalytics(true);

        try {
          // Ensure we have a fresh token
          const token = await getToken();
          if (token) {
            apiService.setToken(token);
          }

          // Small delay to ensure any recent API calls have completed
          setTimeout(async () => {
            if (state.user && isSignedIn) {
              try {
                const analyticsData = await apiService.getAnalyticsOverview(7);
                setAnalytics(analyticsData);
                console.log("Dashboard: Data refreshed on page focus");
              } catch (error) {
                console.error("Dashboard: Failed to refresh data", error);
              } finally {
                setIsLoadingAnalytics(false);
              }
            }
          }, 500);
        } catch (error) {
          console.error("Dashboard: Failed to get token for refresh", error);
          setIsLoadingAnalytics(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [state.user, isSignedIn, getToken, isLoadingAnalytics]);

  // Show loading state while analytics are being fetched
  if (state.isLoading || !state.user || isLoadingAnalytics) {
    return (
      <DashboardScreen
        selectedEmotion="happy"
        currentStreak={0}
        weeklyData={[false, false, false, false, false, false, false]}
      />
    );
  }

  // If we have analytics data, use it; otherwise fall back to defaults
  if (analytics) {
    // Determine current emotion based on recent emotion distribution
    const topEmotions = Object.entries(analytics.emotionDistribution).sort(
      ([, a], [, b]) => b - a
    );
    const mostRecentEmotion = (topEmotions[0]?.[0] as EmotionType) || "happy";

    // Convert weekly progress to boolean array (true if there was activity that day)
    const weeklyData =
      analytics.weeklyStats.moodTrend.length > 0
        ? analytics.weeklyStats.moodTrend.map((trend) => trend.entryCount > 0)
        : [false, false, false, false, false, false, false];

    // Ensure we have exactly 7 days of data
    const paddedWeeklyData = [...weeklyData];
    while (paddedWeeklyData.length < 7) {
      paddedWeeklyData.unshift(false);
    }
    const last7Days = paddedWeeklyData.slice(-7);

    console.log("Dashboard: Rendering with real data", {
      emotion: mostRecentEmotion,
      streak: analytics.streakData.current,
      weeklyData: last7Days,
      totalEntries: analytics.totalEntries,
    });

    return (
      <DashboardScreen
        selectedEmotion={mostRecentEmotion}
        currentStreak={analytics.streakData.current}
        weeklyData={last7Days}
      />
    );
  }

  // Fallback to default values if no analytics data
  console.log("Dashboard: Rendering with fallback data");
  return (
    <DashboardScreen
      selectedEmotion="happy"
      currentStreak={0}
      weeklyData={[false, false, false, false, false, false, false]}
    />
  );
};

export default Dashboard;
