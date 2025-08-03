/**
 * Comprehensive Performance Tests
 * Tests response times, throughput, scalability, and resource usage
 * Run with: node tests/performance-tests.js
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const API_BASE = 'http://localhost:5001';
const TEST_CLERK_ID = 'test_perf_user_123';

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

// Performance measurement utilities
class PerformanceTracker {
    constructor() {
        this.measurements = [];
    }

    startMeasurement(name) {
        return {
            name,
            startTime: performance.now(),
            startMemory: process.memoryUsage()
        };
    }

    endMeasurement(measurement) {
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        
        const result = {
            name: measurement.name,
            duration: endTime - measurement.startTime,
            memoryDelta: {
                rss: endMemory.rss - measurement.startMemory.rss,
                heapUsed: endMemory.heapUsed - measurement.startMemory.heapUsed,
                external: endMemory.external - measurement.startMemory.external
            }
        };
        
        this.measurements.push(result);
        return result;
    }

    getStats(measurementName) {
        const filtered = this.measurements.filter(m => m.name === measurementName);
        if (filtered.length === 0) return null;

        const durations = filtered.map(m => m.duration);
        return {
            count: filtered.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            avg: durations.reduce((a, b) => a + b, 0) / durations.length,
            p50: this.percentile(durations, 50),
            p95: this.percentile(durations, 95),
            p99: this.percentile(durations, 99)
        };
    }

    percentile(arr, p) {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[index];
    }
}

const tracker = new PerformanceTracker();

// HTTP request helper with performance tracking
function makeRequest(method, url, data = null, headers = {}, trackPerformance = true) {
    return new Promise((resolve, reject) => {
        const measurement = trackPerformance ? tracker.startMeasurement(`${method} ${url}`) : null;
        
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
                    const result = { status: res.statusCode, data: parsed, headers: res.headers };
                    
                    if (measurement) {
                        result.performance = tracker.endMeasurement(measurement);
                    }
                    
                    resolve(result);
                } catch (e) {
                    const result = { status: res.statusCode, data: responseData, headers: res.headers };
                    
                    if (measurement) {
                        result.performance = tracker.endMeasurement(measurement);
                    }
                    
                    resolve(result);
                }
            });
        });

        req.on('error', (error) => {
            if (measurement) {
                tracker.endMeasurement(measurement);
            }
            reject(error);
        });

        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

// Generate test data
function generateTestData(size = 'small') {
    const sizes = {
        small: { emotions: 10, journals: 5, games: 8 },
        medium: { emotions: 100, journals: 50, games: 75 },
        large: { emotions: 1000, journals: 500, games: 750 }
    };

    const config = sizes[size];
    const testData = {
        emotions: [],
        journals: [],
        games: []
    };

    // Generate emotions
    for (let i = 0; i < config.emotions; i++) {
        testData.emotions.push({
            emotion: ['happy', 'sad', 'anxious', 'calm', 'excited'][i % 5],
            intensity: Math.floor(Math.random() * 10) + 1,
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
            notes: `Performance test emotion ${i}`
        });
    }

    // Generate journals
    for (let i = 0; i < config.journals; i++) {
        testData.journals.push({
            content: `Performance test journal entry ${i}. `.repeat(Math.floor(Math.random() * 10) + 1),
            mood: Math.floor(Math.random() * 10) + 1,
            tags: ['performance', 'testing', `batch_${Math.floor(i / 10)}`],
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
        });
    }

    // Generate games
    for (let i = 0; i < config.games; i++) {
        testData.games.push({
            gameType: ['mindfulness_breathing', 'cognitive_restructuring', 'emotional_regulation'][i % 3],
            score: Math.floor(Math.random() * 1000) + 100,
            duration: Math.floor(Math.random() * 1800) + 300,
            completed: true,
            gameData: { level: i % 5 + 1, achievements: [`perf_test_${i}`] }
        });
    }

    return testData;
}

// Test suite
const tests = [
    {
        name: 'Response Time Benchmarks',
        test: async () => {
            colorLog('Testing response time benchmarks...', 'blue');
            
            const endpoints = [
                { method: 'GET', url: '/health', name: 'Health Check' },
                { method: 'GET', url: '/api/emotions', name: 'Get Emotions' },
                { method: 'GET', url: '/api/journal', name: 'Get Journal Entries' },
                { method: 'GET', url: '/api/games/available', name: 'Get Available Games' },
                { method: 'GET', url: '/api/analytics/summary', name: 'Get Analytics Summary' },
                { method: 'GET', url: '/api/users/profile', name: 'Get User Profile' }
            ];

            const benchmarks = {};

            for (const endpoint of endpoints) {
                colorLog(`  Testing ${endpoint.name}...`, 'cyan');
                
                // Warm up
                for (let i = 0; i < 3; i++) {
                    await makeRequest(endpoint.method, `${API_BASE}${endpoint.url}`, null, {}, false);
                }

                // Actual measurements
                const measurements = [];
                for (let i = 0; i < 20; i++) {
                    const response = await makeRequest(endpoint.method, `${API_BASE}${endpoint.url}`);
                    if (response.performance) {
                        measurements.push(response.performance.duration);
                    }
                }

                const stats = {
                    count: measurements.length,
                    min: Math.min(...measurements),
                    max: Math.max(...measurements),
                    avg: measurements.reduce((a, b) => a + b, 0) / measurements.length,
                    p95: tracker.percentile(measurements, 95)
                };

                benchmarks[endpoint.name] = stats;
                
                colorLog(`    Avg: ${stats.avg.toFixed(2)}ms, P95: ${stats.p95.toFixed(2)}ms`, 'green');
            }

            // Performance thresholds
            const thresholds = {
                'Health Check': 100,
                'Get Emotions': 500,
                'Get Journal Entries': 500,
                'Get Available Games': 300,
                'Get Analytics Summary': 1000,
                'Get User Profile': 400
            };

            let failedThresholds = 0;
            for (const [name, threshold] of Object.entries(thresholds)) {
                if (benchmarks[name] && benchmarks[name].p95 > threshold) {
                    colorLog(`⚠ ${name} P95 (${benchmarks[name].p95.toFixed(2)}ms) exceeds threshold (${threshold}ms)`, 'yellow');
                    failedThresholds++;
                } else if (benchmarks[name]) {
                    colorLog(`✓ ${name} P95 within threshold`, 'green');
                }
            }

            colorLog(`Response time benchmarks: ${Object.keys(benchmarks).length - failedThresholds}/${Object.keys(benchmarks).length} within thresholds`, 'cyan');
            return { benchmarks, failedThresholds };
        }
    },
    
    {
        name: 'Throughput and Concurrent Users',
        test: async () => {
            colorLog('Testing throughput and concurrent users...', 'blue');
            
            const concurrencyLevels = [1, 5, 10, 20, 50];
            const throughputResults = {};

            for (const concurrency of concurrencyLevels) {
                colorLog(`  Testing with ${concurrency} concurrent users...`, 'cyan');
                
                const startTime = performance.now();
                const promises = [];
                
                for (let i = 0; i < concurrency; i++) {
                    promises.push(makeRequest('GET', `${API_BASE}/api/emotions?page=${i}`, null, {}, false));
                }
                
                const responses = await Promise.all(promises);
                const endTime = performance.now();
                
                const successfulRequests = responses.filter(r => r.status === 200).length;
                const totalTime = endTime - startTime;
                const requestsPerSecond = (successfulRequests / (totalTime / 1000)).toFixed(2);
                
                throughputResults[concurrency] = {
                    totalRequests: concurrency,
                    successfulRequests,
                    totalTime: totalTime.toFixed(2),
                    requestsPerSecond: parseFloat(requestsPerSecond)
                };
                
                colorLog(`    ${successfulRequests}/${concurrency} successful, ${requestsPerSecond} req/s`, 'green');
            }

            // Test sustained load
            colorLog('  Testing sustained load (30 seconds)...', 'cyan');
            const sustainedStartTime = performance.now();
            const sustainedPromises = [];
            let sustainedRequests = 0;
            
            const sustainedTest = setInterval(() => {
                if (performance.now() - sustainedStartTime < 30000) { // 30 seconds
                    for (let i = 0; i < 5; i++) {
                        sustainedPromises.push(makeRequest('GET', `${API_BASE}/health`, null, {}, false));
                        sustainedRequests++;
                    }
                } else {
                    clearInterval(sustainedTest);
                }
            }, 100); // Every 100ms

            // Wait for sustained test to complete
            await new Promise(resolve => setTimeout(resolve, 31000));
            
            const sustainedResponses = await Promise.all(sustainedPromises);
            const sustainedSuccessful = sustainedResponses.filter(r => r.status === 200).length;
            const sustainedRps = (sustainedSuccessful / 30).toFixed(2);
            
            colorLog(`  Sustained load: ${sustainedSuccessful}/${sustainedRequests} successful, ${sustainedRps} req/s avg`, 'green');
            
            throughputResults.sustained = {
                totalRequests: sustainedRequests,
                successfulRequests: sustainedSuccessful,
                duration: 30,
                requestsPerSecond: parseFloat(sustainedRps)
            };

            return throughputResults;
        }
    },
    
    {
        name: 'Data Creation Performance',
        test: async () => {
            colorLog('Testing data creation performance...', 'blue');
            
            const testData = generateTestData('medium');
            const creationResults = {};

            // Test emotion creation performance
            colorLog('  Testing emotion creation...', 'cyan');
            let measurement = tracker.startMeasurement('bulk_emotion_creation');
            
            const emotionPromises = testData.emotions.slice(0, 50).map(emotion => 
                makeRequest('POST', `${API_BASE}/api/emotions`, emotion, {}, false)
            );
            
            const emotionResponses = await Promise.all(emotionPromises);
            const emotionPerf = tracker.endMeasurement(measurement);
            
            const successfulEmotions = emotionResponses.filter(r => r.status === 201).length;
            creationResults.emotions = {
                total: 50,
                successful: successfulEmotions,
                duration: emotionPerf.duration,
                averagePerItem: emotionPerf.duration / 50
            };
            
            colorLog(`    ${successfulEmotions}/50 emotions created in ${emotionPerf.duration.toFixed(2)}ms`, 'green');

            // Test journal creation performance
            colorLog('  Testing journal creation...', 'cyan');
            measurement = tracker.startMeasurement('bulk_journal_creation');
            
            const journalPromises = testData.journals.slice(0, 25).map(journal => 
                makeRequest('POST', `${API_BASE}/api/journal`, journal, {}, false)
            );
            
            const journalResponses = await Promise.all(journalPromises);
            const journalPerf = tracker.endMeasurement(measurement);
            
            const successfulJournals = journalResponses.filter(r => r.status === 201).length;
            creationResults.journals = {
                total: 25,
                successful: successfulJournals,
                duration: journalPerf.duration,
                averagePerItem: journalPerf.duration / 25
            };
            
            colorLog(`    ${successfulJournals}/25 journals created in ${journalPerf.duration.toFixed(2)}ms`, 'green');

            // Test game session creation performance
            colorLog('  Testing game session creation...', 'cyan');
            measurement = tracker.startMeasurement('bulk_game_creation');
            
            const gamePromises = testData.games.slice(0, 30).map(game => 
                makeRequest('POST', `${API_BASE}/api/games/session`, game, {}, false)
            );
            
            const gameResponses = await Promise.all(gamePromises);
            const gamePerf = tracker.endMeasurement(measurement);
            
            const successfulGames = gameResponses.filter(r => r.status === 201).length;
            creationResults.games = {
                total: 30,
                successful: successfulGames,
                duration: gamePerf.duration,
                averagePerItem: gamePerf.duration / 30
            };
            
            colorLog(`    ${successfulGames}/30 game sessions created in ${gamePerf.duration.toFixed(2)}ms`, 'green');

            return creationResults;
        }
    },
    
    {
        name: 'Database Query Performance',
        test: async () => {
            colorLog('Testing database query performance...', 'blue');
            
            const queryResults = {};

            // Test pagination performance
            colorLog('  Testing pagination performance...', 'cyan');
            const pageTests = [];
            for (let page = 1; page <= 10; page++) {
                pageTests.push(makeRequest('GET', `${API_BASE}/api/emotions?page=${page}&limit=20`));
            }
            
            const pageResponses = await Promise.all(pageTests);
            const avgPageTime = pageResponses.reduce((sum, r) => sum + (r.performance?.duration || 0), 0) / pageResponses.length;
            
            queryResults.pagination = {
                pages: 10,
                averageTime: avgPageTime,
                successful: pageResponses.filter(r => r.status === 200).length
            };
            
            colorLog(`    Average page load time: ${avgPageTime.toFixed(2)}ms`, 'green');

            // Test filtering performance
            colorLog('  Testing filtering performance...', 'cyan');
            const filterTests = [
                makeRequest('GET', `${API_BASE}/api/emotions?emotion=happy`),
                makeRequest('GET', `${API_BASE}/api/emotions?intensity_min=7`),
                makeRequest('GET', `${API_BASE}/api/emotions?date_from=${new Date(Date.now() - 86400000).toISOString()}`),
                makeRequest('GET', `${API_BASE}/api/journal?mood_min=5&mood_max=8`),
                makeRequest('GET', `${API_BASE}/api/games/sessions?gameType=mindfulness_breathing&completed=true`)
            ];
            
            const filterResponses = await Promise.all(filterTests);
            const avgFilterTime = filterResponses.reduce((sum, r) => sum + (r.performance?.duration || 0), 0) / filterResponses.length;
            
            queryResults.filtering = {
                filters: 5,
                averageTime: avgFilterTime,
                successful: filterResponses.filter(r => r.status === 200).length
            };
            
            colorLog(`    Average filter query time: ${avgFilterTime.toFixed(2)}ms`, 'green');

            // Test aggregation performance
            colorLog('  Testing aggregation performance...', 'cyan');
            const aggregationTests = [
                makeRequest('GET', `${API_BASE}/api/analytics/summary`),
                makeRequest('GET', `${API_BASE}/api/analytics/emotions-trend?period=30d`),
                makeRequest('GET', `${API_BASE}/api/analytics/mood-patterns?period=14d`),
                makeRequest('GET', `${API_BASE}/api/clinical-analytics/assessment/phq9`),
                makeRequest('GET', `${API_BASE}/api/games/analytics?period=7d`)
            ];
            
            const aggregationResponses = await Promise.all(aggregationTests);
            const avgAggregationTime = aggregationResponses.reduce((sum, r) => sum + (r.performance?.duration || 0), 0) / aggregationResponses.length;
            
            queryResults.aggregation = {
                queries: 5,
                averageTime: avgAggregationTime,
                successful: aggregationResponses.filter(r => r.status === 200).length
            };
            
            colorLog(`    Average aggregation query time: ${avgAggregationTime.toFixed(2)}ms`, 'green');

            return queryResults;
        }
    },
    
    {
        name: 'Memory Usage and Resource Efficiency',
        test: async () => {
            colorLog('Testing memory usage and resource efficiency...', 'blue');
            
            const initialMemory = process.memoryUsage();
            const resourceResults = {};

            // Test memory usage during bulk operations
            colorLog('  Testing memory usage during bulk operations...', 'cyan');
            
            const bulkData = generateTestData('large');
            const memorySnapshots = [process.memoryUsage()];
            
            // Create bulk emotions in batches
            const batchSize = 10;
            for (let i = 0; i < bulkData.emotions.length; i += batchSize) {
                const batch = bulkData.emotions.slice(i, i + batchSize);
                const batchPromises = batch.map(emotion => 
                    makeRequest('POST', `${API_BASE}/api/emotions`, emotion, {}, false)
                );
                
                await Promise.all(batchPromises);
                memorySnapshots.push(process.memoryUsage());
                
                // Small delay to allow garbage collection
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            const finalMemory = process.memoryUsage();
            const memoryIncrease = {
                rss: finalMemory.rss - initialMemory.rss,
                heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
                external: finalMemory.external - initialMemory.external
            };
            
            resourceResults.memoryUsage = {
                initialMemory,
                finalMemory,
                memoryIncrease,
                operationsPerformed: bulkData.emotions.length
            };
            
            colorLog(`    Memory increase: RSS +${(memoryIncrease.rss / 1024 / 1024).toFixed(2)}MB, Heap +${(memoryIncrease.heapUsed / 1024 / 1024).toFixed(2)}MB`, 'green');

            // Test request processing time consistency
            colorLog('  Testing request processing consistency...', 'cyan');
            
            const consistencyTests = [];
            for (let i = 0; i < 100; i++) {
                consistencyTests.push(makeRequest('GET', `${API_BASE}/health`));
            }
            
            const consistencyResponses = await Promise.all(consistencyTests);
            const responseTimes = consistencyResponses
                .filter(r => r.performance)
                .map(r => r.performance.duration);
            
            if (responseTimes.length > 0) {
                const consistencyStats = {
                    count: responseTimes.length,
                    min: Math.min(...responseTimes),
                    max: Math.max(...responseTimes),
                    avg: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
                    stdDev: Math.sqrt(responseTimes.reduce((sum, time) => sum + Math.pow(time - (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length), 2), 0) / responseTimes.length)
                };
                
                resourceResults.consistency = consistencyStats;
                colorLog(`    Response time consistency: ${consistencyStats.avg.toFixed(2)}ms ±${consistencyStats.stdDev.toFixed(2)}ms`, 'green');
            }

            // Test connection pooling efficiency
            colorLog('  Testing connection pooling...', 'cyan');
            
            const connectionTests = [];
            const startTime = performance.now();
            
            for (let i = 0; i < 50; i++) {
                connectionTests.push(makeRequest('GET', `${API_BASE}/api/emotions?limit=1`, null, {}, false));
            }
            
            const connectionResponses = await Promise.all(connectionTests);
            const endTime = performance.now();
            
            const connectionStats = {
                totalRequests: 50,
                successfulRequests: connectionResponses.filter(r => r.status === 200).length,
                totalTime: endTime - startTime,
                averageTime: (endTime - startTime) / 50
            };
            
            resourceResults.connectionPooling = connectionStats;
            colorLog(`    Connection pooling: ${connectionStats.successfulRequests}/50 successful, ${connectionStats.averageTime.toFixed(2)}ms avg`, 'green');

            return resourceResults;
        }
    },
    
    {
        name: 'Scalability Stress Test',
        test: async () => {
            colorLog('Testing scalability under stress...', 'blue');
            
            const stressResults = {};

            // Test increasing load pattern
            colorLog('  Testing increasing load pattern...', 'cyan');
            
            const loadLevels = [10, 25, 50, 100, 200];
            const loadResults = [];
            
            for (const load of loadLevels) {
                colorLog(`    Testing with ${load} concurrent requests...`, 'blue');
                
                const startTime = performance.now();
                const promises = [];
                
                for (let i = 0; i < load; i++) {
                    promises.push(makeRequest('GET', `${API_BASE}/api/emotions?page=${i % 10 + 1}`, null, {}, false));
                }
                
                const responses = await Promise.all(promises);
                const endTime = performance.now();
                
                const successful = responses.filter(r => r.status === 200).length;
                const failed = responses.filter(r => r.status >= 400).length;
                const errors = responses.filter(r => r.status === 0).length;
                
                const result = {
                    load,
                    successful,
                    failed,
                    errors,
                    totalTime: endTime - startTime,
                    successRate: (successful / load) * 100,
                    averageResponseTime: (endTime - startTime) / load
                };
                
                loadResults.push(result);
                colorLog(`      ${successful}/${load} successful (${result.successRate.toFixed(1)}%), ${result.averageResponseTime.toFixed(2)}ms avg`, 'green');
                
                // Cool down period
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            stressResults.loadTesting = loadResults;

            // Test burst traffic pattern
            colorLog('  Testing burst traffic pattern...', 'cyan');
            
            const burstTests = [];
            const burstSize = 100;
            const burstCount = 5;
            
            for (let burst = 0; burst < burstCount; burst++) {
                const burstStartTime = performance.now();
                const burstPromises = [];
                
                for (let i = 0; i < burstSize; i++) {
                    burstPromises.push(makeRequest('GET', `${API_BASE}/health`, null, {}, false));
                }
                
                const burstResponses = await Promise.all(burstPromises);
                const burstEndTime = performance.now();
                
                const burstSuccessful = burstResponses.filter(r => r.status === 200).length;
                burstTests.push({
                    burst: burst + 1,
                    successful: burstSuccessful,
                    total: burstSize,
                    duration: burstEndTime - burstStartTime
                });
                
                colorLog(`    Burst ${burst + 1}: ${burstSuccessful}/${burstSize} successful`, 'green');
                
                // Wait between bursts
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            stressResults.burstTesting = burstTests;

            // Test long-running connections
            colorLog('  Testing long-running connections...', 'cyan');
            
            const longRunningPromises = [];
            for (let i = 0; i < 20; i++) {
                longRunningPromises.push(
                    makeRequest('GET', `${API_BASE}/api/analytics/summary`, null, {}, false)
                );
                
                // Stagger the requests
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            const longRunningResponses = await Promise.all(longRunningPromises);
            const longRunningSuccessful = longRunningResponses.filter(r => r.status === 200).length;
            
            stressResults.longRunning = {
                total: 20,
                successful: longRunningSuccessful,
                successRate: (longRunningSuccessful / 20) * 100
            };
            
            colorLog(`    Long-running connections: ${longRunningSuccessful}/20 successful`, 'green');

            return stressResults;
        }
    }
];

// Run all tests
async function runAllTests() {
    colorLog('⚡ PERFORMANCE COMPREHENSIVE TESTS', 'magenta');
    colorLog('=================================', 'magenta');
    
    const startTime = performance.now();
    let passed = 0;
    let failed = 0;
    const results = [];
    
    for (const test of tests) {
        try {
            colorLog(`\n🧪 Testing: ${test.name}`, 'yellow');
            const testStartTime = Date.now();
            
            const result = await test.test();
            const duration = Date.now() - testStartTime;
            
            colorLog(`✅ ${test.name} - PASSED (${duration}ms)`, 'green');
            passed++;
            results.push({ name: test.name, status: 'PASSED', duration, result });
            
        } catch (error) {
            colorLog(`❌ ${test.name} - FAILED: ${error.message}`, 'red');
            failed++;
            results.push({ name: test.name, status: 'FAILED', error: error.message });
        }
    }
    
    const totalTime = performance.now() - startTime;
    
    // Summary
    colorLog('\n📊 PERFORMANCE TEST SUMMARY', 'cyan');
    colorLog('============================', 'cyan');
    colorLog(`Total Tests: ${passed + failed}`, 'blue');
    colorLog(`Passed: ${passed}`, 'green');
    colorLog(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    colorLog(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'blue');
    colorLog(`Total Test Duration: ${(totalTime / 1000).toFixed(2)}s`, 'blue');
    
    // Performance summary
    colorLog('\n📈 PERFORMANCE INSIGHTS', 'cyan');
    colorLog('=======================', 'cyan');
    
    results.forEach(result => {
        if (result.status === 'PASSED' && result.result) {
            colorLog(`✓ ${result.name}:`, 'blue');
            
            if (result.result.benchmarks) {
                Object.entries(result.result.benchmarks).forEach(([endpoint, stats]) => {
                    colorLog(`    ${endpoint}: ${stats.avg.toFixed(2)}ms avg, ${stats.p95.toFixed(2)}ms P95`, 'cyan');
                });
            }
            
            if (result.result.requestsPerSecond) {
                colorLog(`    Peak throughput: ${Math.max(...Object.values(result.result).map(r => r.requestsPerSecond || 0)).toFixed(2)} req/s`, 'cyan');
            }
        }
    });
    
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

export { runAllTests, tests, PerformanceTracker };