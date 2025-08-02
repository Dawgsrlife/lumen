import type { 
  User, 
  EmotionEntry, 
  EmotionFormData, 
  ProgressStats, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API client instance
const apiClient = new ApiClient(API_BASE_URL);

// User API services
export const userApi = {
  // Get current user profile
  getProfile: (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/user/profile');
  },

  // Update user profile
  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put<User>('/user/profile', data);
  },

  // Get user preferences
  getPreferences: (): Promise<ApiResponse<User['preferences']>> => {
    return apiClient.get<User['preferences']>('/user/preferences');
  },

  // Update user preferences
  updatePreferences: (preferences: User['preferences']): Promise<ApiResponse<User['preferences']>> => {
    return apiClient.put<User['preferences']>('/user/preferences', preferences);
  },
};

// Emotion API services
export const emotionApi = {
  // Get emotion entries
  getEntries: (params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<EmotionEntry>>> => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get<PaginatedResponse<EmotionEntry>>(`/emotions${query}`);
  },

  // Create new emotion entry
  createEntry: (data: EmotionFormData): Promise<ApiResponse<EmotionEntry>> => {
    return apiClient.post<EmotionEntry>('/emotions', data);
  },

  // Get specific emotion entry
  getEntry: (id: string): Promise<ApiResponse<EmotionEntry>> => {
    return apiClient.get<EmotionEntry>(`/emotions/${id}`);
  },

  // Update emotion entry
  updateEntry: (id: string, data: Partial<EmotionFormData>): Promise<ApiResponse<EmotionEntry>> => {
    return apiClient.put<EmotionEntry>(`/emotions/${id}`, data);
  },

  // Delete emotion entry
  deleteEntry: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/emotions/${id}`);
  },

  // Get emotion trends
  getTrends: (period: 'week' | 'month' | 'year' = 'week'): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/emotions/trends?period=${period}`);
  },
};

// Progress API services
export const progressApi = {
  // Get user progress stats
  getStats: (): Promise<ApiResponse<ProgressStats>> => {
    return apiClient.get<ProgressStats>('/progress/stats');
  },

  // Get achievement progress
  getAchievements: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/progress/achievements');
  },

  // Get streak information
  getStreaks: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/progress/streaks');
  },
};

// AI API services
export const aiApi = {
  // Get AI feedback for emotion
  getFeedback: (emotionEntryId: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/ai/feedback/${emotionEntryId}`);
  },

  // Generate personalized insights
  getInsights: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/ai/insights');
  },

  // Get recommendations
  getRecommendations: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/ai/recommendations');
  },
};

// Game API services
export const gameApi = {
  // Get available games
  getGames: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/games');
  },

  // Start game session
  startSession: (gameId: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/games/sessions', { gameId });
  },

  // End game session
  endSession: (sessionId: string, score: number): Promise<ApiResponse<any>> => {
    return apiClient.put<any>(`/games/sessions/${sessionId}`, { score, completed: true });
  },

  // Get game progress
  getProgress: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/games/progress');
  },
};

// Analytics API services
export const analyticsApi = {
  // Get emotion analytics
  getEmotionAnalytics: (period: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/analytics/emotions?period=${period}`);
  },

  // Get progress analytics
  getProgressAnalytics: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/analytics/progress');
  },

  // Get game analytics
  getGameAnalytics: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/analytics/games');
  },

  // Export user data
  exportData: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/analytics/export');
  },
};

// Export all API services
export const api = {
  user: userApi,
  emotion: emotionApi,
  progress: progressApi,
  ai: aiApi,
  game: gameApi,
  analytics: analyticsApi,
}; 