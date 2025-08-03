import mongoose, { Schema, Document } from 'mongoose';
import type { GameSession } from '../types/index.js';

export interface GameSessionDocument extends Omit<GameSession, 'id'>, Document {}

const gameSessionSchema = new Schema<GameSessionDocument>({
  userId: {
    type: String,
    required: true
  },
  clerkId: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: [
      'boxbreathing', 'colorbloom', 'memorylantern', 'rythmgrow',
      'placeholderGame_fear', 'placeholderGame_anxiety', 'placeholderGame_loneliness'
    ],
    required: true
  },
  mappedEmotion: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 480 // max 8 hours
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  emotionBefore: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'],
    required: true
  },
  emotionAfter: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief']
  },
  completionStatus: {
    type: String,
    enum: ['completed', 'incomplete', 'abandoned'],
    default: 'completed'
  },
  metadata: {
    sessionStartTime: Date,
    sessionEndTime: Date,
    interactionCount: Number,
    achievements: [String],
    therapeuticTechniques: [String]
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

// Indexes for efficient queries
gameSessionSchema.index({ clerkId: 1, createdAt: -1 });
gameSessionSchema.index({ clerkId: 1, gameType: 1 });
gameSessionSchema.index({ clerkId: 1, mappedEmotion: 1 });

// Virtual for date (YYYY-MM-DD format)
gameSessionSchema.virtual('date').get(function() {
  return (this as any).createdAt.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON output
gameSessionSchema.set('toJSON', { virtuals: true });

export const GameSessionModel = mongoose.model<GameSessionDocument>('GameSession', gameSessionSchema); 