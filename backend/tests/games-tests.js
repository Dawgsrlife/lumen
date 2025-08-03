/**
 * Comprehensive Games Tests
 * Tests game session management, scoring, progress tracking, and therapeutic gaming features
 * Run with: node tests/games-tests.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5001';
const TEST_CLERK_ID = 'test_games_user_123';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorLog(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// HTTP request helper
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
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
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

// Generate test game session data
function generateTestGameSession(gameType) {
    const gameData = {
        'mindfulness_breathing': {
            breathingPattern: 'box_breathing',
            cycles: 10,
            sessionDuration: 600,
            heartRateData: [72, 71, 70, 68, 66, 65, 64, 66, 67, 68],
            calmnessScore: 8.5
        },
        'cognitive_restructuring': {
            thoughtsAnalyzed: 5,
            negativeThoughts: 3,
            reframedThoughts: 3,
            confidenceRatings: [6, 7, 8, 7, 9],
            cognitiveDistortions: ['catastrophizing', 'all_or_nothing']
        },
        'emotional_regulation': {
            emotionsIdentified: ['anxiety', 'frustration', 'calm'],
            copingStrategies: ['deep_breathing', 'progressive_relaxation'],
            effectivenessRatings: [8, 9],
            triggerSituations: ['work_presentation', 'traffic_jam']
        },
        'stress_relief': {
            stressLevel: { before: 8, after: 4 },
            activitiesCompleted: ['guided_meditation', 'muscle_relaxation'],
            relaxationTechniques: ['visualization', 'body_scan'],
            moodImprovement: 4.5
        }
    };

    return {
        gameType,
        startTime: new Date().toISOString(),
        duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        score: Math.floor(Math.random() * 1000) + 100,
        difficultyLevel: Math.floor(Math.random() * 5) + 1,
        completed: true,
        gameData: gameData[gameType] || {},
        achievements: [],
        notes: `Test session for ${gameType}`
    };
}

// Test suite
const tests = [
    {
        name: 'Game Configuration and Setup',
        test: async () => {
            colorLog('Testing game configuration...', 'blue');
            
            // Test available games
            const gamesResponse = await makeRequest('GET', `${API_BASE}/api/games/available`);
            if (gamesResponse.status !== 200) {
                throw new Error(`Get available games failed: ${gamesResponse.status}`);
            }
            
            const games = gamesResponse.data;
            if (!Array.isArray(games.games) || games.games.length === 0) {
                throw new Error('No games available');
            }
            
            colorLog(`✓ Available games: ${games.games.length}`, 'green');
            games.games.forEach(game => {
                colorLog(`   • ${game.name} (${game.category})`, 'cyan');
            });
            
            // Test game details
            const gameId = games.games[0].id;
            const detailsResponse = await makeRequest('GET', `${API_BASE}/api/games/${gameId}`);
            if (detailsResponse.status !== 200) {
                throw new Error(`Get game details failed: ${detailsResponse.status}`);
            }
            
            const gameDetails = detailsResponse.data;
            if (!gameDetails.name || !gameDetails.instructions || !gameDetails.therapeuticGoals) {
                throw new Error('Invalid game details response');
            }
            
            colorLog(`✓ Game details loaded: ${gameDetails.name}`, 'green');
            colorLog(`   Therapeutic goals: ${gameDetails.therapeuticGoals.length}`, 'cyan');
            
            return { games: games.games, gameDetails };
        }
    },
    
    {
        name: 'Game Session Creation',
        test: async () => {
            colorLog('Testing game session creation...', 'blue');
            
            const gameTypes = ['mindfulness_breathing', 'cognitive_restructuring', 'emotional_regulation', 'stress_relief'];
            const createdSessions = [];
            
            for (const gameType of gameTypes) {
                const sessionData = {
                    gameType,
                    difficultyLevel: Math.floor(Math.random() * 5) + 1,
                    targetDuration: 900, // 15 minutes
                    personalizedSettings: {
                        anxietyLevel: Math.floor(Math.random() * 10) + 1,
                        preferredTechniques: ['breathing', 'visualization']
                    }
                };
                
                const response = await makeRequest('POST', `${API_BASE}/api/games/session`, sessionData);
                if (response.status !== 201) {
                    throw new Error(`Session creation failed for ${gameType}: ${response.status}`);
                }
                
                const session = response.data;
                if (!session.sessionId || !session.gameType || !session.status) {
                    throw new Error(`Invalid session response for ${gameType}`);
                }
                
                colorLog(`✓ Created ${gameType} session: ${session.sessionId}`, 'green');
                createdSessions.push(session);
            }
            
            return createdSessions;
        }
    },
    
    {
        name: 'Game Session Management',
        test: async () => {
            colorLog('Testing game session management...', 'blue');
            
            // Create a test session
            const sessionData = generateTestGameSession('mindfulness_breathing');
            const createResponse = await makeRequest('POST', `${API_BASE}/api/games/session`, sessionData);
            
            if (createResponse.status !== 201) {
                throw new Error(`Session creation failed: ${createResponse.status}`);
            }
            
            const sessionId = createResponse.data.sessionId;
            colorLog(`✓ Created session: ${sessionId}`, 'green');
            
            // Start the session
            const startResponse = await makeRequest('POST', `${API_BASE}/api/games/session/${sessionId}/start`);
            if (startResponse.status !== 200) {
                throw new Error(`Session start failed: ${startResponse.status}`);
            }
            
            colorLog('✓ Started game session', 'green');
            
            // Update session progress
            const progressData = {
                progress: 50,
                currentScore: 450,
                timeElapsed: 300,
                gameData: {
                    breathingCycles: 5,
                    heartRateVariability: 0.85,
                    relaxationLevel: 7
                }
            };
            
            const updateResponse = await makeRequest('PUT', `${API_BASE}/api/games/session/${sessionId}/progress`, progressData);
            if (updateResponse.status !== 200) {
                throw new Error(`Session update failed: ${updateResponse.status}`);
            }
            
            colorLog('✓ Updated session progress', 'green');
            
            // Get session status
            const statusResponse = await makeRequest('GET', `${API_BASE}/api/games/session/${sessionId}`);
            if (statusResponse.status !== 200) {
                throw new Error(`Get session status failed: ${statusResponse.status}`);
            }
            
            const sessionStatus = statusResponse.data;
            if (!sessionStatus.status || !sessionStatus.progress || !sessionStatus.gameData) {
                throw new Error('Invalid session status response');
            }
            
            colorLog(`✓ Session status: ${sessionStatus.status}, Progress: ${sessionStatus.progress}%`, 'green');
            
            // Complete the session
            const completeData = {
                finalScore: 850,
                completed: true,
                sessionSummary: 'Excellent breathing session with significant relaxation',
                achievements: ['steady_breathing', 'heart_rate_coherence']
            };
            
            const completeResponse = await makeRequest('POST', `${API_BASE}/api/games/session/${sessionId}/complete`, completeData);
            if (completeResponse.status !== 200) {
                throw new Error(`Session completion failed: ${completeResponse.status}`);
            }
            
            colorLog('✓ Completed game session', 'green');
            
            return { sessionId, finalStatus: completeResponse.data };
        }
    },
    
    {
        name: 'Scoring and Achievement System',
        test: async () => {
            colorLog('Testing scoring and achievement system...', 'blue');
            
            // Test scoring calculation
            const scoreData = {
                gameType: 'cognitive_restructuring',
                performance: {
                    accuracy: 85,
                    timeEfficiency: 75,
                    consistency: 90,
                    improvement: 20
                },
                sessionData: {
                    thoughtsReframed: 4,
                    confidenceIncrease: 3,
                    techniquesUsed: 2
                }
            };
            
            const scoreResponse = await makeRequest('POST', `${API_BASE}/api/games/calculate-score`, scoreData);
            if (scoreResponse.status !== 200) {
                throw new Error(`Score calculation failed: ${scoreResponse.status}`);
            }
            
            const score = scoreResponse.data;
            if (typeof score.totalScore !== 'number' || !score.breakdown || !score.feedback) {
                throw new Error('Invalid score calculation response');
            }
            
            colorLog(`✓ Calculated score: ${score.totalScore}`, 'green');
            colorLog(`   Breakdown: ${Object.keys(score.breakdown).join(', ')}`, 'cyan');
            
            // Test achievement checking
            const achievementData = {
                gameType: 'mindfulness_breathing',
                sessionData: {
                    consecutiveSessions: 7,
                    averageScore: 850,
                    heartRateImprovement: 15,
                    totalSessionTime: 5400
                }
            };
            
            const achievementResponse = await makeRequest('POST', `${API_BASE}/api/games/check-achievements`, achievementData);
            if (achievementResponse.status !== 200) {
                throw new Error(`Achievement checking failed: ${achievementResponse.status}`);
            }
            
            const achievements = achievementResponse.data;
            if (!Array.isArray(achievements.newAchievements) || !Array.isArray(achievements.progressTowards)) {
                throw new Error('Invalid achievement response');
            }
            
            colorLog(`✓ Achievements unlocked: ${achievements.newAchievements.length}`, 'green');
            colorLog(`✓ Progress towards: ${achievements.progressTowards.length}`, 'green');
            
            // Test leaderboard
            const leaderboardResponse = await makeRequest('GET', `${API_BASE}/api/games/leaderboard?gameType=mindfulness_breathing&period=week`);
            if (leaderboardResponse.status !== 200) {
                throw new Error(`Leaderboard failed: ${leaderboardResponse.status}`);
            }
            
            const leaderboard = leaderboardResponse.data;
            if (!Array.isArray(leaderboard.rankings) || !leaderboard.userRank) {
                throw new Error('Invalid leaderboard response');
            }
            
            colorLog(`✓ Leaderboard loaded: ${leaderboard.rankings.length} players`, 'green');
            colorLog(`   User rank: ${leaderboard.userRank}`, 'cyan');
            
            return { score, achievements, leaderboard };
        }
    },
    
    {
        name: 'Progress Tracking',
        test: async () => {
            colorLog('Testing progress tracking...', 'blue');
            
            // Test overall progress
            const progressResponse = await makeRequest('GET', `${API_BASE}/api/games/progress?period=30d`);
            if (progressResponse.status !== 200) {
                throw new Error(`Progress tracking failed: ${progressResponse.status}`);
            }
            
            const progress = progressResponse.data;
            if (!progress.overallProgress || !progress.gameSpecificProgress || !progress.trends) {
                throw new Error('Invalid progress response');
            }
            
            colorLog(`✓ Overall progress: ${progress.overallProgress}%`, 'green');
            colorLog(`   Games played: ${Object.keys(progress.gameSpecificProgress).length}`, 'cyan');
            
            // Test skill development tracking
            const skillsResponse = await makeRequest('GET', `${API_BASE}/api/games/skills-development`);
            if (skillsResponse.status !== 200) {
                throw new Error(`Skills development tracking failed: ${skillsResponse.status}`);
            }
            
            const skills = skillsResponse.data;
            if (!skills.skills || !skills.improvements || !skills.recommendations) {
                throw new Error('Invalid skills development response');
            }
            
            colorLog(`✓ Skills tracked: ${skills.skills.length}`, 'green');
            colorLog(`   Recent improvements: ${skills.improvements.length}`, 'cyan');
            
            // Test personalized recommendations
            const recommendationsResponse = await makeRequest('GET', `${API_BASE}/api/games/recommendations`);
            if (recommendationsResponse.status !== 200) {
                throw new Error(`Game recommendations failed: ${recommendationsResponse.status}`);
            }
            
            const recommendations = recommendationsResponse.data;
            if (!recommendations.recommendedGames || !recommendations.reasoning) {
                throw new Error('Invalid recommendations response');
            }
            
            colorLog(`✓ Game recommendations: ${recommendations.recommendedGames.length}`, 'green');
            recommendations.recommendedGames.forEach(rec => {
                colorLog(`   • ${rec.game}: ${rec.reason}`, 'cyan');
            });
            
            return { progress, skills, recommendations };
        }
    },
    
    {
        name: 'Therapeutic Integration',
        test: async () => {
            colorLog('Testing therapeutic integration...', 'blue');
            
            // Test therapy goal mapping
            const therapyGoalsResponse = await makeRequest('GET', `${API_BASE}/api/games/therapy-goals`);
            if (therapyGoalsResponse.status !== 200) {
                throw new Error(`Therapy goals mapping failed: ${therapyGoalsResponse.status}`);
            }
            
            const therapyGoals = therapyGoalsResponse.data;
            if (!therapyGoals.goals || !therapyGoals.gameMapping) {
                throw new Error('Invalid therapy goals response');
            }
            
            colorLog(`✓ Therapy goals mapped: ${therapyGoals.goals.length}`, 'green');
            colorLog(`   Game mappings: ${Object.keys(therapyGoals.gameMapping).length}`, 'cyan');
            
            // Test therapeutic outcome measurement
            const outcomeData = {
                period: '14d',
                therapyGoals: ['reduce_anxiety', 'improve_mood_regulation'],
                gameTypes: ['mindfulness_breathing', 'emotional_regulation']
            };
            
            const outcomeResponse = await makeRequest('POST', `${API_BASE}/api/games/therapeutic-outcomes`, outcomeData);
            if (outcomeResponse.status !== 200) {
                throw new Error(`Therapeutic outcomes failed: ${outcomeResponse.status}`);
            }
            
            const outcomes = outcomeResponse.data;
            if (!outcomes.improvementScores || !outcomes.goalProgress || !outcomes.recommendations) {
                throw new Error('Invalid therapeutic outcomes response');
            }
            
            colorLog(`✓ Therapeutic outcomes measured`, 'green');
            colorLog(`   Goal progress: ${Object.keys(outcomes.goalProgress).length} goals`, 'cyan');
            
            // Test integration with mood tracking
            const integrationResponse = await makeRequest('GET', `${API_BASE}/api/games/mood-integration?period=7d`);
            if (integrationResponse.status !== 200) {
                throw new Error(`Mood integration failed: ${integrationResponse.status}`);
            }
            
            const integration = integrationResponse.data;
            if (!integration.moodGameCorrelation || !integration.effectivenessMetrics) {
                throw new Error('Invalid mood integration response');
            }
            
            colorLog(`✓ Mood-game correlation analyzed`, 'green');
            colorLog(`   Effectiveness metrics: ${Object.keys(integration.effectivenessMetrics).length}`, 'cyan');
            
            return { therapyGoals, outcomes, integration };
        }
    },
    
    {
        name: 'Multiplayer and Social Features',
        test: async () => {
            colorLog('Testing multiplayer and social features...', 'blue');
            
            // Test group session creation
            const groupSessionData = {
                gameType: 'group_mindfulness',
                maxParticipants: 8,
                sessionName: 'Anxiety Support Group Breathing',
                scheduledTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                isPrivate: false,
                therapeuticGoal: 'anxiety_reduction'
            };
            
            const groupResponse = await makeRequest('POST', `${API_BASE}/api/games/group-session`, groupSessionData);
            if (groupResponse.status !== 201) {
                throw new Error(`Group session creation failed: ${groupResponse.status}`);
            }
            
            const groupSession = groupResponse.data;
            if (!groupSession.sessionId || !groupSession.inviteCode) {
                throw new Error('Invalid group session response');
            }
            
            colorLog(`✓ Group session created: ${groupSession.sessionId}`, 'green');
            colorLog(`   Invite code: ${groupSession.inviteCode}`, 'cyan');
            
            // Test joining group session
            const joinResponse = await makeRequest('POST', `${API_BASE}/api/games/group-session/${groupSession.sessionId}/join`, {
                inviteCode: groupSession.inviteCode
            });
            if (joinResponse.status !== 200) {
                throw new Error(`Join group session failed: ${joinResponse.status}`);
            }
            
            colorLog('✓ Joined group session successfully', 'green');
            
            // Test peer support features
            const supportResponse = await makeRequest('GET', `${API_BASE}/api/games/peer-support`);
            if (supportResponse.status !== 200) {
                throw new Error(`Peer support failed: ${supportResponse.status}`);
            }
            
            const support = supportResponse.data;
            if (!support.supportGroups || !support.encouragementMessages) {
                throw new Error('Invalid peer support response');
            }
            
            colorLog(`✓ Peer support groups: ${support.supportGroups.length}`, 'green');
            colorLog(`✓ Encouragement messages available: ${support.encouragementMessages.length}`, 'cyan');
            
            return { groupSession, support };
        }
    },
    
    {
        name: 'Data Analytics and Insights',
        test: async () => {
            colorLog('Testing data analytics and insights...', 'blue');
            
            // Test session analytics
            const analyticsResponse = await makeRequest('GET', `${API_BASE}/api/games/analytics?period=30d`);
            if (analyticsResponse.status !== 200) {
                throw new Error(`Session analytics failed: ${analyticsResponse.status}`);
            }
            
            const analytics = analyticsResponse.data;
            if (!analytics.sessionMetrics || !analytics.performanceMetrics || !analytics.engagementMetrics) {
                throw new Error('Invalid analytics response');
            }
            
            colorLog(`✓ Session analytics generated`, 'green');
            colorLog(`   Total sessions: ${analytics.sessionMetrics.totalSessions}`, 'cyan');
            colorLog(`   Average score: ${analytics.performanceMetrics.averageScore}`, 'cyan');
            colorLog(`   Engagement rate: ${analytics.engagementMetrics.engagementRate}%`, 'cyan');
            
            // Test personalized insights
            const insightsResponse = await makeRequest('GET', `${API_BASE}/api/games/insights`);
            if (insightsResponse.status !== 200) {
                throw new Error(`Personalized insights failed: ${insightsResponse.status}`);
            }
            
            const insights = insightsResponse.data;
            if (!insights.personalizedInsights || !insights.improvementAreas || !insights.strengths) {
                throw new Error('Invalid insights response');
            }
            
            colorLog(`✓ Personalized insights generated`, 'green');
            colorLog(`   Improvement areas: ${insights.improvementAreas.length}`, 'cyan');
            colorLog(`   Identified strengths: ${insights.strengths.length}`, 'cyan');
            
            // Test usage patterns
            const patternsResponse = await makeRequest('GET', `${API_BASE}/api/games/usage-patterns`);
            if (patternsResponse.status !== 200) {
                throw new Error(`Usage patterns failed: ${patternsResponse.status}`);
            }
            
            const patterns = patternsResponse.data;
            if (!patterns.playTime || !patterns.preferredGames || !patterns.streaks) {
                throw new Error('Invalid usage patterns response');
            }
            
            colorLog(`✓ Usage patterns analyzed`, 'green');
            colorLog(`   Preferred play time: ${patterns.playTime.peak}`, 'cyan');
            colorLog(`   Current streak: ${patterns.streaks.current} days`, 'cyan');
            
            return { analytics, insights, patterns };
        }
    }
];

// Run all tests
async function runAllTests() {
    colorLog('🎮 GAMES COMPREHENSIVE TESTS', 'magenta');
    colorLog('=============================', 'magenta');
    
    let passed = 0;
    let failed = 0;
    const results = [];
    
    for (const test of tests) {
        try {
            colorLog(`\n🧪 Testing: ${test.name}`, 'yellow');
            const startTime = Date.now();
            
            const result = await test.test();
            const duration = Date.now() - startTime;
            
            colorLog(`✅ ${test.name} - PASSED (${duration}ms)`, 'green');
            passed++;
            results.push({ name: test.name, status: 'PASSED', duration, result });
            
        } catch (error) {
            colorLog(`❌ ${test.name} - FAILED: ${error.message}`, 'red');
            failed++;
            results.push({ name: test.name, status: 'FAILED', error: error.message });
        }
    }
    
    // Summary
    colorLog('\n📊 GAMES TEST SUMMARY', 'cyan');
    colorLog('=====================', 'cyan');
    colorLog(`Total Tests: ${passed + failed}`, 'blue');
    colorLog(`Passed: ${passed}`, 'green');
    colorLog(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    colorLog(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'blue');
    
    if (failed > 0) {
        colorLog('\n❌ Failed Tests:', 'red');
        results.filter(r => r.status === 'FAILED').forEach(r => {
            colorLog(`  • ${r.name}: ${r.error}`, 'red');
        });
    }
    
    process.exit(failed > 0 ? 1 : 0);
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    colorLog(`❌ Unhandled Rejection: ${reason}`, 'red');
    process.exit(1);
});

// Run tests
if (require.main === module) {
    runAllTests().catch(error => {
        colorLog(`❌ Test suite failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { runAllTests, tests };