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
  const [todayEmotion, setTodayEmotion] = useState<string | null>(null);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

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

        // Try to fetch today's emotion data from our working endpoint
        try {
          const todayData = await apiService.getTodayEmotion();
          console.log("Dashboard: Today's data loaded", todayData);
          console.log("Dashboard: Raw API userData:", todayData.userData);
          
          // Store today's emotion and logging status
          setTodayEmotion(todayData.userData?.currentEmotion || null);
          setHasLoggedToday(todayData.hasLoggedToday || false);
          
          const mappedAnalytics = {
            userId: state.user.userId,
            totalEntries: todayData.userData?.totalEmotionEntries || 0,
            averageMood: todayData.userData?.averageMood || 5,
            emotionDistribution: {
              happy: todayData.userData?.currentEmotion === 'happy' ? 1 : 0,
              sad: todayData.userData?.currentEmotion === 'sad' ? 1 : 0,
              loneliness: todayData.userData?.currentEmotion === 'loneliness' ? 1 : 0,
              anxiety: todayData.userData?.currentEmotion === 'anxiety' ? 1 : 0,
              frustration: todayData.userData?.currentEmotion === 'frustration' ? 1 : 0,
              stress: todayData.userData?.currentEmotion === 'stress' ? 1 : 0,
              lethargy: todayData.userData?.currentEmotion === 'lethargy' ? 1 : 0,
              fear: todayData.userData?.currentEmotion === 'fear' ? 1 : 0,
              grief: todayData.userData?.currentEmotion === 'grief' ? 1 : 0,
            },
            streakData: { 
              current: todayData.userData?.currentStreak || 0, 
              longest: todayData.userData?.longestStreak || 0 
            },
            weeklyProgress: todayData.userData?.weeklyData || [false, false, false, false, false, false, false],
            gamesPlayed: 0,
            achievementsUnlocked: [],
            weeklyStats: {
              averageMood: todayData.userData?.averageMood || 5,
              totalEntries: todayData.userData?.totalEmotionEntries || 0,
              moodTrend: [],
              topEmotions: todayData.userData?.currentEmotion ? [todayData.userData.currentEmotion] : [],
            },
            monthlyStats: {
              averageMood: todayData.userData?.averageMood || 5,
              totalEntries: todayData.userData?.totalEmotionEntries || 0,
              streakData: { 
                current: todayData.userData?.currentStreak || 0, 
                longest: todayData.userData?.longestStreak || 0 
              },
              gameActivity: { gamesPlayed: 0, averageScore: 0 },
            },
            insights: [],
            lastUpdated: new Date(),
          };
          
          console.log("Dashboard: Mapped analytics:", mappedAnalytics);
          console.log("Dashboard: Streak data:", mappedAnalytics.streakData);
          console.log("Dashboard: Weekly progress:", mappedAnalytics.weeklyProgress);
          
          setAnalytics(mappedAnalytics);
        } catch (apiError) {
          console.warn(
            "Dashboard: API request failed, using defaults",
            apiError
          );

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
        console.error("Dashboard: Error fetching data", error);
        // Set fallback data on any error
        setAnalytics({
          userId: state.user?.userId || "fallback-user",
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

  if (isLoadingAnalytics) {
    return (
      <DashboardScreen
        selectedEmotion="happy"
        currentStreak={0}
        weeklyData={[false, false, false, false, false, false, false]}
        hasLoggedToday={false}
      />
    );
  }

  // Use today's emotion from API, default to 'happy' if none is set
  const currentEmotion = (todayEmotion as EmotionType) || "happy";
  const currentStreak = analytics?.streakData?.current || 0;
  // Convert weeklyProgress to boolean array or use default
  const weeklyData = Array.isArray(analytics?.weeklyProgress)
    ? analytics.weeklyProgress.map((item: unknown) =>
        typeof item === "boolean" ? item : false
      )
    : [false, false, false, false, false, false, false];

  console.log("Dashboard: Rendering dashboard with analytics", analytics);

  return (
    <DashboardScreen
      selectedEmotion={currentEmotion}
      currentStreak={currentStreak}
      weeklyData={weeklyData}
      hasLoggedToday={hasLoggedToday}
    />
  );
};

export default Dashboard;
