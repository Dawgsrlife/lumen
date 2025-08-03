import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { useClerkUser } from '../../hooks/useClerkUser';
import LumenIcon from '../ui/LumenIcon';
import { gsap } from 'gsap';
import NotificationsModal from '../ui/NotificationsModal';
import { getNotifications, markNotificationAsRead } from '../../services/api';
import type { Notification } from '../../types';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useClerkUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [isNotificationsAnimating, setIsNotificationsAnimating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === '/landing';
  const isWelcomePage = location.pathname === '/welcome';



  // GSAP animations for dropdowns
  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        // Show animation
        gsap.set(menuRef.current, { opacity: 0, y: -10, scale: 0.95 });
        gsap.to(menuRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
      } else {
        // Hide animation
        gsap.to(menuRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.15,
          ease: "power2.in"
        });
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (notificationsMenuRef.current) {
      if (isNotificationsOpen) {
        // Show animation
        gsap.set(notificationsMenuRef.current, { opacity: 0, y: -10, scale: 0.95 });
        gsap.to(notificationsMenuRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
      } else {
        // Hide animation
        gsap.to(notificationsMenuRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.15,
          ease: "power2.in"
        });
      }
    }
  }, [isNotificationsOpen]);

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

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingNotifications(true);
    try {
      const response = await getNotifications();
      if (response.success && response.notifications) {
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id!);
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Handle different notification types
    switch (notification.type) {
      case 'emotion_log':
        // TODO: Navigate to emotion logging page
        console.log('Navigate to emotion logging');
        break;
      case 'analytics_check':
        // TODO: Navigate to analytics page
        console.log('Navigate to analytics page');
        break;
      case 'meditation_session':
        // TODO: Navigate to meditation session page
        console.log('Navigate to meditation session');
        break;
      default:
        console.log('Unknown notification type:', notification.type);
    }

    // Close modal
    setIsNotificationsModalOpen(false);
  };

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated]);

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
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setIsNotificationsModalOpen(true)}
                    className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50 relative"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l2.25 2.25a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25L6.75 12.75V9.75a6 6 0 0 1 6-6z" />
                    </svg>
                    {/* Notification badge */}
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Modal Trigger */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 transform origin-top-right">
                    <button 
                      onClick={() => setIsNotificationsModalOpen(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            ) : null}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    if (isMenuOpen) {
                      // Start hide animation
                      gsap.to(menuRef.current, {
                        opacity: 0,
                        y: -10,
                        scale: 0.95,
                        duration: 0.15,
                        ease: "power2.in",
                        onComplete: () => setIsMenuOpen(false)
                      });
                    } else {
                      setIsMenuOpen(true);
                    }
                  }}
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
                    <div 
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 transform origin-top-right"
                    >
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

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
    </header>
  );
};

export default Header; 