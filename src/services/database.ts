import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import type { Document } from 'mongodb';

// Database Types
export interface UserData {
  _id?: ObjectId;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacyLevel: 'public' | 'private' | 'friends';
    language: string;
  };
  stats: {
    totalEmotions: number;
    currentStreak: number;
    longestStreak: number;
    averageMood: number;
    totalGamesPlayed: number;
    totalPoints: number;
  };
}

export interface EmotionEntry {
  _id?: ObjectId;
  userId: ObjectId;
  emotion: string;
  intensity: number;
  timestamp: Date;
  surveyResponses: SurveyResponse[];
  aiFeedback?: AIFeedback;
  tags?: string[];
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
  };
}

export interface SurveyResponse {
  questionId: string;
  question: string;
  answer: string | number;
  category: 'context' | 'severity' | 'triggers' | 'coping';
}

export interface AIFeedback {
  insights: string[];
  advice: string[];
  activities: string[];
  moodPrediction?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  generatedAt: Date;
}

export interface GameProgress {
  _id?: ObjectId;
  userId: ObjectId;
  gameId: string;
  gameType: 'react' | 'unity';
  score: number;
  duration: number;
  achievements: string[];
  completedAt: Date;
  emotionData?: {
    emotion: string;
    intensity: number;
  };
  rewards?: GameReward[];
}

export interface GameReward {
  type: 'points' | 'achievement' | 'badge' | 'unlock';
  value: string | number;
  description: string;
  earnedAt: Date;
}

export interface UserEngagement {
  _id?: ObjectId;
  userId: ObjectId;
  action: 'emotion_logged' | 'game_played' | 'ai_feedback_viewed' | 'survey_completed';
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface WeeklyInsight {
  _id?: ObjectId;
  userId: ObjectId;
  weekStart: Date;
  weekEnd: Date;
  insights: string[];
  moodTrend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
  generatedAt: Date;
}

class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Connect to MongoDB
  async connect(): Promise<void> {
    try {
      const uri = import.meta.env.MONGODB_URI;
      if (!uri) {
        console.warn('MongoDB URI not found. Using localStorage fallback.');
        return;
      }

      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('lumen');
      this.isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
    }
  }

