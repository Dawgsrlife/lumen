import React from "react";
import { motion } from "framer-motion";
import type { EmotionType } from "../types";

// Random motivational dashboard messages
const dashboardMessages = [
  "Every moment is a fresh beginning ✨",
  "Your mindful journey continues 🌸",
  "Progress, not perfection 🌱",
  "Small steps, big impact 💫",
  "Your growth is beautiful to witness 🌺",
  "Consistency creates magic ⭐",
  "You're exactly where you need to be 🦋",
  "Breathe deeply, you've got this 🌊",
  "Your self-care matters 💝",
  "Today brings new possibilities 🌅",
  "You're building something wonderful 🏗️",
  "Inner peace is your superpower 🧘‍♀️",
  "Your emotional awareness is growing 📈",
  "Kindness to yourself is revolutionary 💕",
  "You're creating positive change 🌟",
];

// Function to get a random message each time the dashboard is viewed
const getRandomMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * dashboardMessages.length);
  return dashboardMessages[randomIndex];
};

const emotionData: Record<
  EmotionType,
  {
    emoji: string;
    label: string;
    encouragingMessage: string;
    gradient: string;
    bgColor: string;
    textColor: string;
  }
> = {
  happy: {
    emoji: "😊",
    label: "Happy",
    encouragingMessage: "Your joy illuminates everything around you",
    gradient: "from-amber-400 via-yellow-400 to-orange-400",
    bgColor: "from-amber-50 to-yellow-50",
    textColor: "text-amber-700",
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    encouragingMessage: "Every feeling has its place in your journey",
    gradient: "from-blue-400 via-indigo-400 to-purple-400",
    bgColor: "from-blue-50 to-indigo-50",
    textColor: "text-blue-700",
  },
  loneliness: {
    emoji: "😔",
    label: "Loneliness",
    encouragingMessage: "Connection begins with self-compassion",
    gradient: "from-purple-400 via-violet-400 to-pink-400",
    bgColor: "from-purple-50 to-pink-50",
    textColor: "text-purple-700",
  },
  anxiety: {
    emoji: "😰",
    label: "Anxiety",
    encouragingMessage: "Breathe deeply, you are stronger than you know",
    gradient: "from-yellow-400 via-orange-400 to-red-400",
    bgColor: "from-yellow-50 to-orange-50",
    textColor: "text-orange-700",
  },
  frustration: {
    emoji: "😤",
    label: "Frustration",
    encouragingMessage: "This storm shall pass, peace will return",
    gradient: "from-orange-400 via-red-400 to-pink-400",
    bgColor: "from-orange-50 to-red-50",
    textColor: "text-red-700",
  },
  stress: {
    emoji: "😵",
    label: "Stress",
    encouragingMessage: "You're navigating with remarkable grace",
    gradient: "from-teal-400 via-cyan-400 to-blue-400",
    bgColor: "from-teal-50 to-cyan-50",
    textColor: "text-teal-700",
  },
  lethargy: {
    emoji: "😴",
    label: "Lethargy",
    encouragingMessage: "Rest is not weakness, it's wisdom",
    gradient: "from-slate-400 via-gray-400 to-zinc-400",
    bgColor: "from-slate-50 to-gray-50",
    textColor: "text-slate-700",
  },
  fear: {
    emoji: "😨",
    label: "Fear",
    encouragingMessage: "Courage grows in the presence of fear",
    gradient: "from-indigo-400 via-purple-400 to-violet-400",
    bgColor: "from-indigo-50 to-purple-50",
    textColor: "text-indigo-700",
  },
  grief: {
    emoji: "💔",
    label: "Grief",
    encouragingMessage: "Love continues beyond loss",
    gradient: "from-rose-400 via-pink-400 to-red-400",
    bgColor: "from-rose-50 to-pink-50",
    textColor: "text-rose-700",
  },
};

