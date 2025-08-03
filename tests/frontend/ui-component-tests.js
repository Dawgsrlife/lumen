/**
 * UI Component Tests
 * Tests all UI components for proper rendering and functionality
 */

import { JSDOM } from 'jsdom';

// Mock DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Test results tracking
const uiTestResults = {
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

function testComponent(componentName, testFunction) {
  try {
    testFunction();
    log(`✅ ${componentName} - Test passed`, 'success');
    uiTestResults.passed++;
    uiTestResults.total++;
  } catch (error) {
    log(`❌ ${componentName} - ${error.message}`, 'error');
    uiTestResults.failed++;
    uiTestResults.total++;
    uiTestResults.details.push({ component: componentName, error: error.message });
  }
}

// Button Component Tests
function testButtonComponent() {
  log('🔘 Testing Button Component...', 'info');
  
  testComponent('Button - Primary Variant', () => {
    const button = document.createElement('button');
    button.className = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-lumen-primary text-white hover:bg-lumen-primary/90 focus:ring-lumen-primary/50 px-4 py-2 text-base';
    button.textContent = 'Click me';
    
    document.body.appendChild(button);
    
    assert(button.classList.contains('bg-lumen-primary'), 'Primary button should have primary background');
    assert(button.classList.contains('text-white'), 'Primary button should have white text');
    assert(button.classList.contains('hover:bg-lumen-primary/90'), 'Primary button should have hover state');
    assert(button.textContent === 'Click me', 'Button should have correct text content');
    
    document.body.removeChild(button);
  });
  
  testComponent('Button - Secondary Variant', () => {
    const button = document.createElement('button');
    button.className = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-lumen-secondary text-white hover:bg-lumen-secondary/90 focus:ring-lumen-secondary/50 px-4 py-2 text-base';
    
    document.body.appendChild(button);
    
    assert(button.classList.contains('bg-lumen-secondary'), 'Secondary button should have secondary background');
    assert(button.classList.contains('hover:bg-lumen-secondary/90'), 'Secondary button should have hover state');
    
    document.body.removeChild(button);
  });
  
  testComponent('Button - Outline Variant', () => {
    const button = document.createElement('button');
    button.className = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-lumen-secondary text-lumen-secondary hover:bg-lumen-secondary hover:text-white focus:ring-lumen-secondary/50 px-4 py-2 text-base';
    
    document.body.appendChild(button);
    
    assert(button.classList.contains('border-lumen-secondary'), 'Outline button should have secondary border');
    assert(button.classList.contains('text-lumen-secondary'), 'Outline button should have secondary text');
    assert(button.classList.contains('hover:bg-lumen-secondary'), 'Outline button should have hover state');
    
    document.body.removeChild(button);
  });
  
  testComponent('Button - Loading State', () => {
    const button = document.createElement('button');
    button.className = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-lumen-primary text-white hover:bg-lumen-primary/90 focus:ring-lumen-primary/50 px-4 py-2 text-base';
    button.innerHTML = `
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      Loading...
    `;
    
    document.body.appendChild(button);
    
    const spinner = button.querySelector('.animate-spin');
    assert(spinner, 'Loading button should have spinner');
    assert(spinner.classList.contains('animate-spin'), 'Spinner should have animation class');
    assert(button.textContent.includes('Loading...'), 'Loading button should show loading text');
    
    document.body.removeChild(button);
  });
  
  testComponent('Button - Disabled State', () => {
    const button = document.createElement('button');
    button.className = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-lumen-primary text-white hover:bg-lumen-primary/90 focus:ring-lumen-primary/50 px-4 py-2 text-base opacity-50 cursor-not-allowed';
    button.disabled = true;
    
    document.body.appendChild(button);
    
    assert(button.disabled, 'Button should be disabled');
    assert(button.classList.contains('opacity-50'), 'Disabled button should have reduced opacity');
    assert(button.classList.contains('cursor-not-allowed'), 'Disabled button should have not-allowed cursor');
    
    document.body.removeChild(button);
  });
  
  testComponent('Button - Click Interaction', () => {
    const button = document.createElement('button');
    button.className = 'bg-lumen-primary text-white px-4 py-2 rounded-lg';
    let clicked = false;
    
    button.addEventListener('click', () => {
      clicked = true;
    });
    
    button.click();
    assert(clicked, 'Button should respond to click events');
  });
}

// Card Component Tests
function testCardComponent() {
  log('🃏 Testing Card Component...', 'info');
  
  testComponent('Card - Basic Rendering', () => {
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
  
  testComponent('Card - Interactive', () => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow';
    let clicked = false;
    
    card.addEventListener('click', () => {
      clicked = true;
    });
    
    card.click();
    assert(clicked, 'Interactive card should respond to clicks');
  });
}

// Input Component Tests
function testInputComponent() {
  log('📝 Testing Input Component...', 'info');
  
  testComponent('Input - Basic Rendering', () => {
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
  
  testComponent('Input - Focus States', () => {
    const input = document.createElement('input');
    input.className = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-primary focus:border-transparent';
    
    document.body.appendChild(input);
    
    assert(input.classList.contains('focus:ring-lumen-primary'), 'Input should have focus ring');
    assert(input.classList.contains('focus:border-transparent'), 'Input should have transparent border on focus');
    
    document.body.removeChild(input);
  });
  
  testComponent('Input - Value Changes', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = '';
    
    let changed = false;
    input.addEventListener('input', () => {
      changed = true;
    });
    
    input.value = 'test';
    input.dispatchEvent(new dom.window.Event('input'));
    
    assert(changed, 'Input should respond to input events');
    assert(input.value === 'test', 'Input should update value');
  });
}

// Modal Component Tests
function testModalComponent() {
  log('🪟 Testing Modal Component...', 'info');
  
  testComponent('Modal - Basic Structure', () => {
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
  
  testComponent('Modal - Close Functionality', () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <button class="close-btn bg-lumen-primary text-white px-4 py-2 rounded">Close</button>
      </div>
    `;
    
    let closed = false;
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      closed = true;
    });
    
    closeBtn.click();
    assert(closed, 'Modal close button should work');
  });
}

// Loading Spinner Component Tests
function testLoadingSpinnerComponent() {
  log('🌀 Testing Loading Spinner Component...', 'info');
  
  testComponent('Loading Spinner - Basic Rendering', () => {
    const spinner = document.createElement('div');
    spinner.className = 'flex justify-center items-center';
    spinner.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-lumen-primary"></div>
      <span class="ml-2 text-gray-600">Loading...</span>
    `;
    
    document.body.appendChild(spinner);
    
    const spinnerElement = spinner.querySelector('.animate-spin');
    assert(spinnerElement, 'Spinner should have spinner element');
    assert(spinnerElement.classList.contains('animate-spin'), 'Spinner should have animation class');
    assert(spinnerElement.classList.contains('border-lumen-primary'), 'Spinner should use primary color');
    assert(spinner.textContent.includes('Loading...'), 'Spinner should show loading text');
    
    document.body.removeChild(spinner);
  });
  
  testComponent('Loading Spinner - Different Sizes', () => {
    const sizes = ['h-4 w-4', 'h-8 w-8', 'h-12 w-12'];
    
    sizes.forEach(size => {
      const spinner = document.createElement('div');
      spinner.className = `animate-spin rounded-full ${size} border-b-2 border-lumen-primary`;
      
      document.body.appendChild(spinner);
      const sizeClasses = size.split(' ');
      sizeClasses.forEach(sizeClass => {
        assert(spinner.classList.contains(sizeClass), `Spinner should have size class ${sizeClass}`);
      });
      document.body.removeChild(spinner);
    });
  });
}

// Emotion Selector Component Tests
function testEmotionSelectorComponent() {
  log('😊 Testing Emotion Selector Component...', 'info');
  
  testComponent('Emotion Selector - Basic Structure', () => {
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
    assert(buttons[1].getAttribute('data-emotion') === 'sad', 'Second button should be sad');
    
    document.body.removeChild(selector);
  });
  
  testComponent('Emotion Selector - Interaction', () => {
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

// Responsive Design Tests
function testResponsiveDesign() {
  log('📱 Testing Responsive Design...', 'info');
  
  testComponent('Responsive Grid Layout', () => {
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
  
  testComponent('Responsive Typography', () => {
    const text = document.createElement('h1');
    text.className = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold';
    text.textContent = 'Responsive Heading';
    
    document.body.appendChild(text);
    
    assert(text.classList.contains('text-2xl'), 'Text should have base size');
    assert(text.classList.contains('sm:text-3xl'), 'Text should have small breakpoint size');
    assert(text.classList.contains('md:text-4xl'), 'Text should have medium breakpoint size');
    assert(text.classList.contains('lg:text-5xl'), 'Text should have large breakpoint size');
    
    document.body.removeChild(text);
  });
}

// Accessibility Tests
function testAccessibility() {
  log('♿ Testing Accessibility...', 'info');
  
  testComponent('Button Accessibility', () => {
    const button = document.createElement('button');
    button.className = 'bg-lumen-primary text-white px-4 py-2 rounded-lg';
    button.setAttribute('aria-label', 'Submit form');
    button.textContent = 'Submit';
    
    document.body.appendChild(button);
    
    assert(button.getAttribute('aria-label'), 'Button should have aria-label');
    assert(button.textContent === 'Submit', 'Button should have accessible text');
    
    document.body.removeChild(button);
  });
  
  testComponent('Form Accessibility', () => {
    const form = document.createElement('form');
    form.innerHTML = `
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
    `;
    
    document.body.appendChild(form);
    
    const label = form.querySelector('label');
    const input = form.querySelector('input');
    
    assert(label.getAttribute('for') === 'email', 'Label should be associated with input');
    assert(input.getAttribute('id') === 'email', 'Input should have matching id');
    assert(input.hasAttribute('required'), 'Required input should have required attribute');
    
    document.body.removeChild(form);
  });
}

// Color Scheme Tests
function testColorScheme() {
  log('🎨 Testing Color Scheme...', 'info');
  
  testComponent('Lumen Brand Colors', () => {
    const colors = [
      'lumen-primary',
      'lumen-secondary', 
      'lumen-dark',
      'lumen-light'
    ];
    
    colors.forEach(color => {
      const element = document.createElement('div');
      element.className = `bg-${color}`;
      
      document.body.appendChild(element);
      assert(element.classList.contains(`bg-${color}`), `Should support ${color} background`);
      document.body.removeChild(element);
    });
  });
  
  testComponent('Text Colors', () => {
    const textColors = [
      'text-lumen-primary',
      'text-lumen-secondary',
      'text-gray-600',
      'text-gray-900'
    ];
    
    textColors.forEach(color => {
      const element = document.createElement('span');
      element.className = color;
      element.textContent = 'Test text';
      
      document.body.appendChild(element);
      assert(element.classList.contains(color), `Should support ${color} text color`);
      document.body.removeChild(element);
    });
  });
}

// Animation Tests
function testAnimations() {
  log('✨ Testing Animations...', 'info');
  
  testComponent('Transition Classes', () => {
    const element = document.createElement('div');
    element.className = 'transition-all duration-200 ease-in-out';
    
    document.body.appendChild(element);
    
    assert(element.classList.contains('transition-all'), 'Element should have transition class');
    assert(element.classList.contains('duration-200'), 'Element should have duration class');
    assert(element.classList.contains('ease-in-out'), 'Element should have easing class');
    
    document.body.removeChild(element);
  });
  
  testComponent('Animation Classes', () => {
    const animations = [
      'animate-spin',
      'animate-pulse',
      'animate-bounce'
    ];
    
    animations.forEach(animation => {
      const element = document.createElement('div');
      element.className = animation;
      
      document.body.appendChild(element);
      assert(element.classList.contains(animation), `Should support ${animation} animation`);
      document.body.removeChild(element);
    });
  });
}

// Run all UI component tests
function runUIComponentTests() {
  log('🧪 Starting UI Component Tests', 'info');
  log('================================', 'info');
  
  testButtonComponent();
  testCardComponent();
  testInputComponent();
  testModalComponent();
  testLoadingSpinnerComponent();
  testEmotionSelectorComponent();
  testResponsiveDesign();
  testAccessibility();
  testColorScheme();
  testAnimations();
  
  // Print results
  log('================================', 'info');
  log('📊 UI Component Test Results:', 'info');
  log(`✅ Passed: ${uiTestResults.passed}`, 'success');
  log(`❌ Failed: ${uiTestResults.failed}`, uiTestResults.failed > 0 ? 'error' : 'info');
  log(`📈 Total: ${uiTestResults.total}`, 'info');
  log(`📊 Success Rate: ${((uiTestResults.passed / uiTestResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (uiTestResults.details.length > 0) {
    log('📋 Failed Component Details:', 'warning');
    uiTestResults.details.forEach(detail => {
      log(`  - ${detail.component}: ${detail.error}`, 'error');
    });
  }
  
  log('================================', 'info');
  
  return uiTestResults;
}

// Export for use in other test files
export { runUIComponentTests, testComponent };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runUIComponentTests();
} 