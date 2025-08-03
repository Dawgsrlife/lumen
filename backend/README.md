# Lumen Backend API

A comprehensive backend API for the Lumen mental health app, built with Express.js, TypeScript, MongoDB, and integrated with Clerk authentication and Google's Gemini AI.

## 🚀 Features

- **User Management**: Clerk authentication integration with JWT tokens
- **Emotion Tracking**: Daily emotion logging with intensity and context
- **Journal Entries**: Rich journaling with AI-powered sentiment analysis
- **Game Sessions**: Track Unity game sessions and achievements
- **AI Insights**: Gemini AI-powered mental health insights and recommendations
- **Analytics**: Comprehensive user analytics and mood trends
- **Security**: Rate limiting, CORS, helmet, and input validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Clerk account for authentication
- Google AI API key for Gemini

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumen?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Clerk Configuration
   CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
   CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
   
   # Google AI Configuration
   GOOGLE_AI_API_KEY=your-google-ai-api-key
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication & Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `DELETE /api/users/profile` - Delete user account

### Emotions

- `POST /api/emotions` - Log emotion entry
- `GET /api/emotions` - Get emotion entries (with filtering)
- `GET /api/emotions/daily` - Get emotions grouped by day
- `GET /api/emotions/:id` - Get specific emotion entry
- `PUT /api/emotions/:id` - Update emotion entry
- `DELETE /api/emotions/:id` - Delete emotion entry

### Journal

- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get journal entries (with filtering)
- `GET /api/journal/daily` - Get journals grouped by day
- `GET /api/journal/search` - Search journal entries
- `GET /api/journal/:id` - Get specific journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Analytics

- `GET /api/analytics/overview` - Get user analytics overview
- `POST /api/analytics/insights` - Generate AI insights
- `GET /api/analytics/emotions` - Get emotion-specific analytics
- `GET /api/analytics/trends` - Get mood trends over time

### Health Check

- `GET /health` - API health check

## 🔐 Authentication

The API uses Clerk for authentication with JWT tokens:

1. **Frontend Flow:**
   - User authenticates with Clerk
   - Frontend gets Clerk session token
   - Frontend calls backend with Clerk token
   - Backend validates Clerk token and creates/updates user
   - Backend returns JWT token for API calls

2. **API Calls:**
   - Include JWT token in Authorization header: `Bearer <token>`
   - Most endpoints require authentication
   - Some endpoints support optional authentication

## 🗄️ Database Schema

### Users
- `clerkId` (unique identifier from Clerk)
- `email`, `firstName`, `lastName`, `avatar`
- `preferences` (theme, notifications, privacy, language)
- `lastLoginAt`, `createdAt`, `updatedAt`

### Emotion Entries
- `userId`, `clerkId`
- `emotion` (happy, sad, loneliness, etc.)
- `intensity` (1-10 scale)
- `context`, `surveyResponses`
- `aiFeedback` (AI-generated insights)
- `createdAt`, `updatedAt`

### Journal Entries
- `userId`, `clerkId`
- `content` (journal text)
- `mood` (emotion type)
- `tags`, `isPrivate`
- `emotionEntryId` (optional link to emotion)
- `createdAt`, `updatedAt`

### Game Sessions
- `userId`, `clerkId`
- `gameId`, `score`, `duration`
- `completed`, `achievements`
- `startedAt`, `completedAt`

## 🤖 AI Integration

The API integrates with Google's Gemini AI for:

- **Journal Analysis**: Sentiment analysis and key themes
- **Personalized Insights**: Mood trends and patterns
- **Recommendations**: Coping strategies and self-care tips
- **Mental Health Resources**: Professional help suggestions

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Express-validator for all inputs
- **JWT Tokens**: Secure authentication
- **MongoDB Injection Protection**: Mongoose ODM

## 🧪 Development

### Scripts
```bash
npm run dev      # Start development server with nodemon
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests (when implemented)
```

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `CLERK_SECRET_KEY`: Clerk secret key
- `GOOGLE_AI_API_KEY`: Google AI API key

## 📊 Monitoring

The API includes:
- Request logging with Morgan
- Error tracking and logging
- Health check endpoint
- Graceful shutdown handling

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the server:**
   ```bash
   npm start
   ```

## 📝 API Response Format

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "error": "Error message if success: false"
}
```

## 🔗 Frontend Integration

The frontend should:
1. Authenticate users with Clerk
2. Call `/api/users/register` or `/api/users/login` with Clerk token
3. Store the returned JWT token
4. Include JWT token in Authorization header for all API calls
5. Handle API responses and errors appropriately

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas is accessible
4. Verify Clerk and Google AI API keys are valid 