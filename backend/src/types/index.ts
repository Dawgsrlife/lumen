// Backend Types - Extending frontend types for API needs

// User Types
export interface User {
  id?: string;
  clerkId: string; // Clerk user ID
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  privacyLevel: 'public' | 'private' | 'friends';
  language: string;
}

// Emotion Types
export type EmotionType = 
  | 'happy'
  | 'sad' 
  | 'loneliness' 
  | 'anxiety' 
  | 'frustration' 
  | 'stress' 
  | 'lethargy' 
  | 'fear' 
  | 'grief';

export interface EmotionEntry {
  id?: string;
  userId: string;
  clerkId: string;
  emotion: EmotionType;
  intensity: number; // 1-10 scale
  context?: string;
  surveyResponses?: SurveyResponse[];
  aiFeedback?: AIFeedback;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyResponse {
  questionId: string;
  question: string;
  answer: string | number;
  category: 'context' | 'severity' | 'triggers' | 'coping';
}

export interface AIFeedback {
  id: string;
  emotionEntryId: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  resources: string[];
  generatedAt: Date;
}

// Journal Types
export interface JournalEntry {
  id?: string;
  userId: string;
  clerkId: string;
  title: string;
  content: string;
  emotionEntryId?: string; // Optional link to emotion entry
  mood?: number; // 1-10 scale
  tags: string[];
  isPrivate: boolean;
  source?: 'manual' | 'voice_chat' | 'ai_generated';
  metadata?: {
    sessionId?: string;
    duration?: number;
    emotionIntensity?: number;
    therapeuticTechniques?: string[];
    conversationLog?: Array<{
      timestamp: Date;
      role: string;
      content: string;
      audioData?: string;
    }>;
    sentiment?: 'positive' | 'negative' | 'neutral';
    keyThemes?: string[];
    insights?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Game Types
export interface Game {
  id: string;
  name: string;
  emotionType: EmotionType;
  description: string;
  instructions: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
}

export interface GameSession {
  id?: string;
  userId: string;
  clerkId: string;
  gameType: 'boxbreathing' | 'colorbloom' | 'memorylantern' | 'rythmgrow' | 'placeholderGame_fear' | 'placeholderGame_anxiety' | 'placeholderGame_loneliness';
  mappedEmotion: EmotionType;
  duration: number; // in minutes
  score?: number; // optional score 0-100
  notes?: string;
  emotionBefore: EmotionType;
  emotionAfter?: EmotionType;
  completionStatus: 'completed' | 'incomplete' | 'abandoned';
  metadata?: {
    sessionStartTime?: Date;
    sessionEndTime?: Date;
    interactionCount?: number;
    achievements?: string[];
    therapeuticTechniques?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Voice Chat Types
export interface VoiceChatSession {
  id: string;
  clerkId: string;
  emotion: string;
  intensity: number;
  recentGame?: GameSession;
  conversationLog: Array<{
    timestamp: Date;
    role: 'user' | 'assistant';
    content: string;
    audioData?: string;
  }>;
  therapeuticContext: {
    primaryConcern: string;
    recommendedTechniques: string[];
    sessionGoals: string[];
    userHistory: {
      recentEmotions: EmotionEntry[];
      recentGames: GameSession[];
      recentJournals: JournalEntry[];
      moodTrends: any;
    };
  };
}

// Analytics Types
export interface DailyEntry {
  date: string; // YYYY-MM-DD format
  emotionEntries: EmotionEntry[];
  journalEntries: JournalEntry[];
  gameSessions: GameSession[];
}

export interface UserAnalytics {
  userId: string;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  mostFrequentEmotion: EmotionType;
  gamesPlayed: number;
  lastUpdated: Date;
  dailyEntries: DailyEntry[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request Types
export interface CreateEmotionRequest {
  emotion: EmotionType;
  intensity?: number; // Optional, defaults to 5
  context?: string;
  surveyResponses?: SurveyResponse[];
}

export interface CreateJournalRequest {
  title: string;
  content: string;
  emotionEntryId?: string;
  mood?: number;
  tags?: string[];
  isPrivate?: boolean;
}

export interface CreateGameSessionRequest {
  gameType: 'boxbreathing' | 'colorbloom' | 'memorylantern' | 'rythmgrow' | 'placeholderGame_fear' | 'placeholderGame_anxiety' | 'placeholderGame_loneliness';
  mappedEmotion: EmotionType;
  duration: number;
  score?: number;
  notes?: string;
  emotionBefore: EmotionType;
  emotionAfter?: EmotionType;
  completionStatus?: 'completed' | 'incomplete' | 'abandoned';
  interactionCount?: number;
  achievements?: string[];
}

// AI Types
export interface AIInsightRequest {
  userId: string;
  timeframe: 'week' | 'month' | 'all';
  focus?: 'emotions' | 'journal' | 'games' | 'all';
}

export interface AIInsightResponse {
  summary: string;
  insights: string[];
  recommendations: string[];
  resources: string[];
  moodTrend: string;
  patterns: string[];
  clinicalAssessment: string;
  evidenceBasedInterventions: string[];
  healthcareOutcomes: string;
  riskFactors: string;
}

// Authentication Types
export interface AuthUser {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
} 