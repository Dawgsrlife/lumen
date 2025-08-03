import { Router, Request, Response } from 'express';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { EmotionEntryModel } from '../models/EmotionEntry.js';
import { JournalEntryModel } from '../models/JournalEntry.js';
import { GameSessionModel } from '../models/GameSession.js';
import { UserModel } from '../models/User.js';
import { aiService } from '../services/ai.js';
import type { UserAnalytics, DailyEntry, AIInsightRequest, AIInsightResponse, EmotionType } from '../types/index.js';

const router = Router();

/**
 * GET /api/analytics/overview
 * Get user's analytics overview
 */
router.get('/overview', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { days = 30 } = req.query;
      const daysNum = parseInt(days as string);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      // Get all user data for the period
      const [emotions, journals, games] = await Promise.all([
        EmotionEntryModel.find({
          clerkId,
          createdAt: { $gte: startDate }
        }).lean(),
        JournalEntryModel.find({
          clerkId,
          createdAt: { $gte: startDate }
        }).lean(),
        GameSessionModel.find({
          clerkId,
          createdAt: { $gte: startDate }
        }).lean()
      ]);

      // Calculate analytics
      const totalEntries = emotions.length + journals.length;
      const averageMood = emotions.length > 0 
        ? emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length 
        : 0;

      // Most frequent emotion
      const emotionCounts: Record<string, number> = {};
      emotions.forEach(e => {
        const emotion = e.emotion as string;
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      const mostFrequentEmotion = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'happy';

      // Calculate streak
      const currentStreak = calculateStreak(emotions);
      const longestStreak = calculateLongestStreak(emotions);

      // Group by day for daily entries
      const dailyEntries: Record<string, DailyEntry> = {};
      
      // Add emotions to daily entries
      emotions.forEach(emotion => {
        const date = emotion.createdAt.toISOString().split('T')[0];
        if (!dailyEntries[date]) {
          dailyEntries[date] = {
            date,
            emotionEntries: [],
            journalEntries: [],
            gameSessions: []
          };
        }
        dailyEntries[date]!.emotionEntries.push(emotion);
      });

      // Add journals to daily entries
      journals.forEach(journal => {
        const date = journal.createdAt.toISOString().split('T')[0];
        if (!dailyEntries[date]) {
          dailyEntries[date] = {
            date,
            emotionEntries: [],
            journalEntries: [],
            gameSessions: []
          };
        }
        dailyEntries[date]!.journalEntries.push(journal);
      });

      // Add games to daily entries
      games.forEach(game => {
        const date = (game as any).createdAt.toISOString().split('T')[0];
        if (!dailyEntries[date]) {
          dailyEntries[date] = {
            date,
            emotionEntries: [],
            journalEntries: [],
            gameSessions: []
          };
        }
        dailyEntries[date]!.gameSessions.push(game);
      });

      const analytics: UserAnalytics = {
        userId: clerkId,
        totalEntries,
        currentStreak,
        longestStreak,
        averageMood: Math.round(averageMood * 10) / 10,
        mostFrequentEmotion: mostFrequentEmotion as any,
        gamesPlayed: games.length,
        lastUpdated: new Date(),
        dailyEntries: Object.values(dailyEntries).sort((a, b) => b.date.localeCompare(a.date))
      };

      res.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics'
      });
    }
  }
);

/**
 * POST /api/analytics/insights
 * Generate AI insights for the user
 */
router.post('/insights', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { timeframe = 'week', focus = 'all' }: AIInsightRequest = req.body;
      const clerkId = req.clerkId!;

      // Calculate date range based on timeframe
      const endDate = new Date();
      let startDate = new Date();
      
      switch (timeframe) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'all':
          startDate = new Date(0); // Beginning of time
          break;
      }

      // Get user data for the period
      const [emotions, journals, games] = await Promise.all([
        EmotionEntryModel.find({
          clerkId,
          createdAt: { $gte: startDate }
        }).lean(),
        JournalEntryModel.find({
          clerkId,
          createdAt: { $gte: startDate }
        }).lean(),
        GameSessionModel.find({
          clerkId,
          createdAt: { $gte: startDate }
        }).lean()
      ]);

      // Generate AI insights
      const insights = await aiService.generateInsights(
        { userId: clerkId, timeframe, focus },
        emotions,
        journals,
        games
      );

      res.json({
        success: true,
        data: insights
      });

    } catch (error) {
      console.error('Error generating insights:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate insights'
      });
    }
  }
);

