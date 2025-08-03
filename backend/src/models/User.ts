import mongoose, { Schema, Document } from 'mongoose';
import type { User, UserPreferences } from '../types/index.js';

export interface UserDocument extends Omit<User, 'id'>, Document {}

const userPreferencesSchema = new Schema<UserPreferences>({
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  notifications: {
    type: Boolean,
    default: true
  },
  privacyLevel: {
    type: String,
    enum: ['public', 'private', 'friends'],
    default: 'private'
  },
  language: {
    type: String,
    default: 'en'
  }
}, { _id: false });

const userSchema = new Schema<UserDocument>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  preferences: {
    type: userPreferencesSchema,
    default: () => ({})
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  // Enhanced user tracking
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastEmotionDate: {
    type: Date
  },
  weeklyData: {
    type: [Boolean],
    default: [false, false, false, false, false, false, false] // Sun-Sat
  },
  totalEmotionEntries: {
    type: Number,
    default: 0
  },
  favoriteEmotions: {
    type: [String],
    default: []
  },
  // Session tracking
  hasPlayedGameToday: {
    type: Boolean,
    default: false
  },
  currentEmotion: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief', null],
    default: null
  },
  // Analytics data
  averageMood: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  },
  moodTrend: {
    type: String,
    enum: ['improving', 'stable', 'declining'],
    default: 'stable'
  },
  // Game statistics
  gamesPlayed: {
    type: Number,
    default: 0
  },
  totalGameTime: {
    type: Number, // in minutes
    default: 0
  },
  favoriteGames: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ clerkId: 1, lastEmotionDate: -1 });
userSchema.index({ clerkId: 1, currentStreak: -1 });

// Update lastLoginAt on save
userSchema.pre('save', function(next) {
  if (this.isModified('lastLoginAt')) {
    this.lastLoginAt = new Date();
  }
  next();
});

// Method to update weekly data
userSchema.methods.updateWeeklyData = function(dayIndex: number, logged: boolean) {
  this.weeklyData[dayIndex] = logged;
  return this.save();
};

// Method to update streak
userSchema.methods.updateStreak = function(newStreak: number) {
  this.currentStreak = newStreak;
  if (newStreak > this.longestStreak) {
    this.longestStreak = newStreak;
  }
  return this.save();
};

// Method to reset weekly data
userSchema.methods.resetWeeklyData = function() {
  this.weeklyData = [false, false, false, false, false, false, false];
  return this.save();
};

// Method to check if user has logged emotion today
userSchema.methods.hasLoggedToday = function() {
  if (!this.lastEmotionDate) return false;
  
  const today = new Date();
  const lastEmotion = new Date(this.lastEmotionDate);
  
  return today.toDateString() === lastEmotion.toDateString();
};

// Method to get current week's data
userSchema.methods.getCurrentWeekData = function() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Reset weekly data if it's a new week
  const lastEmotion = this.lastEmotionDate ? new Date(this.lastEmotionDate) : null;
  if (!lastEmotion || this.isNewWeek(lastEmotion, today)) {
    this.weeklyData = [false, false, false, false, false, false, false];
  }
  
  return this.weeklyData;
};

// Helper method to check if it's a new week
userSchema.methods.isNewWeek = function(lastDate: Date, currentDate: Date) {
  const lastWeek = this.getWeekNumber(lastDate);
  const currentWeek = this.getWeekNumber(currentDate);
  return lastWeek !== currentWeek;
};

// Helper method to get week number
userSchema.methods.getWeekNumber = function(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const UserModel = mongoose.model<UserDocument>('User', userSchema); 