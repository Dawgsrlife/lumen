import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '../../types';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onViewAll: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onViewAll,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is on the notifications button (which is outside the dropdown)
      const target = event.target as Element;
      const isNotificationsButton = target.closest('[data-notifications-button]');
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !isNotificationsButton) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
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
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emotion_log':
        return '😊';
      case 'analytics_check':
        return '📊';
      case 'meditation_session':
        return '🧘';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'emotion_log':
        return 'bg-purple-500';
      case 'analytics_check':
        return 'bg-amber-500';
      case 'meditation_session':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const recentNotifications = notifications.slice(0, 3);
  const remainingCount = notifications.length - 3;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "backOut" }}
          className="absolute right-0 mt-2 w-80 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] transform origin-top-right"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-500">{unreadCount} unread</span>
              )}
            </div>
          </div>

                     {/* Notifications List */}
           <div className="max-h-80 overflow-y-auto">
             {recentNotifications.length === 0 ? (
               <div className="px-4 py-8 text-center">
                 <div className="text-4xl mb-3">🔕</div>
                 <h4 className="text-sm font-medium text-gray-900 mb-1">No notifications yet</h4>
                 <p className="text-xs text-gray-500">We'll notify you about important updates</p>
               </div>
             ) : (
               <div className="divide-y divide-gray-50">
                 {recentNotifications.map((notification) => (
                   <motion.div
                     key={notification._id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                       !notification.isRead ? 'bg-blue-50/30' : ''
                     }`}
                     onClick={() => onNotificationClick(notification)}
                   >
                     <div className="flex items-start space-x-3">
                       <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.type)}`}></div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center space-x-2 mb-1">
                           <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                           <h4 className="text-xs font-semibold text-gray-900 truncate">
                             {notification.title}
                           </h4>
                           {!notification.isRead && (
                             <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></span>
                           )}
                         </div>
                         <p className="text-xs text-gray-600 mb-1 leading-relaxed line-clamp-2">
                           {notification.message}
                         </p>
                         <p className="text-xs text-gray-400">
                           {new Date(notification.createdAt).toLocaleDateString('en-US', {
                             month: 'short',
                             day: 'numeric',
                             hour: '2-digit',
                             minute: '2-digit'
                           })}
                         </p>
                       </div>
                     </div>
                   </motion.div>
                 ))}
                 {remainingCount > 0 && (
                   <div className="px-4 py-3 text-center">
                     <p className="text-xs text-gray-500">
                       and {remainingCount} more...
                     </p>
                   </div>
                 )}
               </div>
             )}
           </div>

                     {/* Footer */}
           {notifications.length > 0 && (
             <div className="px-4 py-3 border-t border-gray-100">
               <button
                 onClick={() => {
                   onClose();
                   onViewAll();
                 }}
                 className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
               >
                 View All Notifications
               </button>
             </div>
           )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown; 