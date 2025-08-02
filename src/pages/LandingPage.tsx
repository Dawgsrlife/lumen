import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lumen-light to-lumen-primary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-lumen-dark mb-6">
            Welcome to <span className="text-lumen-primary">Lumen</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your journey to mental wellness starts here. Track emotions, get AI-powered insights, 
            and discover therapeutic mini-games designed to support your mental health.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-lumen-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-lumen-primary/90 transition-colors">
              Get Started
            </button>
            <button className="border-2 border-lumen-secondary text-lumen-secondary px-8 py-3 rounded-lg font-semibold hover:bg-lumen-secondary hover:text-white transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 