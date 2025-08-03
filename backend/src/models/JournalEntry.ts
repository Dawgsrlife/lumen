import mongoose, { Schema, Document } from 'mongoose';
import type { JournalEntry, EmotionType } from '../types/index.js';

export interface JournalEntryDocument extends Omit<JournalEntry, 'id'>, Document {}

const journalEntrySchema = new Schema<JournalEntryDocument>({
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
  emotionEntryId: {
    type: String,
    ref: 'EmotionEntry',
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10000 // 10k character limit
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'],
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
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
journalEntrySchema.index({ clerkId: 1, createdAt: -1 });
journalEntrySchema.index({ clerkId: 1, mood: 1 });
journalEntrySchema.index({ clerkId: 1, tags: 1 });
journalEntrySchema.index({ clerkId: 1, 'createdAt': 1 }, { 
  partialFilterExpression: { 
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
  } 
});

// Virtual for date (YYYY-MM-DD format)
journalEntrySchema.virtual('date').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON output
journalEntrySchema.set('toJSON', { virtuals: true });

// Text index for content search
journalEntrySchema.index({ content: 'text' });

export const JournalEntryModel = mongoose.model<JournalEntryDocument>('JournalEntry', journalEntrySchema); 