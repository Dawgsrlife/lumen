import { useClerk } from '@clerk/clerk-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useClerkUser } from '../../hooks/useClerkUser';
import { AnimatedBackground, LumenIcon } from '../ui';

export const UserProfile: React.FC = () => {
  const { user } = useClerkUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumen-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lumen-gradient-start)]/3 via-white/40 to-[var(--lumen-gradient-end)]/3 z-5"></div>

      {/* Minimalist Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {/* Clean white background */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Colorful floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'var(--lumen-primary)' : i % 3 === 1 ? 'var(--lumen-secondary)' : '#8B5CF6'
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Subtle connecting lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 50}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              background: 'linear-gradient(90deg, transparent, var(--lumen-primary), transparent)'
            }}
            animate={{
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>



      {/* Main content */}
      <div className="relative z-50 flex items-center justify-center min-h-[calc(100vh-120px)] px-8 pb-16">
        <div ref={contentRef} className="w-full max-w-4xl mx-auto">
          
          {/* Profile Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-16"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Your Profile
            </h1>
            <div className="mb-4"></div>
            <p className="text-lg text-gray-600 leading-relaxed text-center">
              Manage your account and preferences
            </p>
            <div className="w-32 h-1 mx-auto bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-full mt-8 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" 
                 title="Your wellness journey" />
          </motion.div>

          {/* Profile Card */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* User Info */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--lumen-primary)]/20 to-[var(--lumen-secondary)]/20 flex items-center justify-center border-2 border-white/50 shadow-lg">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-700">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </h2>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {user.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Account Settings */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h3>
                <div className="mb-4"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50">
                    <span className="text-gray-600">Privacy Level</span>
                    <span className="text-gray-900 font-medium capitalize">Private</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50">
                    <span className="text-gray-600">Theme</span>
                    <span className="text-gray-900 font-medium">Light</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50">
                    <span className="text-gray-600">Notifications</span>
                    <span className="text-gray-900 font-medium">Enabled</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="mb-4"></div>
                <div className="space-y-4">
                   <motion.button 
                     onClick={() => navigate('/dashboard')}
                     className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 px-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer font-semibold"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     Go to Dashboard
                   </motion.button>
                   <motion.button 
                     onClick={() => navigate('/analytics')}
                     className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer font-semibold"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     View Analytics
                   </motion.button>
                   <motion.button 
                     onClick={handleSignOut}
                     disabled={isLoading}
                     className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
                     whileHover={{ scale: isLoading ? 1 : 1.02 }}
                     whileTap={{ scale: isLoading ? 1 : 0.98 }}
                   >
                     {isLoading ? 'Signing out...' : 'Sign Out'}
                   </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 