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
    unique: true
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

// Only add non-unique indexes since unique fields auto-create indexes
userSchema.index({ createdAt: -1 });

// Update lastLoginAt on explicit set only (not on every save)
userSchema.pre('save', function(next) {
  // Only update lastLoginAt if it was explicitly modified
  if (this.isModified('lastLoginAt') && this.lastLoginAt !== this.get('lastLoginAt')) {
    this.lastLoginAt = new Date();
  }
  next();
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema); 