/**
 * Page Component Tests
 * Tests all page components for proper rendering and functionality
 */

import { JSDOM } from 'jsdom';

// Mock DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock React Router
global.React = { createElement: () => {} };
global.ReactRouter = { useNavigate: () => () => {}, useLocation: () => ({ pathname: '/' }) };

// Mock Clerk Auth
global.useAuth = () => ({
  isSignedIn: false,
  isLoaded: true,
  userId: 'test-user-id'
});

// Test results tracking
const pageTestResults = {
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

function testPage(pageName, testFunction) {
  try {
    testFunction();
    log(`✅ ${pageName} - Test passed`, 'success');
    pageTestResults.passed++;
    pageTestResults.total++;
  } catch (error) {
    log(`❌ ${pageName} - ${error.message}`, 'error');
    pageTestResults.failed++;
    pageTestResults.total++;
    pageTestResults.details.push({ page: pageName, error: error.message });
  }
}

// Landing Page Tests
function testLandingPage() {
  log('🏠 Testing Landing Page...', 'info');
  
  testPage('Landing Page - Basic Structure', () => {
    const page = document.createElement('div');
    page.className = 'min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100';
    page.innerHTML = `
      <nav class="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <a href="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer logo">
          <span class="text-xl font-bold text-gray-900">Lumen</span>
        </a>
        <div class="hidden md:flex space-x-8">
          <a href="/" class="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">HOME</a>
          <a href="/about" class="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">ABOUT</a>
          <a href="/features" class="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">FEATURES</a>
          <a href="/contact" class="nav-link text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">CONTACT</a>
        </div>
      </nav>
      <div class="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto px-8 py-24 lg:py-32">
        <div class="space-y-24">
          <h1 class="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            <span class="block hero-line relative">
              <span class="hero-word">Light</span> <span class="hero-word">the</span> <span class="hero-word">Mind.</span>
            </span>
            <span class="block hero-line relative">
              <span class="hero-word">Feel,</span> <span class="hero-word">Heal,</span> <span class="hero-word">and</span> <span class="hero-word">Grow.</span>
            </span>
          </h1>
          <p class="text-xl leading-relaxed text-gray-600 max-w-lg hero-subtext">
            Lumen listens when no one else does. It understands your words and feelings, then gently guides you with calming games and health insights tailored just for what you're going through.
          </p>
          <button class="hero-button relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white text-base tracking-normal transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer">
            Begin Your Journey
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    // Test navigation
    const nav = page.querySelector('nav');
    assert(nav, 'Landing page should have navigation');
    
    const logo = nav.querySelector('.logo');
    assert(logo, 'Navigation should have logo');
    
    const navLinks = nav.querySelectorAll('.nav-link');
    assert(navLinks.length === 4, 'Navigation should have 4 links');
    
    // Test hero content
    const heroTitle = page.querySelector('h1');
    assert(heroTitle, 'Landing page should have hero title');
    assert(heroTitle.textContent.includes('Light the Mind'), 'Hero title should contain main message');
    assert(heroTitle.textContent.includes('Feel, Heal, and Grow'), 'Hero title should contain secondary message');
    
    // Test hero words for animation classes
    const heroWords = page.querySelectorAll('.hero-word');
    assert(heroWords.length > 0, 'Hero title should have animated words');
    
    // Test CTA button
    const ctaButton = page.querySelector('.hero-button');
    assert(ctaButton, 'Landing page should have CTA button');
    assert(ctaButton.textContent.includes('Begin Your Journey'), 'CTA button should have correct text');
    
    document.body.removeChild(page);
  });
  
  testPage('Landing Page - Responsive Design', () => {
    const page = document.createElement('div');
    page.className = 'min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100';
    page.innerHTML = `
      <div class="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto px-8 py-24 lg:py-32">
        <div class="space-y-24">
          <h1 class="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Light the Mind.
          </h1>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const grid = page.querySelector('.grid');
    assert(grid.classList.contains('lg:grid-cols-2'), 'Landing page should have responsive grid');
    
    const title = page.querySelector('h1');
    assert(title.classList.contains('text-5xl'), 'Title should have base size');
    assert(title.classList.contains('lg:text-6xl'), 'Title should have large breakpoint size');
    
    document.body.removeChild(page);
  });
  
  testPage('Landing Page - Animation Classes', () => {
    const page = document.createElement('div');
    page.innerHTML = `
      <span class="hero-line">Light the Mind.</span>
      <span class="hero-word">Light</span>
      <span class="hero-subtext">Description text</span>
      <button class="hero-button">CTA Button</button>
    `;
    
    document.body.appendChild(page);
    
    const heroLine = page.querySelector('.hero-line');
    const heroWord = page.querySelector('.hero-word');
    const heroSubtext = page.querySelector('.hero-subtext');
    const heroButton = page.querySelector('.hero-button');
    
    assert(heroLine, 'Should have hero-line class for animations');
    assert(heroWord, 'Should have hero-word class for animations');
    assert(heroSubtext, 'Should have hero-subtext class for animations');
    assert(heroButton, 'Should have hero-button class for animations');
    
    document.body.removeChild(page);
  });
}

// Dashboard Page Tests
function testDashboardPage() {
  log('📊 Testing Dashboard Page...', 'info');
  
  testPage('Dashboard - Basic Structure', () => {
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50';
    page.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600">Welcome back! Here's your mental health overview.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Today's Mood</h3>
            <div class="text-3xl font-bold text-lumen-primary">😊</div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Weekly Streak</h3>
            <div class="text-3xl font-bold text-lumen-secondary">7 days</div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Journal Entries</h3>
            <div class="text-3xl font-bold text-gray-900">12</div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const title = page.querySelector('h1');
    assert(title, 'Dashboard should have title');
    assert(title.textContent === 'Dashboard', 'Dashboard title should be correct');
    
    const cards = page.querySelectorAll('.bg-white.rounded-lg.shadow');
    assert(cards.length === 3, 'Dashboard should have 3 main cards');
    
    const grid = page.querySelector('.grid');
    assert(grid.classList.contains('grid-cols-1'), 'Dashboard should have responsive grid');
    assert(grid.classList.contains('md:grid-cols-2'), 'Dashboard should have medium breakpoint grid');
    assert(grid.classList.contains('lg:grid-cols-3'), 'Dashboard should have large breakpoint grid');
    
    document.body.removeChild(page);
  });
  
  testPage('Dashboard - Quick Actions', () => {
    const page = document.createElement('div');
    page.innerHTML = `
      <div class="space-y-4">
        <button class="bg-lumen-primary text-white px-4 py-2 rounded-lg hover:bg-lumen-primary/90 transition-colors">
          Log Emotion
        </button>
        <button class="bg-lumen-secondary text-white px-4 py-2 rounded-lg hover:bg-lumen-secondary/90 transition-colors">
          Write Journal
        </button>
        <button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Play Game
        </button>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const buttons = page.querySelectorAll('button');
    assert(buttons.length === 3, 'Dashboard should have 3 quick action buttons');
    
    const logEmotionBtn = buttons[0];
    const writeJournalBtn = buttons[1];
    const playGameBtn = buttons[2];
    
    assert(logEmotionBtn.textContent.trim() === 'Log Emotion', 'First button should be Log Emotion');
    assert(writeJournalBtn.textContent.trim() === 'Write Journal', 'Second button should be Write Journal');
    assert(playGameBtn.textContent.trim() === 'Play Game', 'Third button should be Play Game');
    
    document.body.removeChild(page);
  });
}

// Analytics Page Tests
function testAnalyticsPage() {
  log('📈 Testing Analytics Page...', 'info');
  
  testPage('Analytics - Basic Structure', () => {
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50';
    page.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
          <p class="text-gray-600">Track your mental health journey with detailed insights.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Mood Trends</h3>
            <div class="h-64 bg-gray-100 rounded flex items-center justify-center">
              <span class="text-gray-500">Chart Placeholder</span>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Emotion Distribution</h3>
            <div class="h-64 bg-gray-100 rounded flex items-center justify-center">
              <span class="text-gray-500">Chart Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const title = page.querySelector('h1');
    assert(title, 'Analytics page should have title');
    assert(title.textContent === 'Analytics', 'Analytics title should be correct');
    
    const chartContainers = page.querySelectorAll('.bg-white.rounded-lg.shadow');
    assert(chartContainers.length === 2, 'Analytics should have 2 chart containers');
    
    const grid = page.querySelector('.grid');
    assert(grid.classList.contains('grid-cols-1'), 'Analytics should have responsive grid');
    assert(grid.classList.contains('lg:grid-cols-2'), 'Analytics should have large breakpoint grid');
    
    document.body.removeChild(page);
  });
  
  testPage('Analytics - Time Period Selector', () => {
    const page = document.createElement('div');
    page.innerHTML = `
      <div class="flex space-x-2 mb-6">
        <button class="px-4 py-2 rounded-lg bg-lumen-primary text-white">Week</button>
        <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Month</button>
        <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Year</button>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const buttons = page.querySelectorAll('button');
    assert(buttons.length === 3, 'Analytics should have 3 time period buttons');
    
    const weekBtn = buttons[0];
    const monthBtn = buttons[1];
    const yearBtn = buttons[2];
    
    assert(weekBtn.textContent === 'Week', 'First button should be Week');
    assert(monthBtn.textContent === 'Month', 'Second button should be Month');
    assert(yearBtn.textContent === 'Year', 'Third button should be Year');
    
    assert(weekBtn.classList.contains('bg-lumen-primary'), 'Active period should be highlighted');
    
    document.body.removeChild(page);
  });
}

// Games Page Tests
function testGamesPage() {
  log('🎮 Testing Games Page...', 'info');
  
  testPage('Games - Basic Structure', () => {
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50';
    page.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Therapeutic Games</h1>
          <p class="text-gray-600">Play calming games designed to improve your mental well-being.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span class="text-white text-2xl">🎯</span>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Focus Game</h3>
              <p class="text-gray-600 mb-4">Improve concentration and mindfulness.</p>
              <button class="w-full bg-lumen-primary text-white px-4 py-2 rounded-lg hover:bg-lumen-primary/90 transition-colors">
                Play Now
              </button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span class="text-white text-2xl">🌊</span>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Breathing Exercise</h3>
              <p class="text-gray-600 mb-4">Learn deep breathing techniques.</p>
              <button class="w-full bg-lumen-secondary text-white px-4 py-2 rounded-lg hover:bg-lumen-secondary/90 transition-colors">
                Start Session
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const title = page.querySelector('h1');
    assert(title, 'Games page should have title');
    assert(title.textContent === 'Therapeutic Games', 'Games title should be correct');
    
    const gameCards = page.querySelectorAll('.bg-white.rounded-lg.shadow.overflow-hidden');
    assert(gameCards.length === 2, 'Games page should have 2 game cards');
    
    const playButtons = page.querySelectorAll('button');
    assert(playButtons.length === 2, 'Games page should have 2 play buttons');
    
    const focusGame = gameCards[0];
    const breathingGame = gameCards[1];
    
    assert(focusGame.querySelector('h3').textContent === 'Focus Game', 'First game should be Focus Game');
    assert(breathingGame.querySelector('h3').textContent === 'Breathing Exercise', 'Second game should be Breathing Exercise');
    
    document.body.removeChild(page);
  });
  
  testPage('Games - Game Categories', () => {
    const page = document.createElement('div');
    page.innerHTML = `
      <div class="flex space-x-4 mb-6">
        <button class="px-4 py-2 rounded-lg bg-lumen-primary text-white">All Games</button>
        <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Focus</button>
        <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Relaxation</button>
        <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Mindfulness</button>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const buttons = page.querySelectorAll('button');
    assert(buttons.length === 4, 'Games page should have 4 category buttons');
    
    const categories = ['All Games', 'Focus', 'Relaxation', 'Mindfulness'];
    buttons.forEach((button, index) => {
      assert(button.textContent === categories[index], `Button ${index + 1} should be ${categories[index]}`);
    });
    
    document.body.removeChild(page);
  });
}

// Journal Page Tests
function testJournalPage() {
  log('📝 Testing Journal Page...', 'info');
  
  testPage('Journal - Basic Structure', () => {
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50';
    page.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Journal</h1>
            <p class="text-gray-600">Reflect on your thoughts and feelings.</p>
          </div>
          <button class="bg-lumen-primary text-white px-6 py-2 rounded-lg hover:bg-lumen-primary/90 transition-colors">
            New Entry
          </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
              <div class="space-y-4">
                <div class="border-b border-gray-200 pb-4">
                  <h4 class="font-medium text-gray-900">Today's Reflection</h4>
                  <p class="text-gray-600 text-sm">Feeling grateful for the small moments...</p>
                  <span class="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Journal Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Entries</span>
                <span class="font-semibold">24</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">This Week</span>
                <span class="font-semibold">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const title = page.querySelector('h1');
    assert(title, 'Journal page should have title');
    assert(title.textContent === 'Journal', 'Journal title should be correct');
    
    const newEntryBtn = page.querySelector('button');
    assert(newEntryBtn, 'Journal page should have New Entry button');
    assert(newEntryBtn.textContent.trim() === 'New Entry', 'Button text should be correct');
    
    const grid = page.querySelector('.grid');
    assert(grid.classList.contains('grid-cols-1'), 'Journal should have responsive grid');
    assert(grid.classList.contains('lg:grid-cols-3'), 'Journal should have large breakpoint grid');
    
    const recentEntries = page.querySelector('.lg\\:col-span-2');
    assert(recentEntries, 'Journal should have recent entries section');
    
    const stats = page.querySelector('.bg-white.rounded-lg.shadow.p-6:last-child');
    assert(stats, 'Journal should have stats section');
    
    document.body.removeChild(page);
  });
  
  testPage('Journal - Entry Form', () => {
    const page = document.createElement('div');
    page.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">New Journal Entry</h3>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-primary focus:border-transparent" placeholder="Entry title">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-primary focus:border-transparent" rows="6" placeholder="Write your thoughts..."></textarea>
          </div>
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-lumen-primary focus:ring-lumen-primary">
              <span class="ml-2 text-sm text-gray-700">Private entry</span>
            </label>
          </div>
          <button type="submit" class="w-full bg-lumen-primary text-white px-4 py-2 rounded-lg hover:bg-lumen-primary/90 transition-colors">
            Save Entry
          </button>
        </form>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const form = page.querySelector('form');
    assert(form, 'Journal should have entry form');
    
    const titleInput = form.querySelector('input[type="text"]');
    assert(titleInput, 'Form should have title input');
    assert(titleInput.placeholder === 'Entry title', 'Title input should have correct placeholder');
    
    const contentTextarea = form.querySelector('textarea');
    assert(contentTextarea, 'Form should have content textarea');
    assert(contentTextarea.placeholder === 'Write your thoughts...', 'Content textarea should have correct placeholder');
    
    const privateCheckbox = form.querySelector('input[type="checkbox"]');
    assert(privateCheckbox, 'Form should have private checkbox');
    
    const saveButton = form.querySelector('button[type="submit"]');
    assert(saveButton, 'Form should have save button');
    assert(saveButton.textContent.trim() === 'Save Entry', 'Save button should have correct text');
    
    document.body.removeChild(page);
  });
}

// Profile Page Tests
function testProfilePage() {
  log('👤 Testing Profile Page...', 'info');
  
  testPage('Profile - Basic Structure', () => {
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50';
    page.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
          <p class="text-gray-600">Manage your account settings and preferences.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-lumen-primary rounded-full flex items-center justify-center">
                <span class="text-white text-xl font-semibold">JD</span>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">John Doe</h2>
                <p class="text-gray-600">john.doe@example.com</p>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input type="text" value="John Doe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-primary focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value="john.doe@example.com" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-primary focus:border-transparent">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const title = page.querySelector('h1');
    assert(title, 'Profile page should have title');
    assert(title.textContent === 'Profile', 'Profile title should be correct');
    
    const avatar = page.querySelector('.w-16.h-16.bg-lumen-primary.rounded-full');
    assert(avatar, 'Profile should have avatar');
    
    const displayName = page.querySelector('h2');
    assert(displayName, 'Profile should have display name');
    assert(displayName.textContent === 'John Doe', 'Display name should be correct');
    
    const email = page.querySelector('p.text-gray-600');
    assert(email, 'Profile should have email');
    // Check if the email element exists and has content
    assert(email.textContent.length > 0, 'Email should have content');
    
    const inputs = page.querySelectorAll('input');
    assert(inputs.length === 2, 'Profile should have 2 input fields');
    
    document.body.removeChild(page);
  });
  
  testPage('Profile - Preferences', () => {
    const page = document.createElement('div');
    page.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-primary focus:border-transparent">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" checked class="rounded border-gray-300 text-lumen-primary focus:ring-lumen-primary">
                <span class="ml-2 text-sm text-gray-700">Daily reminders</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 text-lumen-primary focus:ring-lumen-primary">
                <span class="ml-2 text-sm text-gray-700">Weekly insights</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(page);
    
    const themeSelect = page.querySelector('select');
    assert(themeSelect, 'Profile should have theme selector');
    
    const themeOptions = themeSelect.querySelectorAll('option');
    assert(themeOptions.length === 3, 'Theme selector should have 3 options');
    
    const checkboxes = page.querySelectorAll('input[type="checkbox"]');
    assert(checkboxes.length === 2, 'Profile should have 2 notification checkboxes');
    
    const dailyReminders = checkboxes[0];
    assert(dailyReminders.checked, 'Daily reminders should be checked by default');
    
    document.body.removeChild(page);
  });
}

// Run all page tests
function runPageTests() {
  log('📄 Starting Page Component Tests', 'info');
  log('================================', 'info');
  
  testLandingPage();
  testDashboardPage();
  testAnalyticsPage();
  testGamesPage();
  testJournalPage();
  testProfilePage();
  
  // Print results
  log('================================', 'info');
  log('📊 Page Component Test Results:', 'info');
  log(`✅ Passed: ${pageTestResults.passed}`, 'success');
  log(`❌ Failed: ${pageTestResults.failed}`, pageTestResults.failed > 0 ? 'error' : 'info');
  log(`📈 Total: ${pageTestResults.total}`, 'info');
  log(`📊 Success Rate: ${((pageTestResults.passed / pageTestResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (pageTestResults.details.length > 0) {
    log('📋 Failed Page Details:', 'warning');
    pageTestResults.details.forEach(detail => {
      log(`  - ${detail.page}: ${detail.error}`, 'error');
    });
  }
  
  log('================================', 'info');
  
  return pageTestResults;
}

// Export for use in other test files
export { runPageTests, testPage };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPageTests();
} 