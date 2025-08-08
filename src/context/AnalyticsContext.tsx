import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiService } from "../services/api";
import type { UserAnalytics, AIInsightResponse } from "../types";

interface AnalyticsContextType {
  analytics: UserAnalytics | null;
  aiInsights: AIInsightResponse | null;
  isLoadingAnalytics: boolean;
  isLoadingInsights: boolean;
  refreshAnalytics: () => Promise<void>;
  forceRefreshAnalytics: () => Promise<void>; // Force refresh ignoring cache
  generateInsights: (timeframe?: "week" | "month" | "all") => Promise<void>;
  currentTimeframe: "week" | "month" | "all";
  setTimeframe: (timeframe: "week" | "month" | "all") => void;
  invalidateCache: () => void; // Add method to invalidate cache after emotion logs
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export { AnalyticsContext };
export type { AnalyticsContextType };
export default AnalyticsContext;

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const { getToken, isSignedIn } = useAuth();

  // Cache analytics data for all timeframes with timestamp
  const [analyticsCache, setAnalyticsCache] = useState<{
    week: UserAnalytics | null;
    month: UserAnalytics | null;
    all: UserAnalytics | null;
    lastUpdated: number | null;
  }>({
    week: null,
    month: null,
    all: null,
    lastUpdated: null,
  });

  const [aiInsights, setAiInsights] = useState<AIInsightResponse | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState<
    "week" | "month" | "all"
  >("month");

  // Get current analytics based on selected timeframe
  const analytics = analyticsCache[currentTimeframe];

  // Load analytics for all timeframes at once - only if cache is empty or stale
  const refreshAnalytics = useCallback(async () => {
    if (!isSignedIn) return;

    // Check if we already have cached data for all timeframes
    const hasCachedData =
      analyticsCache.week && analyticsCache.month && analyticsCache.all;

    // Check if cache is fresh (less than 5 minutes old)
    const cacheAge = analyticsCache.lastUpdated
      ? Date.now() - analyticsCache.lastUpdated
      : Infinity;
    const isCacheFresh = cacheAge < 5 * 60 * 1000; // 5 minutes

    if (hasCachedData && isCacheFresh) {
      console.log("Analytics: Using fresh cached data, skipping database call");
      return;
    }

    if (hasCachedData && !isCacheFresh) {
      console.log("Analytics: Cache is stale, refreshing data");
    }

    try {
      setIsLoadingAnalytics(true);
      console.log("Analytics: Loading data from database");

      // Ensure we have a valid token
      const token = await getToken();
      if (token) {
        apiService.setToken(token);
      }

      // Only load missing timeframes to optimize database calls
      const promises: Promise<UserAnalytics>[] = [];
      const timeframesToLoad: string[] = [];

      if (!analyticsCache.week || !isCacheFresh) {
        promises.push(apiService.getAnalyticsOverview(7));
        timeframesToLoad.push("week");
      } else {
        promises.push(Promise.resolve(analyticsCache.week));
      }

      if (!analyticsCache.month || !isCacheFresh) {
        promises.push(apiService.getAnalyticsOverview(30));
        timeframesToLoad.push("month");
      } else {
        promises.push(Promise.resolve(analyticsCache.month));
      }

      if (!analyticsCache.all || !isCacheFresh) {
        promises.push(apiService.getAnalyticsOverview(365));
        timeframesToLoad.push("all");
      } else {
        promises.push(Promise.resolve(analyticsCache.all));
      }

      const [weekData, monthData, allData] = await Promise.all(promises);

      setAnalyticsCache({
        week: weekData,
        month: monthData,
        all: allData,
        lastUpdated: Date.now(),
      });

      console.log(
        `Analytics: Loaded ${timeframesToLoad.length > 0 ? timeframesToLoad.join(", ") : "cached"} data`
      );
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [isSignedIn, getToken, analyticsCache]);

  // Force refresh analytics ignoring cache
  const forceRefreshAnalytics = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      setIsLoadingAnalytics(true);
      console.log("Analytics: Force refreshing all data from database");

      // Ensure we have a valid token
      const token = await getToken();
      if (token) {
        apiService.setToken(token);
      }

      // Always load all timeframes fresh
      const [weekData, monthData, allData] = await Promise.all([
        apiService.getAnalyticsOverview(7), // week
        apiService.getAnalyticsOverview(30), // month
        apiService.getAnalyticsOverview(365), // all
      ]);

      setAnalyticsCache({
        week: weekData,
        month: monthData,
        all: allData,
        lastUpdated: Date.now(),
      });

      console.log("Analytics: Force refresh complete");
    } catch (error) {
      console.error("Failed to force refresh analytics:", error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [isSignedIn, getToken]);

  const generateInsights = useCallback(
    async (timeframe: "week" | "month" | "all" = currentTimeframe) => {
      if (!isSignedIn) return;

      try {
        setIsLoadingInsights(true);

        // Ensure we have a valid token
        const token = await getToken();
        if (token) {
          apiService.setToken(token);
        }

        const insightsData = await apiService.generateAIInsights(timeframe);
        setAiInsights(insightsData);
      } catch (error) {
        console.error("Failed to generate insights:", error);
      } finally {
        setIsLoadingInsights(false);
      }
    },
    [isSignedIn, getToken, currentTimeframe]
  );

  // Instant timeframe switching - no loading needed!
  const setTimeframe = (timeframe: "week" | "month" | "all") => {
    setCurrentTimeframe(timeframe);
    // No need to refresh analytics - data is already cached!
  };

  // Method to invalidate cache after emotion logs
  const invalidateCache = useCallback(() => {
    console.log("Analytics: Invalidating cache and force refreshing");
    setAnalyticsCache({
      week: null,
      month: null,
      all: null,
      lastUpdated: null,
    });
    // Force refresh all data since we just invalidated
    forceRefreshAnalytics();
  }, [forceRefreshAnalytics]);

  // Initial load when user signs in - only load once per session
  useEffect(() => {
    if (isSignedIn && !analyticsCache.lastUpdated) {
      console.log("Analytics: Initial load for signed-in user");
      refreshAnalytics();
      generateInsights();
    }
  }, [
    isSignedIn,
    refreshAnalytics,
    generateInsights,
    analyticsCache.lastUpdated,
  ]);

  const value: AnalyticsContextType = {
    analytics,
    aiInsights,
    isLoadingAnalytics,
    isLoadingInsights,
    refreshAnalytics,
    forceRefreshAnalytics,
    generateInsights,
    currentTimeframe,
    setTimeframe,
    invalidateCache,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
