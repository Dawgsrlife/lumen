import React, { useEffect, useState } from 'react';
import { useClerkUser } from '../hooks/useClerkUser';
import { apiService } from '../services/api';

const DebugUserInfo: React.FC = () => {
  const { user } = useClerkUser();
  const [apiTest, setApiTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('DebugUserInfo: Testing API with user:', user.id);
      
      // Set authentication
      apiService.setClerkUserId(user.id);
      
      // Test creating an emotion
      const emotionResult = await apiService.createEmotionEntry({
        emotion: 'happy',
        intensity: 8,
        context: 'Debug test from frontend'
      });
      
      console.log('DebugUserInfo: Emotion creation result:', emotionResult);
      
      // Test getting emotions
      const getResult = await apiService.getEmotionEntries({ limit: 5 });
      console.log('DebugUserInfo: Get emotions result:', getResult);
      
      setApiTest({
        createResult: emotionResult,
        getResult: getResult,
        userId: user.id,
        userIdLength: user.id.length
      });
      
    } catch (error) {
      console.error('DebugUserInfo: API test error:', error);
      setApiTest({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('DebugUserInfo: User available:', {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg m-4">
        <h3 className="font-bold text-red-800">Debug: No User</h3>
        <p className="text-red-600">Clerk user not available</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg m-4 text-sm">
      <h3 className="font-bold text-blue-800 mb-2">Debug: User Info</h3>
      <div className="space-y-1 text-blue-700">
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.emailAddresses?.[0]?.emailAddress}</p>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>ID Length:</strong> {user.id.length}</p>
      </div>
      
      <div className="mt-4">
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing API...' : 'Test API Call'}
        </button>
      </div>
      
      {apiTest && (
        <div className="mt-4 bg-white p-3 rounded border">
          <h4 className="font-bold text-gray-800">API Test Result:</h4>
          <pre className="text-xs text-gray-600 mt-2 overflow-auto">
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugUserInfo;