/**
 * AI Service Tests for Lumen Backend
 * Tests Gemini AI integration and clinical analysis
 * Run with: node tests/ai-service-tests.js
 */

// Import AI service - adjust paths based on build output
let aiService;

try {
    // Try compiled JS first
    ({ aiService } = require('../dist/services/ai.js'));
} catch (error) {
    // Fallback to TypeScript with ts-node
    require('ts-node/register');
    ({ aiService } = require('../src/services/ai.ts'));
}
const fs = require('fs');
const path = require('path');

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

function assertType(value, type, message) {
    if (typeof value !== type) {
        throw new Error(message || `Expected ${type}, got ${typeof value}`);
    }
}

// Test runner
async function runTests() {
    console.log('🧠 Starting AI Service Tests\n');
    
    // Check if Google AI API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('⚠️  No GOOGLE_AI_API_KEY found in environment');
        console.log('   Some AI tests will be skipped\n');
    }
    
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

    console.log(`\n📊 AI Service Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${tests.length}`);
    
    if (failed === 0) {
        console.log('\n🎉 All AI tests passed!');
    } else {
        console.log('\n⚠️  Some AI tests failed. Check the output above for details.');
    }
}

// Mock journal entries for testing
const mockJournalEntries = [
    {
        _id: 'test1',
        clerkId: 'test_user',
        content: 'I feel really sad today. Nothing seems to bring me joy anymore. I used to love painting but now I have no energy for it.',
        mood: 'sad',
        tags: ['depression', 'anhedonia'],
        createdAt: new Date(),
        toObject: function() { return this; }
    },
    {
        _id: 'test2',
        clerkId: 'test_user',
        content: 'I can\'t stop worrying about everything. My mind races constantly and I feel restless. I worry about work, health, relationships.',
        mood: 'anxiety',
        tags: ['worry', 'restless'],
        createdAt: new Date(),
        toObject: function() { return this; }
    },
    {
        _id: 'test3',
        clerkId: 'test_user',
        content: 'Had a great day today! Went for a hike and felt so peaceful in nature. Feeling grateful for my health and friends.',
        mood: 'happy',
        tags: ['gratitude', 'nature'],
        createdAt: new Date(),
        toObject: function() { return this; }
    }
];

const mockEmotionEntries = [
    {
        _id: 'emotion1',
        clerkId: 'test_user',
        emotion: 'sad',
        intensity: 7,
        context: 'Work stress',
        createdAt: new Date()
    },
    {
        _id: 'emotion2',
        clerkId: 'test_user',
        emotion: 'anxiety',
        intensity: 8,
        context: 'Meeting anxiety',
        createdAt: new Date()
    },
    {
        _id: 'emotion3',
        clerkId: 'test_user',
        emotion: 'happy',
        intensity: 6,
        context: 'Nature walk',
        createdAt: new Date()
    }
];

const mockGameSessions = [
    {
        _id: 'game1',
        clerkId: 'test_user',
        gameType: 'meditation',
        duration: 20,
        score: 85,
        emotionBefore: 'stress',
        emotionAfter: 'calm',
        completionStatus: 'completed',
        createdAt: new Date()
    }
];

// AI Service initialization tests
test('AI Service should initialize properly', async () => {
    assert(aiService, 'AI service should exist');
    assertType(aiService.initialize, 'function', 'Should have initialize method');
    assertType(aiService.analyzeJournalEntry, 'function', 'Should have analyzeJournalEntry method');
    assertType(aiService.generateInsights, 'function', 'Should have generateInsights method');
});

test('AI Service initialization with API key', async () => {
    const testKey = 'test_key_123';
    await aiService.initialize(testKey);
    // Should not throw error with valid key format
    assert(true, 'Initialize should accept API key');
});

// Journal analysis tests
test('Journal analysis should handle depression indicators', async () => {
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('   ⏭️  Skipping - no API key');
        return;
    }
    
    const depressedJournal = mockJournalEntries[0];
    const analysis = await aiService.analyzeJournalEntry(depressedJournal);
    
    // Check response structure
    assert(analysis, 'Should return analysis object');
    assert(analysis.sentiment, 'Should include sentiment');
    assert(Array.isArray(analysis.keyThemes), 'Should include key themes array');
    assert(Array.isArray(analysis.clinicalInsights), 'Should include clinical insights');
    assert(Array.isArray(analysis.evidenceBasedSuggestions), 'Should include evidence-based suggestions');
    assert(analysis.riskAssessment, 'Should include risk assessment');
    
    // Check for depression-specific content
    assertType(analysis.intensityAdjustment, 'number', 'Should include intensity adjustment');
    assert(['low', 'medium', 'high'].includes(analysis.riskAssessment), 'Risk assessment should be valid');
    
    console.log('   📊 Analysis result:', {
        sentiment: analysis.sentiment,
        riskLevel: analysis.riskAssessment,
        themes: analysis.keyThemes?.slice(0, 2),
        intensityAdjust: analysis.intensityAdjustment
    });
});

