import { ObjectId } from 'mongodb';
import { databaseService, type EmotionEntry } from './database';
import type { SurveyResponse } from '../types';

export interface StoredEmotionData {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  surveyResponses: SurveyResponse[];
  note?: string;
  tags?: string[];
}

export interface EmotionTrend {
  date: string;
  averageIntensity: number;
  dominantEmotion: string;
  entryCount: number;
}

export interface UserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageIntensity: number;
  mostCommonEmotion: string;
  weeklyAverage: number;
}

class StorageService {
  private static instance: StorageService;
  private readonly STORAGE_KEY = 'lumen_emotions';
  // private readonly USER_STATS_KEY = 'lumen_user_stats'; // Will be used for caching stats

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Save emotion entry
  async saveEmotionEntry(entry: Omit<StoredEmotionData, 'id' | 'timestamp'>): Promise<StoredEmotionData> {
    const emotionEntry: StoredEmotionData = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    // Save to database service
    try {
      const dbEntry: Omit<EmotionEntry, '_id'> = {
        userId: new ObjectId(entry.userId),
        emotion: entry.emotion,
        intensity: entry.intensity,
        timestamp: new Date(),
        surveyResponses: entry.surveyResponses,
        tags: entry.tags,
      };
      
      await databaseService.saveEmotionEntry(dbEntry);
      
      // Log engagement
      await databaseService.logEngagement({
        userId: new ObjectId(entry.userId),
        action: 'emotion_logged',
        timestamp: new Date(),
        metadata: { emotion: entry.emotion, intensity: entry.intensity }
      });
    } catch (error) {
      console.error('Failed to save to database:', error);
    }

    // Fallback to localStorage
    const existingData = this.getStoredData();
    existingData.push(emotionEntry);
    this.setStoredData(existingData);

    // Update user stats
    this.updateUserStats(entry.userId);

    return emotionEntry;
  }

  // Get all emotion entries for a user
  async getEmotionEntries(userId: string): Promise<StoredEmotionData[]> {
    try {
      // Try to get from database first
      const dbEntries = await databaseService.getUserEmotions(new ObjectId(userId));
      
      // Convert database entries to storage format
      return dbEntries.map(entry => ({
        id: entry._id?.toString() || this.generateId(),
        userId: entry.userId.toString(),
        emotion: entry.emotion,
        intensity: entry.intensity,
        timestamp: entry.timestamp.toISOString(),
        surveyResponses: entry.surveyResponses,
        tags: entry.tags,
      }));
    } catch (error) {
      console.error('Failed to get from database, using localStorage:', error);
      // Fallback to localStorage
      const data = this.getStoredData();
      return data.filter(entry => entry.userId === userId);
    }
  }

