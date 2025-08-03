import mongoose, { Schema, Document } from 'mongoose';
import type { JournalEntry } from '../types/index.js';

export interface JournalEntryDocument extends Omit<JournalEntry, 'id'>, Document {}

const journalEntrySchema = new Schema<JournalEntryDocument>({
  userId: {
    type: String,
    required: true
  },
  clerkId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  emotionEntryId: {
    type: String,
    ref: 'EmotionEntry'
  },
  mood: {
    type: Number,
    min: 1,
    max: 10
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['manual', 'voice_chat', 'ai_generated', 'gemini_voice_chat'],
    default: 'manual'
  },
  metadata: {
    sessionId: String,
    duration: Number, // in minutes
    emotionIntensity: Number,
    therapeuticTechniques: [String],
    conversationLog: [{
      timestamp: Date,
      role: String, // 'user' or 'assistant'
      content: String,
      audioData: String
    }],
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    },
    keyThemes: [String],
    insights: [String]
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
journalEntrySchema.index({ clerkId: 1, source: 1 });
journalEntrySchema.index({ clerkId: 1, tags: 1 });

// Virtual for date (YYYY-MM-DD format)
journalEntrySchema.virtual('date').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON output
journalEntrySchema.set('toJSON', { virtuals: true });

export const JournalEntryModel = mongoose.model<JournalEntryDocument>('JournalEntry', journalEntrySchema); 