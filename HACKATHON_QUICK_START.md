# Lumen Hackathon Quick Start

## 🚀 Quick Setup

### 1. Run the setup script
```bash
./setup-hackathon.sh
```

This will:
- Check Node version (recommends Node 20)
- Create backend `.env` file with hackathon mode enabled
- Install all dependencies
- Build the backend

### 2. Start the application
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5001 (Express API server)

## 🔧 What's Different for Hackathon

### Backend Configuration
- **Hackathon Mode**: `HACKATHON_MODE=true` - Simplified authentication
- **Mock Data**: Server runs without MongoDB connection
- **Simple Auth**: Accepts any token (1-50 characters) as user ID
- **Resilient**: Continues running even if database fails

### Authentication
- **Hackathon**: Use any string as token (e.g., "demo123")
- **Production**: Requires proper Clerk authentication

### API Endpoints
- **Health Check**: http://localhost:5001/health
- **API Health**: http://localhost:5001/api/health
- **All APIs**: http://localhost:5001/api/*

## 🧪 Testing

### Test with curl
```bash
# Health check
curl http://localhost:5001/health

# API health
curl http://localhost:5001/api/health

# Test emotions API with simple token
curl -H "Authorization: Bearer demo123" http://localhost:5001/api/emotions
```

### Test in browser
- Frontend: http://localhost:5173
- Backend health: http://localhost:5001/health

## 🔍 Troubleshooting

### Port conflicts
- Frontend uses port 5173 (Vite will auto-increment if busy)
- Backend uses port 5001
- Check if ports are available: `lsof -i :5173` or `lsof -i :5001`

### Node version issues
```bash
# Use Node 20
nvm use 20

# Or install Node 20
nvm install 20
```

### Backend not starting
- Check if `.env` file exists in `backend/` directory
- Ensure `HACKATHON_MODE=true` is set
- Check logs for specific errors

### Frontend can't connect to backend
- Verify backend is running on port 5001
- Check CORS settings in backend
- Ensure API_BASE_URL is set to `http://localhost:5001`

## 📊 Environment Variables

### Backend (.env)
```env
HACKATHON_MODE=true
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lumen-hackathon
CORS_ORIGIN=http://localhost:5173
```

### Frontend
- API_BASE_URL defaults to `http://localhost:5001`
- Can be overridden with `VITE_API_URL` environment variable

## 🎯 Development Workflow

1. **Start both servers**: `npm run dev`
2. **Frontend development**: Edit files in `src/`
3. **Backend development**: Edit files in `backend/src/`
4. **API testing**: Use health endpoints or curl
5. **Database**: Not required for hackathon (uses mock data)

## 🚀 Production Migration

When ready for production:

1. Set `HACKATHON_MODE=false` in backend `.env`
2. Configure proper MongoDB connection
3. Set up Clerk authentication
4. Update environment variables
5. Deploy both frontend and backend

## 📝 Notes

- **Mock Data**: Resets on server restart
- **Authentication**: Simple token validation in hackathon mode
- **Database**: Optional - server runs in degraded mode without it
- **CORS**: Configured for localhost development
- **Logging**: Detailed logs for debugging

## 🆘 Need Help?

1. Check the health endpoints
2. Review server logs
3. Verify environment configuration
4. Restart both servers if needed 