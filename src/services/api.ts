import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { 
  EmotionEntry, 
  JournalEntry, 
  UserAnalytics, 
  AIInsightResponse,
  CreateEmotionRequest,
  CreateJournalRequest,
  PostGameFeedback,
  CreateFeedbackRequest,
  User,
  NotificationResponse
} from '../types/index';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  const token = localStorage.getItem('lumen_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 second timeout
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          this.clearToken();
          window.location.href = '/login';
        }
        
        // Log network errors but don't throw
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
          console.warn('API unavailable, using fallback behavior');
          // Return a mock response for critical endpoints
          return Promise.resolve({
            data: {
              success: true,
              data: {
                hasLoggedToday: false,
                todayEntry: null,
                userData: {
                  currentStreak: 0,
                  longestStreak: 0,
                  weeklyData: [false, false, false, false, false, false, false],
                  currentEmotion: null,
                  hasPlayedGameToday: false
                }
              }
            }
          });
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('lumen_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('lumen_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('lumen_token');
  }

  // Authentication
  async registerWithClerk(clerkToken: string, userData: {
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  }): Promise<{ user: User; token: string }> {
    const response: AxiosResponse = await this.api.post('/api/users/register', {
      ...userData,
      clerkToken
    });
    return response.data.data;
  }

  async loginWithClerk(clerkToken: string): Promise<{ user: User; token: string }> {
    const response: AxiosResponse = await this.api.post('/api/users/login', {
      clerkToken
    });
    return response.data.data;
  }

  // User management
  async getUserProfile(): Promise<User> {
    const response: AxiosResponse = await this.api.get('/api/users/profile');
    return response.data.data;
  }

  async updateUserProfile(profileData: Partial<User>): Promise<User> {
    const response: AxiosResponse = await this.api.put('/api/users/profile', profileData);
    return response.data.data;
  }

  async updateUserPreferences(preferences: unknown): Promise<unknown> {
    const response: AxiosResponse = await this.api.put('/api/users/preferences', { preferences });
    return response.data.data;
  }

  // Emotion entries
  async createEmotionEntry(data: CreateEmotionRequest): Promise<EmotionEntry> {
    try {
      const response = await this.api.post<{
        emotionEntry: EmotionEntry;
        userData: {
          currentStreak: number;
          longestStreak: number;
          weeklyData: boolean[];
          totalEmotionEntries: number;
          averageMood: number;
        };
      }>('/emotions', data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create emotion entry');
      }

      return response.data.data!.emotionEntry;
    } catch (error) {
      console.error('Error creating emotion entry:', error);
      throw error;
    }
  }

  /**
   * Get emotion entries with enhanced user data
   */
  async getEmotionEntries(params?: {
    page?: number;
    limit?: number;
    emotion?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
  }): Promise<{
    emotions: EmotionEntry[];
    userData?: {
      currentStreak: number;
      longestStreak: number;
      weeklyData: boolean[];
      totalEmotionEntries: number;
      averageMood: number;
      hasLoggedToday: boolean;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.emotion) queryParams.append('emotion', params.emotion);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.sort) queryParams.append('sort', params.sort);

      const response = await this.api.get<{
        emotions: EmotionEntry[];
        userData?: {
          currentStreak: number;
          longestStreak: number;
          weeklyData: boolean[];
          totalEmotionEntries: number;
          averageMood: number;
          hasLoggedToday: boolean;
        };
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }>(`/emotions?${queryParams.toString()}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch emotion entries');
      }

      return response.data.data!;
    } catch (error) {
      console.error('Error fetching emotion entries:', error);
      throw error;
    }
  }

  /**
   * Check if user has logged emotion today and get today's data
   */
  async getTodayEmotion(): Promise<{
    hasLoggedToday: boolean;
    todayEntry?: EmotionEntry;
    userData?: {
      currentStreak: number;
      longestStreak: number;
      weeklyData: boolean[];
      currentEmotion?: string | null;
      hasPlayedGameToday: boolean;
    };
  }> {
    try {
      const response = await this.api.get<{
        hasLoggedToday: boolean;
        todayEntry?: EmotionEntry;
        userData?: {
          currentStreak: number;
          longestStreak: number;
          weeklyData: boolean[];
          currentEmotion?: string | null;
          hasPlayedGameToday: boolean;
        };
      }>('/emotions/today');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to check today\'s emotion');
      }

      return response.data.data!;
    } catch (error) {
      console.error('Error checking today\'s emotion:', error);
      throw error;
    }
  }

  async getDailyEmotions(days: number = 30): Promise<{
    dailyEntries: Record<string, EmotionEntry[]>;
    totalDays: number;
    totalEntries: number;
  }> {
    const response: AxiosResponse = await this.api.get('/api/emotions/daily', {
      params: { days }
    });
    return response.data.data;
  }

  async getEmotionEntry(id: string): Promise<EmotionEntry> {
    const response: AxiosResponse = await this.api.get(`/api/emotions/${id}`);
    return response.data.data;
  }

  async updateEmotionEntry(id: string, emotionData: Partial<CreateEmotionRequest>): Promise<EmotionEntry> {
    const response: AxiosResponse = await this.api.put(`/api/emotions/${id}`, emotionData);
    return response.data.data;
  }

  async deleteEmotionEntry(id: string): Promise<void> {
    await this.api.delete(`/api/emotions/${id}`);
  }

  // Journal entries
  async createJournalEntry(journalData: CreateJournalRequest): Promise<{
    journalEntry: JournalEntry;
    analysis?: {
      sentiment: 'positive' | 'negative' | 'neutral';
      keyThemes: string[];
      suggestions: string[];
    };
  }> {
    const response: AxiosResponse = await this.api.post('/api/journal', journalData);
    return response.data.data;
  }

  async getJournalEntries(params?: {
    page?: number;
    limit?: number;
    mood?: string;
    startDate?: string;
    endDate?: string;
    includePrivate?: boolean;
  }): Promise<{ entries: JournalEntry[]; pagination: unknown }> {
    const response: AxiosResponse = await this.api.get('/api/journal', { params });
    return response.data.data;
  }

  async getDailyJournals(days: number = 30, includePrivate: boolean = true): Promise<{
    dailyEntries: Record<string, JournalEntry[]>;
    totalDays: number;
    totalEntries: number;
  }> {
    const response: AxiosResponse = await this.api.get('/api/journal/daily', {
      params: { days, includePrivate }
    });
    return response.data.data;
  }

  async searchJournalEntries(query: string, page: number = 1, limit: number = 20): Promise<{
    entries: JournalEntry[];
    pagination: unknown;
  }> {
    const response: AxiosResponse = await this.api.get('/api/journal/search', {
      params: { q: query, page, limit }
    });
    return response.data.data;
  }

  async getJournalEntry(id: string): Promise<JournalEntry> {
    const response: AxiosResponse = await this.api.get(`/api/journal/${id}`);
    return response.data.data;
  }

  async updateJournalEntry(id: string, journalData: Partial<CreateJournalRequest>): Promise<JournalEntry> {
    const response: AxiosResponse = await this.api.put(`/api/journal/${id}`, journalData);
    return response.data.data;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await this.api.delete(`/api/journal/${id}`);
  }

  // Analytics
  async getAnalyticsOverview(days: number = 30): Promise<UserAnalytics> {
    const response: AxiosResponse = await this.api.get('/api/analytics/overview', {
      params: { days }
    });
    return response.data.data;
  }

  async generateAIInsights(timeframe: 'week' | 'month' | 'all' = 'week', focus: 'emotions' | 'journal' | 'games' | 'all' = 'all'): Promise<AIInsightResponse> {
    const response: AxiosResponse = await this.api.post('/api/analytics/insights', {
      timeframe,
      focus
    });
    return response.data.data;
  }

  async getEmotionAnalytics(days: number = 30): Promise<{
    emotionStats: Record<string, any>;
    totalEntries: number;
    dateRange: { start: string; end: string };
  }> {
    const response: AxiosResponse = await this.api.get('/api/analytics/emotions', {
      params: { days }
    });
    return response.data.data;
  }

  async getMoodTrends(days: number = 30): Promise<{
    trends: unknown[];
    totalDays: number;
    dateRange: { start: string; end: string };
  }> {
    const response: AxiosResponse = await this.api.get('/api/analytics/trends', {
      params: { days }
    });
    return response.data.data;
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string; environment: string }> {
    const response: AxiosResponse = await this.api.get('/health');
    return response.data;
  }

  // Post-Game Feedback
  async createFeedback(feedbackData: CreateFeedbackRequest): Promise<PostGameFeedback> {
    const response: AxiosResponse = await this.api.post('/api/feedback', feedbackData);
    return response.data.data;
  }

  async getFeedback(gameId?: string, emotion?: string): Promise<PostGameFeedback[]> {
    const response: AxiosResponse = await this.api.get('/api/feedback', {
      params: { gameId, emotion }
    });
    return response.data.data;
  }

  async getFeedbackStats(): Promise<{
    totalResponses: number;
    positiveResponses: number;
    responsesByGame: Record<string, { positive: number; total: number }>;
    responsesByEmotion: Record<string, { positive: number; total: number }>;
  }> {
    const response: AxiosResponse = await this.api.get('/api/feedback/stats');
    return response.data.data;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export for backward compatibility
export default apiService; 

// Notification API functions
export const getNotifications = async (): Promise<NotificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, message: 'Failed to fetch notifications' };
  }
};

export const createNotification = async (notification: Omit<Notification, '_id' | 'createdAt'>): Promise<NotificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify(notification)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, message: 'Failed to create notification' };
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<NotificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, message: 'Failed to mark notification as read' };
  }
};

export const markAllNotificationsAsRead = async (): Promise<NotificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, message: 'Failed to mark all notifications as read' };
  }
};

export const deleteNotification = async (notificationId: string): Promise<NotificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, message: 'Failed to delete notification' };
  }
}; 