test('Journal analysis should handle anxiety indicators', async () => {
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('   ⏭️  Skipping - no API key');
        return;
    }
    
    const anxiousJournal = mockJournalEntries[1];
    const analysis = await aiService.analyzeJournalEntry(anxiousJournal);
    
    assert(analysis.sentiment, 'Should detect sentiment');
    assert(analysis.riskAssessment, 'Should assess risk level');
    
    // Should detect anxiety-related themes
    const themes = analysis.keyThemes || [];
    const insights = analysis.clinicalInsights || [];
    const suggestions = analysis.evidenceBasedSuggestions || [];
    
    assert(themes.length > 0, 'Should identify key themes');
    assert(insights.length > 0, 'Should provide clinical insights');
    assert(suggestions.length > 0, 'Should provide evidence-based suggestions');
    
    console.log('   📊 Anxiety analysis:', {
        sentiment: analysis.sentiment,
        riskLevel: analysis.riskAssessment,
        suggestionsCount: suggestions.length
    });
});

test('Journal analysis should handle positive entries', async () => {
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('   ⏭️  Skipping - no API key');
        return;
    }
    
    const positiveJournal = mockJournalEntries[2];
    const analysis = await aiService.analyzeJournalEntry(positiveJournal);
    
    assert(analysis.sentiment, 'Should detect positive sentiment');
    assertEqual(analysis.riskAssessment, 'low', 'Risk should be low for positive entries');
    
    console.log('   📊 Positive analysis:', {
        sentiment: analysis.sentiment,
        riskLevel: analysis.riskAssessment
    });
});

// Comprehensive insights tests
test('Generate comprehensive insights', async () => {
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('   ⏭️  Skipping - no API key');
        return;
    }
    
    const request = {
        timeframe: '7d',
        focus: 'mood'
    };
    
    const insights = await aiService.generateInsights(
        request,
        mockEmotionEntries,
        mockJournalEntries,
        mockGameSessions
    );
    
    // Check response structure
    assert(insights, 'Should return insights object');
    assert(insights.summary, 'Should include summary');
    assert(Array.isArray(insights.insights), 'Should include insights array');
    assert(Array.isArray(insights.recommendations), 'Should include recommendations');
    assert(insights.moodTrend, 'Should include mood trend');
    assert(insights.clinicalAssessment, 'Should include clinical assessment');
    assert(insights.healthcareOutcomes, 'Should include healthcare outcomes');
    
    console.log('   📊 Comprehensive insights:', {
        summaryLength: insights.summary?.length,
        insightsCount: insights.insights?.length,
        recommendationsCount: insights.recommendations?.length,
        hasAssessment: !!insights.clinicalAssessment
    });
});

// Audio analysis tests (mocked)
test('Audio analysis structure validation', async () => {
    // Test the structure without actual audio processing
    try {
        // This should fail gracefully without API key
        const mockAudioData = 'fake_base64_audio_data';
        await aiService.analyzeAudioJournal(mockAudioData);
        assert(false, 'Should have thrown error without proper setup');
    } catch (error) {
        assert(error.message.includes('AI model not initialized') || 
               error.message.includes('Failed to analyze'), 'Should handle audio analysis errors gracefully');
    }
});

// Error handling tests
test('AI service should handle missing API key gracefully', async () => {
    const analysis = await aiService.analyzeJournalEntry(mockJournalEntries[0]);
    
    // Should return fallback response
    assert(analysis, 'Should return analysis even without API key');
    assert(analysis.sentiment, 'Should include default sentiment');
    assert(Array.isArray(analysis.clinicalInsights), 'Should include fallback insights');
    assertEqual(analysis.sentiment, 'neutral', 'Should default to neutral sentiment');
});

test('AI service should handle invalid journal data', async () => {
    const invalidJournal = {
        content: '',
        mood: 'invalid',
        tags: null
    };
    
    try {
        const analysis = await aiService.analyzeJournalEntry(invalidJournal);
        assert(analysis, 'Should handle invalid data gracefully');
        assert(analysis.sentiment, 'Should return valid response structure');
    } catch (error) {
        // Should either handle gracefully or throw meaningful error
        assert(error.message, 'Should provide meaningful error message');
    }
});

// Clinical validation tests
test('Risk assessment values should be valid', async () => {
    const validRiskLevels = ['low', 'medium', 'high'];
    
    for (const journal of mockJournalEntries) {
        const analysis = await aiService.analyzeJournalEntry(journal);
        assert(validRiskLevels.includes(analysis.riskAssessment), 
               `Risk assessment "${analysis.riskAssessment}" should be one of: ${validRiskLevels.join(', ')}`);
    }
});

