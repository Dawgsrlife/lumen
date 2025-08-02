import { useClerk } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerkUser } from '../../hooks/useClerkUser';

export const UserProfile: React.FC = () => {
  const { user } = useClerkUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumen-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lumen-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-lumen-dark mb-8">Profile</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-lumen-primary/20 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-lumen-primary">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-lumen-dark">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {user.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-lumen-dark mb-3">Account Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Theme</span>
                    <span className="text-lumen-dark font-medium">{user.preferences.theme}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Notifications</span>
                    <span className="text-lumen-dark font-medium">
                      {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Privacy Level</span>
                    <span className="text-lumen-dark font-medium capitalize">
                      {user.preferences.privacyLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-lumen-dark mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-lumen-primary text-white py-2 px-4 rounded-lg hover:bg-lumen-primary/90 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button 
                    onClick={() => navigate('/analytics')}
                    className="w-full bg-lumen-secondary text-white py-2 px-4 rounded-lg hover:bg-lumen-secondary/90 transition-colors"
                  >
                    View Analytics
                  </button>
                  <button 
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 