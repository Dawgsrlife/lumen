import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;

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

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Other middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lumen API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working',
    data: {
      timestamp: new Date().toISOString(),
      port: PORT
    }
  });
});

app.post('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'POST test endpoint working',
    data: {
      received: req.body,
      timestamp: new Date().toISOString()
    }
  });
});

// Mock API endpoints to test frontend integration
app.post('/api/users/register', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: '1', email: 'test@example.com', ...req.body },
      token: 'mock-jwt-token'
    },
    message: 'User registered successfully (mock)'
  });
});

app.post('/api/users/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: '1', email: 'test@example.com' },
      token: 'mock-jwt-token'
    },
    message: 'User logged in successfully (mock)'
  });
});

app.get('/api/users/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    }
  });
});

app.post('/emotions', (req, res) => {
  res.json({
    success: true,
    emotionEntry: {
      id: '1',
      emotion: req.body.emotion,
      intensity: req.body.intensity || 5,
      context: req.body.context,
      createdAt: new Date().toISOString(),
      ...req.body
    },
    userData: {
      currentStreak: 1,
      longestStreak: 1,
      weeklyData: [true, false, false, false, false, false, false],
      totalEmotionEntries: 1,
      averageMood: req.body.intensity || 5
    },
    message: 'Emotion logged successfully (mock)'
  });
});

app.get('/emotions', (req, res) => {
  res.json({
    success: true,
    data: {
      emotions: [],
      userData: {
        currentStreak: 0,
        longestStreak: 0,
        weeklyData: [false, false, false, false, false, false, false],
        totalEmotionEntries: 0,
        averageMood: 5,
        hasLoggedToday: false
      },
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    }
  });
});

app.get('/emotions/today', (req, res) => {
  res.json({
    success: true,
    data: {
      hasLoggedToday: false,
      todayEntry: null,
      userData: {
        currentStreak: 0,
        longestStreak: 0,
        weeklyData: [false, false, false, false, false, false, false],
        currentEmotion: null,
        hasPlayedGameToday: false
      }
    }
  });
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
app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
}); 