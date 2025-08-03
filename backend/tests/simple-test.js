/**
 * Simple Test to verify basic functionality works
 * Tests without complex module imports
 */

const { makeRequest } = require('./api-tests.js');

const API_BASE = 'http://localhost:5001';

async function runSimpleTests() {
    console.log('🧪 Running Simple Backend Tests\n');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Health endpoint
    try {
        console.log('📋 Testing health endpoint...');
        const response = await makeRequest('GET', `${API_BASE}/health`);
        
        if (response.status === 200 && response.data.success) {
            console.log('✅ Health endpoint working');
            passed++;
        } else {
            console.log('❌ Health endpoint failed');
            failed++;
        }
    } catch (error) {
        console.log('❌ Health endpoint error:', error.message);
        failed++;
    }
    
    // Test 2: Test endpoint
    try {
        console.log('📋 Testing test endpoint...');
        const response = await makeRequest('GET', `${API_BASE}/api/test`);
        
        if (response.status === 200 && response.data.success) {
            console.log('✅ Test endpoint working');
            passed++;
        } else {
            console.log('❌ Test endpoint failed');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test endpoint error:', error.message);
        failed++;
    }
    
    // Test 3: Create emotion entry (will test auth and validation)
    try {
        console.log('📋 Testing emotion creation...');
        const emotionData = {
            emotion: 'happy',
            intensity: 7,
            context: 'Simple test'
        };
        
        const response = await makeRequest('POST', `${API_BASE}/api/emotions`, emotionData);
        
        if (response.status === 201 && response.data.success) {
            console.log('✅ Emotion creation working');
            console.log(`   Created emotion: ${response.data.data.emotionEntry.emotion} (intensity: ${response.data.data.emotionEntry.intensity})`);
            passed++;
        } else {
            console.log('❌ Emotion creation failed:', response.data.message || 'Unknown error');
            failed++;
        }
    } catch (error) {
        console.log('❌ Emotion creation error:', error.message);
        failed++;
    }
    
    // Test 4: Create journal entry (will test AI integration)
    try {
        console.log('📋 Testing journal creation...');
        const journalData = {
            content: 'This is a simple test journal entry. I am feeling good about testing the backend functionality.',
            mood: 'happy',
            tags: ['test', 'simple'],
            isPrivate: false
        };
        
        const response = await makeRequest('POST', `${API_BASE}/api/journal`, journalData);
        
        if (response.status === 201 && response.data.success) {
            console.log('✅ Journal creation working');
            
            if (response.data.data.analysis) {
                console.log(`   AI Analysis: ${response.data.data.analysis.sentiment} sentiment, ${response.data.data.analysis.riskAssessment} risk`);
            }
            passed++;
        } else {
            console.log('❌ Journal creation failed:', response.data.message || 'Unknown error');
            failed++;
        }
    } catch (error) {
        console.log('❌ Journal creation error:', error.message);
        failed++;
    }
    
    // Test 5: Get analytics
    try {
        console.log('📋 Testing analytics...');
        const response = await makeRequest('GET', `${API_BASE}/api/analytics/overview?days=1`);
        
        if (response.status === 200 && response.data.success) {
            console.log('✅ Analytics working');
            console.log(`   Found ${response.data.data.emotions?.totalEntries || 0} emotions, ${response.data.data.journals?.totalEntries || 0} journals`);
            passed++;
        } else {
            console.log('❌ Analytics failed:', response.data.message || 'Unknown error');
            failed++;
        }
    } catch (error) {
        console.log('❌ Analytics error:', error.message);
        failed++;
    }
    
    // Summary
    console.log('\n📊 Simple Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${passed + failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 All simple tests passed! Backend is working correctly.');
        console.log('💡 You can now run the full test suite with: npm test');
    } else {
        console.log('\n⚠️  Some tests failed. Make sure:');
        console.log('   1. Backend server is running (npm run dev)');
        console.log('   2. MongoDB is connected');
        console.log('   3. Environment variables are configured');
    }
    
    return failed === 0;
}

// Helper function to wait
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if server is running first
async function checkServerHealth() {
    try {
        const response = await makeRequest('GET', `${API_BASE}/health`);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('🚀 Lumen Backend Simple Test Suite\n');
    
    // Check if server is running
    console.log('🔍 Checking if backend server is running...');
    const serverRunning = await checkServerHealth();
    
    if (!serverRunning) {
        console.log('❌ Backend server is not responding on port 5001');
        console.log('💡 Start the server with: npm run dev');
        console.log('   Then run this test again: node tests/simple-test.js\n');
        process.exit(1);
    }
    
    console.log('✅ Backend server is running\n');
    
    // Run tests
    const success = await runSimpleTests();
    process.exit(success ? 0 : 1);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { runSimpleTests, checkServerHealth };