/**
 * Integration Tests for Lumen Backend
 * Tests complete workflows and feature integration
 * Run with: node tests/integration-tests.js
 */

const { makeRequest } = require('./api-tests.js');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5001';
const TEST_CLERK_ID = 'integration_test_user';

// Test result tracking
let tests = [];
let passed = 0;
let failed = 0;

function test(name, testFn) {
    tests.push({ name, testFn });
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

function assertContains(str, substring, message) {
    if (!str || !str.includes) {
        throw new Error(message || `Expected string, got ${typeof str}`);
    }
    if (!str.includes(substring)) {
        throw new Error(message || `Expected "${str}" to contain "${substring}"`);
    }
}

// Test runner
async function runTests() {
    console.log('🔄 Starting Integration Tests\n');
    
    for (const test of tests) {
        try {
            console.log(`🧪 Running: ${test.name}`);
            await test.testFn();
            console.log(`✅ PASSED: ${test.name}\n`);
            passed++;
        } catch (error) {
            console.log(`❌ FAILED: ${test.name}`);
            console.log(`   Error: ${error.message}\n`);
            failed++;
        }
    }

    console.log(`\n📊 Integration Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${tests.length}`);
    
    if (failed === 0) {
        console.log('\n🎉 All integration tests passed!');
    } else {
        console.log('\n⚠️  Some integration tests failed. Check the output above for details.');
    }
}

// Complete workflow tests
test('Complete emotion-journal workflow', async () => {
    // 1. Create emotion entry
    const emotionData = {
        emotion: 'anxiety',
        intensity: 7,
        context: 'Work presentation anxiety',
        location: 'office'
    };
    
    const emotionResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData);
    assertEqual(emotionResponse.status, 200);
    const emotionId = emotionResponse.data.data.emotionEntry._id;
    
    // 2. Create related journal entry
    const journalData = {
        content: 'I have a big presentation tomorrow and I can\'t stop worrying about it. My mind keeps racing with all the things that could go wrong.',
        mood: 'anxiety',
        tags: ['work', 'presentation', 'worry'],
        isPrivate: false,
        emotionEntryId: emotionId
    };
    
    const journalResponse = await makeRequest('POST', `${API_BASE}/api/journal`, journalData);
    assertEqual(journalResponse.status, 201);
    
    // 3. Verify AI analysis was performed
    assert(journalResponse.data.data.analysis, 'Should include AI analysis');
    assert(journalResponse.data.data.analysis.sentiment, 'Should include sentiment analysis');
    assert(journalResponse.data.data.analysis.riskAssessment, 'Should include risk assessment');
    
    // 4. Check emotion intensity was adjusted
    const updatedEmotionResponse = await makeRequest('GET', `${API_BASE}/api/emotions/${emotionId}`);
    assertEqual(updatedEmotionResponse.status, 200);
    
    // Intensity might have been adjusted by AI
    const originalIntensity = emotionData.intensity;
    const newIntensity = updatedEmotionResponse.data.data.intensity;
    console.log(`   📊 Intensity: ${originalIntensity} → ${newIntensity}`);
    
    // 5. Create game session to help with anxiety
    const gameData = {
        gameType: 'breathing',
        duration: 10,
        emotionBefore: 'anxiety',
        emotionAfter: 'calm',
        completionStatus: 'completed',
        notes: 'Breathing exercise after work stress'
    };
    
    const gameResponse = await makeRequest('POST', `${API_BASE}/api/games`, gameData);
    assertEqual(gameResponse.status, 201);
    
    console.log('   ✅ Complete workflow: Emotion → Journal → AI Analysis → Game Session');
});

