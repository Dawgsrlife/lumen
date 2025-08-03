# Lumen - AI-Powered Mental Health Platform

A comprehensive mental health application that combines emotion tracking, AI-powered insights, therapeutic games, and voice chat therapy.

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- MongoDB database
- Google Gemini AI API key
- Clerk authentication keys

### 1. Clone and Setup
```bash
git clone <repository-url>
cd lumen
cp env.example .env
```

### 2. Configure Environment
Edit `.env` file with your credentials:
```env
# Required: MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumen

# Required: Google AI API Key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Required: Clerk Authentication
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key

# Optional: Customize server settings
PORT=3000
NODE_ENV=development
```

### 3. Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
```

### 4. Start Development Server
```bash
# Option 1: Use the startup script
./start-unified.sh

# Option 2: Manual start
npm run dev
```

## 🏗️ Architecture

### Unified Development Server
Lumen uses a unified development setup where:
- **Frontend**: React + Vite (port 5173)
- **Backend**: Express + TypeScript (port 3000)
- **Proxy**: Unified server proxies frontend requests to Vite dev server
- **API**: All API routes served from the unified server

### Key Features
- **Emotion Tracking**: Log and analyze emotional states
- **AI Insights**: Gemini-powered analysis and recommendations
- **Therapeutic Games**: Evidence-based interventions
- **Voice Chat**: AI-powered therapeutic conversations
- **Journaling**: Secure personal reflection space
- **Analytics**: Comprehensive mental health insights

## 📁 Project Structure

```
lumen/
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── types/            # TypeScript definitions
├── backend/              # Backend API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   └── middleware/   # Express middleware
│   └── tests/            # Backend tests
├── server.js             # Unified development server
├── vite.config.ts        # Vite configuration
└── package.json          # Root dependencies
```

## 🔧 Development

### Available Scripts
```bash
npm run dev              # Start unified development server
npm run dev:vite         # Start Vite dev server only
npm run dev:server       # Start backend server only
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Development Workflow
1. **Unified Server**: Handles API routes and proxies frontend requests
2. **Vite Dev Server**: Provides hot reload for frontend development
3. **Database**: MongoDB for data persistence
4. **AI Integration**: Google Gemini for intelligent insights

### API Endpoints
- `GET /health` - Server health check
- `POST /api/emotions` - Create emotion entry
- `GET /api/emotions` - Get user emotions
- `POST /api/journal` - Create journal entry
- `GET /api/analytics` - Get user analytics
- `POST /api/games` - Start game session
- `POST /api/voice-chat/start` - Start voice chat session

## 🧪 Testing

### Run All Tests
```bash
npm run test
```

### Individual Test Suites
```bash
# Backend tests
cd backend && npm run test

# Frontend tests (when implemented)
npm run test:frontend
```

## 🚀 Production Deployment

### Build and Start
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all required environment variables are set for production:
- `NODE_ENV=production`
- `MONGODB_URI`
- `GOOGLE_AI_API_KEY`
- `CLERK_SECRET_KEY`
- `JWT_SECRET`

## 🔒 Security Features

- **Authentication**: Clerk-based user management
- **Rate Limiting**: API request throttling
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Input Validation**: Request sanitization
- **Database Security**: MongoDB connection security

## 🎯 Key Technologies

### Frontend
- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe backend
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM

### AI & External Services
- **Google Gemini**: AI-powered insights
- **Clerk**: Authentication and user management
- **WebSocket**: Real-time voice chat

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Lumen** - Illuminating mental health through AI-powered care.
