# 🧪 Lumen Backend Test Suite

Comprehensive testing suite for the Lumen mental health AI backend, covering all functionality from basic API endpoints to complex AI integration workflows.

## 🚀 Quick Start

### Run All Tests
```bash
npm test
```

### Run Individual Test Suites
```bash
# API endpoints and validation
npm run test:api

# AI service and Gemini integration  
npm run test:ai

# Database models and data integrity
npm run test:db

# Complete workflows and integration
npm run test:integration

# Get help and test information
npm run test:help
```

## 📋 Test Suites Overview

### 1. API Tests (`api-tests.js`)
**Tests all REST API endpoints and functionality**

- ✅ Health and connectivity endpoints
- ✅ Emotion entry CRUD operations
- ✅ Journal entry creation and retrieval  
- ✅ Game session management
- ✅ Analytics and insights generation
- ✅ Clinical analytics endpoints
- ✅ User profile management
- ✅ Input validation and error handling
- ✅ Authentication and authorization
- ✅ Data linking and relationships

**Key Features Tested:**
- Request/response validation
- Error handling and status codes
- Data consistency across endpoints
- Authentication token handling
- Automatic emotion-journal linking

### 2. AI Service Tests (`ai-service-tests.js`)
**Tests Gemini AI integration and clinical analysis**

- ✅ AI service initialization
- ✅ Journal entry analysis with clinical insights
- ✅ Depression indicator detection (PHQ-9 based)
- ✅ Anxiety assessment (GAD-7 based) 
- ✅ Risk assessment and safety protocols
- ✅ Evidence-based intervention recommendations
- ✅ Audio analysis structure validation
- ✅ Error handling without API keys
- ✅ Performance and response time testing
- ✅ Clinical framework validation

**Clinical Features Tested:**
- CBT, DBT, MBSR technique recommendations
- Research citation inclusion
- Risk stratification (low/medium/high)
- Intensity adjustment algorithms
- Evidence-based content validation

### 3. Database Tests (`database-tests.js`)
**Tests MongoDB models, validation, and data integrity**

- ✅ Model creation and validation
- ✅ Schema constraint enforcement
- ✅ Default value assignment
- ✅ Relationship and reference handling
- ✅ Index performance validation
- ✅ Date filtering and queries
- ✅ Data aggregation operations
- ✅ Concurrent operation handling
- ✅ Edge case and limit testing
- ✅ Model method functionality

**Data Integrity Features:**
- Unique constraint enforcement
- Field validation and limits
- Automatic timestamp generation
- Reference integrity checking
- Aggregation query validation

### 4. Integration Tests (`integration-tests.js`)
**Tests complete workflows and user journeys**

- ✅ End-to-end emotion-journal workflows
- ✅ Multi-modal data integration
- ✅ Analytics pipeline integration
- ✅ Clinical assessment workflows
- ✅ User journey progression tracking
- ✅ Error handling and recovery
- ✅ Performance under concurrent load
- ✅ Data consistency across systems
- ✅ Real-world usage simulation

**Workflow Features Tested:**
- Complete user session simulation
- AI analysis integration with data creation
- Clinical risk assessment workflows
- Multi-day user journey tracking
- Cross-endpoint data consistency

## 🔧 Setup Requirements

### Prerequisites
1. **Node.js** (v18 or higher)
2. **MongoDB** running locally or remotely
3. **Backend server** running on port 5001
4. **Environment variables** configured

### Environment Configuration
Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/lumen_test
GOOGLE_AI_API_KEY=your_gemini_api_key_here
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=test
```

### Start Backend Server
```bash
# In backend directory
npm run dev
```

The server should be running on `http://localhost:5001`

## 📊 Test Execution Details

### Test Runner Features
- **Prerequisite checking** - Validates setup before running tests
- **Colored output** - Easy-to-read results with status indicators
- **Performance tracking** - Measures execution time for each suite
- **Error handling** - Graceful handling of failures and timeouts
- **Summary reporting** - Comprehensive results overview

