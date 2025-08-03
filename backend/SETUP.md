# Lumen Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumen?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Clerk Configuration (for production)
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key

# Google AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### 3. Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🧪 Testing

### Option 1: Use the Test Frontend
1. Open `test-frontend/index.html` in your browser
2. Click "Register User" to create a test user
3. Test all the features through the UI

### Option 2: Use the Test Script
```bash
node test.js
```

### Option 3: Use Postman
Import these endpoints into Postman:

#### Health Check
- **GET** `http://localhost:5000/health`

#### Authentication
- **POST** `http://localhost:5000/api/users/register`
  ```json
  {
    "clerkToken": "test-token",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```

- **POST** `http://localhost:5000/api/users/login`
  ```json
  {
    "clerkToken": "test-token"
  }
  ```

- **GET** `http://localhost:5000/api/users/profile`
  - Headers: `Authorization: Bearer <jwt-token>`

#### Emotions
- **POST** `http://localhost:5000/api/emotions`
  ```json
  {
    "emotion": "happy",
    "intensity": 7,
    "context": "Feeling great today!"
  }
  ```

- **GET** `http://localhost:5000/api/emotions`
- **GET** `http://localhost:5000/api/emotions/daily?days=7`

#### Journal
- **POST** `http://localhost:5000/api/journal`
  ```json
  {
    "content": "Today was a good day...",
    "mood": "happy",
    "tags": ["work", "family"],
    "isPrivate": true
  }
  ```

- **GET** `http://localhost:5000/api/journal`
- **GET** `http://localhost:5000/api/journal/search?q=good`

#### Analytics
- **GET** `http://localhost:5000/api/analytics/overview?days=30`
- **POST** `http://localhost:5000/api/analytics/insights`
  ```json
  {
    "timeframe": "week",
    "focus": "all"
  }
  ```

## 📊 Data Storage

The backend stores data in MongoDB Atlas with the following collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  clerkId: String,        // Clerk user ID
  email: String,
  firstName: String,
  lastName: String,
  avatar: String,
  preferences: {
    theme: String,         // 'light' | 'dark' | 'system'
    notifications: Boolean,
    privacyLevel: String,  // 'public' | 'private' | 'friends'
    language: String
  },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Emotion Entries Collection
```javascript
{
  _id: ObjectId,
  userId: String,         // User's MongoDB ID
  clerkId: String,        // Clerk user ID
  emotion: String,        // 'happy' | 'sad' | 'anxiety' | etc.
  intensity: Number,      // 1-10 scale
  context: String,        // Optional context
  surveyResponses: Array, // Optional survey responses
  aiFeedback: Object,     // AI-generated insights
  createdAt: Date,
  updatedAt: Date
}
```

### Journal Entries Collection
```javascript
{
  _id: ObjectId,
  userId: String,         // User's MongoDB ID
  clerkId: String,        // Clerk user ID
  emotionEntryId: String, // Optional link to emotion entry
  content: String,        // Journal text
  mood: String,          // Emotion type
  tags: Array,           // Array of tags
  isPrivate: Boolean,    // Privacy setting
  createdAt: Date,
  updatedAt: Date
}
```

### Game Sessions Collection
```javascript
{
  _id: ObjectId,
  userId: String,         // User's MongoDB ID
  clerkId: String,        // Clerk user ID
  gameId: String,         // Game identifier
  score: Number,          // Game score
  duration: Number,       // Duration in seconds
  completed: Boolean,     // Whether game was completed
  achievements: Array,    // Array of achievements
  startedAt: Date,
  completedAt: Date,      // Optional
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### File Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts          # Authentication middleware
│   ├── models/
│   │   ├── User.ts          # User model
│   │   ├── EmotionEntry.ts  # Emotion model
│   │   ├── JournalEntry.ts  # Journal model
│   │   └── GameSession.ts   # Game session model
│   ├── routes/
│   │   ├── users.ts         # User routes
│   │   ├── emotions.ts      # Emotion routes
│   │   ├── journal.ts       # Journal routes
│   │   └── analytics.ts     # Analytics routes
│   ├── services/
│   │   └── ai.ts            # AI service
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── server.ts            # Main server file
├── test-frontend/
│   └── index.html           # Test UI
├── test.js                  # Test script
├── package.json
├── tsconfig.json
└── .env                     # Environment variables
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your `MONGODB_URI` in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username/password are correct

2. **JWT Token Issues**
   - Make sure `JWT_SECRET` is set and is a long, random string
   - Check that the token is being sent in Authorization header

3. **CORS Errors**
   - Verify `CORS_ORIGIN` matches your frontend URL
   - For development, you can set it to `*` temporarily

4. **AI Service Not Working**
   - Check that `GOOGLE_AI_API_KEY` is valid
   - The API will still work without AI features

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages and logs.

### Logs
The server logs all requests and errors. Check the console for debugging information.

## 📝 API Response Format

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]  // Validation errors
}
```

## 🔒 Security Notes

- JWT tokens are stored in localStorage (for testing only)
- In production, use secure HTTP-only cookies
- Rate limiting is enabled (100 requests per 15 minutes)
- Input validation is enforced on all endpoints
- CORS is configured for security

## 🎯 Next Steps

1. Test the API using the provided tools
2. Set up your MongoDB Atlas cluster
3. Configure your environment variables
4. Start the server and verify it's working
5. Use the test frontend to explore all features
6. Integrate with your actual frontend when ready 