import mongoose, { Schema, Document } from 'mongoose';
import type { GameSession } from '../types/index.js';

export interface GameSessionDocument extends Omit<GameSession, 'id'>, Document {}

const gameSessionSchema = new Schema<GameSessionDocument>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  gameId: {
    type: String,
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 0 // duration in seconds
  },
  completed: {
    type: Boolean,
    default: false
  },
  achievements: [{
    type: String,
    trim: true
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
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
gameSessionSchema.index({ clerkId: 1, gameId: 1 });
gameSessionSchema.index({ clerkId: 1, completed: 1 });
gameSessionSchema.index({ clerkId: 1, 'createdAt': 1 }, { 
  partialFilterExpression: { 
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
  } 
});

// Virtual for date (YYYY-MM-DD format)
gameSessionSchema.virtual('date').get(function() {
  return (this as any).createdAt.toISOString().split('T')[0];
});

// Virtual for duration in minutes
gameSessionSchema.virtual('durationMinutes').get(function() {
  return Math.round(this.duration / 60);
});

// Ensure virtuals are included in JSON output
gameSessionSchema.set('toJSON', { virtuals: true });

// Auto-set completedAt when completed is set to true
gameSessionSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

export const GameSessionModel = mongoose.model<GameSessionDocument>('GameSession', gameSessionSchema); 