### Test Data Management
- Uses unique test user IDs to avoid conflicts
- Automatic cleanup of test data
- Isolated test environments
- Mock data generation for consistent testing

### Performance Benchmarks
- Individual API calls: < 5 seconds
- AI analysis: < 30 seconds  
- Database operations: < 100ms
- Concurrent requests: 10+ simultaneous

## 🎯 Testing Scenarios

### Depression Assessment Testing
```javascript
// Simulates PHQ-9 depression screening
const depressiveContent = "I feel hopeless and worthless. Nothing brings me joy anymore.";
// Expected: High risk assessment, CBT recommendations, intensity adjustment
```

### Anxiety Detection Testing  
```javascript
// Simulates GAD-7 anxiety assessment
const anxiousContent = "I can't stop worrying about everything. My mind races constantly.";
// Expected: Medium/high risk, DBT skills recommendations, MBSR techniques
```

### Clinical Workflow Testing
```javascript
// Complete clinical assessment workflow
Emotion Entry → Journal Analysis → AI Assessment → Risk Evaluation → Intervention Recommendations
```

### Audio Analysis Testing
```javascript
// Voice biomarker detection simulation
Audio Upload → Transcription → Emotional Tone Analysis → Clinical Speech Patterns → Integration
```

## 🔍 Debugging and Troubleshooting

### Common Issues

**1. Server Not Running**
```bash
Error: ECONNREFUSED localhost:5001
Solution: Start backend server with `npm run dev`
```

**2. Database Connection Failed**
```bash
Error: MongoNetworkError
Solution: Ensure MongoDB is running and MONGODB_URI is correct
```

**3. AI Tests Failing**
```bash
Warning: No GOOGLE_AI_API_KEY found
Solution: Set up Gemini API key in .env file
```

**4. Authentication Errors**
```bash
Error: 401 Unauthorized
Solution: Check CLERK_SECRET_KEY configuration
```

### Verbose Testing
```bash
# Run with detailed output
DEBUG=* npm test

# Test specific functionality
node tests/api-tests.js
```

### Manual Testing
Use the test frontend at `http://localhost:5001/test-frontend/` for interactive testing.

## 📈 Coverage and Quality Metrics

### Test Coverage Areas
- **API Endpoints**: 100% of routes tested
- **Error Scenarios**: All validation and error cases
- **Data Models**: Complete schema and constraint testing  
- **AI Integration**: Full clinical analysis pipeline
- **User Workflows**: End-to-end journey simulation

### Quality Assurance
- **Input Validation**: Comprehensive boundary testing
- **Security**: Authentication and authorization testing
- **Performance**: Response time and concurrent load testing
- **Reliability**: Error handling and recovery testing
- **Clinical Accuracy**: Evidence-based validation

## 🚀 Continuous Integration

### Automated Testing
```bash
# In CI/CD pipeline
npm install
npm test

# Exit codes:
# 0 = All tests passed
# 1 = Some tests failed
```

### Performance Monitoring
- Track response times across test runs
- Monitor memory usage during testing
- Validate database query performance
- Check AI service latency

## 📚 Additional Resources

- **Clinical Evidence Base**: See `../CLINICAL_EVIDENCE_BASE.md`
- **API Documentation**: Auto-generated from test frontend
- **Implementation Guide**: See `../EVIDENCE_BASED_TESTING_GUIDE.md`
- **Hackathon Criteria**: See `../HACKATHON_CRITERIA.md`

---

**Need Help?** 
- Run `npm run test:help` for detailed information
- Check individual test files for specific scenarios
- Use the test frontend for interactive testing
- Review error logs for debugging guidance

This comprehensive test suite ensures that Lumen's backend meets the highest standards for healthcare applications, providing reliable, evidence-based mental health support with robust AI integration.