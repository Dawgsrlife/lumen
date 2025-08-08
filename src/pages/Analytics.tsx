import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useClerkUser } from "../hooks/useClerkUser";
import { apiService } from "../services/api";
import { LumenMascot } from "../components/ui";
import type { UserAnalytics } from "../types";
import {
  LineChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics: React.FC = () => {
  const { user } = useClerkUser();
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "7days" | "month" | "3months" | "alltime"
  >("7days");
  const [analytics, setAnalytics] = useState<Partial<UserAnalytics> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [moodData, setMoodData] = useState<
    Array<{ date: string; mood: number }>
  >([]);

  // Calculate streak from journal entries
  const calculateStreak = async (): Promise<number> => {
    try {
      const journalResponse = await apiService.getJournalEntries({
        limit: 365, // Get up to a year of data to calculate streak
        includePrivate: true,
      });

      const entries = journalResponse.entries;
      if (entries.length === 0) return 0;

      // Sort by date (newest first)
      const sortedEntries = entries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      let streak = 0;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset to start of day

      // Check if today has an entry
      const today = new Date().toDateString();
      const hasEntryToday = sortedEntries.some(
        (entry) => new Date(entry.createdAt).toDateString() === today
      );

      if (!hasEntryToday) {
        // If no entry today, start from yesterday
        currentDate.setDate(currentDate.getDate() - 1);
      }

      // Count consecutive days with entries
      for (let i = 0; i < 365; i++) {
        const dateStr = currentDate.toDateString();
        const hasEntry = sortedEntries.some(
          (entry) => new Date(entry.createdAt).toDateString() === dateStr
        );

        if (hasEntry) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error("Error calculating streak:", error);
      return 0;
    }
  };

  // Fetch comprehensive analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        const days =
          selectedTimeRange === "7days"
            ? 7
            : selectedTimeRange === "month"
              ? 30
              : selectedTimeRange === "3months"
                ? 90
                : 365;

        // Get journal entries for the selected time range to calculate real analytics
        const journalResponse = await apiService.getJournalEntries({
          limit: 1000, // Get more entries to ensure we capture the time range
          includePrivate: true,
        });

        const allEntries = journalResponse.entries;
        
        // Filter entries by the selected time range
        const cutoffDate = new Date();
        if (selectedTimeRange !== "alltime") {
          cutoffDate.setDate(cutoffDate.getDate() - days);
        } else {
          cutoffDate.setFullYear(cutoffDate.getFullYear() - 10); // Far back for "all time"
        }

        const filteredEntries = allEntries.filter(
          entry => new Date(entry.createdAt) >= cutoffDate
        );

        // Calculate real analytics from filtered entries
        const realAnalytics: Partial<UserAnalytics> = {
          totalEntries: filteredEntries.length,
          averageMood: 0,
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
        };

        // Calculate average mood from entries that have mood data
        const entriesWithMood = filteredEntries.filter(entry => entry.mood && entry.mood > 0);
        if (entriesWithMood.length > 0) {
          const totalMood = entriesWithMood.reduce((sum, entry) => sum + (entry.mood || 0), 0);
          realAnalytics.averageMood = totalMood / entriesWithMood.length;
        }

        setAnalytics(realAnalytics);

        // Calculate current streak (this should be based on all entries, not just filtered ones)
        const streak = await calculateStreak();
        setCurrentStreak(streak);

        // Generate mood trends chart data from filtered entries
        if (filteredEntries.length > 0) {
          // Group entries by date and calculate daily averages
          const dailyMoods: Record<string, number[]> = {};
          
          entriesWithMood.forEach(entry => {
            const dateKey = new Date(entry.createdAt).toDateString();
            if (!dailyMoods[dateKey]) {
              dailyMoods[dateKey] = [];
            }
            dailyMoods[dateKey].push(entry.mood || 0);
          });

          // Create chart data
          const chartData: Array<{ date: string; mood: number }> = [];
          for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toDateString();
            
            const formattedDate =
              selectedTimeRange === "7days"
                ? date.toLocaleDateString("en-US", { weekday: "short" })
                : selectedTimeRange === "month"
                  ? date.getDate().toString()
                  : date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

            if (dailyMoods[dateKey]) {
              const avgMood = dailyMoods[dateKey].reduce((a, b) => a + b, 0) / dailyMoods[dateKey].length;
              chartData.push({
                date: formattedDate,
                mood: Math.round(avgMood * 10) / 10,
              });
            } else {
              // No entry for this day - only add to chart if we want to show gaps
              chartData.push({
                date: formattedDate,
                mood: 0, // or null if you want gaps in the chart
              });
            }
          }

          setMoodData(chartData.filter(d => d.mood > 0)); // Only show days with actual data
        } else {
          // No data for this time range
          setMoodData([]);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        // Set empty state on error
        setAnalytics({
          totalEntries: 0,
          averageMood: 0,
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
        });
        setMoodData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, selectedTimeRange]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Please sign in to view your analytics
          </p>
          <Link
            to="/sign-in"
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <LumenMascot currentPage="/analytics" />
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        {/* Beautiful Header - Inspired by Landing Page */}
        <motion.div
          className="text-center mb-24 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.h1
            className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-8 text-center"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Beautiful Journey
          </motion.h1>

          <motion.p
            className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto font-light text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A gentle look at your emotional patterns and growth over time
          </motion.p>
        </motion.div>

        {/* Simple Time Range Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {[
            { key: "7days", label: "Last 7 Days" },
            { key: "month", label: "Last Month" },
            { key: "3months", label: "Last 3 Months" },
            { key: "alltime", label: "All Time" },
          ].map((range) => (
            <motion.button
              key={range.key}
              onClick={() =>
                setSelectedTimeRange(
                  range.key as "7days" | "month" | "3months" | "alltime"
                )
              }
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                selectedTimeRange === range.key
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {range.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Simple Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Mood Journey
            </h2>
            <p className="text-gray-600 text-lg">
              A gentle look at your emotional patterns over time
            </p>
            {moodData.length === 0 ? (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  Start logging your emotions to see your personalized insights
                  here
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  ✨ This preview shows how your analytics will look as you
                  build your emotional journey
                </p>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={moodData}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  fontSize: "13px",
                  padding: "12px 16px",
                  backdropFilter: "blur(10px)",
                }}
                formatter={(value) => {
                  return [`${value}/5 😊`, "Mood"];
                }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#111827"
                fill="url(#moodGradient)"
                strokeWidth={2}
                name="Mood"
                dot={{
                  fill: "#111827",
                  strokeWidth: 2,
                  r: 5,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 7,
                  stroke: "#111827",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Simple Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Average Mood Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Average Mood
            </h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : analytics?.averageMood && analytics.averageMood > 0 ? (
                Math.round(analytics.averageMood * 10) / 10
              ) : (
                "0"
              )}
            </div>
            <p className="text-gray-600">
              {analytics?.averageMood && analytics.averageMood > 0 
                ? "Out of 5 stars" 
                : "No data yet"}
            </p>
          </motion.div>

          {/* Check-ins Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => (window.location.href = "/check-ins")}
          >
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Total Check-ins
            </h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                analytics?.totalEntries || 0
              )}
            </div>
            <p className="text-gray-600 mb-4">
              {selectedTimeRange === "7days" && "Last 7 days"}
              {selectedTimeRange === "month" && "Last month"}
              {selectedTimeRange === "3months" && "Last 3 months"}
              {selectedTimeRange === "alltime" && "All time"}
            </p>
            <p className="text-sm text-purple-600 font-medium">
              👆 Click to view details
            </p>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
          >
            <div className="text-5xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Current Streak
            </h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                currentStreak
              )}
            </div>
            <p className="text-gray-600">Days in a row</p>
          </motion.div>
        </div>

        {/* Action buttons removed to reduce redundancy for analytics page */}
      </div>
    </div>
  );
};

export default Analytics;
