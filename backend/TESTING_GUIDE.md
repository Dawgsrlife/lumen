# 🧠 Lumen Backend Testing Guide

This guide will help you test all the backend functionalities using the comprehensive test interface.

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:5001`

### 2. Open the Test Interface

Open `backend/test-frontend/index.html` in your browser, or serve it with a simple HTTP server:

```bash
cd backend/test-frontend
python -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000`

## 🔗 Connection Status

The test interface will automatically check the API health. You should see:
- ✅ **API Health**: Connected
- ✅ **Authentication**: Authenticated as test_user_123

## 📋 Testing Overview

The test interface is organized into 5 main tabs:

### 1. 😊 Emotions Tab
**Purpose**: Test emotion tracking functionality

**Key Features**:
- Create emotion entries with 9 different emotions
- Set intensity levels (1-10)
- Add optional context
- View emotion history and daily summaries

**Quick Test**:
1. Click "Happy (8)" quick button
2. Check the response shows success
3. Click "Get Entries" to see the created entry

**API Endpoints Tested**:
- `POST /api/emotions` - Create emotion entry
- `GET /api/emotions` - Get emotion entries
- `GET /api/emotions/daily` - Get daily summaries

### 2. 📝 Journal Tab
**Purpose**: Test journal entry functionality

**Key Features**:
- Create journal entries with mood association
- Add tags and privacy settings
- Search through entries
- View journal history

**Quick Test**:
1. Click "Happy Entry" quick button
2. Check the response shows success with AI analysis
3. Click "Get Entries" to see the created entry

**API Endpoints Tested**:
- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get journal entries
- `GET /api/journal/search` - Search entries

### 3. 📊 Analytics Tab
**Purpose**: Test analytics and insights functionality

**Key Features**:
- View analytics overview
- Check emotion statistics
- Analyze mood trends
- Get user engagement metrics

**Quick Test**:
1. Create a few emotion and journal entries first
2. Click "Overview" to see analytics
3. Check "Emotion Stats" for detailed breakdown

**API Endpoints Tested**:
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/emotions` - Get emotion analytics
- `GET /api/analytics/trends` - Get mood trends

### 4. 🤖 AI Insights Tab
**Purpose**: Test AI-powered insights functionality

**Key Features**:
- Generate AI insights for different timeframes
- Configure Google AI API key
- Test AI connection
- Get personalized recommendations

**Quick Test**:
1. Set your Google AI API key (optional)
2. Click "Week Insights" to generate AI analysis
3. Check the response for insights and recommendations

**API Endpoints Tested**:
- `POST /api/analytics/insights` - Generate AI insights

### 5. 🎮 Games Tab
**Purpose**: Test game session tracking

**Key Features**:
- Create game sessions for different activities
- Track duration and optional scores
- Add notes about the session
- View game session history

**Quick Test**:
1. Click "Mindfulness (15min)" quick button
2. Check the response shows success
3. Click "Get Sessions" to see the created session

**API Endpoints Tested**:
- `POST /api/games` - Create game session
- `GET /api/games` - Get game sessions
- `GET /api/games/stats` - Get game statistics

## 🔧 Configuration

### Google AI API Key (Optional)

To test AI insights functionality:

1. Get a Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. In the AI tab, enter your API key
3. Click "Set API Key"
4. Test the connection with "Test AI"

Without an API key, AI features will return fallback responses.

### Test User ID

The default test user ID is `test_user_123`. You can change this in the Authentication section to test with different users.

## 📊 Expected Data Flow

### 1. Basic Workflow
```
User creates emotion entry → User writes journal → AI analyzes → Analytics updated
```

### 2. Game Session Workflow
```
User plays game → Session recorded → Analytics include game data → AI considers game activity
```

### 3. Analytics Workflow
```
Data collected → Analytics calculated → AI insights generated → Recommendations provided
```

## 🧪 Testing Scenarios

### Scenario 1: New User Journey
1. Set a new test user ID
2. Create 3-4 emotion entries over different days
3. Write 2-3 journal entries
4. Play 1-2 game sessions
5. Generate AI insights
6. Check analytics overview

### Scenario 2: Emotion Tracking
1. Create entries for all 9 emotions
2. Test different intensity levels
3. Add context to some entries
4. View daily summaries
5. Check emotion analytics

### Scenario 3: Journal Analysis
1. Write entries with different moods
2. Add various tags
3. Test search functionality
4. Check AI analysis responses
5. View journal trends

### Scenario 4: Game Integration
1. Create sessions for all game types
2. Test with and without scores
3. Add notes to sessions
4. Check game statistics
5. Verify analytics include game data

## 🔍 Troubleshooting

### Common Issues

**API Connection Failed**:
- Ensure backend server is running on port 5001
- Check CORS settings in server.ts
- Verify network connectivity

**Authentication Errors**:
- Check that the test user ID is set
- Verify the auth middleware is working
- Look for JWT token issues

**Database Errors**:
- Ensure MongoDB is running
- Check database connection string
- Verify environment variables

**AI Features Not Working**:
- Check if Google AI API key is set
- Verify API key is valid
- Check network connectivity to Google AI

### Debug Mode

To enable debug logging, set the environment variable:
```bash
NODE_ENV=development
```

This will show detailed error messages and stack traces.

## 📈 Performance Testing

### Load Testing
Use tools like Apache Bench or Artillery to test API performance:

```bash
# Test emotion creation
ab -n 100 -c 10 -H "Authorization: Bearer test_user_123" \
   -H "Content-Type: application/json" \
   -p emotion_data.json \
   http://localhost:5001/api/emotions

# Test analytics retrieval
ab -n 50 -c 5 -H "Authorization: Bearer test_user_123" \
   http://localhost:5001/api/analytics/overview
```

### Memory Testing
Monitor memory usage during extended testing sessions to ensure no memory leaks.

## 🎯 Success Criteria

A successful test should demonstrate:

1. ✅ All API endpoints respond correctly
2. ✅ Data is properly stored and retrieved
3. ✅ Analytics calculations are accurate
4. ✅ AI insights are generated (with valid API key)
5. ✅ Error handling works properly
6. ✅ Authentication and authorization work
7. ✅ Data relationships are maintained
8. ✅ Performance is acceptable

## 📝 Test Data Cleanup

To clean up test data, you can:

1. Delete specific entries using the DELETE endpoints
2. Use different test user IDs for different test sessions
3. Clear the database entirely (use with caution)

## 🔄 Continuous Testing

For ongoing development:

1. Run the test interface regularly
2. Test new features as they're added
3. Verify existing functionality still works
4. Monitor API response times
5. Check error rates and logs

---

**Happy Testing! 🧠✨** 