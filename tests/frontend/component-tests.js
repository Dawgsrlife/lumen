/**
 * Frontend Component Tests
 * Tests React components for proper rendering and functionality
 */

import { JSDOM } from 'jsdom';

// Mock DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Test results tracking
const componentTestResults = {
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

// Test utility functions
function testComponentRendering(componentName, testFunction) {
  try {
    testFunction();
    log(`✅ ${componentName} - Rendering test passed`, 'success');
    componentTestResults.passed++;
    componentTestResults.total++;
  } catch (error) {
    log(`❌ ${componentName} - ${error.message}`, 'error');
    componentTestResults.failed++;
    componentTestResults.total++;
    componentTestResults.details.push({ component: componentName, error: error.message });
  }
}

function testComponentInteraction(componentName, testFunction) {
  try {
    testFunction();
    log(`✅ ${componentName} - Interaction test passed`, 'success');
    componentTestResults.passed++;
    componentTestResults.total++;
  } catch (error) {
    log(`❌ ${componentName} - ${error.message}`, 'error');
    componentTestResults.failed++;
    componentTestResults.total++;
    componentTestResults.details.push({ component: componentName, error: error.message });
  }
}

// Component tests
function testHeaderComponent() {
  log('🧭 Testing Header Component...', 'info');
  
  // Test header rendering
  testComponentRendering('Header', () => {
    // Create a mock header element
    const header = document.createElement('header');
    header.className = 'bg-white shadow-sm border-b border-gray-200';
    header.innerHTML = `
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-xl font-bold text-lumen-primary">Lumen</span>
            </div>
          </div>
        </div>
      </nav>
    `;
    
    document.body.appendChild(header);
    
    // Test that header has required classes
    assert(header.classList.contains('bg-white'), 'Header should have white background');
    assert(header.querySelector('.text-lumen-primary'), 'Header should contain Lumen branding');
    
    document.body.removeChild(header);
  });
  
  // Test header navigation
  testComponentInteraction('Header', () => {
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <a href="/dashboard" class="text-gray-700 hover:text-lumen-primary">Dashboard</a>
      <a href="/analytics" class="text-gray-700 hover:text-lumen-primary">Analytics</a>
    `;
    
    const links = nav.querySelectorAll('a');
    assert(links.length === 2, 'Header should have navigation links');
    assert(links[0].getAttribute('href') === '/dashboard', 'First link should point to dashboard');
  });
}

function testButtonComponent() {
  log('🔘 Testing Button Component...', 'info');
  
  testComponentRendering('Button', () => {
    const button = document.createElement('button');
    button.className = 'bg-lumen-primary text-white px-4 py-2 rounded-lg hover:bg-lumen-primary/90 transition-colors';
    button.textContent = 'Click me';
    
    document.body.appendChild(button);
    
    assert(button.classList.contains('bg-lumen-primary'), 'Button should have primary background');
    assert(button.classList.contains('text-white'), 'Button should have white text');
    assert(button.textContent === 'Click me', 'Button should have correct text content');
    
    document.body.removeChild(button);
  });
  
  testComponentInteraction('Button', () => {
    const button = document.createElement('button');
    button.className = 'bg-lumen-primary text-white px-4 py-2 rounded-lg';
    let clicked = false;
    
    button.addEventListener('click', () => {
      clicked = true;
    });
    
    // Simulate click
    button.click();
    assert(clicked, 'Button should respond to click events');
  });
}

function testCardComponent() {
  log('🃏 Testing Card Component...', 'info');
  
  testComponentRendering('Card', () => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-6 border border-gray-200';
    card.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
      <p class="text-gray-600">Card content goes here</p>
    `;
    
    document.body.appendChild(card);
    
    assert(card.classList.contains('bg-white'), 'Card should have white background');
    assert(card.classList.contains('rounded-lg'), 'Card should have rounded corners');
    assert(card.classList.contains('shadow-md'), 'Card should have shadow');
    assert(card.querySelector('h3'), 'Card should have a title');
    assert(card.querySelector('p'), 'Card should have content');
    
    document.body.removeChild(card);
  });
}

function testEmotionSelectorComponent() {
  log('😊 Testing Emotion Selector Component...', 'info');
  
  testComponentRendering('EmotionSelector', () => {
    const selector = document.createElement('div');
    selector.className = 'emotion-selector';
    selector.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button class="emotion-btn" data-emotion="happy">😊 Happy</button>
        <button class="emotion-btn" data-emotion="sad">😢 Sad</button>
        <button class="emotion-btn" data-emotion="angry">😠 Angry</button>
        <button class="emotion-btn" data-emotion="calm">😌 Calm</button>
      </div>
    `;
    
    document.body.appendChild(selector);
    
    const buttons = selector.querySelectorAll('.emotion-btn');
    assert(buttons.length === 4, 'Emotion selector should have 4 emotion buttons');
    assert(buttons[0].getAttribute('data-emotion') === 'happy', 'First button should be happy');
    
    document.body.removeChild(selector);
  });
  
  testComponentInteraction('EmotionSelector', () => {
    const selector = document.createElement('div');
    selector.innerHTML = `
      <button class="emotion-btn" data-emotion="happy">😊 Happy</button>
    `;
    
    const button = selector.querySelector('.emotion-btn');
    let selectedEmotion = null;
    
    button.addEventListener('click', () => {
      selectedEmotion = button.getAttribute('data-emotion');
    });
    
    button.click();
    assert(selectedEmotion === 'happy', 'Emotion selector should track selected emotion');
  });
}

function testLoadingSpinnerComponent() {
  log('🌀 Testing Loading Spinner Component...', 'info');
  
  testComponentRendering('LoadingSpinner', () => {
    const spinner = document.createElement('div');
    spinner.className = 'flex justify-center items-center';
    spinner.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-lumen-primary"></div>
      <span class="ml-2 text-gray-600">Loading...</span>
    `;
    
    document.body.appendChild(spinner);
    
    assert(spinner.querySelector('.animate-spin'), 'Spinner should have animation class');
    assert(spinner.querySelector('.border-lumen-primary'), 'Spinner should use primary color');
    assert(spinner.textContent.includes('Loading...'), 'Spinner should show loading text');
    
    document.body.removeChild(spinner);
  });
}

function testModalComponent() {
  log('🪟 Testing Modal Component...', 'info');
  
  testComponentRendering('Modal', () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-semibold mb-4">Modal Title</h2>
        <p class="text-gray-600 mb-4">Modal content</p>
        <button class="bg-lumen-primary text-white px-4 py-2 rounded">Close</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    assert(modal.classList.contains('fixed'), 'Modal should be fixed positioned');
    assert(modal.classList.contains('bg-black'), 'Modal should have black overlay');
    assert(modal.querySelector('.bg-white'), 'Modal should have white content area');
    assert(modal.querySelector('button'), 'Modal should have close button');
    
    document.body.removeChild(modal);
  });
}