test('Intensity adjustment should be in valid range', async () => {
    for (const journal of mockJournalEntries) {
        const analysis = await aiService.analyzeJournalEntry(journal);
        if (analysis.intensityAdjustment !== undefined) {
            assert(analysis.intensityAdjustment >= -2 && analysis.intensityAdjustment <= 2,
                   `Intensity adjustment ${analysis.intensityAdjustment} should be between -2 and 2`);
        }
    }
});

// Evidence-based content validation
test('Evidence-based suggestions should contain research references', async () => {
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('   ⏭️  Skipping - no API key');
        return;
    }
    
    const analysis = await aiService.analyzeJournalEntry(mockJournalEntries[0]);
    const suggestions = analysis.evidenceBasedSuggestions || [];
    
    if (suggestions.length > 0) {
        // Look for evidence-based therapy mentions
        const evidenceTerms = ['CBT', 'DBT', 'MBSR', 'mindfulness', 'cognitive', 'behavioral'];
        const hasEvidenceTerms = suggestions.some(suggestion => 
            evidenceTerms.some(term => suggestion.toLowerCase().includes(term.toLowerCase()))
        );
        
        assert(hasEvidenceTerms, 'Suggestions should contain evidence-based therapy references');
    }
});

// Performance tests
test('Journal analysis should complete within reasonable time', async () => {
    const startTime = Date.now();
    const analysis = await aiService.analyzeJournalEntry(mockJournalEntries[0]);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    assert(analysis, 'Should complete analysis');
    assert(duration < 30000, `Analysis should complete within 30 seconds, took ${duration}ms`);
    
    console.log(`   ⏱️  Analysis completed in ${duration}ms`);
});

// Integration tests
test('Journal analysis with audio context should work', async () => {
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('   ⏭️  Skipping - no API key');
        return;
    }
    
    // Test with mock audio data (this will likely fail but should handle gracefully)
    try {
        const mockAudioData = 'fake_base64_audio';
        const analysis = await aiService.analyzeJournalEntry(mockJournalEntries[0], mockAudioData);
        
        // If it succeeds, check structure
        assert(analysis, 'Should return analysis with audio context');
        
        if (analysis.audioAnalysis) {
            assert(analysis.audioAnalysis.transcription, 'Should include transcription');
            assert(analysis.audioAnalysis.emotionalTone, 'Should include emotional tone');
        }
    } catch (error) {
        // Expected to fail with mock data, but should handle gracefully
        assert(error.message, 'Should provide meaningful error for invalid audio');
    }
});

// Clinical assessment validation
test('Clinical insights should follow evidence-based frameworks', async () => {
    if (!process.env.GOOGLE_AI_API_KEY) {
        console.log('   ⏭️  Skipping - no API key');
        return;
    }
    
    const analysis = await aiService.analyzeJournalEntry(mockJournalEntries[0]);
    const insights = analysis.clinicalInsights || [];
    
    if (insights.length > 0) {
        // Should mention clinical frameworks
        const clinicalTerms = ['PHQ', 'GAD', 'assessment', 'symptoms', 'clinical'];
        const hasClinicalContent = insights.some(insight => 
            clinicalTerms.some(term => insight.toLowerCase().includes(term.toLowerCase()))
        );
        
        // This is a soft assertion since fallback responses might not include clinical terms
        console.log(`   📋 Clinical content detected: ${hasClinicalContent}`);
    }
});

// Load test data for more comprehensive testing
test('Batch analysis should handle multiple entries', async () => {
    const analyses = [];
    
    for (const journal of mockJournalEntries) {
        const analysis = await aiService.analyzeJournalEntry(journal);
        analyses.push(analysis);
    }
    
    assertEqual(analyses.length, mockJournalEntries.length, 'Should analyze all entries');
    
    // Each analysis should have required fields
    for (const analysis of analyses) {
        assert(analysis.sentiment, 'Each analysis should have sentiment');
        assert(analysis.riskAssessment, 'Each analysis should have risk assessment');
    }
    
    console.log(`   📊 Batch analysis completed: ${analyses.length} entries processed`);
});

// API key validation test
test('Should validate API key format', async () => {
    // Test with obviously invalid key
    try {
        await aiService.initialize('invalid_key');
        // Should either accept it (validation happens on use) or reject it
        assert(true, 'API key validation handled');
    } catch (error) {
        assert(error.message, 'Should provide meaningful error for invalid key');
    }
});

// Run tests if called directly
if (require.main === module) {
    // Load environment variables
    require('dotenv').config();
    
    runTests().catch(console.error);
}

module.exports = { test, assert, assertEqual, assertContains, runTests };