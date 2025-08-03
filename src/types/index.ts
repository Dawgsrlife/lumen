// User Types
export interface User {
  id: string;
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
  id: string;
  userId: string;
  emotion: EmotionType;
  intensity: number; // 1-10 scale
  context: string;
  surveyResponses: SurveyResponse[];
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
  id: string;
  userId: string;
  gameId: string;
  score: number;
  duration: number; // actual time played
  completed: boolean;
  achievements: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'emotion' | 'game' | 'streak' | 'milestone';
  criteria: AchievementCriteria;
  unlockedAt?: Date;
}

export interface AchievementCriteria {
  type: 'streak' | 'count' | 'score' | 'completion';
  value: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

// Progress & Analytics Types
export interface ProgressStats {
  userId: string;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  mostFrequentEmotion: EmotionType;
  gamesPlayed: number;
  achievementsUnlocked: number;
  lastUpdated: Date;
}

export interface EmotionTrend {
  date: Date;
  averageIntensity: number;
  dominantEmotion: EmotionType;
  entryCount: number;
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

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Form Types
export interface EmotionFormData {
  emotion: EmotionType;
  intensity: number;
  context: string;
  surveyResponses: SurveyResponse[];
}

// Theme Types
export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  shadow: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  isProtected?: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

// Journal Types
export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  emotionEntryId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types  
export interface UserAnalytics {
  userId: string;
  totalEntries: number;
  averageMood: number;
  emotionDistribution: Record<EmotionType, number>;
  streakData: {
    current: number;
    longest: number;
  };
  weeklyProgress: EmotionTrend[];
  gamesPlayed: number;
  achievementsUnlocked: Achievement[];
}

// AI Response Types
export interface AIInsightResponse {
  insights: string[];
  recommendations: string[];
  summary: string;
  resources: string[];
}

// Request Types
export interface CreateEmotionRequest {
  emotion: EmotionType;
  intensity: number;
  context: string;
  surveyResponses?: SurveyResponse[];
}

export interface CreateJournalRequest {
  title: string;
  content: string;
  emotionEntryId?: string;
  tags?: string[];
}

// Post-Game Feedback Types
export interface PostGameFeedback {
  id: string;
  userId: string;
  gameId: string;
  gameName: string;
  emotion: EmotionType;
  feelsBetter: boolean;
  timestamp: Date;
  sessionData?: {
    score?: number;
    duration?: number;
    achievements?: string[];
  };
}

export interface CreateFeedbackRequest {
  gameId: string;
  gameName: string;
  emotion: EmotionType;
  feelsBetter: boolean;
  sessionData?: {
    score?: number;
    duration?: number;
    achievements?: string[];
  };
} 