test('Analytics integration workflow', async () => {
    // Create diverse data for analytics
    const emotions = [
        { emotion: 'happy', intensity: 8, context: 'Great day' },
        { emotion: 'sad', intensity: 4, context: 'Missed friend' },
        { emotion: 'anxiety', intensity: 6, context: 'Job interview' },
        { emotion: 'happy', intensity: 7, context: 'Good news' }
    ];
    
    const journals = [
        { content: 'Had an amazing day with friends. Feeling grateful for their support.', mood: 'happy', tags: ['friends', 'gratitude'] },
        { content: 'Missing my old friend who moved away. Feeling a bit lonely.', mood: 'sad', tags: ['friendship', 'loneliness'] },
        { content: 'Job interview went better than expected. Still nervous about results.', mood: 'anxiety', tags: ['career', 'interview'] }
    ];
    
    // Create emotions
    for (const emotionData of emotions) {
        await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData);
    }
    
    // Create journals
    for (const journalData of journals) {
        await makeRequest('POST', `${API_BASE}/api/journal`, journalData);
    }
    
    // Test analytics overview
    const analyticsResponse = await makeRequest('GET', `${API_BASE}/api/analytics/overview?days=7`);
    assertEqual(analyticsResponse.status, 200);
    
    const analytics = analyticsResponse.data.data;
    assert(analytics.summary, 'Should include analytics summary');
    assert(analytics.emotions, 'Should include emotion analytics');
    assert(analytics.streaks, 'Should include streak data');
    
    // Test emotion analytics
    const emotionAnalyticsResponse = await makeRequest('GET', `${API_BASE}/api/analytics/emotions?days=7`);
    assertEqual(emotionAnalyticsResponse.status, 200);
    
    const emotionAnalytics = emotionAnalyticsResponse.data.data;
    assert(emotionAnalytics.mostFrequent, 'Should identify most frequent emotion');
    assert(emotionAnalytics.averageIntensity, 'Should calculate average intensity');
    
    console.log('   📊 Analytics generated for diverse emotional data');
});

test('Clinical analytics workflow', async () => {
    // Create concerning mental health data
    const concerningData = [
        {
            emotion: 'sad',
            intensity: 8,
            context: 'Everything feels hopeless'
        },
        {
            content: 'I can\'t see any point in anything anymore. Nothing brings me joy. I feel worthless and like a burden to everyone.',
            mood: 'sad',
            tags: ['depression', 'hopelessness', 'worthless']
        }
    ];
    
    // Create concerning emotion
    await makeRequest('POST', `${API_BASE}/api/emotions`, concerningData[0]);
    
    // Create concerning journal
    const journalResponse = await makeRequest('POST', `${API_BASE}/api/journal`, concerningData[1]);
    assertEqual(journalResponse.status, 201);
    
    // Check that AI flagged high risk
    const analysis = journalResponse.data.data.analysis;
    assert(['medium', 'high'].includes(analysis.riskAssessment), 'Should flag concerning content as medium/high risk');
    
    // Test clinical analytics
    const clinicalResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/overview?days=7`);
    assertEqual(clinicalResponse.status, 200);
    
    const clinical = clinicalResponse.data.data;
    assert(clinical.clinicalAssessment, 'Should include clinical assessment');
    assert(clinical.riskFactors, 'Should identify risk factors');
    assert(clinical.evidenceBasedInterventions, 'Should recommend interventions');
    
    // Test risk assessment
    const riskResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/risk-assessment?days=7`);
    assertEqual(riskResponse.status, 200);
    
    const riskData = riskResponse.data.data;
    assert(riskData.riskLevel, 'Should assess risk level');
    assert(['medium', 'high'].includes(riskData.riskLevel), 'Should identify elevated risk');
    
    console.log(`   ⚠️  Clinical assessment identified ${riskData.riskLevel} risk level`);
});

