import mongoose, { Schema, Document } from 'mongoose';

export interface VoiceSessionDocument extends Document {
  id: string;
  clerkId: string;
  sessionId: string;
  emotion: string;
  intensity: number;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  status: 'active' | 'ended' | 'interrupted';
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
      recentEmotions: any[];
      recentGames: any[];
      recentJournals: any[];
      moodTrends: any;
    };
  };
  metadata: {
    model: string;
    responseModalities: string[];
    audioFormat: string;
    sampleRate: number;
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keyThemes: string[];
    insights: string[];
    journalEntryId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const conversationLogSchema = new Schema({
  timestamp: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  audioData: {
    type: String
  }
}, { _id: false });

const userHistorySchema = new Schema({
  recentEmotions: [{
    type: Schema.Types.Mixed
  }],
  recentGames: [{
    type: Schema.Types.Mixed
  }],
  recentJournals: [{
    type: Schema.Types.Mixed
  }],
  moodTrends: {
    type: Schema.Types.Mixed
  }
}, { _id: false });

const therapeuticContextSchema = new Schema({
  primaryConcern: {
    type: String,
    required: true
  },
  recommendedTechniques: [{
    type: String
  }],
  sessionGoals: [{
    type: String
  }],
  userHistory: {
    type: userHistorySchema,
    required: true
  }
}, { _id: false });

const metadataSchema = new Schema({
  model: {
    type: String,
    default: 'hackathon-simplified'
  },
  responseModalities: [{
    type: String
  }],
  audioFormat: {
    type: String,
    default: 'audio/pcm;rate=16000'
  },
  sampleRate: {
    type: Number,
    default: 16000
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  userMessages: {
    type: Number,
    default: 0
  },
  assistantMessages: {
    type: Number,
    default: 0
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral']
  },
  keyThemes: [{
    type: String
  }],
  insights: [{
    type: String
  }],
  journalEntryId: {
    type: String
  }
}, { _id: false });

const voiceSessionSchema = new Schema<VoiceSessionDocument>({
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief'],
    required: true
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'interrupted'],
    default: 'active'
  },
  conversationLog: [conversationLogSchema],
  therapeuticContext: {
    type: therapeuticContextSchema,
    required: true
  },
  metadata: {
    type: metadataSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id as string;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for efficient queries
voiceSessionSchema.index({ clerkId: 1, createdAt: -1 });
voiceSessionSchema.index({ clerkId: 1, status: 1 });
voiceSessionSchema.index({ clerkId: 1, emotion: 1 });
voiceSessionSchema.index({ sessionId: 1 });

// Virtual for date (YYYY-MM-DD format)
voiceSessionSchema.virtual('date').get(function() {
  return this.startTime.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON output
voiceSessionSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to update duration and message counts
voiceSessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  }
  
  // Update message counts
  this.metadata.totalMessages = this.conversationLog.length;
  this.metadata.userMessages = this.conversationLog.filter(log => log.role === 'user').length;
  this.metadata.assistantMessages = this.conversationLog.filter(log => log.role === 'assistant').length;
  
  next();
});

export const VoiceSessionModel = mongoose.model<VoiceSessionDocument>('VoiceSession', voiceSessionSchema); 