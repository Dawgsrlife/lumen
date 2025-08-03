import type { SurveyResponse, AIFeedback } from '../types';

interface StoredEmotionData {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  surveyResponses: SurveyResponse[];
  tags: string[];
  aiFeedback?: AIFeedback;
}

interface UserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageIntensity: number;
  mostCommonEmotion: string;
  weeklyAverage: number;
}

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get stored data from localStorage
  private getStoredData(): StoredEmotionData[] {
    try {
      const data = localStorage.getItem('lumen_emotions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  // Set data to localStorage
  private setStoredData(data: StoredEmotionData[]): void {
    try {
      localStorage.setItem('lumen_emotions', JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  // Save emotion entry
  async saveEmotionEntry(entry: Omit<StoredEmotionData, 'id' | 'timestamp'>): Promise<StoredEmotionData> {
    const emotionEntry: StoredEmotionData = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    const existingData = this.getStoredData();
    existingData.push(emotionEntry);
    this.setStoredData(existingData);

    // Update user stats
    this.updateUserStats(entry.userId);

    return emotionEntry;
  }

  // Get all emotion entries for a user
  async getEmotionEntries(userId: string): Promise<StoredEmotionData[]> {
    const allData = this.getStoredData();
    return allData.filter(entry => entry.userId === userId);
  }

  // Get recent emotions for a user
  async getRecentEmotions(userId: string, limit: number = 5): Promise<StoredEmotionData[]> {
    const userEntries = await this.getEmotionEntries(userId);
    return userEntries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get weekly trends
  async getWeeklyTrends(userId: string): Promise<unknown> {
    const userEntries = await this.getEmotionEntries(userId);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyEntries = userEntries.filter(entry => 
      new Date(entry.timestamp) >= weekAgo
    );

    return {
      totalEntries: weeklyEntries.length,
      averageIntensity: weeklyEntries.length > 0 
        ? weeklyEntries.reduce((sum, entry) => sum + entry.intensity, 0) / weeklyEntries.length 
        : 0,
      emotionBreakdown: weeklyEntries.reduce((acc, entry) => {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    const userEntries = await this.getEmotionEntries(userId);
    const totalEntries = userEntries.length;
    
    if (totalEntries === 0) {
      return {
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageIntensity: 0,
        mostCommonEmotion: '😐',
        weeklyAverage: 0,
      };
    }

    // Calculate average intensity
    const averageIntensity = userEntries.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries;

    // Calculate most common emotion
    const emotionCounts = userEntries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '😐';

    // Calculate streaks (simplified)
    const currentStreak = 1; // TODO: Implement proper streak calculation
    const longestStreak = 1; // TODO: Implement proper streak calculation

    // Calculate weekly average
    const weeklyTrends = await this.getWeeklyTrends(userId);
    const weeklyAverage = weeklyTrends.averageIntensity;

    return {
      totalEntries,
      currentStreak,
      longestStreak,
      averageIntensity,
      mostCommonEmotion,
      weeklyAverage,
    };
  }

  // Update user statistics
  private updateUserStats(): void {
    // This could be used to update cached stats
    // For now, we'll calculate stats on-demand
  }

  // Clear all data (for testing)
  clearAllData(): void {
    localStorage.removeItem('lumen_emotions');
  }
}

export const storageService = StorageService.getInstance(); 