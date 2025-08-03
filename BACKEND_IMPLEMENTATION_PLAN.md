# Lumen Backend Implementation Plan

## 🎯 Overview

This document outlines the complete backend implementation for the Lumen mental health app, including the API structure, database design, and frontend integration steps.

## 📋 What We've Built

### ✅ Backend Structure (Complete)
- **Express.js API** with TypeScript
- **MongoDB Atlas** integration with Mongoose ODM
- **Clerk Authentication** integration
- **Google Gemini AI** integration for insights
- **Comprehensive API endpoints** for all features
- **Security middleware** (rate limiting, CORS, helmet)
- **Input validation** and error handling

### ✅ Database Models (Complete)
- **User Model**: Clerk integration with preferences
- **EmotionEntry Model**: Daily emotion tracking with AI feedback
- **JournalEntry Model**: Rich journaling with sentiment analysis
- **GameSession Model**: Unity game session tracking

### ✅ API Endpoints (Complete)
- **Authentication**: `/api/users/*` (register, login, profile)
- **Emotions**: `/api/emotions/*` (CRUD operations)
- **Journal**: `/api/journal/*` (CRUD + search)
- **Analytics**: `/api/analytics/*` (overview, insights, trends)
- **Health Check**: `/health`

### ✅ Frontend Integration (Complete)
- **Updated API service** with authentication
- **Token management** and automatic auth headers
- **Error handling** and redirects
- **Type-safe API calls** with TypeScript

## 🚀 Next Steps: Frontend Integration

### Phase 1: Environment Setup

1. **Set up environment variables:**
   ```bash
   # In your frontend .env file
   VITE_API_URL=http://localhost:5000
   VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up MongoDB Atlas:**
   - Create a cluster
   - Get connection string
   - Add to backend `.env`

4. **Set up Clerk:**
   - Create Clerk application
   - Get API keys
   - Add to backend `.env`

5. **Set up Google AI:**
   - Get Gemini API key
   - Add to backend `.env`

### Phase 2: Backend Setup

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the API:**
   ```bash
   curl http://localhost:5000/health
   ```

### Phase 3: Frontend Integration

#### Step 1: Authentication Flow

Update your Clerk integration to work with the backend:

```typescript
// In your auth component
import { apiService } from '../services/api';

const handleClerkAuth = async (clerkToken: string) => {
  try {
    // Try to login first
    const { user, token } = await apiService.loginWithClerk(clerkToken);
    apiService.setToken(token);
    // Navigate to dashboard
  } catch (error) {
    // If user doesn't exist, register them
    const { user, token } = await apiService.registerWithClerk(clerkToken, {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0]?.emailAddress,
      avatar: user?.imageUrl
    });
    apiService.setToken(token);
    // Navigate to dashboard
  }
};
```

#### Step 2: Emotion Integration

Update your emotion selection to save to the backend:

```typescript
// In your Dashboard component
import { apiService } from '../services/api';

const handleMoodSelect = async (emotion: EmotionType) => {
  try {
    const emotionEntry = await apiService.createEmotionEntry({
      emotion,
      intensity: 5, // You can add intensity selection
      context: 'Selected from dashboard'
    });
    
    setSelectedMood(emotion);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  } catch (error) {
    console.error('Failed to log emotion:', error);
  }
};
```

#### Step 3: Journal Integration

Create a journal entry component:

```typescript
// New component: src/components/journal/JournalEntryForm.tsx
import { apiService } from '../../services/api';

