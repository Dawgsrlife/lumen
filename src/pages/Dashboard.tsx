import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-lumen-light">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-lumen-dark mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-lumen-dark mb-4">Emotion Tracker</h3>
            <p className="text-gray-600">Track your daily emotions and get insights</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-lumen-dark mb-4">Progress Overview</h3>
            <p className="text-gray-600">View your mental health journey</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-lumen-dark mb-4">Mini-Games</h3>
            <p className="text-gray-600">Therapeutic games based on your emotions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 