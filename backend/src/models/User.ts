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

// Update lastLoginAt on save
userSchema.pre('save', function(next) {
  if (this.isModified('lastLoginAt')) {
    this.lastLoginAt = new Date();
  }
  next();
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema); 