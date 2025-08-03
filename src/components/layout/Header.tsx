import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerkUser } from '../../hooks/useClerkUser';
import LumenIcon from '../ui/LumenIcon';

import NotificationsModal from '../ui/NotificationsModal';
import NotificationsDropdown from '../ui/NotificationsDropdown';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/api';
import type { Notification } from '../../types';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useClerkUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === '/landing';
  const isWelcomePage = location.pathname === '/welcome';



  // Handle profile dropdown click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is on the profile button (which is outside the dropdown)
      const target = event.target as Element;
      const isProfileButton = target.closest('[data-profile-button]');

      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !isProfileButton) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Use a small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isMenuOpen]);



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

    try {
      const response = await getNotifications();
      if (response.success && response.notifications) {
        setNotifications(response.notifications);
      } else {
        // For now, use mock notifications until backend is fully connected
        setNotifications([
          {
            _id: '1',
            userId: user?.id || '',
            type: 'emotion_log',
            title: 'Time to check in!',
            message: 'How are you feeling today? Take a moment to log your emotions.',
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            actionUrl: '/dashboard'
          },
          {
            _id: '2',
            userId: user?.id || '',
            type: 'analytics_check',
            title: 'Weekly insights ready',
            message: 'Your weekly mood analysis is complete. Check out your progress!',
            isRead: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            actionUrl: '/analytics'
          },
          {
            _id: '3',
            userId: user?.id || '',
            type: 'meditation_session',
            title: 'Meditation reminder',
            message: 'Take a 5-minute break to practice mindfulness and reduce stress.',
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            actionUrl: '/flow'
          },
          {
            _id: '4',
            userId: user?.id || '',
            type: 'emotion_log',
            title: 'Great progress!',
            message: 'You\'ve logged emotions for 7 days in a row. Keep up the amazing work!',
            isRead: true,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            actionUrl: '/analytics'
          },
          {
            _id: '5',
            userId: user?.id || '',
            type: 'analytics_check',
            title: 'New feature available',
            message: 'Check out the new detailed insights in your analytics dashboard.',
            isRead: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            actionUrl: '/analytics'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock notifications
      setNotifications([
        {
          _id: '1',
          userId: user?.id || '',
          type: 'emotion_log',
          title: 'Time to check in!',
          message: 'How are you feeling today? Take a moment to log your emotions.',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          actionUrl: '/dashboard'
        },
        {
          _id: '2',
          userId: user?.id || '',
          type: 'analytics_check',
          title: 'Weekly insights ready',
          message: 'Your weekly mood analysis is complete. Check out your progress!',
          isRead: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          actionUrl: '/analytics'
        }
      ]);
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

    // Navigate based on notification type and actionUrl
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else {
      // Fallback navigation based on type
      switch (notification.type) {
        case 'emotion_log':
          navigate('/dashboard');
          break;
        case 'analytics_check':
          navigate('/analytics');
          break;
        default:
          console.log('Unknown notification type:', notification.type);
      }
    }

    // Close dropdown and modal
    setIsNotificationsDropdownOpen(false);
    setIsNotificationsModalOpen(false);
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
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
                    className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-lg whitespace-nowrap ${isActive(item.href)
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
                    data-notifications-button
                    onClick={() => {
                      if (isNotificationsDropdownOpen) {
                        setIsNotificationsDropdownOpen(false);
                      } else {
                        setIsNotificationsDropdownOpen(true);
                      }
                    }}
                    className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-50 relative cursor-pointer hover:scale-105"
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

                  {/* Notifications Dropdown */}
                  <NotificationsDropdown
                    isOpen={isNotificationsDropdownOpen}
                    onClose={() => setIsNotificationsDropdownOpen(false)}
                    notifications={notifications}
                    onNotificationClick={handleNotificationClick}
                    onViewAll={() => setIsNotificationsModalOpen(true)}
                  />
                </div>
              </>
            ) : null}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  data-profile-button
                  onClick={() => {
                    if (isMenuOpen) {
                      setIsMenuOpen(false);
                    } else {
                      setIsMenuOpen(true);
                    }
                  }}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 px-2 py-1 rounded-lg hover:bg-gray-50 cursor-pointer hover:scale-105"
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

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "backOut" }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] transform origin-top-right"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSigningOut ? 'Signing out...' : 'Sign out'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </header>
  );
};

export default Header;
