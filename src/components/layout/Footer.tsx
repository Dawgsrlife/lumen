import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Left side - Copyright */}
          <div className="text-sm text-gray-600">
            © 2025 Lumen. Built with ❤️ for mental health awareness.
          </div>
          
          {/* Right side - Links */}
          <div className="flex space-x-8 text-sm">
            <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            <a href="https://github.com/Dawgsrlife/lumen" className="text-gray-600 hover:text-gray-900 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 