const JournalEntryForm = ({ emotionEntryId }: { emotionEntryId?: string }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<EmotionType>('happy');

  const handleSubmit = async () => {
    try {
      const result = await apiService.createJournalEntry({
        content,
        mood,
        tags: [],
        isPrivate: true,
        emotionEntryId
      });
      
      // Handle success - show AI insights if available
      if (result.analysis) {
        // Display AI analysis
      }
    } catch (error) {
      console.error('Failed to create journal entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your journal form UI */}
    </form>
  );
};
```

#### Step 4: Analytics Integration

Update your analytics page to use real data:

```typescript
// In your Analytics component
import { apiService } from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [insights, setInsights] = useState<AIInsightResponse | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [analyticsData, insightsData] = await Promise.all([
          apiService.getAnalyticsOverview(30),
          apiService.generateAIInsights('week', 'all')
        ]);
        
        setAnalytics(analyticsData);
        setInsights(insightsData);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };

    loadAnalytics();
  }, []);

  // Render your analytics UI with real data
};
```

### Phase 4: Welcome Screen Implementation

Create a welcome screen that shows for 2 seconds:

```typescript
// New component: src/components/WelcomeScreen.tsx
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-50"
      >
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Welcome to Lumen</h1>
          <p className="text-xl">Your mental health journey starts here</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
```

### Phase 5: Game Integration

Update your Unity game component to track sessions:

```typescript
// In your UnityGame component
import { apiService } from '../services/api';

const UnityGame = ({ gameId }: { gameId: string }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleGameStart = async () => {
    try {
      // Start tracking game session
      const session = await apiService.createGameSession({
        gameId,
        score: 0,
        duration: 0,
        completed: false
      });
      setSessionId(session.id);
    } catch (error) {
      console.error('Failed to start game session:', error);
    }
  };

  const handleGameEnd = async (score: number, duration: number) => {
    if (sessionId) {
      try {
        await apiService.updateGameSession(sessionId, {
          score,
          duration,
          completed: true
        });
      } catch (error) {
        console.error('Failed to end game session:', error);
      }
    }
  };

  // Your Unity game integration
};
```

## 🔧 Development Workflow

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:5000/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/users/profile
```

### 3. Monitor Logs
- Backend logs will show API requests
- Frontend console will show API calls
- Check MongoDB Atlas for data

## 🧪 Testing Strategy

### Backend Testing
1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test API endpoints
3. **Database Tests**: Test MongoDB operations
4. **Authentication Tests**: Test Clerk integration

### Frontend Testing
1. **Component Tests**: Test UI components
2. **API Integration Tests**: Test API service
3. **E2E Tests**: Test complete user flows

## 🚀 Deployment

### Backend Deployment
1. **Build the backend:**
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to your preferred platform:**
   - Vercel
   - Railway
   - Heroku
   - DigitalOcean

3. **Set production environment variables**

### Frontend Deployment
1. **Update API URL** to production backend
2. **Deploy to Vercel/Netlify**

## 📊 Monitoring & Analytics

### Backend Monitoring
- Request logging with Morgan
- Error tracking
- Performance monitoring
- Database query optimization

### Frontend Monitoring
- User interaction tracking
- Error boundary implementation
- Performance monitoring
- Analytics integration

## 🔒 Security Considerations

### Backend Security
- ✅ Rate limiting implemented
- ✅ CORS configured
- ✅ Input validation
- ✅ JWT token security
- ✅ MongoDB injection protection

### Frontend Security
- ✅ Secure token storage
- ✅ HTTPS enforcement
- ✅ XSS protection
- ✅ CSRF protection

## 🎯 Success Metrics

### Technical Metrics
- API response time < 200ms
- 99.9% uptime
- Zero security vulnerabilities
- < 1% error rate

### User Metrics
- Daily active users
- Emotion tracking frequency
- Journal entry completion rate
- User retention rate

## 📞 Support & Maintenance

### Development Support
- Backend API documentation
- Frontend component library
- TypeScript type definitions
- Error handling patterns

### Production Support
- Monitoring and alerting
- Backup and recovery
- Performance optimization
- Security updates

## 🎉 Next Steps

1. **Set up your environment variables**
2. **Start the backend server**
3. **Integrate authentication flow**
4. **Test emotion logging**
5. **Add journal functionality**
6. **Implement analytics dashboard**
7. **Add game session tracking**
8. **Deploy to production**

The backend is now complete and ready for integration! Let me know if you need help with any specific step or have questions about the implementation. 