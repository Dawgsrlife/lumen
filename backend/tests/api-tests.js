/**
 * Simple API Tests for Lumen Backend
 * Run with: node tests/api-tests.js
 * 
 * Tests all endpoints and core functionality without external frameworks
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5001';
const TEST_CLERK_ID = 'test_user_123';

// Simple HTTP request helper
function makeRequest(method, url, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TEST_CLERK_ID}`,
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData, headers: res.headers });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

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
    if (!str.includes(substring)) {
        throw new Error(message || `Expected "${str}" to contain "${substring}"`);
    }
}

// Test runner
async function runTests() {
    console.log('🧪 Starting Lumen Backend API Tests\n');
    
    for (const test of tests) {
        try {
            console.log(`📋 Running: ${test.name}`);
            await test.testFn();
            console.log(`✅ PASSED: ${test.name}\n`);
            passed++;
        } catch (error) {
            console.log(`❌ FAILED: ${test.name}`);
            console.log(`   Error: ${error.message}\n`);
            failed++;
        }
    }

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${tests.length}`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed!');
    } else {
        console.log('\n⚠️  Some tests failed. Check the output above for details.');
        process.exit(1);
    }
}

// Health and basic connectivity tests
test('Health endpoint should respond', async () => {
    const response = await makeRequest('GET', `${API_BASE}/health`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Health check should return success');
    assertContains(response.data.message, 'Lumen API is running');
});

test('Test endpoint should work', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/test`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Test endpoint should return success');
});

// Emotion entry tests
test('Create emotion entry', async () => {
    const emotionData = {
        emotion: 'happy',
        intensity: 7,
        context: 'Testing emotion creation',
        location: 'test environment'
    };
    
    const response = await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData);
    assertEqual(response.status, 201);
    assert(response.data.success, 'Emotion creation should succeed');
    assert(response.data.data.emotionEntry, 'Should return emotion entry data');
    assertEqual(response.data.data.emotionEntry.emotion, 'happy');
    
    // Store for later tests
    global.testEmotionId = response.data.data.emotionEntry._id;
});

test('Get emotion entries', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/emotions?days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Getting emotions should succeed');
    assert(Array.isArray(response.data.data), 'Should return array of emotions');
});

test('Get emotion by ID', async () => {
    if (!global.testEmotionId) {
        throw new Error('No emotion ID available from previous test');
    }
    
    const response = await makeRequest('GET', `${API_BASE}/api/emotions/${global.testEmotionId}`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Getting emotion by ID should succeed');
    assertEqual(response.data.data.emotion, 'happy');
});

// Journal entry tests
test('Create journal entry', async () => {
    const journalData = {
        content: 'This is a test journal entry for API testing. I am feeling positive about the progress of this project.',
        mood: 'happy',
        tags: ['testing', 'progress', 'positive'],
        isPrivate: false
    };
    
    const response = await makeRequest('POST', `${API_BASE}/api/journal`, journalData);
    assertEqual(response.status, 201);
    assert(response.data.success, 'Journal creation should succeed');
    assert(response.data.data.journalEntry, 'Should return journal entry data');
    assertContains(response.data.data.journalEntry.content, 'test journal entry');
    
    // Store for later tests
    global.testJournalId = response.data.data.journalEntry._id;
});

test('Get journal entries', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/journal?days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Getting journal entries should succeed');
    assert(Array.isArray(response.data.data), 'Should return array of journal entries');
});

test('Search journal entries', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/journal/search?query=test&days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Journal search should succeed');
    assert(Array.isArray(response.data.data), 'Should return search results');
});

// Game session tests
test('Create game session', async () => {
    const gameData = {
        gameType: 'meditation',
        duration: 15,
        score: 85,
        notes: 'Test meditation session',
        emotionBefore: 'stress',
        emotionAfter: 'calm',
        completionStatus: 'completed'
    };
    
    const response = await makeRequest('POST', `${API_BASE}/api/games`, gameData);
    assertEqual(response.status, 201);
    assert(response.data.success, 'Game session creation should succeed');
    assert(response.data.data, 'Should return game session data');
    assertEqual(response.data.data.gameType, 'meditation');
    
    global.testGameId = response.data.data._id;
});

test('Get game sessions', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/games?days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Getting game sessions should succeed');
    assert(Array.isArray(response.data.data), 'Should return array of game sessions');
});

test('Get game statistics', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/games/stats`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Getting game stats should succeed');
    assert(response.data.data.totalSessions !== undefined, 'Should include total sessions');
});

// Analytics tests
test('Get analytics overview', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/analytics/overview?days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Analytics overview should succeed');
    assert(response.data.data.summary, 'Should include summary');
    assert(response.data.data.emotions, 'Should include emotions data');
});

test('Get emotion analytics', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/analytics/emotions?days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Emotion analytics should succeed');
    assert(response.data.data.summary, 'Should include emotion summary');
});

test('Get mood trends', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/analytics/trends?days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Mood trends should succeed');
    assert(Array.isArray(response.data.data), 'Should return trends array');
});

// Clinical analytics tests
test('Get clinical overview', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/overview?days=30`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Clinical overview should succeed');
    assert(response.data.data.clinicalAssessment, 'Should include clinical assessment');
});

test('Get clinical insights', async () => {
    const insightRequest = {
        timeframe: '7d',
        focus: 'mood'
    };
    
    const response = await makeRequest('POST', `${API_BASE}/api/clinical-analytics/insights`, insightRequest);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Clinical insights should succeed');
    assert(response.data.data.insights, 'Should include clinical insights');
});

test('Get risk assessment', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/risk-assessment?days=7`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'Risk assessment should succeed');
    assert(response.data.data.riskLevel, 'Should include risk level');
});

// User profile tests
test('Get user profile', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/users/profile`);
    assertEqual(response.status, 200);
    assert(response.data.success, 'User profile should succeed');
    assert(response.data.data, 'Should return user data');
});

// Validation tests
test('Create emotion with invalid data should fail', async () => {
    const invalidData = {
        emotion: 'invalid_emotion',
        intensity: 15 // out of range
    };
    
    const response = await makeRequest('POST', `${API_BASE}/api/emotions`, invalidData);
    assertEqual(response.status, 400);
    assert(!response.data.success, 'Should fail validation');
    assert(response.data.errors || response.data.message, 'Should return error details');
});

test('Create journal with missing content should fail', async () => {
    const invalidData = {
        mood: 'happy'
        // missing content
    };
    
    const response = await makeRequest('POST', `${API_BASE}/api/journal`, invalidData);
    assertEqual(response.status, 400);
    assert(!response.data.success, 'Should fail validation');
});

// Authentication tests
test('Request without auth should fail for protected routes', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/emotions`, null, { 'Authorization': '' });
    assertEqual(response.status, 401);
    assert(!response.data.success, 'Should require authentication');
});

// Error handling tests
test('Non-existent endpoint should return 404', async () => {
    const response = await makeRequest('GET', `${API_BASE}/api/nonexistent`);
    assertEqual(response.status, 404);
});

test('Get non-existent emotion should return 404', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const response = await makeRequest('GET', `${API_BASE}/api/emotions/${fakeId}`);
    assertEqual(response.status, 404);
    assert(!response.data.success, 'Should fail for non-existent emotion');
});

// Data consistency tests
test('Emotion-Journal linking should work', async () => {
    // Create emotion first
    const emotionData = {
        emotion: 'anxiety',
        intensity: 6,
        context: 'Before important meeting'
    };
    
    const emotionResponse = await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData);
    assertEqual(emotionResponse.status, 201);
    const emotionId = emotionResponse.data.data.emotionEntry._id;
    
    // Create journal with emotion link
    const journalData = {
        content: 'Feeling nervous about the upcoming meeting. Need to practice my presentation.',
        mood: 'anxiety',
        tags: ['work', 'presentation'],
        emotionEntryId: emotionId
    };
    
    const journalResponse = await makeRequest('POST', `${API_BASE}/api/journal`, journalData);
    assertEqual(journalResponse.status, 201);
    assertEqual(journalResponse.data.data.journalEntry.emotionEntryId, emotionId);
});

test('Auto-linking recent emotion and journal should work', async () => {
    // Create emotion
    const emotionData = {
        emotion: 'frustration',
        intensity: 5,
        context: 'Traffic jam'
    };
    
    await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData);
    
    // Create journal without explicit linking - should auto-link to recent emotion
    const journalData = {
        content: 'Stuck in traffic for an hour. This is so frustrating.',
        mood: 'frustration',
        tags: ['traffic', 'commute']
    };
    
    const journalResponse = await makeRequest('POST', `${API_BASE}/api/journal`, journalData);
    assertEqual(journalResponse.status, 201);
    assert(journalResponse.data.data.journalEntry.emotionEntryId, 'Should auto-link to recent emotion');
});

// Run all tests
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export { makeRequest, test, assert, assertEqual, assertContains, runTests };