/**
 * GET /api/analytics/emotions
 * Get emotion-specific analytics
 */
router.get('/emotions', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { days = 30 } = req.query;
      const daysNum = parseInt(days as string);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const emotions = await EmotionEntryModel.find({
        clerkId,
        createdAt: { $gte: startDate }
      }).lean();

      // Group by emotion type
      const emotionStats: Record<string, {
        count: number;
        averageIntensity: number;
        totalIntensity: number;
        dates: string[];
      }> = {};

      emotions.forEach(emotion => {
        const emotionType = emotion.emotion;
        if (!emotionStats[emotionType]) {
          emotionStats[emotionType] = {
            count: 0,
            averageIntensity: 0,
            totalIntensity: 0,
            dates: []
          };
        }

        emotionStats[emotionType].count++;
        emotionStats[emotionType].totalIntensity += emotion.intensity;
        emotionStats[emotionType].dates.push(emotion.createdAt.toISOString().split('T')[0]);
      });

      // Calculate averages
      Object.values(emotionStats).forEach(stats => {
        stats.averageIntensity = Math.round((stats.totalIntensity / stats.count) * 10) / 10;
      });

      res.json({
        success: true,
        data: {
          emotionStats,
          totalEntries: emotions.length,
          dateRange: {
            start: startDate.toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        }
      });

    } catch (error) {
      console.error('Error fetching emotion analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch emotion analytics'
      });
    }
  }
);

/**
 * GET /api/analytics/trends
 * Get mood trends over time
 */
router.get('/trends', 
  authenticateToken, 
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const clerkId = req.clerkId!;
      const { days = 30 } = req.query;
      const daysNum = parseInt(days as string);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const emotions = await EmotionEntryModel.find({
        clerkId,
        createdAt: { $gte: startDate }
      })
      .sort({ createdAt: 1 })
      .lean();

      // Group by date and calculate daily averages
      const dailyAverages: Record<string, {
        date: string;
        averageIntensity: number;
        dominantEmotion: string;
        entryCount: number;
        emotions: string[];
      }> = {};

      emotions.forEach(emotion => {
        const date = emotion.createdAt.toISOString().split('T')[0];
        if (!dailyAverages[date]) {
          dailyAverages[date] = {
            date,
            averageIntensity: 0,
            dominantEmotion: '',
            entryCount: 0,
            emotions: []
          };
        }

        dailyAverages[date].entryCount++;
        dailyAverages[date].emotions.push(emotion.emotion);
      });

      // Calculate averages and dominant emotions
      Object.values(dailyAverages).forEach(day => {
        const dayEmotions = emotions.filter(e => 
          e.createdAt.toISOString().split('T')[0] === day.date
        );
        
        if (dayEmotions.length > 0) {
          day.averageIntensity = Math.round(
            (dayEmotions.reduce((sum, e) => sum + e.intensity, 0) / dayEmotions.length) * 10
          ) / 10;
        }

        // Find dominant emotion
        const emotionCounts: Record<string, number> = {};
        day.emotions.forEach(e => {
          emotionCounts[e] = (emotionCounts[e] || 0) + 1;
        });
        day.dominantEmotion = Object.entries(emotionCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
      });

      res.json({
        success: true,
        data: {
          trends: Object.values(dailyAverages).sort((a, b) => a.date.localeCompare(b.date)),
          totalDays: Object.keys(dailyAverages).length,
          dateRange: {
            start: startDate.toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        }
      });

    } catch (error) {
      console.error('Error fetching trends:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trends'
      });
    }
  }
);

// Helper functions
function calculateStreak(emotions: any[]): number {
  if (emotions.length === 0) return 0;

  const sortedEmotions = emotions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const emotionDates = new Set(
    sortedEmotions.map(e => e.createdAt.toISOString().split('T')[0])
  );

  while (emotionDates.has(currentDate.toISOString().split('T')[0])) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

function calculateLongestStreak(emotions: any[]): number {
  if (emotions.length === 0) return 0;

  const emotionDates = new Set(
    emotions.map(e => e.createdAt.toISOString().split('T')[0])
  );

  let longestStreak = 0;
  let currentStreak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Go back 365 days to find the longest streak
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    if (emotionDates.has(dateStr)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return longestStreak;
}

export default router; 