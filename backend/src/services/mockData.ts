// Mock data service for hackathon mode when MongoDB is not available
import type { EmotionEntry, JournalEntry, GameSession, User } from '../types/index.js';

class MockDataService {
  private emotions: Map<string, EmotionEntry[]> = new Map();
  private journals: Map<string, JournalEntry[]> = new Map();
  private gameSessions: Map<string, GameSession[]> = new Map();
  private users: Map<string, User> = new Map();

  // Emotion entries
  async createEmotionEntry(clerkId: string, data: Partial<EmotionEntry>): Promise<EmotionEntry> {
    const entry: EmotionEntry = {
      id: `emotion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId || clerkId, // Use clerkId as userId for mock data
      clerkId,
      emotion: data.emotion || 'happy', // Use valid EmotionType
      intensity: data.intensity || 5,
      context: data.context || 'general',
      surveyResponses: data.surveyResponses || [],
      aiFeedback: data.aiFeedback,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!this.emotions.has(clerkId)) {
      this.emotions.set(clerkId, []);
    }
    this.emotions.get(clerkId)!.push(entry);
    
    return entry;
  }

  async getEmotionEntries(clerkId: string, days: number = 30): Promise<EmotionEntry[]> {
    const entries = this.emotions.get(clerkId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return entries.filter(entry => entry.createdAt >= cutoffDate);
  }

  async getEmotionEntry(id: string): Promise<EmotionEntry | null> {
    for (const entries of this.emotions.values()) {
      const entry = entries.find(e => e.id === id);
      if (entry) return entry;
    }
    return null;
  }

  // Journal entries
  async createJournalEntry(clerkId: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    const entry: JournalEntry = {
      id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId || clerkId, // Use clerkId as userId for mock data
      clerkId,
      title: data.title || 'Journal Entry',
      content: data.content || '',
      mood: data.mood || 5,
      tags: data.tags || [],
      source: data.source || 'manual',
      isPrivate: data.isPrivate || false,
      emotionEntryId: data.emotionEntryId,
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!this.journals.has(clerkId)) {
      this.journals.set(clerkId, []);
    }
    this.journals.get(clerkId)!.push(entry);
    
    return entry;
  }

  async getJournalEntries(clerkId: string, days: number = 30): Promise<JournalEntry[]> {
    const entries = this.journals.get(clerkId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return entries.filter(entry => entry.createdAt >= cutoffDate);
  }

  async searchJournalEntries(clerkId: string, query: string, days: number = 30): Promise<JournalEntry[]> {
    const entries = await this.getJournalEntries(clerkId, days);
    return entries.filter(entry => 
      entry.content.toLowerCase().includes(query.toLowerCase()) ||
      entry.title.toLowerCase().includes(query.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Game sessions
  async createGameSession(clerkId: string, data: Partial<GameSession>): Promise<GameSession> {
    const session: GameSession = {
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId || clerkId, // Use clerkId as userId for mock data
      clerkId,
      gameType: data.gameType || 'boxbreathing', // Use valid game type
      mappedEmotion: data.mappedEmotion || 'happy', // Use valid EmotionType
      emotionBefore: data.emotionBefore || 'happy', // Use valid EmotionType
      emotionAfter: data.emotionAfter,
      duration: data.duration || 0,
      score: data.score || 0,
      notes: data.notes || '',
      completionStatus: data.completionStatus || 'completed',
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!this.gameSessions.has(clerkId)) {
      this.gameSessions.set(clerkId, []);
    }
    this.gameSessions.get(clerkId)!.push(session);
    
    return session;
  }

  async getGameSessions(clerkId: string, days: number = 30): Promise<GameSession[]> {
    const sessions = this.gameSessions.get(clerkId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return sessions.filter(session => session.createdAt >= cutoffDate);
  }

  async updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<GameSession | null> {
    for (const sessions of this.gameSessions.values()) {
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates, updatedAt: new Date() };
        return sessions[sessionIndex];
      }
    }
    return null;
  }

  // User management
  async createUser(data: Partial<User>): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clerkId: data.clerkId!,
      email: data.email!,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      preferences: data.preferences || {
        theme: 'light',
        notifications: true,
        privacyLevel: 'private',
        language: 'en'
      },
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    this.users.set(user.clerkId, user);
    return user;
  }

  async getUser(clerkId: string): Promise<User | null> {
    return this.users.get(clerkId) || null;
  }

  async updateUser(clerkId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(clerkId);
    if (user) {
      const updatedUser = { ...user, ...updates, lastLoginAt: new Date() };
      this.users.set(clerkId, updatedUser);
      return updatedUser;
    }
    return null;
  }

  // Analytics
  async getEmotionAnalytics(clerkId: string, days: number = 30): Promise<any> {
    const entries = await this.getEmotionEntries(clerkId, days);
    
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        averageIntensity: 0,
        mostCommonEmotion: 'happy',
        moodTrend: 'stable',
        emotionBreakdown: {},
        weeklyTrends: []
      };
    }

    const emotionCounts: Record<string, number> = {};
    let totalIntensity = 0;

    entries.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      totalIntensity += entry.intensity;
    });

    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0][0] as any;

    return {
      totalEntries: entries.length,
      averageIntensity: Math.round((totalIntensity / entries.length) * 10) / 10,
      mostCommonEmotion,
      moodTrend: 'stable',
      emotionBreakdown: emotionCounts,
      weeklyTrends: this.generateWeeklyTrends(entries)
    };
  }

  async getMoodTrends(clerkId: string, days: number = 30): Promise<any> {
    const entries = await this.getEmotionEntries(clerkId, days);
    
    if (entries.length === 0) {
      return {
        trends: [],
        totalDays: 0,
        dateRange: { start: new Date().toISOString(), end: new Date().toISOString() }
      };
    }

    // Group entries by date
    const dailyEntries: Record<string, EmotionEntry[]> = {};
    entries.forEach(entry => {
      const date = entry.createdAt.toDateString();
      if (!dailyEntries[date]) {
        dailyEntries[date] = [];
      }
      dailyEntries[date].push(entry);
    });

    const trends = Object.entries(dailyEntries).map(([date, dayEntries]) => {
      const avgIntensity = dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length;
      const dominantEmotion = dayEntries.reduce((acc, entry) => {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostFrequent = Object.entries(dominantEmotion)
        .sort(([,a], [,b]) => b - a)[0][0] as any;

      return {
        date: new Date(date),
        averageIntensity: Math.round(avgIntensity * 10) / 10,
        dominantEmotion: mostFrequent,
        entryCount: dayEntries.length
      };
    });

    return {
      trends,
      totalDays: trends.length,
      dateRange: {
        start: new Date(Math.min(...trends.map(t => t.date.getTime()))).toISOString(),
        end: new Date(Math.max(...trends.map(t => t.date.getTime()))).toISOString()
      }
    };
  }

  private generateWeeklyTrends(entries: EmotionEntry[]): any[] {
    // Simple weekly trend generation
    const weeklyData = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekEntries = entries.filter(entry => 
        entry.createdAt >= weekStart && entry.createdAt <= weekEnd
      );
      
      const avgIntensity = weekEntries.length > 0 
        ? weekEntries.reduce((sum, entry) => sum + entry.intensity, 0) / weekEntries.length 
        : 0;
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        averageIntensity: Math.round(avgIntensity * 10) / 10,
        entryCount: weekEntries.length
      });
    }
    
    return weeklyData;
  }
}

export default new MockDataService(); 