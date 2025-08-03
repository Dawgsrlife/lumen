import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  clerkId: string;
  type: 'emotion_log' | 'analytics_check' | 'meditation_session' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true
  },
  clerkId: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['emotion_log', 'analytics_check', 'meditation_session', 'general']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    required: false
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
notificationSchema.index({ clerkId: 1, createdAt: -1 });
notificationSchema.index({ clerkId: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema); 