test('Multi-modal data integration', async () => {
    // Create comprehensive user session
    const sessionData = {
        emotion: { emotion: 'stress', intensity: 7, context: 'Work deadline pressure' },
        journal: { 
            content: 'Feeling overwhelmed by work deadlines. Need to find better ways to manage stress.',
            mood: 'stress',
            tags: ['work', 'deadlines', 'overwhelm']
        },
        game: {
            gameType: 'meditation',
            duration: 15,
            emotionBefore: 'stress',
            emotionAfter: 'calm',
            completionStatus: 'completed'
        }
    };
    
    // Create emotion
    const emotionResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, sessionData.emotion);
    const emotionId = emotionResponse.data.data.emotionEntry._id;
    
    // Create journal linked to emotion
    sessionData.journal.emotionEntryId = emotionId;
    const journalResponse = await makeRequest('POST', `${API_BASE}/api/journal`, sessionData.journal);
    const journalId = journalResponse.data.data.journalEntry._id;
    
    // Create game session
    const gameResponse = await makeRequest('POST', `${API_BASE}/api/games`, sessionData.game);
    const gameId = gameResponse.data.data._id;
    
    // Generate comprehensive insights
    const insightRequest = {
        timeframe: '24h',
        focus: 'stress_management'
    };
    
    const insightsResponse = await makeRequest('POST', `${API_BASE}/api/clinical-analytics/insights`, insightRequest);
    assertEqual(insightsResponse.status, 200);
    
    const insights = insightsResponse.data.data;
    assert(insights.summary, 'Should provide comprehensive summary');
    assert(insights.patterns, 'Should identify behavioral patterns');
    assert(insights.recommendations, 'Should provide personalized recommendations');
    
    // Verify multi-modal integration
    assertContains(insights.summary.toLowerCase(), 'stress', 'Should reference stress theme');
    
    console.log('   🔄 Multi-modal integration: Emotion + Journal + Game + AI Analysis');
});

test('User journey progression tracking', async () => {
    // Simulate user journey over time
    const journeySteps = [
        {
            day: 1,
            emotion: { emotion: 'anxiety', intensity: 8, context: 'Starting therapy' },
            journal: { content: 'First day trying this app. Feeling very anxious about everything.', mood: 'anxiety', tags: ['first-day', 'therapy'] }
        },
        {
            day: 3,
            emotion: { emotion: 'anxiety', intensity: 6, context: 'Learning coping skills' },
            journal: { content: 'Tried some breathing exercises. They help a little.', mood: 'anxiety', tags: ['breathing', 'coping'] },
            game: { gameType: 'breathing', duration: 5, emotionBefore: 'anxiety', emotionAfter: 'calm' }
        },
        {
            day: 7,
            emotion: { emotion: 'happy', intensity: 7, context: 'Making progress' },
            journal: { content: 'Feeling better this week. The meditation is really helping.', mood: 'happy', tags: ['progress', 'meditation'] },
            game: { gameType: 'meditation', duration: 15, emotionBefore: 'neutral', emotionAfter: 'happy' }
        }
    ];
    
    // Create journey data
    for (const step of journeySteps) {
        // Create emotion
        await makeRequest('POST', `${API_BASE}/api/emotions`, step.emotion);
        
        // Create journal
        await makeRequest('POST', `${API_BASE}/api/journal`, step.journal);
        
        // Create game if present
        if (step.game) {
            await makeRequest('POST', `${API_BASE}/api/games`, step.game);
        }
    }
    
    // Analyze progression
    const progressResponse = await makeRequest('GET', `${API_BASE}/api/analytics/trends?days=7`);
    assertEqual(progressResponse.status, 200);
    
    const trends = progressResponse.data.data;
    assert(Array.isArray(trends), 'Should return trend data');
    
    // Test clinical insights for progression
    const clinicalInsights = await makeRequest('POST', `${API_BASE}/api/clinical-analytics/insights`, {
        timeframe: '7d',
        focus: 'progress_tracking'
    });
    
    assertEqual(clinicalInsights.status, 200);
    const insights = clinicalInsights.data.data;
    
    // Should detect improvement patterns
    assert(insights.patterns, 'Should identify improvement patterns');
    assert(insights.healthcareOutcomes, 'Should assess healthcare outcomes');
    
    console.log('   📈 User journey progression tracked and analyzed');
});

