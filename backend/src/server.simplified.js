import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// User Schema - Simplified
const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastEmotionDate: Date,
  weeklyData: {
    type: [Boolean],
    default: [false, false, false, false, false, false, false]
  },
  totalEmotionEntries: { type: Number, default: 0 },
  currentEmotion: {
    type: String,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief', null],
    default: null
  },
  averageMood: { type: Number, default: 5 }
}, {
  timestamps: true
});

// Add hasLoggedToday method
userSchema.methods.hasLoggedToday = function() {
  if (!this.lastEmotionDate) return false;
  
  const today = new Date();
  const lastEmotion = new Date(this.lastEmotionDate);
  
  return today.toDateString() === lastEmotion.toDateString();
};

const User = mongoose.model('User', userSchema);

// Emotion Entry Schema - Simplified
const emotionSchema = new mongoose.Schema({
  userId: String,
  clerkId: String,
  emotion: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'loneliness', 'anxiety', 'frustration', 'stress', 'lethargy', 'fear', 'grief']
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  context: String,
  surveyResponses: [Object]
}, {
  timestamps: true
});

const EmotionEntry = mongoose.model('EmotionEntry', emotionSchema);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 900000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// Other middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple auth middleware (mock for now)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // For development, we'll mock the authentication
  req.clerkId = 'mock-clerk-id';
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lumen API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Today's emotion check endpoint
app.get('/emotions/today', authenticateToken, async (req, res) => {
  try {
    // Prevent caching for real-time data
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const clerkId = req.clerkId;
    
    // Get today's emotion entry
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const todayEntry = await EmotionEntry.findOne({
      clerkId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    // Get user data
    let user = await User.findOne({ clerkId });
    
    // Create user if doesn't exist
    if (!user) {
      user = new User({
        clerkId,
        email: `${clerkId}@example.com`
      });
      await user.save();
    }

    res.json({
      success: true,
      data: {
        hasLoggedToday: !!todayEntry,
        todayEntry,
        userData: {
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          weeklyData: user.weeklyData,
          currentEmotion: user.currentEmotion,
          hasPlayedGameToday: false
        }
      }
    });

  } catch (error) {
    console.error('Error checking today\'s emotion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check today\'s emotion'
    });
  }
});

// Create emotion entry endpoint
app.post('/emotions', authenticateToken, async (req, res) => {
  try {
    const { emotion, intensity, context, surveyResponses } = req.body;
    const clerkId = req.clerkId;

    // Validate input
    if (!emotion || !intensity) {
      return res.status(400).json({
        success: false,
        error: 'Emotion and intensity are required'
      });
    }

    // Get or create user
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({
        clerkId,
        email: `${clerkId}@example.com`
      });
    }

    // Check if user has already logged an emotion today
    if (user.hasLoggedToday()) {
      return res.status(400).json({
        success: false,
        error: 'You have already logged an emotion today',
        data: {
          currentEmotion: user.currentEmotion,
          lastEmotionDate: user.lastEmotionDate
        }
      });
    }

    // Create emotion entry
    const emotionEntry = new EmotionEntry({
      userId: user._id,
      clerkId,
      emotion,
      intensity: intensity || 5,
      context,
      surveyResponses
    });

    await emotionEntry.save();

    // Update user data
    const today = new Date();
    user.lastEmotionDate = today;
    user.currentEmotion = emotion;
    user.totalEmotionEntries += 1;
    
    // Update weekly data
    const dayOfWeek = today.getDay(); // 0 = Sunday
    user.weeklyData[dayOfWeek] = true;
    
    // Simple streak calculation
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayEntry = await EmotionEntry.findOne({
      clerkId,
      createdAt: {
        $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
        $lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1)
      }
    });
    
    if (yesterdayEntry) {
      user.currentStreak += 1;
    } else {
      user.currentStreak = 1;
    }
    
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
    
    // Update average mood (simple calculation)
    const recentEmotions = await EmotionEntry.find({ clerkId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    if (recentEmotions.length > 0) {
      const totalIntensity = recentEmotions.reduce((sum, entry) => sum + entry.intensity, 0);
      user.averageMood = Math.round(totalIntensity / recentEmotions.length);
    }
    
    await user.save();

    res.status(201).json({
      success: true,
      emotionEntry,
      userData: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        weeklyData: user.weeklyData,
        totalEmotionEntries: user.totalEmotionEntries,
        averageMood: user.averageMood
      },
      message: 'Emotion logged successfully'
    });

  } catch (error) {
    console.error('Error creating emotion entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create emotion entry'
    });
  }
});

// Get emotion entries endpoint
app.get('/emotions', authenticateToken, async (req, res) => {
  try {
    const clerkId = req.clerkId;
    const { page = 1, limit = 50 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [emotions, total] = await Promise.all([
      EmotionEntry.find({ clerkId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      EmotionEntry.countDocuments({ clerkId })
    ]);

    // Get user data
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({ clerkId, email: `${clerkId}@example.com` });
      await user.save();
    }

    const userData = {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      weeklyData: user.weeklyData,
      totalEmotionEntries: user.totalEmotionEntries,
      averageMood: user.averageMood,
      hasLoggedToday: user.hasLoggedToday()
    };

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        emotions,
        userData,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching emotion entries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch emotion entries'
    });
  }
});

// DELETE emotion entry (for testing purposes)
app.delete('/emotions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const clerkId = req.clerkId;

    const emotion = await EmotionEntry.findOneAndDelete({
      _id: id,
      clerkId
    });

    if (!emotion) {
      return res.status(404).json({
        success: false,
        error: 'Emotion entry not found'
      });
    }

    // Reset user's emotion status
    const user = await User.findOne({ clerkId });
    if (user) {
      user.currentEmotion = null;
      user.lastEmotionDate = null;
      user.totalEmotionEntries = Math.max(0, user.totalEmotionEntries - 1);
      user.weeklyData = [false, false, false, false, false, false, false];
      user.currentStreak = 0;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Emotion entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting emotion entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete emotion entry'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Lumen API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🎯 Today's emotion: http://localhost:${PORT}/emotions/today`);
      console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();