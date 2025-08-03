/**
 * Comprehensive Clinical Analytics Tests
 * Tests clinical data processing, analytics generation, and evidence-based metrics
 * Run with: node tests/clinical-analytics-tests.js
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5001';
const TEST_CLERK_ID = 'test_clinical_user_123';

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

// Generate test data for clinical analytics
function generateTestEmotionData() {
    const emotions = ['happy', 'sad', 'anxious', 'calm', 'stressed', 'excited', 'angry', 'peaceful'];
    const data = [];
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
            emotion: emotions[Math.floor(Math.random() * emotions.length)],
            intensity: Math.floor(Math.random() * 10) + 1,
            triggers: ['work', 'relationships', 'health', 'finances'][Math.floor(Math.random() * 4)],
            timestamp: date.toISOString(),
            context: 'daily_checkin',
            notes: `Test emotion entry ${i}`
        });
    }
    
    return data;
}

function generateTestJournalData() {
    const entries = [];
    
    for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 2));
        
        entries.push({
            content: `This is a test journal entry ${i}. I explored my thoughts about anxiety management and found some helpful techniques.`,
            mood: Math.floor(Math.random() * 10) + 1,
            tags: ['anxiety', 'coping', 'mindfulness', 'therapy'][Math.floor(Math.random() * 4)],
            timestamp: date.toISOString(),
            isPrivate: false
        });
    }
    
    return entries;
}

function generateTestGameData() {
    const games = ['mindfulness_breathing', 'cognitive_restructuring', 'emotional_regulation', 'stress_relief'];
    const sessions = [];
    
    for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(i / 2));
        
        sessions.push({
            gameType: games[Math.floor(Math.random() * games.length)],
            score: Math.floor(Math.random() * 1000) + 100,
            duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
            completed: Math.random() > 0.2,
            difficultyLevel: Math.floor(Math.random() * 5) + 1,
            timestamp: date.toISOString(),
            achievements: ['first_session', 'streak_3', 'high_score'][Math.floor(Math.random() * 3)]
        });
    }
    
    return sessions;
}

// Test suite
const tests = [
    {
        name: 'Clinical Analytics Configuration',
        test: async () => {
            colorLog('Testing clinical analytics configuration...', 'blue');
            
            const configResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/config`);
            if (configResponse.status !== 200) {
                throw new Error(`Config endpoint failed: ${configResponse.status}`);
            }
            
            const config = configResponse.data;
            if (!config.evidenceBasedMetrics || !config.clinicalScales) {
                throw new Error('Missing required configuration elements');
            }
            
            colorLog('✓ Clinical analytics configuration loaded', 'green');
            colorLog(`   Evidence-based metrics: ${config.evidenceBasedMetrics.length}`, 'cyan');
            colorLog(`   Clinical scales: ${config.clinicalScales.length}`, 'cyan');
            
            return config;
        }
    },
    
    {
        name: 'Data Ingestion and Processing',
        test: async () => {
            colorLog('Testing clinical data ingestion...', 'blue');
            
            // Create test data sets
            const emotionData = generateTestEmotionData();
            const journalData = generateTestJournalData();
            const gameData = generateTestGameData();
            
            // Ingest emotion data
            for (const emotion of emotionData.slice(0, 5)) {
                const response = await makeRequest('POST', `${API_BASE}/api/emotions`, emotion);
                if (response.status !== 201) {
                    throw new Error(`Emotion ingestion failed: ${response.status}`);
                }
            }
            colorLog('✓ Emotion data ingested successfully', 'green');
            
            // Ingest journal data
            for (const entry of journalData.slice(0, 3)) {
                const response = await makeRequest('POST', `${API_BASE}/api/journal`, entry);
                if (response.status !== 201) {
                    throw new Error(`Journal ingestion failed: ${response.status}`);
                }
            }
            colorLog('✓ Journal data ingested successfully', 'green');
            
            // Ingest game session data
            for (const session of gameData.slice(0, 5)) {
                const response = await makeRequest('POST', `${API_BASE}/api/games/session`, session);
                if (response.status !== 201) {
                    throw new Error(`Game session ingestion failed: ${response.status}`);
                }
            }
            colorLog('✓ Game session data ingested successfully', 'green');
            
            return { emotionData, journalData, gameData };
        }
    },
    
    {
        name: 'Mental Health Assessments',
        test: async () => {
            colorLog('Testing mental health assessments...', 'blue');
            
            // Test PHQ-9 assessment
            const phq9Response = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/assessment/phq9`);
            if (phq9Response.status !== 200) {
                throw new Error(`PHQ-9 assessment failed: ${phq9Response.status}`);
            }
            
            const phq9 = phq9Response.data;
            if (typeof phq9.score !== 'number' || !phq9.severity || !phq9.recommendations) {
                throw new Error('Invalid PHQ-9 assessment response');
            }
            
            colorLog(`✓ PHQ-9 Assessment: Score ${phq9.score}, Severity: ${phq9.severity}`, 'green');
            
            // Test GAD-7 assessment
            const gad7Response = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/assessment/gad7`);
            if (gad7Response.status !== 200) {
                throw new Error(`GAD-7 assessment failed: ${gad7Response.status}`);
            }
            
            const gad7 = gad7Response.data;
            if (typeof gad7.score !== 'number' || !gad7.severity || !gad7.recommendations) {
                throw new Error('Invalid GAD-7 assessment response');
            }
            
            colorLog(`✓ GAD-7 Assessment: Score ${gad7.score}, Severity: ${gad7.severity}`, 'green');
            
            // Test custom wellness score
            const wellnessResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/assessment/wellness`);
            if (wellnessResponse.status !== 200) {
                throw new Error(`Wellness assessment failed: ${wellnessResponse.status}`);
            }
            
            const wellness = wellnessResponse.data;
            if (typeof wellness.overallScore !== 'number' || !wellness.domains) {
                throw new Error('Invalid wellness assessment response');
            }
            
            colorLog(`✓ Wellness Assessment: Overall Score ${wellness.overallScore}`, 'green');
            
            return { phq9, gad7, wellness };
        }
    },
    
    {
        name: 'Trend Analysis',
        test: async () => {
            colorLog('Testing trend analysis...', 'blue');
            
            // Test mood trends
            const moodTrendsResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/trends/mood?period=30d`);
            if (moodTrendsResponse.status !== 200) {
                throw new Error(`Mood trends analysis failed: ${moodTrendsResponse.status}`);
            }
            
            const moodTrends = moodTrendsResponse.data;
            if (!moodTrends.trend || !moodTrends.dataPoints || !moodTrends.analysis) {
                throw new Error('Invalid mood trends response');
            }
            
            colorLog(`✓ Mood Trends: ${moodTrends.trend} over 30 days`, 'green');
            colorLog(`   Data points: ${moodTrends.dataPoints.length}`, 'cyan');
            
            // Test anxiety patterns
            const anxietyResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/trends/anxiety?period=7d`);
            if (anxietyResponse.status !== 200) {
                throw new Error(`Anxiety trends analysis failed: ${anxietyResponse.status}`);
            }
            
            const anxietyTrends = anxietyResponse.data;
            if (!anxietyTrends.patterns || !anxietyTrends.triggers) {
                throw new Error('Invalid anxiety trends response');
            }
            
            colorLog(`✓ Anxiety Patterns: ${anxietyTrends.patterns.length} identified`, 'green');
            colorLog(`   Common triggers: ${anxietyTrends.triggers.slice(0, 3).join(', ')}`, 'cyan');
            
            // Test engagement trends
            const engagementResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/trends/engagement?period=14d`);
            if (engagementResponse.status !== 200) {
                throw new Error(`Engagement trends analysis failed: ${engagementResponse.status}`);
            }
            
            const engagement = engagementResponse.data;
            if (typeof engagement.averageSessionTime !== 'number' || !engagement.activityPatterns) {
                throw new Error('Invalid engagement trends response');
            }
            
            colorLog(`✓ Engagement Analysis: Avg session ${engagement.averageSessionTime}min`, 'green');
            
            return { moodTrends, anxietyTrends, engagement };
        }
    },
    
    {
        name: 'Intervention Recommendations',
        test: async () => {
            colorLog('Testing intervention recommendations...', 'blue');
            
            // Test personalized recommendations
            const recommendationsResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/recommendations`);
            if (recommendationsResponse.status !== 200) {
                throw new Error(`Recommendations failed: ${recommendationsResponse.status}`);
            }
            
            const recommendations = recommendationsResponse.data;
            if (!recommendations.interventions || !recommendations.priority || !recommendations.evidenceBase) {
                throw new Error('Invalid recommendations response');
            }
            
            colorLog(`✓ Generated ${recommendations.interventions.length} personalized interventions`, 'green');
            colorLog(`   Priority level: ${recommendations.priority}`, 'cyan');
            colorLog(`   Evidence base: ${recommendations.evidenceBase}`, 'cyan');
            
            // Test specific intervention details
            if (recommendations.interventions.length > 0) {
                const interventionId = recommendations.interventions[0].id;
                const detailResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/intervention/${interventionId}`);
                
                if (detailResponse.status !== 200) {
                    throw new Error(`Intervention details failed: ${detailResponse.status}`);
                }
                
                const intervention = detailResponse.data;
                if (!intervention.protocol || !intervention.expectedOutcomes || !intervention.timeline) {
                    throw new Error('Invalid intervention details response');
                }
                
                colorLog(`✓ Intervention details: ${intervention.protocol.name}`, 'green');
                colorLog(`   Expected timeline: ${intervention.timeline}`, 'cyan');
            }
            
            return recommendations;
        }
    },
    
    {
        name: 'Risk Assessment',
        test: async () => {
            colorLog('Testing risk assessment...', 'blue');
            
            // Test crisis risk evaluation
            const riskResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/risk-assessment`);
            if (riskResponse.status !== 200) {
                throw new Error(`Risk assessment failed: ${riskResponse.status}`);
            }
            
            const risk = riskResponse.data;
            if (!risk.riskLevel || !risk.factors || !risk.recommendations) {
                throw new Error('Invalid risk assessment response');
            }
            
            colorLog(`✓ Risk Level: ${risk.riskLevel}`, 'green');
            colorLog(`   Risk factors identified: ${risk.factors.length}`, 'cyan');
            colorLog(`   Safety recommendations: ${risk.recommendations.length}`, 'cyan');
            
            // Test suicide risk screening
            const suicideScreenResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/suicide-screening`);
            if (suicideScreenResponse.status !== 200) {
                throw new Error(`Suicide screening failed: ${suicideScreenResponse.status}`);
            }
            
            const screening = suicideScreenResponse.data;
            if (!screening.riskScore || !screening.protectiveFactors || !screening.warningSigns) {
                throw new Error('Invalid suicide screening response');
            }
            
            colorLog(`✓ Suicide Risk Score: ${screening.riskScore}`, 'green');
            colorLog(`   Protective factors: ${screening.protectiveFactors.length}`, 'cyan');
            
            return { risk, screening };
        }
    },
    
    {
        name: 'Evidence-Based Metrics',
        test: async () => {
            colorLog('Testing evidence-based metrics...', 'blue');
            
            // Test treatment effectiveness metrics
            const effectivenessResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/metrics/effectiveness`);
            if (effectivenessResponse.status !== 200) {
                throw new Error(`Effectiveness metrics failed: ${effectivenessResponse.status}`);
            }
            
            const effectiveness = effectivenessResponse.data;
            if (!effectiveness.treatmentResponse || !effectiveness.functionalImprovement) {
                throw new Error('Invalid effectiveness metrics response');
            }
            
            colorLog(`✓ Treatment Response: ${effectiveness.treatmentResponse}%`, 'green');
            colorLog(`   Functional Improvement: ${effectiveness.functionalImprovement}%`, 'cyan');
            
            // Test outcome measures
            const outcomesResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/metrics/outcomes`);
            if (outcomesResponse.status !== 200) {
                throw new Error(`Outcome measures failed: ${outcomesResponse.status}`);
            }
            
            const outcomes = outcomesResponse.data;
            if (!outcomes.primaryOutcomes || !outcomes.secondaryOutcomes) {
                throw new Error('Invalid outcome measures response');
            }
            
            colorLog(`✓ Primary outcomes tracked: ${outcomes.primaryOutcomes.length}`, 'green');
            colorLog(`✓ Secondary outcomes tracked: ${outcomes.secondaryOutcomes.length}`, 'green');
            
            return { effectiveness, outcomes };
        }
    },
    
    {
        name: 'Clinical Reports Generation',
        test: async () => {
            colorLog('Testing clinical reports generation...', 'blue');
            
            // Test comprehensive clinical report
            const reportData = {
                reportType: 'comprehensive',
                period: '30d',
                includeAssessments: true,
                includeInterventions: true,
                includeRiskAnalysis: true
            };
            
            const reportResponse = await makeRequest('POST', `${API_BASE}/api/clinical-analytics/reports/generate`, reportData);
            if (reportResponse.status !== 201) {
                throw new Error(`Report generation failed: ${reportResponse.status}`);
            }
            
            const report = reportResponse.data;
            if (!report.reportId || !report.summary || !report.sections) {
                throw new Error('Invalid clinical report response');
            }
            
            colorLog(`✓ Clinical report generated: ${report.reportId}`, 'green');
            colorLog(`   Report sections: ${report.sections.length}`, 'cyan');
            
            // Test report retrieval
            const getReportResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/reports/${report.reportId}`);
            if (getReportResponse.status !== 200) {
                throw new Error(`Report retrieval failed: ${getReportResponse.status}`);
            }
            
            const retrievedReport = getReportResponse.data;
            if (!retrievedReport.content || !retrievedReport.metadata) {
                throw new Error('Invalid retrieved report response');
            }
            
            colorLog(`✓ Report retrieved successfully`, 'green');
            colorLog(`   Content length: ${retrievedReport.content.length} characters`, 'cyan');
            
            return { reportId: report.reportId, content: retrievedReport };
        }
    },
    
    {
        name: 'Data Privacy and Security',
        test: async () => {
            colorLog('Testing data privacy and security...', 'blue');
            
            // Test data anonymization
            const anonymizeResponse = await makeRequest('POST', `${API_BASE}/api/clinical-analytics/anonymize`, {
                dataType: 'emotion_entries',
                period: '7d'
            });
            if (anonymizeResponse.status !== 200) {
                throw new Error(`Data anonymization failed: ${anonymizeResponse.status}`);
            }
            
            const anonymized = anonymizeResponse.data;
            if (!anonymized.anonymizedData || !anonymized.privacyLevel) {
                throw new Error('Invalid anonymization response');
            }
            
            colorLog(`✓ Data anonymized with privacy level: ${anonymized.privacyLevel}`, 'green');
            
            // Test data retention policies
            const retentionResponse = await makeRequest('GET', `${API_BASE}/api/clinical-analytics/data-retention-policy`);
            if (retentionResponse.status !== 200) {
                throw new Error(`Data retention policy failed: ${retentionResponse.status}`);
            }
            
            const retention = retentionResponse.data;
            if (!retention.policies || !retention.complianceStandards) {
                throw new Error('Invalid retention policy response');
            }
            
            colorLog(`✓ Data retention policies: ${retention.policies.length} defined`, 'green');
            colorLog(`   Compliance standards: ${retention.complianceStandards.join(', ')}`, 'cyan');
            
            return { anonymized, retention };
        }
    }
];

// Run all tests
async function runAllTests() {
    colorLog('🏥 CLINICAL ANALYTICS COMPREHENSIVE TESTS', 'magenta');
    colorLog('==========================================', 'magenta');
    
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
    colorLog('\n📊 CLINICAL ANALYTICS TEST SUMMARY', 'cyan');
    colorLog('===================================', 'cyan');
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
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(error => {
        colorLog(`❌ Test suite failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

export { runAllTests, tests };