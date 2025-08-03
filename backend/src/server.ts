import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectDatabase } from './config/database.js';
import emotionsRouter from './routes/emotions.js';
import journalRouter from './routes/journal.js';
import analyticsRouter from './routes/analytics.js';
import clinicalAnalyticsRouter from './routes/clinical-analytics.js';
import usersRouter from './routes/users.js';
import gamesRouter from './routes/games.js';
import voiceChatRouter, { setupVoiceChatWebSocket } from './routes/voiceChat.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lumen API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/emotions', emotionsRouter);
app.use('/api/journal', journalRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/clinical-analytics', clinicalAnalyticsRouter);
app.use('/api/games', gamesRouter);
app.use('/api/voice-chat', voiceChatRouter);

// Serve static files
app.use('/test-frontend', express.static(path.join(__dirname, '../test-frontend')));

// Serve voice chat test page
app.get('/voice-chat-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/voice-chat-test.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    // Connect to database
    await connectDatabase();
    
    // Start listening with WebSocket support
    const server = app.listen(PORT, () => {
      console.log(`🚀 Lumen API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test interface: http://localhost:${PORT}/test-frontend/`);
      console.log(`🎙️ Voice chat WebSocket: ws://localhost:${PORT}/ws/voice-chat`);
      console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Setup WebSocket for voice chat
    setupVoiceChatWebSocket(server);
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

// Start the server
startServer(); 