  // Get recent emotion entries
  async getRecentEmotions(userId: string, limit: number = 10): Promise<StoredEmotionData[]> {
    const entries = await this.getEmotionEntries(userId);
    return entries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get emotion entries for a date range
  async getEmotionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<StoredEmotionData[]> {
    const entries = await this.getEmotionEntries(userId);
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  // Get weekly trends
  async getWeeklyTrends(userId: string): Promise<EmotionTrend[]> {
    const entries = await this.getEmotionEntries(userId);
    const trends: EmotionTrend[] = [];
    
    // Group by week
    const weeklyGroups = this.groupByWeek(entries);
    
    weeklyGroups.forEach((weekEntries, weekStart) => {
      const averageIntensity = weekEntries.reduce((sum, entry) => sum + entry.intensity, 0) / weekEntries.length;
      const emotionCounts = this.countEmotions(weekEntries);
      const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      trends.push({
        date: weekStart,
        averageIntensity,
        dominantEmotion,
        entryCount: weekEntries.length,
      });
    });

    return trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Try to get stats from database
      const dbStats = await databaseService.getEmotionStats(new ObjectId(userId));
      
      return {
        totalEntries: dbStats.totalEntries,
        currentStreak: 0, // TODO: Calculate from database
        longestStreak: 0, // TODO: Calculate from database
        averageIntensity: dbStats.averageIntensity,
        mostCommonEmotion: dbStats.mostCommonEmotion || '😐',
        weeklyAverage: 0, // TODO: Calculate from database
      };
    } catch (error) {
      console.error('Failed to get stats from database, using localStorage:', error);
      
      // Fallback to localStorage calculation
      const entries = await this.getEmotionEntries(userId);
      
      if (entries.length === 0) {
        return {
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageIntensity: 0,
          mostCommonEmotion: '😐',
          weeklyAverage: 0,
        };
      }

      const totalEntries = entries.length;
      const currentStreak = this.calculateCurrentStreak(entries);
      const longestStreak = this.calculateLongestStreak(entries);
      const averageIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
      const mostCommonEmotion = this.getMostCommonEmotion(entries);
      const weeklyAverage = this.calculateWeeklyAverage(entries);

      return {
        totalEntries,
        currentStreak,
        longestStreak,
        averageIntensity,
        mostCommonEmotion,
        weeklyAverage,
      };
    }
  }

  // Delete emotion entry
  async deleteEmotionEntry(entryId: string): Promise<void> {
    const data = this.getStoredData();
    const filteredData = data.filter(entry => entry.id !== entryId);
    this.setStoredData(filteredData);
  }

  // Update emotion entry
  async updateEmotionEntry(entryId: string, updates: Partial<StoredEmotionData>): Promise<StoredEmotionData | null> {
    const data = this.getStoredData();
    const entryIndex = data.findIndex(entry => entry.id === entryId);
    
    if (entryIndex === -1) return null;

    data[entryIndex] = { ...data[entryIndex], ...updates };
    this.setStoredData(data);
    
    return data[entryIndex];
  }

  // Clear all data for a user
  async clearUserData(userId: string): Promise<void> {
    const data = this.getStoredData();
    const filteredData = data.filter(entry => entry.userId !== userId);
    this.setStoredData(filteredData);
  }

  // Private helper methods
  private getStoredData(): StoredEmotionData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private setStoredData(data: StoredEmotionData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private groupByWeek(entries: StoredEmotionData[]): Map<string, StoredEmotionData[]> {
    const groups = new Map<string, StoredEmotionData[]>();
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const weekStart = this.getWeekStart(date);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!groups.has(weekKey)) {
        groups.set(weekKey, []);
      }
      groups.get(weekKey)!.push(entry);
    });
    
    return groups;
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  private countEmotions(entries: StoredEmotionData[]): Record<string, number> {
    const counts: Record<string, number> = {};
    entries.forEach(entry => {
      counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
    });
    return counts;
  }

  private calculateCurrentStreak(entries: StoredEmotionData[]): number {
    const sortedEntries = entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak++;
        currentDate = entryDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private calculateLongestStreak(entries: StoredEmotionData[]): number {
    const sortedEntries = entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      
      if (lastDate) {
        const daysDiff = Math.floor((entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      lastDate = entryDate;
    }
    
    return Math.max(longestStreak, currentStreak);
  }

  private getMostCommonEmotion(entries: StoredEmotionData[]): string {
    const emotionCounts = this.countEmotions(entries);
    return Object.entries(emotionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private calculateWeeklyAverage(entries: StoredEmotionData[]): number {
    const weeklyGroups = this.groupByWeek(entries);
    const weeklyAverages = Array.from(weeklyGroups.values()).map(weekEntries => 
      weekEntries.reduce((sum, entry) => sum + entry.intensity, 0) / weekEntries.length
    );
    
    return weeklyAverages.length > 0 
      ? weeklyAverages.reduce((sum, avg) => sum + avg, 0) / weeklyAverages.length 
      : 0;
  }

  private updateUserStats(_userId: string): void {
    // This would be called after each entry to keep stats updated
    // For now, we'll calculate stats on-demand
  }

  // TODO: MongoDB integration methods
  // private async saveToMongoDB(entry: StoredEmotionData): Promise<void> {
  //   // TODO: Implement MongoDB save
  //   console.log('Would save to MongoDB:', entry);
  // }

  // private async loadFromMongoDB(userId: string): Promise<StoredEmotionData[]> {
  //   // TODO: Implement MongoDB load
  //   console.log('Would load from MongoDB for user:', userId);
  //   return [];
  // }
}

export const storageService = StorageService.getInstance(); 