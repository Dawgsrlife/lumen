import mongoose, { Schema, Document } from 'mongoose';
import type { EmotionEntry, EmotionType, SurveyResponse, AIFeedback } from '../types/index.js';

export interface EmotionEntryDocument extends Omit<EmotionEntry, 'id'>, Document {}

const surveyResponseSchema = new Schema<SurveyResponse>({
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['context', 'severity', 'triggers', 'coping'],
    required: true
  }
}, { _id: false });

const aiFeedbackSchema = new Schema<AIFeedback>({
  id: {
    type: String,
    required: true
  },
  emotionEntryId: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  insights: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  resources: [{
    type: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const emotionEntrySchema = new Schema<EmotionEntryDocument>({
  userId: {
    type: String,
    required: true
  },
  clerkId: {
    type: String,
    required: true
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'],
    required: true
  },
  intensity: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  },
  context: {
    type: String,
    trim: true
  },
  surveyResponses: [surveyResponseSchema],
  aiFeedback: aiFeedbackSchema
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

// Compound indexes for efficient queries
emotionEntrySchema.index({ clerkId: 1, createdAt: -1 });
emotionEntrySchema.index({ clerkId: 1, emotion: 1 });

// Virtual for date (YYYY-MM-DD format)
emotionEntrySchema.virtual('date').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON output
emotionEntrySchema.set('toJSON', { virtuals: true });

export const EmotionEntryModel = mongoose.model<EmotionEntryDocument>('EmotionEntry', emotionEntrySchema); 