import { motion } from "framer-motion";
import { useAnalytics } from "../hooks/useAnalytics";
import { FlowBackground } from "../components/ui";

export default function Analytics() {
  const {
    analytics,
    aiInsights,
    isLoadingAnalytics,
    currentTimeframe,
    setTimeframe,
  } = useAnalytics();

  // Loading state - clean and minimal
  if (isLoadingAnalytics) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FlowBackground theme="welcome" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl shadow-slate-900/10 p-12"
          >
            <div className="w-8 h-8 mx-auto mb-6 animate-spin">
              <div className="w-full h-full border-2 border-slate-300 border-t-slate-600 rounded-full"></div>
            </div>
            <h2
              className="text-xl font-light text-slate-900 mb-4"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Loading Analytics
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Gathering your insights from the database...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // No data state - waiting for user to create data
  if (
    !analytics ||
    (analytics.totalEntries === 0 &&
      (!analytics.emotionDistribution ||
        Object.values(analytics.emotionDistribution).every(
          (count) => count === 0
        )))
  ) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FlowBackground theme="welcome" />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl shadow-slate-900/10 p-12"
          >
            <div className="w-16 h-16 mx-auto mb-6 text-4xl">📊</div>
            <h2
              className="text-2xl font-light text-slate-900 mb-4"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              No Data Yet
            </h2>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Start logging your emotions to unlock personalized analytics and
              insights. Your journey data will appear here once you begin.
            </p>
            <button
              onClick={() => (window.location.href = "/flow")}
              className="relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white text-base tracking-normal transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 15px rgba(251, 191, 36, 0.3)",
              }}
            >
              Start Logging Emotions
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Helper function to check if we have any emotion data
  const hasEmotionData = (): boolean => {
    if (!analytics?.emotionDistribution) return false;
    return Object.values(analytics.emotionDistribution).some(
      (count) => count > 0
    );
  };

  // Helper function to get total emotions logged
  const getTotalEmotions = (): number => {
    if (!analytics?.emotionDistribution) return 0;
    return Object.values(analytics.emotionDistribution).reduce(
      (total, count) => total + count,
      0
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FlowBackground theme="insights" />

      <div className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1
              className="text-4xl lg:text-5xl font-light text-slate-900 tracking-wide mb-8"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Your Journey Analytics
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Understanding your emotional patterns helps you grow with
              intention and grace.
            </p>

            {/* Timeframe Selection */}
            <div className="inline-flex items-center bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-2xl border border-white/50 shadow-xl shadow-slate-900/5 p-2">
              {[
                {
                  key: "week",
                  label: "This Week",
                  gradient: "from-amber-400 to-orange-400",
                },
                {
                  key: "month",
                  label: "This Month",
                  gradient: "from-purple-400 to-pink-400",
                },
                {
                  key: "all",
                  label: "All Time",
                  gradient: "from-blue-400 to-indigo-400",
                },
              ].map((period) => (
                <button
                  key={period.key}
                  onClick={() =>
                    setTimeframe(period.key as "week" | "month" | "all")
                  }
                  className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentTimeframe === period.key
                      ? "text-white shadow-lg transform scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                  style={
                    currentTimeframe === period.key
                      ? {
                          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                          backgroundImage: `linear-gradient(135deg, ${period.gradient.includes("amber") ? "#fbbf24, #fb923c" : period.gradient.includes("purple") ? "#a855f7, #ec4899" : "#3b82f6, #6366f1"})`,
                        }
                      : {}
                  }
                >
                  {period.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              {
                label: "Average Mood",
                value: analytics?.averageMood?.toFixed(1) || "0.0",
                gradient: "from-amber-400 to-orange-400",
                emoji: "✨",
              },
              {
                label: "Day Streak",
                value: analytics?.streakData?.current || 0,
                gradient: "from-green-400 to-emerald-400",
                emoji: "🔥",
              },
              {
                label: "Check-ins",
                value: analytics?.totalEntries || 0,
                gradient: "from-blue-400 to-cyan-400",
                emoji: "💭",
              },
              {
                label: "Games Played",
                value: analytics?.gamesPlayed || 0,
                gradient: "from-purple-400 to-pink-400",
                emoji: "🎮",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-2xl border border-white/50 shadow-xl shadow-slate-900/5 p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-2xl`}
                />
                <div className="relative">
                  <div className="text-2xl mb-2">{stat.emoji}</div>
                  <div
                    className="text-3xl font-light text-slate-900 mb-2"
                    style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mood Journey Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl shadow-slate-900/10 p-8 mb-16"
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl font-light text-slate-900 mb-4"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                Your Mood Journey
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                A gentle look at your emotional patterns over time
              </p>
            </div>

            {analytics?.weeklyStats?.moodTrend &&
            analytics.weeklyStats.moodTrend.length > 0 ? (
              <div className="relative">
                {/* Chart Container */}
                <div className="relative h-80 bg-gradient-to-br from-slate-50/50 to-white/30 rounded-2xl p-6 overflow-hidden">
                  {/* Y-axis labels */}
                  <div className="absolute left-4 top-6 bottom-6 flex flex-col justify-between text-xs text-slate-400">
                    <span>10</span>
                    <span>8</span>
                    <span>6</span>
                    <span>4</span>
                    <span>2</span>
                    <span>0</span>
                  </div>

                  {/* Chart area */}
                  <div className="ml-8 mr-4 h-full relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="absolute w-full border-t border-slate-200/50"
                          style={{ top: `${i * 20}%` }}
                        />
                      ))}
                    </div>

                    {/* Mood line */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 400 200"
                    >
                      {/* Generate smooth curve path */}
                      {(() => {
                        const points = analytics.weeklyStats.moodTrend.map(
                          (trend, index) => ({
                            x:
                              (index /
                                (analytics.weeklyStats.moodTrend.length - 1)) *
                                380 +
                              10,
                            y: 190 - (trend.averageIntensity / 10) * 180,
                            intensity: trend.averageIntensity,
                            date: trend.date,
                          })
                        );

                        // Create smooth curve path
                        if (points.length < 2) return null;

                        let path = `M ${points[0].x} ${points[0].y}`;

                        for (let i = 1; i < points.length; i++) {
                          const prev = points[i - 1];
                          const curr = points[i];
                          const next = points[i + 1];

                          const cpX = prev.x + (curr.x - prev.x) * 0.3;
                          const cpY = prev.y;
                          const cp2X =
                            curr.x - (next ? (next.x - curr.x) * 0.3 : 0);
                          const cp2Y = curr.y;

                          path += ` C ${cpX} ${cpY}, ${cp2X} ${cp2Y}, ${curr.x} ${curr.y}`;
                        }

                        return (
                          <>
                            {/* Gradient background under curve */}
                            <defs>
                              <linearGradient
                                id="moodGradient"
                                x1="0%"
                                y1="0%"
                                x2="0%"
                                y2="100%"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="rgb(139, 92, 246)"
                                  stopOpacity="0.3"
                                />
                                <stop
                                  offset="100%"
                                  stopColor="rgb(139, 92, 246)"
                                  stopOpacity="0.05"
                                />
                              </linearGradient>
                            </defs>

                            {/* Fill area under curve */}
                            <path
                              d={`${path} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`}
                              fill="url(#moodGradient)"
                            />

                            {/* Main curve line */}
                            <path
                              d={path}
                              stroke="rgb(139, 92, 246)"
                              strokeWidth="3"
                              fill="none"
                              className="drop-shadow-sm"
                            />

                            {/* Data points */}
                            {points.map((point, index) => (
                              <g key={index}>
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="6"
                                  fill="white"
                                  stroke="rgb(139, 92, 246)"
                                  strokeWidth="3"
                                  className="drop-shadow-sm cursor-pointer hover:r-8 transition-all duration-200"
                                />

                                {/* Hover tooltip */}
                                <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                                  <rect
                                    x={point.x - 25}
                                    y={point.y - 35}
                                    width="50"
                                    height="25"
                                    fill="rgba(0,0,0,0.8)"
                                    rx="4"
                                  />
                                  <text
                                    x={point.x}
                                    y={point.y - 20}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="10"
                                    fontWeight="500"
                                  >
                                    {new Date(point.date).toLocaleDateString(
                                      "en",
                                      { weekday: "short" }
                                    )}
                                  </text>
                                  <text
                                    x={point.x}
                                    y={point.y - 10}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="10"
                                  >
                                    mood: {point.intensity.toFixed(1)}
                                  </text>
                                </g>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Plus button (like in your screenshot) */}
                    <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md">
                      <span className="text-lg font-light">+</span>
                    </button>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between mt-4 ml-8 mr-4 text-xs text-slate-400">
                    {analytics.weeklyStats.moodTrend.map((trend, index) => (
                      <span key={index} className="text-center">
                        {new Date(trend.date).toLocaleDateString("en", {
                          weekday: "short",
                        })}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your mood journey will appear here as you
                  <br />
                  continue logging your emotions over time.
                </p>
              </div>
            )}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Emotion Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl shadow-slate-900/10 p-8"
            >
              <h2
                className="text-2xl font-light text-slate-900 text-center mb-8"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                Emotion Landscape
              </h2>

              <div className="space-y-4">
                {hasEmotionData() ? (
                  Object.entries(analytics.emotionDistribution || {}).map(
                    ([emotion, count]) => {
                      const total = getTotalEmotions();
                      const percentage = total > 0 ? (count / total) * 100 : 0;

                      if (count === 0) return null;

                      // Emotion-specific gradients
                      const emotionThemes: Record<
                        string,
                        { gradient: string; emoji: string }
                      > = {
                        happy: {
                          gradient: "from-amber-400 to-yellow-400",
                          emoji: "😊",
                        },
                        sad: {
                          gradient: "from-blue-400 to-indigo-400",
                          emoji: "😢",
                        },
                        anxiety: {
                          gradient: "from-orange-400 to-red-400",
                          emoji: "😰",
                        },
                        stress: {
                          gradient: "from-teal-400 to-cyan-400",
                          emoji: "😵",
                        },
                        frustration: {
                          gradient: "from-red-400 to-pink-400",
                          emoji: "😤",
                        },
                        lethargy: {
                          gradient: "from-slate-400 to-gray-400",
                          emoji: "😴",
                        },
                        loneliness: {
                          gradient: "from-purple-400 to-pink-400",
                          emoji: "😔",
                        },
                        fear: {
                          gradient: "from-indigo-400 to-purple-400",
                          emoji: "😨",
                        },
                        grief: {
                          gradient: "from-rose-400 to-pink-400",
                          emoji: "💔",
                        },
                      };

                      const theme = emotionThemes[emotion] || {
                        gradient: "from-gray-400 to-slate-400",
                        emoji: "💭",
                      };

                      return (
                        <motion.div
                          key={emotion}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: Math.random() * 0.3,
                          }}
                          className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/30 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">{theme.emoji}</div>
                            <span className="text-sm text-slate-700 capitalize font-medium">
                              {emotion}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-1000`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-600 font-medium w-6 text-right">
                              {count}
                            </span>
                          </div>
                        </motion.div>
                      );
                    }
                  )
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🌱</div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Your emotional landscape is waiting to bloom.
                      <br />
                      Start logging to see your unique patterns emerge.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl shadow-slate-900/10 p-8"
            >
              <h2
                className="text-2xl font-light text-slate-900 text-center mb-8"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                Personal Insights
              </h2>

              {aiInsights?.insights && aiInsights.insights.length > 0 ? (
                <div className="space-y-6">
                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-sm text-amber-600 uppercase tracking-wider mb-3 font-semibold">
                      AI Insights
                    </h3>
                    <div className="space-y-3">
                      {aiInsights.insights.map((insight, index) => (
                        <p
                          key={index}
                          className="text-slate-700 text-sm leading-relaxed"
                        >
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>

                  {aiInsights.recommendations &&
                    aiInsights.recommendations.length > 0 && (
                      <div className="border-l-4 border-purple-400 pl-6">
                        <h3 className="text-sm text-purple-600 uppercase tracking-wider mb-3 font-semibold">
                          Recommendations
                        </h3>
                        <div className="space-y-3">
                          {aiInsights.recommendations.map(
                            (recommendation, index) => (
                              <p
                                key={index}
                                className="text-slate-700 text-sm leading-relaxed"
                              >
                                {recommendation}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🤖</div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    AI insights will appear here once you have
                    <br />
                    sufficient emotion data to analyze.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