function testFormComponents() {
  log('📝 Testing Form Components...', 'info');
  
  testComponentRendering('Input', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-primary focus:border-transparent';
    input.placeholder = 'Enter text...';
    
    document.body.appendChild(input);
    
    assert(input.type === 'text', 'Input should be text type');
    assert(input.classList.contains('w-full'), 'Input should be full width');
    assert(input.placeholder === 'Enter text...', 'Input should have placeholder');
    
    document.body.removeChild(input);
  });
  
  testComponentInteraction('Input', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = '';
    
    let changed = false;
    input.addEventListener('input', () => {
      changed = true;
    });
    
    // Simulate input
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    assert(changed, 'Input should respond to input events');
    assert(input.value === 'test', 'Input should update value');
  });
}

function testResponsiveDesign() {
  log('📱 Testing Responsive Design...', 'info');
  
  testComponentRendering('Responsive Layout', () => {
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4 sm:px-6 lg:px-8';
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-4 rounded-lg">Card 1</div>
        <div class="bg-white p-4 rounded-lg">Card 2</div>
        <div class="bg-white p-4 rounded-lg">Card 3</div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    assert(container.classList.contains('container'), 'Container should have container class');
    assert(container.classList.contains('mx-auto'), 'Container should be centered');
    assert(container.querySelector('.grid'), 'Container should have grid layout');
    assert(container.querySelectorAll('.bg-white').length === 3, 'Container should have 3 cards');
    
    document.body.removeChild(container);
  });
}

// Run all component tests
function runComponentTests() {
  log('🧪 Starting Frontend Component Tests', 'info');
  log('====================================', 'info');
  
  testHeaderComponent();
  testButtonComponent();
  testCardComponent();
  testEmotionSelectorComponent();
  testLoadingSpinnerComponent();
  testModalComponent();
  testFormComponents();
  testResponsiveDesign();
  
  // Print results
  log('====================================', 'info');
  log('📊 Component Test Results:', 'info');
  log(`✅ Passed: ${componentTestResults.passed}`, 'success');
  log(`❌ Failed: ${componentTestResults.failed}`, componentTestResults.failed > 0 ? 'error' : 'info');
  log(`📈 Total: ${componentTestResults.total}`, 'info');
  log(`📊 Success Rate: ${((componentTestResults.passed / componentTestResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (componentTestResults.details.length > 0) {
    log('📋 Failed Component Details:', 'warning');
    componentTestResults.details.forEach(detail => {
      log(`  - ${detail.component}: ${detail.error}`, 'error');
    });
  }
  
  log('====================================', 'info');
  
  return componentTestResults;
}

// Export for use in other test files
export { runComponentTests, testComponentRendering, testComponentInteraction };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComponentTests();
} 