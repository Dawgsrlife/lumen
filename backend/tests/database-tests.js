/**
 * Database and Model Tests for Lumen Backend
 * Tests MongoDB models, validation, and data integrity
 * Run with: node tests/database-tests.js
 */

const mongoose = require('mongoose');
// Import models - adjust paths based on build output
let EmotionEntryModel, JournalEntryModel, GameSessionModel, UserModel;

try {
    // Try compiled JS first
    ({ EmotionEntryModel } = require('../dist/models/EmotionEntry.js'));
    ({ JournalEntryModel } = require('../dist/models/JournalEntry.js'));
    ({ GameSessionModel } = require('../dist/models/GameSession.js'));
    ({ UserModel } = require('../dist/models/User.js'));
    console.log('✅ Loaded compiled JavaScript models');
} catch (error) {
    console.log('⚠️  Failed to load compiled models, attempting TypeScript fallback...');
    console.log('Error:', error.message);
    
    // Fallback to TypeScript with ts-node
    require('ts-node/register');
    ({ EmotionEntryModel } = require('../src/models/EmotionEntry.ts'));
    ({ JournalEntryModel } = require('../src/models/JournalEntry.ts'));
    ({ GameSessionModel } = require('../src/models/GameSession.ts'));
    ({ UserModel } = require('../src/models/User.ts'));
    console.log('✅ Loaded TypeScript models with ts-node');
}

// Test result tracking
let tests = [];
let passed = 0;
let failed = 0;
let isConnected = false;

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

function assertType(value, type, message) {
    if (typeof value !== type) {
        throw new Error(message || `Expected ${type}, got ${typeof value}`);
    }
}

