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
  emotionEntryId?: string; // Optional link to emotion entry
  content: string;
  mood: EmotionType;
  tags: string[];
  isPrivate: boolean;
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
  gameId: string;
  score: number;
  duration: number; // actual time played
  completed: boolean;
  achievements: string[];
  startedAt: Date;
  completedAt?: Date;
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
  intensity: number;
  context?: string;
  surveyResponses?: SurveyResponse[];
}

export interface CreateJournalRequest {
  content: string;
  mood: EmotionType;
  tags?: string[];
  isPrivate?: boolean;
  emotionEntryId?: string;
}

export interface CreateGameSessionRequest {
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
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