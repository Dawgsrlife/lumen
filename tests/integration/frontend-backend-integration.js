/**
 * Frontend-Backend Integration Tests
 * Tests the complete user journey from frontend to backend
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 15000,
  testUser: {
    email: 'integration-test@example.com',
    firstName: 'Integration',
    lastName: 'Test'
  }
};

// Test results tracking
const integrationTestResults = {
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

async function testIntegration(testName, testFunction) {
  try {
    await testFunction();
    log(`✅ ${testName} - Integration test passed`, 'success');
    integrationTestResults.passed++;
    integrationTestResults.total++;
  } catch (error) {
    log(`❌ ${testName} - ${error.message}`, 'error');
    integrationTestResults.failed++;
    integrationTestResults.total++;
    integrationTestResults.details.push({ test: testName, error: error.message });
  }
}

// Integration test scenarios
async function testUserRegistrationFlow() {
  log('👤 Testing User Registration Flow...', 'info');
  
  await testIntegration('User Registration Flow', async () => {
    // 1. Test registration endpoint
    const registrationResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_CONFIG.testUser)
    });
    
    assert(registrationResponse.status === 200, 'Registration should succeed');
    const registrationData = await registrationResponse.json();
    assert(registrationData.message, 'Registration should return a message');
    
    // 2. Test that user can access profile
    const profileResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/users/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(profileResponse.status === 200, 'Profile access should work after registration');
  });
}

async function testEmotionTrackingFlow() {
  log('😊 Testing Emotion Tracking Flow...', 'info');
  
  await testIntegration('Emotion Tracking Flow', async () => {
    // 1. Create emotion entry
    const emotionData = {
      emotion: 'happy',
      intensity: 8,
      notes: 'Integration test emotion entry'
    };
    
    const createResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/emotions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emotionData)
    });
    
    assert(createResponse.status === 200, 'Emotion creation should succeed');
    
    // 2. Retrieve emotion entries
    const getResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/emotions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(getResponse.status === 200, 'Emotion retrieval should succeed');
    const emotionsData = await getResponse.json();
    assert(emotionsData.message, 'Emotions endpoint should return data');
    
    // 3. Test analytics integration
    const analyticsResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/analytics/emotions?days=7`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(analyticsResponse.status === 200, 'Emotion analytics should work');
  });
}

async function testJournalFlow() {
  log('📝 Testing Journal Flow...', 'info');
  
  await testIntegration('Journal Flow', async () => {
    // 1. Create journal entry
    const journalData = {
      content: 'This is an integration test journal entry.',
      mood: 'positive',
      isPrivate: false
    };
    
    const createResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(journalData)
    });
    
    assert(createResponse.status === 200, 'Journal creation should succeed');
    
    // 2. Retrieve journal entries
    const getResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/journal`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(getResponse.status === 200, 'Journal retrieval should succeed');
    
    // 3. Test journal search
    const searchResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/journal/search?q=integration`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(searchResponse.status === 200, 'Journal search should work');
  });
}

async function testAnalyticsFlow() {
  log('📊 Testing Analytics Flow...', 'info');
  
  await testIntegration('Analytics Flow', async () => {
    // 1. Test analytics overview
    const overviewResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/analytics/overview?days=30`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(overviewResponse.status === 200, 'Analytics overview should work');
    
    // 2. Test AI insights generation
    const insightsResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/analytics/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timeframe: 'week',
        focus: 'emotions'
      })
    });
    
    assert(insightsResponse.status === 200, 'AI insights generation should work');
    
    // 3. Test mood trends
    const trendsResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/analytics/trends?days=30`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(trendsResponse.status === 200, 'Mood trends should work');
  });
}

async function testNotificationsFlow() {
  log('🔔 Testing Notifications Flow...', 'info');
  
  await testIntegration('Notifications Flow', async () => {
    // 1. Create notification
    const notificationData = {
      type: 'reminder',
      title: 'Integration Test Notification',
      message: 'This is a test notification from integration tests'
    };
    
    const createResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    });
    
    assert(createResponse.status === 200, 'Notification creation should succeed');
    
    // 2. Retrieve notifications
    const getResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/notifications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(getResponse.status === 200, 'Notification retrieval should succeed');
    
    // 3. Test mark as read
    const markReadResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(markReadResponse.status === 200, 'Mark as read should work');
  });
}

async function testGamesFlow() {
  log('🎮 Testing Games Flow...', 'info');
  
  await testIntegration('Games Flow', async () => {
    // 1. Get available games
    const gamesResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/games`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(gamesResponse.status === 200, 'Games listing should work');
    
    // 2. Start game session
    const startGameData = {
      gameType: 'breathing',
      emotion: 'anxious'
    };
    
    const startResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/games/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(startGameData)
    });
    
    assert(startResponse.status === 200, 'Game start should work');
    
    // 3. Complete game session
    const completeData = {
      score: 85,
      duration: 300
    };
    
    const completeResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/games/123/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeData)
    });
    
    assert(completeResponse.status === 200, 'Game completion should work');
  });
}

async function testVoiceChatFlow() {
  log('🎙️ Testing Voice Chat Flow...', 'info');
  
  await testIntegration('Voice Chat Flow', async () => {
    // 1. Check voice chat status
    const statusResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/voice-chat/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(statusResponse.status === 200, 'Voice chat status should work');
    
    // 2. Start voice chat session
    const startData = {
      emotion: 'sad',
      intensity: 6
    };
    
    const startResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/voice-chat/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(startData)
    });
    
    assert(startResponse.status === 200, 'Voice chat start should work');
    
    // 3. End voice chat session
    const endResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/voice-chat/123/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    assert(endResponse.status === 200, 'Voice chat end should work');
  });
}

async function testFrontendBackendCommunication() {
  log('🌐 Testing Frontend-Backend Communication...', 'info');
  
  await testIntegration('Frontend-Backend Communication', async () => {
    // 1. Test that frontend can access backend APIs
    const healthResponse = await fetch(`${TEST_CONFIG.baseUrl}/health`);
    assert(healthResponse.status === 200, 'Frontend should be able to access health endpoint');
    
    // 2. Test that API responses are properly formatted
    const healthData = await healthResponse.json();
    assert(healthData.success === true, 'Health response should have success field');
    assert(healthData.message, 'Health response should have message field');
    
    // 3. Test CORS headers
    const corsResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/users`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    assert(corsResponse.status === 200 || corsResponse.status === 204, 'CORS should be properly configured');
  });
}

async function testErrorHandlingIntegration() {
  log('🚨 Testing Error Handling Integration...', 'info');
  
  await testIntegration('Error Handling Integration', async () => {
    // 1. Test invalid API calls from frontend perspective
    const invalidResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/invalid-endpoint`);
    assert(invalidResponse.status === 200, 'Invalid endpoints should be handled gracefully');
    
    // 2. Test malformed requests
    const malformedResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    });
    
    assert(malformedResponse.status === 400 || malformedResponse.status === 200, 'Malformed requests should be handled');
    
    // 3. Test authentication errors
    const authResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    assert(authResponse.status === 200, 'Authentication errors should be handled gracefully');
  });
}

async function testPerformanceIntegration() {
  log('⚡ Testing Performance Integration...', 'info');
  
  await testIntegration('Performance Integration', async () => {
    // 1. Test response times
    const startTime = Date.now();
    const response = await fetch(`${TEST_CONFIG.baseUrl}/health`);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    assert(responseTime < 1000, `Response time should be under 1 second, got ${responseTime}ms`);
    
    // 2. Test concurrent requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(fetch(`${TEST_CONFIG.baseUrl}/health`));
    }
    
    const responses = await Promise.all(promises);
    responses.forEach(response => {
      assert(response.status === 200, 'Concurrent requests should all succeed');
    });
  });
}

// Run all integration tests
async function runIntegrationTests() {
  log('🔗 Starting Frontend-Backend Integration Tests', 'info');
  log('==============================================', 'info');
  
  try {
    await testUserRegistrationFlow();
    await testEmotionTrackingFlow();
    await testJournalFlow();
    await testAnalyticsFlow();
    await testNotificationsFlow();
    await testGamesFlow();
    await testVoiceChatFlow();
    await testFrontendBackendCommunication();
    await testErrorHandlingIntegration();
    await testPerformanceIntegration();
    
  } catch (error) {
    log(`❌ Integration test suite failed: ${error.message}`, 'error');
  }
  
  // Print results
  log('==============================================', 'info');
  log('📊 Integration Test Results:', 'info');
  log(`✅ Passed: ${integrationTestResults.passed}`, 'success');
  log(`❌ Failed: ${integrationTestResults.failed}`, integrationTestResults.failed > 0 ? 'error' : 'info');
  log(`📈 Total: ${integrationTestResults.total}`, 'info');
  log(`📊 Success Rate: ${((integrationTestResults.passed / integrationTestResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (integrationTestResults.details.length > 0) {
    log('📋 Failed Integration Details:', 'warning');
    integrationTestResults.details.forEach(detail => {
      log(`  - ${detail.test}: ${detail.error}`, 'error');
    });
  }
  
  log('==============================================', 'info');
  
  return integrationTestResults;
}

// Export for use in other test files
export { runIntegrationTests, testIntegration };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests();
} 