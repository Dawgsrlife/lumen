import { useClerk } from '@clerk/clerk-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useClerkUser } from '../../hooks/useClerkUser';
import { Card } from '../ui';

export const UserProfile: React.FC = () => {
  const { user } = useClerkUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 30
      });

      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSignOut = async () => {
    console.log('🔄 Starting sign out process...');
    setIsLoading(true);
    try {
      console.log('📤 Calling Clerk signOut...');
      await signOut();
      console.log('✅ Sign out successful, navigating to home...');
      navigate('/');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    } finally {
      setIsLoading(false);
      console.log('🏁 Sign out process completed');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
          <div className="mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Profile
            </h1>
            <p className="text-xl text-gray-600">
              Manage your account and preferences
            </p>
          </motion.div>
          <div className="mb-4"></div>
        </div>

        {/* Profile Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            {/* User Info */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 shadow-lg">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-700">
                    {user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.primaryEmailAddress?.emailAddress || 'User'
                  }
                </h2>
                <p className="text-gray-600 mb-1">{user.primaryEmailAddress?.emailAddress || 'No email'}</p>
                <p className="text-sm text-gray-500">
                  Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Account Settings */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-600">Privacy Level</span>
                    <span className="text-gray-900 font-medium capitalize">Private</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-600">Theme</span>
                    <span className="text-gray-900 font-medium">Light</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-600">Notifications</span>
                    <span className="text-gray-900 font-medium">Enabled</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Strategic Color Placement */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                   <motion.button 
                     onClick={() => navigate('/dashboard')}
                     className="w-full bg-gradient-to-r from-yellow-400 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-yellow-500 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer font-semibold"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     Go to Dashboard
                   </motion.button>
                   <motion.button 
                     onClick={() => navigate('/analytics')}
                     className="w-full bg-gradient-to-r from-yellow-400 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-yellow-500 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer font-semibold"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     View Analytics
                   </motion.button>
                   <motion.button 
                     onClick={handleSignOut}
                     disabled={isLoading}
                     className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
                     whileHover={{ scale: isLoading ? 1 : 1.02 }}
                     whileTap={{ scale: isLoading ? 1 : 0.98 }}
                   >
                     {isLoading ? 'Signing out...' : 'Sign Out'}
                   </motion.button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}; 