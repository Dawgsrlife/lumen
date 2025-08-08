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
      if (!state.user || !isSignedIn) {
        console.log("Dashboard: No user or not signed in, using defaults");
        setAnalytics({
          userId: "demo-user",
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
        setIsLoadingAnalytics(false);
        return;
      }

      try {
        setIsLoadingAnalytics(true);

        // Try to get token and set up API, but don't fail if it doesn't work
        try {
          const token = await getToken();
          if (token) {
            apiService.setToken(token);
          }
        } catch (tokenError) {
          console.warn("Dashboard: Could not get auth token", tokenError);
        }

        // Try to fetch analytics data, but use fallback if it fails
        try {
          const analyticsData = await apiService.getAnalyticsOverview(7);
          setAnalytics(analyticsData);
          console.log("Dashboard: Analytics loaded", analyticsData);
        } catch (apiError) {
          console.warn("Dashboard: API request failed, using defaults", apiError);
          
          // Use default values that work with the current user
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
        }
      } catch (error) {
        console.error("Dashboard: Failed to load analytics", error);

        // If API is unavailable, use default values but still show the dashboard
        setAnalytics({
          userId: state.user?.userId || "demo-user",
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
  if (state.isLoading || isLoadingAnalytics) {
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
    const emotionDistribution = analytics.emotionDistribution || {};
    const topEmotions = Object.entries(emotionDistribution).sort(
      ([, a], [, b]) => (b || 0) - (a || 0)
    );

    // Validate that the emotion is a valid EmotionType
    const validEmotions = [
      "happy",
      "sad",
      "loneliness",
      "anxiety",
      "frustration",
      "stress",
      "lethargy",
      "fear",
      "grief",
    ];
    const candidateEmotion = topEmotions[0]?.[0];
    const mostRecentEmotion = (
      validEmotions.includes(candidateEmotion) ? candidateEmotion : "happy"
    ) as EmotionType;

    // Convert weekly progress to boolean array (true if there was activity that day)
    const weeklyStats = analytics.weeklyStats || {};
    const moodTrend = weeklyStats.moodTrend || [];
    const weeklyData = moodTrend.length > 0
      ? moodTrend.map((trend) => (trend && trend.entryCount > 0))
      : [false, false, false, false, false, false, false];

    // Ensure we have exactly 7 days of data
    const paddedWeeklyData = [...weeklyData];
    while (paddedWeeklyData.length < 7) {
      paddedWeeklyData.unshift(false);
    }
    const last7Days = paddedWeeklyData.slice(-7);

    // Ensure streak data exists and is valid
    const streakData = analytics.streakData || {};
    const currentStreak = typeof streakData.current === 'number' ? streakData.current : 0;

    console.log("Dashboard: Rendering with real data", {
      emotion: mostRecentEmotion,
      streak: currentStreak,
      weeklyData: last7Days,
      totalEntries: analytics.totalEntries,
    });

    return (
      <DashboardScreen
        selectedEmotion={mostRecentEmotion}
        currentStreak={currentStreak}
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
