import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
export const FloatingNotificationButton: React.FC = () => {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname.includes('/notifications')) {
    return null;
  }
  const getNotificationsPath = () => {
    switch (user?.role) {
      case 'customer': return '/my/notifications';
      case 'staff': return '/staff/notifications';
      case 'admin': return '/admin/notifications';
      default: return '/my/notifications';
    }
  };
  const handleClick = () => {
    navigate(getNotificationsPath());
  };
  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 flex items-center justify-center z-40 group hover:scale-110 animate-float"
      title="View Notifications"
    >
      <Bell className="w-6 h-6 group-hover:animate-bounce-gentle" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};