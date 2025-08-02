import React from 'react';

const Games: React.FC = () => {
  return (
    <div className="min-h-screen bg-lumen-light">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-lumen-dark mb-8">Therapeutic Games</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-lumen-dark mb-4">Color Bloom</h3>
            <p className="text-gray-600">For sadness - nurture flowers to restore color</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-lumen-dark mb-4">Breath Beacon</h3>
            <p className="text-gray-600">For anxiety - guide orb with breath patterns</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-lumen-dark mb-4">More Games</h3>
            <p className="text-gray-600">Coming soon with Nathan's game development</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games; 