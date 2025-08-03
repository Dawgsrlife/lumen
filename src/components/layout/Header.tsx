import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { useClerkUser } from '../../hooks/useClerkUser';
import LumenIcon from '../ui/LumenIcon';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useClerkUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === '/landing';
  const isWelcomePage = location.pathname === '/welcome';

  const handleSignOut = async () => {
    console.log('🔄 Header: Starting sign out process...');
    setIsSigningOut(true);
    try {
      console.log('📤 Header: Calling Clerk signOut...');
      await signOut();
      console.log('✅ Header: Sign out successful, navigating to home...');
      navigate('/');
    } catch (error) {
      console.error('❌ Header: Sign out error:', error);
    } finally {
      setIsSigningOut(false);
      setIsMenuOpen(false);
      console.log('🏁 Header: Sign out process completed');
    }
  };

  // Don't show header on landing or welcome pages for minimal design
  if (isLandingPage || isWelcomePage) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', protected: true },
    { label: 'Analytics', href: '/analytics', protected: true },
    { label: 'Games', href: '/games', protected: true },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo with LumenIcon */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <LumenIcon size="sm" />
            <span className="text-xl font-light text-gray-900">Lumen</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-lg whitespace-nowrap ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">HOME</Link>
                <Link to="/about" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">ABOUT</Link>
                <Link to="/features" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">FEATURES</Link>
                <Link to="/contact" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">CONTACT</Link>
              </>
            )}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-semibold text-sm">
                        {user?.firstName?.[0] || user?.email[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block font-light">
                    {user?.firstName || user?.email}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed"
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/sign-in">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 