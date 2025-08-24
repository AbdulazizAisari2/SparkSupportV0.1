import React, { useState } from 'react';
import { Bell, Search, CheckCircle, XCircle, AlertCircle, Info, X, Check, Trash2, Clock, Star } from 'lucide-react';
import { useNotifications, NotificationType } from '../context/NotificationContext';
type FilterType = 'all' | 'unread' | 'success' | 'error' | 'warning' | 'info';
export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, removeNotification, clearAll, unreadCount } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return Info;
    }
  };
  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success': return {
        icon: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800'
      };
      case 'error': return {
        icon: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800'
      };
      case 'warning': return {
        icon: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800'
      };
      case 'info': return {
        icon: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800'
      };
      default: return {
        icon: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-50 dark:bg-gray-900/20',
        border: 'border-gray-200 dark:border-gray-800'
      };
    }
  };
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && !notification.read) ||
                         notification.type === filterType;
    return matchesSearch && matchesFilter;
  });
  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotifications(newSelected);
  };
  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };
  const handleBulkAction = (action: 'read' | 'delete') => {
    selectedNotifications.forEach(id => {
      if (action === 'read') {
        markAsRead(id);
      } else if (action === 'delete') {
        removeNotification(id);
      }
    });
    setSelectedNotifications(new Set());
  };
  const getFilterCount = (filter: FilterType) => {
    switch (filter) {
      case 'all': return notifications.length;
      case 'unread': return unreadCount;
      case 'success': return notifications.filter(n => n.type === 'success').length;
      case 'error': return notifications.filter(n => n.type === 'error').length;
      case 'warning': return notifications.filter(n => n.type === 'warning').length;
      case 'info': return notifications.filter(n => n.type === 'info').length;
      default: return 0;
    }
  };
  const filterOptions = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'unread', label: 'Unread', icon: Star },
    { id: 'success', label: 'Success', icon: CheckCircle },
    { id: 'error', label: 'Error', icon: XCircle },
    { id: 'warning', label: 'Warning', icon: AlertCircle },
    { id: 'info', label: 'Info', icon: Info },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const count = getFilterCount(option.id as FilterType);
              const isActive = filterType === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setFilterType(option.id as FilterType)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 border
                    ${isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg border-transparent'
                      : 'bg-white/50 dark:bg-dark-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600/50 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {count > 0 && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-bold
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 dark:bg-dark-600 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-12 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full blur opacity-50"></div>
              <div className="relative bg-white dark:bg-dark-800 p-6 rounded-full shadow-lg">
                <Bell className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" />
              </div>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {searchTerm || filterType !== 'all' ? 'No matching notifications' : 'No notifications yet'}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'When you receive notifications, they\'ll appear here'
              }
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification, index) => {
              const Icon = getIcon(notification.type);
              const styles = getTypeStyles(notification.type);
              const isSelected = selectedNotifications.has(notification.id);
              return (
                <div
                  key={notification.id}
                  className={`
                    bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-xl shadow-lg border transition-all duration-200 hover:shadow-xl hover:scale-[1.01] animate-slide-up
                    ${!notification.read 
                      ? `${styles.border} ${styles.bg} border-l-4 border-l-primary-500` 
                      : 'border-gray-200/50 dark:border-dark-700/50'
                    }
                    ${isSelected ? 'ring-2 ring-primary-500 shadow-primary-200 dark:shadow-primary-900/20' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-xl ${styles.bg} border ${styles.border}`}>
                        <Icon className={`w-5 h-5 ${styles.icon}`} />
                      </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{notification.createdAt.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {notification.action && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action!.onClick();
                                      removeNotification(notification.id);
                                    }}
                                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors text-xs font-medium"
                                  >
                                    {notification.action.label}
                                  </button>
                                )}
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  title="Delete notification"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
              <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {option.label} ({count})
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};