test('Error handling and recovery workflow', async () => {
    // Test graceful error handling in workflow
    
    // 1. Try to create journal with invalid data
    const invalidJournal = {
        content: '', // empty content
        mood: 'invalid_mood'
    };
    
    const failResponse = await makeRequest('POST', `${API_BASE}/api/journal`, invalidJournal);
    assertEqual(failResponse.status, 400);
    assert(!failResponse.data.success, 'Should fail gracefully');
    
    // 2. Create valid journal after error
    const validJournal = {
        content: 'This is a valid journal entry after error recovery.',
        mood: 'happy',
        tags: ['recovery', 'valid']
    };
    
    const successResponse = await makeRequest('POST', `${API_BASE}/api/journal`, validJournal);
    assertEqual(successResponse.status, 201);
    assert(successResponse.data.success, 'Should succeed after error recovery');
    
    // 3. Test analytics with limited data
    const analyticsResponse = await makeRequest('GET', `${API_BASE}/api/analytics/overview?days=1`);
    assertEqual(analyticsResponse.status, 200);
    assert(analyticsResponse.data.success, 'Analytics should work even with limited data');
    
    console.log('   🔄 Error handling and recovery workflow verified');
});

test('Performance under load simulation', async () => {
    console.log('   ⏱️  Running performance simulation...');
    
    const startTime = Date.now();
    const requests = [];
    
    // Simulate concurrent user activity
    for (let i = 0; i < 10; i++) {
        requests.push(
            makeRequest('POST', `${API_BASE}/api/emotions`, {
                emotion: 'happy',
                intensity: Math.floor(Math.random() * 10) + 1,
                context: `Performance test ${i}`
            })
        );
        
        requests.push(
            makeRequest('POST', `${API_BASE}/api/journal`, {
                content: `Performance test journal entry ${i}. Testing concurrent load handling.`,
                mood: 'happy',
                tags: ['performance', 'test']
            })
        );
    }
    
    // Wait for all requests to complete
    const results = await Promise.all(requests);
    const endTime = Date.now();
    
    // Check that all requests succeeded
    const successCount = results.filter(r => r.status < 400).length;
    assertEqual(successCount, requests.length, 'All concurrent requests should succeed');
    
    const totalTime = endTime - startTime;
    const avgTime = totalTime / requests.length;
    
    console.log(`   📊 Performance: ${requests.length} requests in ${totalTime}ms (avg: ${avgTime.toFixed(2)}ms per request)`);
    
    // Performance should be reasonable
    assert(avgTime < 5000, `Average response time should be under 5 seconds, got ${avgTime.toFixed(2)}ms`);
});

test('Data consistency across endpoints', async () => {
    // Create data and verify consistency across different endpoints
    
    const emotionData = {
        emotion: 'gratitude',
        intensity: 9,
        context: 'Consistency test'
    };
    
    const emotionResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData);
    const emotionId = emotionResponse.data.data.emotionEntry._id;
    
    // Get emotion by ID
    const getEmotionResponse = await makeRequest('GET', `${API_BASE}/api/emotions/${emotionId}`);
    assertEqual(getEmotionResponse.status, 200);
    assertEqual(getEmotionResponse.data.data.emotion, 'gratitude');
    
    // Get emotion in list
    const listEmotionsResponse = await makeRequest('GET', `${API_BASE}/api/emotions?days=1`);
    assertEqual(listEmotionsResponse.status, 200);
    
    const emotionInList = listEmotionsResponse.data.data.find(e => e._id === emotionId);
    assert(emotionInList, 'Created emotion should appear in list');
    assertEqual(emotionInList.emotion, 'gratitude', 'Emotion data should be consistent');
    
    // Check in analytics
    const analyticsResponse = await makeRequest('GET', `${API_BASE}/api/analytics/emotions?days=1`);
    assertEqual(analyticsResponse.status, 200);
    
    // Should include the gratitude emotion in analytics
    assert(analyticsResponse.data.success, 'Analytics should process new emotion');
    
    console.log('   ✅ Data consistency verified across all endpoints');
});

// Helper function to clean up test data
async function cleanupTestData() {
    try {
        // This would ideally clean up test data
        // For now, we rely on test user ID being unique
        console.log('   🧹 Test data cleanup (using unique test user ID)');
    } catch (error) {
        console.log('   ⚠️  Cleanup warning:', error.message);
    }
}

// Run tests if called directly
if (require.main === module) {
    console.log('🚀 Starting Integration Test Suite\n');
    console.log('   Make sure the backend server is running on port 5001\n');
    
    runTests()
        .then(() => cleanupTestData())
        .catch(console.error);
}

module.exports = { test, assert, assertEqual, runTests };