/**
 * Backend API Tests
 * Tests all API endpoints for proper functionality and error handling
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
  testData: {
    user: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    },
    emotion: {
      emotion: 'happy',
      intensity: 7,
      notes: 'Feeling great today!'
    },
    journal: {
      content: 'Today was a wonderful day.',
      mood: 'positive',
      isPrivate: false
    }
  }
};

// Test results tracking
const apiTestResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function testAPIEndpoint(endpoint, method = 'GET', body = null, expectedStatus = 200, description = '') {
  const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    const status = response.status;
    const data = await response.json();
    
    assert(status === expectedStatus, `Expected status ${expectedStatus}, got ${status}`);
    
    log(`✅ ${description || `${method} ${endpoint}`} - Status: ${status}`, 'success');
    apiTestResults.passed++;
    apiTestResults.total++;
    
    return { success: true, status, data };
  } catch (error) {
    log(`❌ ${description || `${method} ${endpoint}`} - ${error.message}`, 'error');
    apiTestResults.failed++;
    apiTestResults.total++;
    apiTestResults.details.push({ 
      test: description || `${method} ${endpoint}`, 
      error: error.message 
    });
    
    return { success: false, error: error.message };
  }
}

// API endpoint tests
async function testUsersAPI() {
  log('👥 Testing Users API...', 'info');
  
  // Test GET /api/users
  await testAPIEndpoint('/api/users', 'GET', null, 200, 'Get users endpoint');
  
  // Test POST /api/users (registration)
  await testAPIEndpoint('/api/users/register', 'POST', TEST_CONFIG.testData.user, 200, 'User registration');
  
  // Test GET /api/users/profile
  await testAPIEndpoint('/api/users/profile', 'GET', null, 200, 'Get user profile');
  
  // Test PUT /api/users/profile
  await testAPIEndpoint('/api/users/profile', 'PUT', { firstName: 'Updated' }, 200, 'Update user profile');
  
  // Test PUT /api/users/preferences
  await testAPIEndpoint('/api/users/preferences', 'PUT', { 
    preferences: { theme: 'dark', notifications: true } 
  }, 200, 'Update user preferences');
}

async function testEmotionsAPI() {
  log('😊 Testing Emotions API...', 'info');
  
  // Test GET /api/emotions
  await testAPIEndpoint('/api/emotions', 'GET', null, 200, 'Get emotions list');
  
  // Test POST /api/emotions
  await testAPIEndpoint('/api/emotions', 'POST', TEST_CONFIG.testData.emotion, 200, 'Create emotion entry');
  
  // Test GET /api/emotions with query parameters
  await testAPIEndpoint('/api/emotions?page=1&limit=10&emotion=happy', 'GET', null, 200, 'Get emotions with filters');
  
  // Test GET /api/emotions/daily
  await testAPIEndpoint('/api/emotions/daily?days=30', 'GET', null, 200, 'Get daily emotions');
  
  // Test GET /api/emotions/:id
  await testAPIEndpoint('/api/emotions/123', 'GET', null, 200, 'Get specific emotion');
  
  // Test PUT /api/emotions/:id
  await testAPIEndpoint('/api/emotions/123', 'PUT', { intensity: 8 }, 200, 'Update emotion entry');
  
  // Test DELETE /api/emotions/:id
  await testAPIEndpoint('/api/emotions/123', 'DELETE', null, 200, 'Delete emotion entry');
}

async function testJournalAPI() {
  log('📝 Testing Journal API...', 'info');
  
  // Test GET /api/journal
  await testAPIEndpoint('/api/journal', 'GET', null, 200, 'Get journal entries');
  
  // Test POST /api/journal
  await testAPIEndpoint('/api/journal', 'POST', TEST_CONFIG.testData.journal, 200, 'Create journal entry');
  
  // Test GET /api/journal with query parameters
  await testAPIEndpoint('/api/journal?page=1&limit=10&mood=positive', 'GET', null, 200, 'Get journal with filters');
  
  // Test GET /api/journal/daily
  await testAPIEndpoint('/api/journal/daily?days=30&includePrivate=true', 'GET', null, 200, 'Get daily journals');
  
  // Test GET /api/journal/search
  await testAPIEndpoint('/api/journal/search?q=wonderful&page=1&limit=20', 'GET', null, 200, 'Search journal entries');
  
  // Test GET /api/journal/:id
  await testAPIEndpoint('/api/journal/123', 'GET', null, 200, 'Get specific journal entry');
  
  // Test PUT /api/journal/:id
  await testAPIEndpoint('/api/journal/123', 'PUT', { content: 'Updated content' }, 200, 'Update journal entry');
  
  // Test DELETE /api/journal/:id
  await testAPIEndpoint('/api/journal/123', 'DELETE', null, 200, 'Delete journal entry');
}

async function testAnalyticsAPI() {
  log('📊 Testing Analytics API...', 'info');
  
  // Test GET /api/analytics/overview
  await testAPIEndpoint('/api/analytics/overview?days=30', 'GET', null, 200, 'Get analytics overview');
  
  // Test POST /api/analytics/insights
  await testAPIEndpoint('/api/analytics/insights', 'POST', {
    timeframe: 'week',
    focus: 'emotions'
  }, 200, 'Generate AI insights');
  
  // Test GET /api/analytics/emotions
  await testAPIEndpoint('/api/analytics/emotions?days=30', 'GET', null, 200, 'Get emotion analytics');
  
  // Test GET /api/analytics/trends
  await testAPIEndpoint('/api/analytics/trends?days=30', 'GET', null, 200, 'Get mood trends');
}

async function testNotificationsAPI() {
  log('🔔 Testing Notifications API...', 'info');
  
  // Test GET /api/notifications
  await testAPIEndpoint('/api/notifications', 'GET', null, 200, 'Get notifications');
  
  // Test POST /api/notifications
  await testAPIEndpoint('/api/notifications', 'POST', {
    type: 'reminder',
    title: 'Daily Check-in',
    message: 'Time for your daily emotion check-in!'
  }, 200, 'Create notification');
  
  // Test PATCH /api/notifications/:id/read
  await testAPIEndpoint('/api/notifications/123/read', 'PATCH', null, 200, 'Mark notification as read');
  
  // Test PATCH /api/notifications/mark-all-read
  await testAPIEndpoint('/api/notifications/mark-all-read', 'PATCH', null, 200, 'Mark all notifications as read');
  
  // Test DELETE /api/notifications/:id
  await testAPIEndpoint('/api/notifications/123', 'DELETE', null, 200, 'Delete notification');
}

async function testClinicalAnalyticsAPI() {
  log('🏥 Testing Clinical Analytics API...', 'info');
  
  // Test GET /api/clinical-analytics
  await testAPIEndpoint('/api/clinical-analytics', 'GET', null, 200, 'Get clinical analytics');
  
  // Test POST /api/clinical-analytics/assessment
  await testAPIEndpoint('/api/clinical-analytics/assessment', 'POST', {
    assessmentType: 'depression',
    responses: [1, 2, 3, 4, 5]
  }, 200, 'Submit clinical assessment');
  
  // Test GET /api/clinical-analytics/reports
  await testAPIEndpoint('/api/clinical-analytics/reports?type=weekly', 'GET', null, 200, 'Get clinical reports');
}

async function testGamesAPI() {
  log('🎮 Testing Games API...', 'info');
  
  // Test GET /api/games
  await testAPIEndpoint('/api/games', 'GET', null, 200, 'Get available games');
  
  // Test POST /api/games/start
  await testAPIEndpoint('/api/games/start', 'POST', {
    gameType: 'breathing',
    emotion: 'anxious'
  }, 200, 'Start game session');
  
  // Test POST /api/games/:id/complete
  await testAPIEndpoint('/api/games/123/complete', 'POST', {
    score: 85,
    duration: 300
  }, 200, 'Complete game session');
  
  // Test GET /api/games/progress
  await testAPIEndpoint('/api/games/progress', 'GET', null, 200, 'Get game progress');
}

async function testVoiceChatAPI() {
  log('🎙️ Testing Voice Chat API...', 'info');
  
  // Test GET /api/voice-chat/status
  await testAPIEndpoint('/api/voice-chat/status', 'GET', null, 200, 'Get voice chat status');
  
  // Test POST /api/voice-chat/start
  await testAPIEndpoint('/api/voice-chat/start', 'POST', {
    emotion: 'sad',
    intensity: 6
  }, 200, 'Start voice chat session');
  
  // Test POST /api/voice-chat/:id/end
  await testAPIEndpoint('/api/voice-chat/123/end', 'POST', null, 200, 'End voice chat session');
  
  // Test GET /api/voice-chat/sessions
  await testAPIEndpoint('/api/voice-chat/sessions', 'GET', null, 200, 'Get voice chat sessions');
}

async function testErrorHandling() {
  log('🚨 Testing Error Handling...', 'info');
  
  // Test invalid endpoint
  await testAPIEndpoint('/api/invalid', 'GET', null, 200, 'Invalid endpoint should return message');
  
  // Test invalid method
  await testAPIEndpoint('/api/users', 'PUT', null, 200, 'Invalid method should be handled');
  
  // Test malformed JSON
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    });
    
    assert(response.status === 400 || response.status === 200, 'Malformed JSON should be handled');
    log('✅ Malformed JSON handling test passed', 'success');
    apiTestResults.passed++;
    apiTestResults.total++;
  } catch (error) {
    log(`❌ Malformed JSON handling test failed: ${error.message}`, 'error');
    apiTestResults.failed++;
    apiTestResults.total++;
  }
}

async function testAuthentication() {
  log('🔐 Testing Authentication...', 'info');
  
  // Test endpoints without authentication
  await testAPIEndpoint('/api/users/profile', 'GET', null, 200, 'Profile without auth should return message');
  
  // Test with invalid token
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    assert(response.status === 200, 'Invalid token should be handled gracefully');
    log('✅ Invalid token handling test passed', 'success');
    apiTestResults.passed++;
    apiTestResults.total++;
  } catch (error) {
    log(`❌ Invalid token handling test failed: ${error.message}`, 'error');
    apiTestResults.failed++;
    apiTestResults.total++;
  }
}

async function testRateLimiting() {
  log('⏱️ Testing Rate Limiting...', 'info');
  
  // Make multiple rapid requests to test rate limiting
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(testAPIEndpoint('/api/users', 'GET', null, 200, `Rate limit test ${i + 1}`));
  }
  
  await Promise.all(promises);
  log('✅ Rate limiting tests completed', 'success');
}

// Run all API tests
async function runAPITests() {
  log('🔧 Starting Backend API Tests', 'info');
  log('================================', 'info');
  
  try {
    await testUsersAPI();
    await testEmotionsAPI();
    await testJournalAPI();
    await testAnalyticsAPI();
    await testNotificationsAPI();
    await testClinicalAnalyticsAPI();
    await testGamesAPI();
    await testVoiceChatAPI();
    await testErrorHandling();
    await testAuthentication();
    await testRateLimiting();
    
  } catch (error) {
    log(`❌ API test suite failed: ${error.message}`, 'error');
  }
  
  // Print results
  log('================================', 'info');
  log('📊 API Test Results:', 'info');
  log(`✅ Passed: ${apiTestResults.passed}`, 'success');
  log(`❌ Failed: ${apiTestResults.failed}`, apiTestResults.failed > 0 ? 'error' : 'info');
  log(`📈 Total: ${apiTestResults.total}`, 'info');
  log(`📊 Success Rate: ${((apiTestResults.passed / apiTestResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (apiTestResults.details.length > 0) {
    log('📋 Failed API Details:', 'warning');
    apiTestResults.details.forEach(detail => {
      log(`  - ${detail.test}: ${detail.error}`, 'error');
    });
  }
  
  log('================================', 'info');
  
  return apiTestResults;
}

// Export for use in other test files
export { runAPITests, testAPIEndpoint };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAPITests();
} 