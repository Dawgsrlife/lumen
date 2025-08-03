# Hackathon Backend Configuration Guide

## Overview

This backend has been configured specifically for hackathon environments with the following key principles:

- **Resilience**: Don't fail fast - continue in degraded mode with mock data
- **Simplicity**: Simplified authentication and validation for rapid development
- **Flexibility**: Easy switching between hackathon and production modes
- **Debugging**: Clear logging and health check endpoints

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure for your hackathon:

```bash
cp env.example .env
```

For hackathon mode, set:
```env
HACKATHON_MODE=true
MONGODB_URI=mongodb://localhost:27017/lumen-hackathon
```

### 2. Start the Server

```bash
npm install
npm start
```

The server will start in hackathon mode if `HACKATHON_MODE=true` or if no `MONGODB_URI` is provided.

## Configuration Decisions

### Database Configuration

**Strategy**: Start in degraded mode with mock data
- Server continues running even if MongoDB is unavailable
- Clear logging of database connection status
- Mock data service provides fallback functionality

**Fallback Database**: Configurable localhost fallback
```env
MONGODB_URI=mongodb://localhost:27017/lumen-hackathon
```

**Health Check**: Database status endpoint
- `GET /health` - General health check
- `GET /api/health` - API-specific health check with database status

### Authentication Strategy

**Hackathon Mode**: Unified hackathon auth service
- Environment variable: `HACKATHON_MODE=true`
- Accepts any non-empty string (1-50 characters) as user ID
- Consistent mock user creation across requests
- No complex JWT validation needed

**Token Validation**: Simple format validation
- Token must be 1-50 characters
- Same token = same mock user (predictable behavior)
- Clear error messages for debugging

**Error Format**: Standardized across all endpoints
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Model Optimizations

**Index Strategy**: Removed duplicate indexes
- Eliminated `index: true` from field definitions
- Kept only explicit `schema.index()` calls
- Removed 30-day partial indexes for simplicity

**ID Transformation**: Standardized on `id` throughout
- All models transform `_id` to `id` in JSON responses
- Consistent API responses across all endpoints

**Validation**: Basic validation only
- Required fields validation
- Simple format checks
- Flexible for hackathon development

### Model-Specific Changes

#### User Model
- **Last Login**: Updates only on explicit set (not every save)
- **Email Validation**: Basic regex validation (contains @ and .)
- **Privacy Level**: Kept 'friends' level for demo scenarios

#### JournalEntry Model
- **Content Validation**: Minimum 10 characters
- **Metadata**: Flexible structure for hackathon needs
- **Voice Chat**: Kept in metadata for simplicity

#### GameSession Model
- **Placeholder Games**: Kept for development/testing
- **Duration**: Removed unnecessary `durationMinutes` virtual
- **Game Types**: Current list sufficient for hackathon

#### Notification Model
- **Consistency**: Added `clerkId` field to match other models
- **ID Transformation**: Added `_id` to `id` transformation
- **Types**: Added "general" type for flexibility
- **User Reference**: Added proper User model reference

## API Endpoints

### Health Checks
- `GET /health` - General server health
- `GET /api/health` - API health with database status

### Authentication
- Uses `hackathonAuth` middleware in hackathon mode
- Uses `authenticateToken` middleware in production mode
- Consistent error format across all endpoints

### Emotions API
- `POST /api/emotions` - Create emotion entry
- `GET /api/emotions` - Get user's emotion entries
- `GET /api/emotions/daily` - Get daily emotion summaries
- `GET /api/emotions/:id` - Get specific emotion entry
- `PUT /api/emotions/:id` - Update emotion entry
- `DELETE /api/emotions/:id` - Delete emotion entry

**Optional Journal Association**:
```bash
POST /api/emotions?associateJournal=true
```

## Services

### Clerk Service
- **Token Verification**: Simplified for hackathon development
- **User Sync**: Basic database sync implementation
- **Error Strategy**: Continues with degraded functionality
- **Email Strategy**: Uses first email address as primary

### AI Service
- **Fallback Strategy**: Hardcoded fallbacks for demo reliability
- **Prompt Management**: Prompts in code for version control
- **Error Strategy**: Always provides fallbacks

### MockData Service
- **Persistence**: In-memory (no file persistence)
- **Data Validation**: Basic validation only
- **ID Strategy**: Timestamp + random approach
- **Analytics**: Basic analytics methods

## Development Workflow

### 1. Local Development
```bash
# Start with hackathon mode
HACKATHON_MODE=true npm start

# Or start with local MongoDB
npm run dev
```

### 2. Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:api
npm run test:auth
npm run test:models
```

### 3. Database Management
```bash
# Check database status
curl http://localhost:5001/api/health

# Reset mock data (restart server)
HACKATHON_MODE=true npm start
```

## Production Considerations

When moving to production:

1. **Set `HACKATHON_MODE=false`**
2. **Configure proper MongoDB connection**
3. **Set up Clerk authentication properly**
4. **Implement proper JWT verification**
5. **Add comprehensive validation**
6. **Set up proper logging and monitoring**

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running locally
   - Verify connection string in `.env`
   - Server will continue in degraded mode

2. **Authentication Errors**
   - Ensure token is 1-50 characters in hackathon mode
   - Check `HACKATHON_MODE` environment variable
   - Verify Clerk configuration for production

3. **Mock Data Issues**
   - Restart server to reset mock data
   - Check mock data service implementation
   - Verify hackathon mode is enabled

### Debug Endpoints

- `GET /health` - Server status
- `GET /api/health` - API and database status
- Check server logs for detailed error messages

## Environment Variables

| Variable | Description | Default | Hackathon |
|----------|-------------|---------|-----------|
| `HACKATHON_MODE` | Enable hackathon mode | `false` | `true` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/lumen-hackathon` | Local or Atlas |
| `CLERK_SECRET_KEY` | Clerk secret key | Required | Optional |
| `PORT` | Server port | `5001` | `5001` |
| `NODE_ENV` | Environment | `development` | `development` |

## Support

For hackathon support:
1. Check the health endpoints for system status
2. Review server logs for detailed error messages
3. Verify environment configuration
4. Restart server to reset mock data if needed 