// Professional Weekly Progress Component with Premium Design
const WeeklyProgress: React.FC<{ weeklyData: boolean[] }> = ({
  weeklyData,
}) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const loggedDays = weeklyData.filter(Boolean).length;

  const getProgressMessage = (loggedDays: number) => {
    if (loggedDays === 0) return "Your journey awaits";
    if (loggedDays === 7) return "Exceptional consistency 🌟";
    if (loggedDays >= 5) return "Outstanding progress ⭐";
    if (loggedDays >= 3) return "Beautiful momentum 🌸";
    return "Every step matters ✨";
  };

  const getProgressColor = (loggedDays: number) => {
    if (loggedDays === 7) return "text-emerald-600";
    if (loggedDays >= 5) return "text-blue-600";
    if (loggedDays >= 3) return "text-purple-600";
    return "text-slate-600";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3
          className="text-2xl font-light text-slate-900 mb-3 tracking-wide"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Weekly Journey
        </h3>
        <div className="mb-3"></div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold text-slate-900">
            {loggedDays}
          </span>
          <span className="text-slate-600 font-light">of 7 days</span>
        </div>
      </motion.div>

      {/* Progress Visualization */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <motion.div
          className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(loggedDays / 7) * 100}%` }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          />
        </motion.div>

        {/* Day Indicators */}
        <div className="grid grid-cols-7 gap-3">
          {weeklyData.map((logged, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {days[index].slice(0, 3)}
              </span>
              <motion.div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  logged
                    ? "bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg shadow-blue-200"
                    : "bg-slate-100 border-2 border-slate-200"
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {logged ? (
                  <span className="text-white text-sm font-bold">✓</span>
                ) : (
                  <span className="text-slate-400 text-sm">○</span>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Progress Message */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <p className={`text-sm font-medium ${getProgressColor(loggedDays)}`}>
            {getProgressMessage(loggedDays)}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Premium Streak Counter Component
const StreakCounter: React.FC<{ currentStreak: number }> = ({
  currentStreak,
}) => {
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Begin your streak today";
    if (streak === 1) return "A wonderful start!";
    if (streak >= 30) return "Extraordinary dedication";
    if (streak >= 14) return "Remarkable consistency";
    if (streak >= 7) return "Building strong habits";
    return "Growing beautifully";
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "🌱";
    if (streak === 1) return "✨";
    if (streak >= 30) return "👑";
    if (streak >= 14) return "🔥";
    if (streak >= 7) return "⭐";
    return "🌟";
  };

  return (
    <div className="text-center space-y-6">
      {/* Streak Display */}
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {getStreakEmoji(currentStreak)}
        </motion.div>
        <div className="mb-4"></div>
        <motion.div
          className="text-4xl font-bold text-slate-900 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {currentStreak}
        </motion.div>

        <motion.p
          className="text-slate-600 font-light text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {currentStreak === 1 ? "day" : "days"}
        </motion.p>
      </motion.div>

      {/* Streak Message */}
      <motion.p
        className="text-slate-700 text-sm font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {getStreakMessage(currentStreak)}
      </motion.p>
    </div>
  );
};

interface DashboardScreenProps {
  selectedEmotion: EmotionType;
  currentStreak: number;
  weeklyData: boolean[];
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  selectedEmotion,
  currentStreak,
  weeklyData,
}) => {
  // Debug logging with comprehensive checks
  console.log("DashboardScreen props:", {
    selectedEmotion,
    currentStreak,
    weeklyData,
    typeOfSelectedEmotion: typeof selectedEmotion,
    typeOfCurrentStreak: typeof currentStreak,
    isArrayWeeklyData: Array.isArray(weeklyData),
  });

  // Safety check for emotion data with fallback
  const safeSelectedEmotion =
    selectedEmotion && typeof selectedEmotion === "string"
      ? (selectedEmotion as EmotionType)
      : "happy";
  const emotion = emotionData[safeSelectedEmotion] || emotionData.happy;
  const dailyMessage = getRandomMessage();

  // Safety check for weeklyData with comprehensive validation
  const safeWeeklyData =
    Array.isArray(weeklyData) && weeklyData.length === 7
      ? weeklyData.map((day) => Boolean(day))
      : [false, false, false, false, false, false, false];

  // Safety check for currentStreak with number validation
  const safeCurrentStreak =
    typeof currentStreak === "number" && !isNaN(currentStreak)
      ? Math.max(0, currentStreak)
      : 0;

  console.log("DashboardScreen safe values:", {
    emotion: emotion?.label,
    safeCurrentStreak,
    safeWeeklyData,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.8),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        {/* Daily Message Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-2xl md:text-3xl text-slate-600 font-light leading-relaxed mx-auto tracking-wide"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {dailyMessage}
          </motion.p>

          <motion.div
            className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
          />
        </motion.div>

        {/* Premium Three-Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Current Emotion Card - Hero Focus */}
          <motion.div
            className={`relative bg-gradient-to-br ${emotion.bgColor} backdrop-blur-xl rounded-3xl p-10 shadow-2xl shadow-slate-900/5 border border-white/50 text-center overflow-hidden`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl" />

            <div className="relative z-10">
              {/* Emotion Icon with Enhanced Animation */}
              <motion.div
                className="text-8xl mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 1.0,
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.4,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                {emotion.emoji}
              </motion.div>

              <motion.h3
                className="text-2xl font-light text-slate-900 mb-4 tracking-wide"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                Today's Emotion
              </motion.h3>
              <div className="mb-4"></div>

              {/* Emotion Label with Sophisticated Styling */}

              <motion.div
                className={`inline-block px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 mb-6`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <span className={`text-lg font-semibold ${emotion.textColor}`}>
                  {emotion.label}
                </span>
              </motion.div>

              <motion.p
                className="text-slate-700 text-sm font-light leading-relaxed italic px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              >
                "{emotion.encouragingMessage}"
              </motion.p>
            </div>
          </motion.div>

          {/* Weekly Progress Card - Premium Design */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-slate-900/5 border border-white/50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <WeeklyProgress weeklyData={safeWeeklyData} />
          </motion.div>

          {/* Streak Card - Elite Design */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-slate-900/5 border border-white/50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <motion.h3
              className="text-2xl font-light text-slate-900 mb-8 text-center tracking-wide"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              Your Dedication
            </motion.h3>
            <div className="mb-8"></div>
            <StreakCounter currentStreak={safeCurrentStreak} />
          </motion.div>
        </div>

        {/* Sophisticated Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <motion.button
            onClick={() => (window.location.href = "/flow?manual=true")}
            className="group relative overflow-hidden px-10 py-5 rounded-2xl font-medium text-white text-lg tracking-wide transition-all duration-500 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 cursor-pointer bg-gradient-to-r from-slate-900 to-slate-800"
            whileHover={{
              scale: 1.02,
              y: -3,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Sophisticated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />

            <div className="relative flex items-center gap-3">
              <span className="text-xl">💭</span>
              <span>Reflect on Today</span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => (window.location.href = "/analytics")}
            className="group px-10 py-5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-2xl font-medium text-lg border-2 border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
            whileHover={{
              scale: 1.02,
              y: -3,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <span>View Insights</span>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardScreen;
