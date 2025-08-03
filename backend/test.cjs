const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

// Test data
const testUser = {
  clerkId: 'test-clerk-user-123',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg'
};

const testEmotion = {
  emotion: 'happy',
  intensity: 7,
  context: 'Testing the API'
};

const testJournal = {
  content: 'This is a test journal entry for API testing.',
  mood: 'happy',
  tags: ['test', 'api'],
  isPrivate: true
};

async function testAPI() {
  console.log('🧪 Starting Lumen Backend API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log('');

    // Test 2: Register User
    console.log('2. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/users/register`, {
      ...testUser,
      clerkToken: 'test-clerk-token'
    });
    console.log('✅ User registration successful');
    const jwtToken = registerResponse.data.data.token;
    console.log('');

    // Test 3: Login User
    console.log('3. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
      clerkToken: 'test-clerk-token'
    });
    console.log('✅ User login successful');
    console.log('');

    // Test 4: Get User Profile
    console.log('4. Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('');

    // Test 5: Create Emotion Entry
    console.log('5. Testing Emotion Entry Creation...');
    const emotionResponse = await axios.post(`${BASE_URL}/api/emotions`, testEmotion, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ Emotion entry created successfully');
    const emotionId = emotionResponse.data.data.id;
    console.log('');

    // Test 6: Get Emotion Entries
    console.log('6. Testing Get Emotion Entries...');
    const emotionsResponse = await axios.get(`${BASE_URL}/api/emotions`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ Emotion entries retrieved successfully');
    console.log(`   Found ${emotionsResponse.data.data.emotions.length} entries`);
    console.log('');

    // Test 7: Create Journal Entry
    console.log('7. Testing Journal Entry Creation...');
    const journalResponse = await axios.post(`${BASE_URL}/api/journal`, {
      ...testJournal,
      emotionEntryId: emotionId
    }, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ Journal entry created successfully');
    console.log('');

    // Test 8: Get Journal Entries
    console.log('8. Testing Get Journal Entries...');
    const journalsResponse = await axios.get(`${BASE_URL}/api/journal`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ Journal entries retrieved successfully');
    console.log(`   Found ${journalsResponse.data.data.entries.length} entries`);
    console.log('');

    // Test 9: Get Analytics Overview
    console.log('9. Testing Analytics Overview...');
    const analyticsResponse = await axios.get(`${BASE_URL}/api/analytics/overview?days=7`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ Analytics overview retrieved successfully');
    console.log(`   Total entries: ${analyticsResponse.data.data.totalEntries}`);
    console.log('');

    // Test 10: Generate AI Insights
    console.log('10. Testing AI Insights Generation...');
    const insightsResponse = await axios.post(`${BASE_URL}/api/analytics/insights`, {
      timeframe: 'week',
      focus: 'all'
    }, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ AI insights generated successfully');
    console.log('');

    console.log('🎉 All tests passed successfully!');
    console.log('');
    console.log('📊 Test Summary:');
    console.log('   ✅ Health Check');
    console.log('   ✅ User Registration');
    console.log('   ✅ User Login');
    console.log('   ✅ Profile Retrieval');
    console.log('   ✅ Emotion Entry Creation');
    console.log('   ✅ Emotion Entries Retrieval');
    console.log('   ✅ Journal Entry Creation');
    console.log('   ✅ Journal Entries Retrieval');
    console.log('   ✅ Analytics Overview');
    console.log('   ✅ AI Insights Generation');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 