// Test runner
async function runTests() {
    console.log('🗄️  Starting Database Model Tests\n');
    
    // Connect to test database
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumen_test';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to test database\n');
        isConnected = true;
    } catch (error) {
        console.log('❌ Failed to connect to database:', error.message);
        console.log('   Make sure MongoDB is running and MONGODB_URI is set\n');
        process.exit(1);
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

    console.log(`\n📊 Database Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${tests.length}`);
    
    // Cleanup
    if (isConnected) {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
    
    if (failed === 0) {
        console.log('\n🎉 All database tests passed!');
    } else {
        console.log('\n⚠️  Some database tests failed. Check the output above for details.');
    }
}

// Clear test data before running tests
async function clearTestData() {
    const testClerkId = 'test_user_db';
    
    await EmotionEntryModel.deleteMany({ clerkId: testClerkId });
    await JournalEntryModel.deleteMany({ clerkId: testClerkId });
    await GameSessionModel.deleteMany({ clerkId: testClerkId });
    await UserModel.deleteMany({ clerkId: testClerkId });
}

// Emotion Entry Model Tests
test('Create valid emotion entry', async () => {
    await clearTestData();
    
    const emotionData = {
        clerkId: 'test_user_db',
        emotion: 'happy',
        intensity: 7,
        context: 'Great day at work',
        location: 'office'
    };
    
    const emotion = new EmotionEntryModel(emotionData);
    const saved = await emotion.save();
    
    assert(saved._id, 'Should have an ID');
    assertEqual(saved.emotion, 'happy', 'Should save emotion correctly');
    assertEqual(saved.intensity, 7, 'Should save intensity correctly');
    assert(saved.createdAt, 'Should have createdAt timestamp');
    assert(saved.updatedAt, 'Should have updatedAt timestamp');
});

test('Emotion entry validation should work', async () => {
    // Test invalid emotion
    try {
        const invalidEmotion = new EmotionEntryModel({
            clerkId: 'test_user_db',
            emotion: 'invalid_emotion',
            intensity: 5
        });
        await invalidEmotion.save();
        assert(false, 'Should not save invalid emotion');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should throw validation error');
    }
    
    // Test invalid intensity
    try {
        const invalidIntensity = new EmotionEntryModel({
            clerkId: 'test_user_db',
            emotion: 'happy',
            intensity: 15 // out of range
        });
        await invalidIntensity.save();
        assert(false, 'Should not save invalid intensity');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should throw validation error for intensity');
    }
});

test('Emotion entry defaults should work', async () => {
    const emotionData = {
        clerkId: 'test_user_db',
        emotion: 'sad'
        // intensity not provided - should default to 5
    };
    
    const emotion = new EmotionEntryModel(emotionData);
    const saved = await emotion.save();
    
    assertEqual(saved.intensity, 5, 'Should default intensity to 5');
});

// Journal Entry Model Tests
test('Create valid journal entry', async () => {
    const journalData = {
        clerkId: 'test_user_db',
        content: 'This is a test journal entry for database validation.',
        mood: 'happy',
        tags: ['test', 'database', 'validation'],
        isPrivate: false
    };
    
    const journal = new JournalEntryModel(journalData);
    const saved = await journal.save();
    
    assert(saved._id, 'Should have an ID');
    assertEqual(saved.content, journalData.content, 'Should save content correctly');
    assertEqual(saved.mood, 'happy', 'Should save mood correctly');
    assert(Array.isArray(saved.tags), 'Tags should be an array');
    assertEqual(saved.tags.length, 3, 'Should save all tags');
    assertEqual(saved.isPrivate, false, 'Should save privacy setting');
});

test('Journal entry validation should work', async () => {
    // Test missing content
    try {
        const invalidJournal = new JournalEntryModel({
            clerkId: 'test_user_db',
            mood: 'happy'
            // content missing
        });
        await invalidJournal.save();
        assert(false, 'Should not save journal without content');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should throw validation error');
    }
    
    // Test invalid mood
    try {
        const invalidMood = new JournalEntryModel({
            clerkId: 'test_user_db',
            content: 'Test content',
            mood: 'invalid_mood'
        });
        await invalidMood.save();
        assert(false, 'Should not save invalid mood');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should throw validation error for mood');
    }
});

test('Journal entry with emotion reference', async () => {
    // First create an emotion
    const emotionData = {
        clerkId: 'test_user_db',
        emotion: 'anxiety',
        intensity: 6
    };
    const emotion = new EmotionEntryModel(emotionData);
    const savedEmotion = await emotion.save();
    
    // Create journal entry with emotion reference
    const journalData = {
        clerkId: 'test_user_db',
        content: 'Feeling anxious about the upcoming presentation.',
        mood: 'anxiety',
        emotionEntryId: savedEmotion._id
    };
    
    const journal = new JournalEntryModel(journalData);
    const savedJournal = await journal.save();
    
    assertEqual(savedJournal.emotionEntryId.toString(), savedEmotion._id.toString(), 
                'Should reference emotion entry correctly');
});

// Game Session Model Tests
test('Create valid game session', async () => {
    const gameData = {
        clerkId: 'test_user_db',
        gameType: 'meditation',
        duration: 20,
        score: 85,
        notes: 'Great meditation session',
        emotionBefore: 'stress',
        emotionAfter: 'calm',
        completionStatus: 'completed'
    };
    
    const game = new GameSessionModel(gameData);
    const saved = await game.save();
    
    assert(saved._id, 'Should have an ID');
    assertEqual(saved.gameType, 'meditation', 'Should save game type correctly');
    assertEqual(saved.duration, 20, 'Should save duration correctly');
    assertEqual(saved.score, 85, 'Should save score correctly');
    assertEqual(saved.emotionBefore, 'stress', 'Should save emotion before');
    assertEqual(saved.emotionAfter, 'calm', 'Should save emotion after');
    assertEqual(saved.completionStatus, 'completed', 'Should save completion status');
});

test('Game session validation should work', async () => {
    // Test invalid game type
    try {
        const invalidGame = new GameSessionModel({
            clerkId: 'test_user_db',
            gameType: 'invalid_game',
            duration: 10
        });
        await invalidGame.save();
        assert(false, 'Should not save invalid game type');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should throw validation error');
    }
    
    // Test invalid duration
    try {
        const invalidDuration = new GameSessionModel({
            clerkId: 'test_user_db',
            gameType: 'meditation',
            duration: 600 // too long
        });
        await invalidDuration.save();
        assert(false, 'Should not save invalid duration');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should throw validation error for duration');
    }
});

test('Game session defaults should work', async () => {
    const gameData = {
        clerkId: 'test_user_db',
        gameType: 'breathing',
        duration: 10
        // completionStatus should default to 'completed'
        // emotionBefore should default to 'neutral'
    };
    
    const game = new GameSessionModel(gameData);
    const saved = await game.save();
    
    assertEqual(saved.completionStatus, 'completed', 'Should default completion status');
    assertEqual(saved.emotionBefore, 'neutral', 'Should default emotion before');
});

// User Model Tests
test('Create valid user', async () => {
    const userData = {
        clerkId: 'test_user_db',
        email: 'test@example.com',
        name: 'Test User',
        timezone: 'America/New_York',
        preferences: {
            notifications: true,
            dailyReminders: false
        }
    };
    
    const user = new UserModel(userData);
    const saved = await user.save();
    
    assert(saved._id, 'Should have an ID');
    assertEqual(saved.clerkId, 'test_user_db', 'Should save clerk ID correctly');
    assertEqual(saved.email, 'test@example.com', 'Should save email correctly');
    assertEqual(saved.name, 'Test User', 'Should save name correctly');
    assert(saved.preferences, 'Should save preferences');
    assertEqual(saved.preferences.notifications, true, 'Should save notification preference');
});

test('User validation should work', async () => {
    // Test duplicate clerk ID
    const userData1 = {
        clerkId: 'duplicate_user',
        email: 'user1@example.com',
        name: 'User One'
    };
    
    const userData2 = {
        clerkId: 'duplicate_user',
        email: 'user2@example.com',
        name: 'User Two'
    };
    
    const user1 = new UserModel(userData1);
    await user1.save();
    
    try {
        const user2 = new UserModel(userData2);
        await user2.save();
        assert(false, 'Should not allow duplicate clerk ID');
    } catch (error) {
        assert(error.code === 11000, 'Should throw duplicate key error');
    }
});

// Database relationships and indexing tests
test('Database indexes should work', async () => {
    // Create multiple entries for the same user
    const clerkId = 'index_test_user';
    
    // Create emotions
    for (let i = 0; i < 5; i++) {
        const emotion = new EmotionEntryModel({
            clerkId: clerkId,
            emotion: 'happy',
            intensity: i + 1
        });
        await emotion.save();
    }
    
    // Query should be fast due to index on clerkId
    const startTime = Date.now();
    const emotions = await EmotionEntryModel.find({ clerkId: clerkId });
    const endTime = Date.now();
    
    assertEqual(emotions.length, 5, 'Should find all emotions for user');
    assert(endTime - startTime < 100, 'Query should be fast with index');
    
    // Cleanup
    await EmotionEntryModel.deleteMany({ clerkId: clerkId });
});

test('Date filtering should work', async () => {
    const clerkId = 'date_test_user';
    
    // Create emotions with different dates
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const emotions = [
        { clerkId, emotion: 'happy', intensity: 5, createdAt: now },
        { clerkId, emotion: 'sad', intensity: 3, createdAt: yesterday },
        { clerkId, emotion: 'anxiety', intensity: 7, createdAt: lastWeek }
    ];
    
    for (const emotionData of emotions) {
        const emotion = new EmotionEntryModel(emotionData);
        await emotion.save();
    }
    
    // Query for last 2 days
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const recentEmotions = await EmotionEntryModel.find({
        clerkId: clerkId,
        createdAt: { $gte: twoDaysAgo }
    });
    
    assertEqual(recentEmotions.length, 2, 'Should find emotions from last 2 days');
    
    // Cleanup
    await EmotionEntryModel.deleteMany({ clerkId: clerkId });
});

// Data aggregation tests
test('Aggregation queries should work', async () => {
    const clerkId = 'aggregation_test_user';
    
    // Create test data
    const emotions = [
        { emotion: 'happy', intensity: 8 },
        { emotion: 'happy', intensity: 6 },
        { emotion: 'sad', intensity: 4 },
        { emotion: 'anxiety', intensity: 7 }
    ];
    
    for (const emotionData of emotions) {
        const emotion = new EmotionEntryModel({
            clerkId: clerkId,
            ...emotionData
        });
        await emotion.save();
    }
    
    // Test aggregation - average intensity by emotion
    const aggregation = await EmotionEntryModel.aggregate([
        { $match: { clerkId: clerkId } },
        {
            $group: {
                _id: '$emotion',
                avgIntensity: { $avg: '$intensity' },
                count: { $sum: 1 }
            }
        }
    ]);
    
    assert(aggregation.length >= 3, 'Should have aggregated results');
    
    // Find happy emotions average
    const happyStats = aggregation.find(stat => stat._id === 'happy');
    assert(happyStats, 'Should have happy emotion stats');
    assertEqual(happyStats.avgIntensity, 7, 'Should calculate correct average');
    assertEqual(happyStats.count, 2, 'Should count correctly');
    
    // Cleanup
    await EmotionEntryModel.deleteMany({ clerkId: clerkId });
});

// Schema validation edge cases
test('Schema field limits should work', async () => {
    // Test maximum content length for journal
    const longContent = 'a'.repeat(10001); // Over 10000 char limit
    
    try {
        const journal = new JournalEntryModel({
            clerkId: 'test_user_db',
            content: longContent,
            mood: 'happy'
        });
        await journal.save();
        assert(false, 'Should not save content over limit');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should validate content length');
    }
});

test('Required fields should be enforced', async () => {
    // Test missing required field
    try {
        const emotion = new EmotionEntryModel({
            // clerkId missing
            emotion: 'happy',
            intensity: 5
        });
        await emotion.save();
        assert(false, 'Should not save without required field');
    } catch (error) {
        assert(error.name === 'ValidationError', 'Should require clerkId');
    }
});

// Concurrent operations test
test('Concurrent saves should work', async () => {
    const clerkId = 'concurrent_test_user';
    
    // Create multiple emotions concurrently
    const promises = [];
    for (let i = 0; i < 10; i++) {
        const emotion = new EmotionEntryModel({
            clerkId: clerkId,
            emotion: 'happy',
            intensity: i % 10 + 1
        });
        promises.push(emotion.save());
    }
    
    const results = await Promise.all(promises);
    assertEqual(results.length, 10, 'Should save all emotions concurrently');
    
    // Verify all were saved
    const saved = await EmotionEntryModel.find({ clerkId: clerkId });
    assertEqual(saved.length, 10, 'Should find all saved emotions');
    
    // Cleanup
    await EmotionEntryModel.deleteMany({ clerkId: clerkId });
});

// Model method tests
test('Model instance methods should work', async () => {
    const emotion = new EmotionEntryModel({
        clerkId: 'test_user_db',
        emotion: 'happy',
        intensity: 7,
        context: 'Great day'
    });
    
    // Test toObject method
    const obj = emotion.toObject();
    assert(obj.emotion, 'toObject should include emotion');
    assert(obj.intensity, 'toObject should include intensity');
    
    // Test JSON serialization
    const json = JSON.stringify(emotion);
    const parsed = JSON.parse(json);
    assertEqual(parsed.emotion, 'happy', 'Should serialize to JSON correctly');
});

// Run tests if called directly
if (require.main === module) {
    // Load environment variables
    require('dotenv').config();
    
    runTests().catch(console.error);
}

module.exports = { test, assert, assertEqual, runTests };