  // Disconnect from MongoDB
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.isConnected = false;
    }
  }

  // Get collection
  private getCollection<T extends Document>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<T>(name);
  }

  // User Management
  async createUser(userData: Omit<UserData, '_id'>): Promise<UserData> {
    if (!this.isConnected) {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser = { ...userData, _id: new ObjectId() };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return newUser;
    }

    const collection = this.getCollection<UserData>('users');
    const result = await collection.insertOne(userData);
    return { ...userData, _id: result.insertedId };
  }

  async getUserByClerkId(clerkId: string): Promise<UserData | null> {
    if (!this.isConnected) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.find((user: UserData) => user.clerkId === clerkId) || null;
    }

    const collection = this.getCollection<UserData>('users');
    return await collection.findOne({ clerkId });
  }

  async updateUser(clerkId: string, updates: Partial<UserData>): Promise<void> {
    if (!this.isConnected) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((user: UserData) => user.clerkId === clerkId);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
      }
      return;
    }

    const collection = this.getCollection<UserData>('users');
    await collection.updateOne({ clerkId }, { $set: updates });
  }

  // Emotion Tracking
  async saveEmotionEntry(entry: Omit<EmotionEntry, '_id'>): Promise<EmotionEntry> {
    if (!this.isConnected) {
      const entries = JSON.parse(localStorage.getItem('emotionEntries') || '[]');
      const newEntry = { ...entry, _id: new ObjectId() };
      entries.push(newEntry);
      localStorage.setItem('emotionEntries', JSON.stringify(entries));
      return newEntry;
    }

    const collection = this.getCollection<EmotionEntry>('emotionEntries');
    const result = await collection.insertOne(entry);
    return { ...entry, _id: result.insertedId };
  }

  async getUserEmotions(userId: ObjectId, limit = 50): Promise<EmotionEntry[]> {
    if (!this.isConnected) {
      const entries = JSON.parse(localStorage.getItem('emotionEntries') || '[]');
      return entries
        .filter((entry: EmotionEntry) => entry.userId.toString() === userId.toString())
        .sort((a: EmotionEntry, b: EmotionEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    }

    const collection = this.getCollection<EmotionEntry>('emotionEntries');
    return await collection
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  async getEmotionStats(userId: ObjectId, days = 30): Promise<{
    totalEntries: number;
    averageIntensity: number;
    mostCommonEmotion: string;
    moodTrend: 'improving' | 'stable' | 'declining';
  }> {
    const entries = await this.getUserEmotions(userId, 1000);
    const recentEntries = entries.filter(entry => 
      new Date(entry.timestamp) > new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    );

    if (recentEntries.length === 0) {
      return {
        totalEntries: 0,
        averageIntensity: 0,
        mostCommonEmotion: '',
        moodTrend: 'stable'
      };
    }

    const emotionCounts: Record<string, number> = {};
    let totalIntensity = 0;

    recentEntries.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      totalIntensity += entry.intensity;
    });

    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0][0];

    const averageIntensity = totalIntensity / recentEntries.length;

    // Simple mood trend calculation
    const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalf.length;
    
    let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.5) moodTrend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 0.5) moodTrend = 'declining';

    return {
      totalEntries: recentEntries.length,
      averageIntensity,
      mostCommonEmotion,
      moodTrend
    };
  }

  // Game Progress
  async saveGameProgress(progress: Omit<GameProgress, '_id'>): Promise<GameProgress> {
    if (!this.isConnected) {
      const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '[]');
      const newProgress = { ...progress, _id: new ObjectId() };
      gameProgress.push(newProgress);
      localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
      return newProgress;
    }

    const collection = this.getCollection<GameProgress>('gameProgress');
    const result = await collection.insertOne(progress);
    return { ...progress, _id: result.insertedId };
  }

  async getUserGameProgress(userId: ObjectId): Promise<GameProgress[]> {
    if (!this.isConnected) {
      const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '[]');
      return gameProgress
        .filter((progress: GameProgress) => progress.userId.toString() === userId.toString())
        .sort((a: GameProgress, b: GameProgress) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    }

    const collection = this.getCollection<GameProgress>('gameProgress');
    return await collection
      .find({ userId })
      .sort({ completedAt: -1 })
      .toArray();
  }

  // User Engagement
  async logEngagement(engagement: Omit<UserEngagement, '_id'>): Promise<void> {
    if (!this.isConnected) {
      const engagements = JSON.parse(localStorage.getItem('userEngagement') || '[]');
      engagements.push({ ...engagement, _id: new ObjectId() });
      localStorage.setItem('userEngagement', JSON.stringify(engagements));
      return;
    }

    const collection = this.getCollection<UserEngagement>('userEngagement');
    await collection.insertOne(engagement);
  }

  async getUserEngagement(userId: ObjectId, days = 7): Promise<UserEngagement[]> {
    if (!this.isConnected) {
      const engagements = JSON.parse(localStorage.getItem('userEngagement') || '[]');
      return engagements
        .filter((engagement: UserEngagement) => 
          engagement.userId.toString() === userId.toString() &&
          new Date(engagement.timestamp) > new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        );
    }

    const collection = this.getCollection<UserEngagement>('userEngagement');
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return await collection
      .find({ 
        userId, 
        timestamp: { $gte: cutoffDate } 
      })
      .sort({ timestamp: -1 })
      .toArray();
  }

  // Weekly Insights
  async saveWeeklyInsight(insight: Omit<WeeklyInsight, '_id'>): Promise<WeeklyInsight> {
    if (!this.isConnected) {
      const insights = JSON.parse(localStorage.getItem('weeklyInsights') || '[]');
      const newInsight = { ...insight, _id: new ObjectId() };
      insights.push(newInsight);
      localStorage.setItem('weeklyInsights', JSON.stringify(insights));
      return newInsight;
    }

    const collection = this.getCollection<WeeklyInsight>('weeklyInsights');
    const result = await collection.insertOne(insight);
    return { ...insight, _id: result.insertedId };
  }

  async getLatestWeeklyInsight(userId: ObjectId): Promise<WeeklyInsight | null> {
    if (!this.isConnected) {
      const insights = JSON.parse(localStorage.getItem('weeklyInsights') || '[]');
      const userInsights = insights
        .filter((insight: WeeklyInsight) => insight.userId.toString() === userId.toString())
        .sort((a: WeeklyInsight, b: WeeklyInsight) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
      return userInsights[0] || null;
    }

    const collection = this.getCollection<WeeklyInsight>('weeklyInsights');
    return await collection
      .findOne({ userId }, { sort: { generatedAt: -1 } });
  }

  // AI Feedback Storage
  async saveAIFeedback(userId: ObjectId, emotionEntryId: ObjectId, feedback: AIFeedback): Promise<void> {
    if (!this.isConnected) {
      const aiFeedbacks = JSON.parse(localStorage.getItem('aiFeedbacks') || '[]');
      aiFeedbacks.push({
        _id: new ObjectId(),
        userId,
        emotionEntryId,
        feedback,
        createdAt: new Date()
      });
      localStorage.setItem('aiFeedbacks', JSON.stringify(aiFeedbacks));
      return;
    }

    const collection = this.getCollection('aiFeedbacks');
    await collection.insertOne({
      userId,
      emotionEntryId,
      feedback,
      createdAt: new Date()
    } as unknown);
  }

  // Database Health Check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return true; // localStorage is always available
      }
      await this.db?.admin().ping();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Get connection status
  getConnectionStatus(): { isConnected: boolean; usingFallback: boolean } {
    return {
      isConnected: this.isConnected,
      usingFallback: !this.isConnected
    };
  }
}

export const databaseService = DatabaseService.getInstance(); 