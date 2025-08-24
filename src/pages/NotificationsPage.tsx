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
      {/* Header */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-600 rounded-xl blur opacity-75 animate-glow"></div>
              <div className="relative bg-white dark:bg-dark-800 p-3 rounded-xl shadow-lg">
                <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with your latest activities
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                {unreadCount} unread
              </div>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 border border-red-200 dark:border-red-800 hover:shadow-md"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Tabs */}
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

        {/* Bulk Actions */}
        {selectedNotifications.size > 0 && (
          <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 animate-slide-down">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {selectedNotifications.size} notification{selectedNotifications.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('read')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Mark Read</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
                <button
                  onClick={() => setSelectedNotifications(new Set())}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
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
            {/* Select All Header */}
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedNotifications.size > 0 && `${selectedNotifications.size} selected`}
                </div>
              </div>
            </div>

            {/* Notifications */}
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
                      {/* Selection checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />

                      {/* Icon */}
                      <div className={`p-2 rounded-xl ${styles.bg} border ${styles.border}`}>
                        <Icon className={`w-5 h-5 ${styles.icon}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            
                            {/* Timestamp and actions */}
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

      {/* Filter Sidebar */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const count = getFilterCount(option.id as FilterType);
          const isActive = filterType === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setFilterType(option.id as FilterType)}
              className={`
                relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 shadow-lg
                ${isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white scale-110'
                  : 'bg-white/80 dark:bg-dark-800/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105'
                }
                backdrop-blur-xl border border-gray-200/50 dark:border-dark-700/50
              `}
              title={`${option.label} (${count})`}
            >
              <Icon className="w-5 h-5" />
              {count > 0 && (
                <span className={`
                  absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center
                  ${isActive 
                    ? 'bg-white text-primary-600' 
                    : 'bg-red-500 text-white'
                  }
                  animate-pulse
                `}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
              
              {/* Tooltip */}
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