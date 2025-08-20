import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Ticket, 
  Users, 
  Settings, 
  LogOut, 
  Home, 
  Plus,
  MessageSquare,
  BarChart3,
  Tags,
  AlertTriangle,
  Bell,
  Trophy
} from 'lucide-react';
import { RoleBadge } from '../ui/Badge';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useNotifications } from '../../context/NotificationContext';
import { FloatingNotificationButton } from '../ui/FloatingNotificationButton';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { addNotification, unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  // Add a simple welcome notification on first load
  React.useEffect(() => {
    if (user) {
      // Only add welcome notification once
      const hasSeenWelcome = localStorage.getItem(`welcome-${user.id}`);
      if (!hasSeenWelcome) {
        addNotification({
          type: 'success',
          title: `Welcome, ${user.name}!`,
          message: 'Your dashboard is ready. Check out the notifications page in the sidebar.',
        });
        localStorage.setItem(`welcome-${user.id}`, 'true');
      }
    }
  }, [user, addNotification]);

  if (!user) {
    return <div>{children}</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user.role) {
      case 'customer':
        return [
          { path: '/my/tickets', label: 'My Tickets', icon: Ticket },
          { path: '/my/tickets/new', label: 'New Ticket', icon: Plus },
          { path: '/my/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        ];
      case 'staff':
        return [
          { path: '/staff/tickets', label: 'All Tickets', icon: Ticket },
          { path: '/staff/dashboard', label: 'Dashboard', icon: BarChart3 },
          { path: '/staff/leaderboard', label: 'Leaderboard', icon: Trophy },
          { path: '/staff/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        ];
      case 'admin':
        return [
          { path: '/admin/categories', label: 'Categories', icon: Tags },
          { path: '/admin/priorities', label: 'Priorities', icon: AlertTriangle },
          { path: '/admin/staff', label: 'Staff', icon: Users },
          { path: '/admin/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 transition-all duration-300">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-dark-700/50 transition-all duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-dark-700/50 bg-gradient-to-r from-primary-500/5 to-purple-500/5 dark:from-primary-900/20 dark:to-purple-900/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur opacity-75 animate-glow"></div>
                <div className="relative bg-white dark:bg-dark-800 p-2 rounded-xl shadow-lg">
                  <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">SparkSupport</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Support Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle variant="minimal" />
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200/50 dark:border-dark-700/50 bg-gradient-to-r from-white/50 to-primary-50/30 dark:from-dark-800/50 dark:to-primary-900/10">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                  <span className="text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                <RoleBadge role={user.role} className="mt-1" />
                {user.department && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.department}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-3 bg-gradient-to-b from-transparent to-white/20 dark:to-dark-800/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden
                    ${isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-md backdrop-blur-sm'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'animate-bounce-gentle' : 'group-hover:scale-110'}`} />
                    {item.label}
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-bold animate-pulse
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-red-500 text-white shadow-lg'
                      }
                    `}>
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50 dark:border-dark-700/50 bg-gradient-to-r from-white/30 to-gray-50/30 dark:from-dark-800/30 dark:to-dark-700/30">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group hover:shadow-md backdrop-blur-sm border border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:animate-bounce-gentle" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8 min-h-screen transition-all duration-300">
          <div className="animate-fade-in">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
        
        {/* Floating Notification Button */}
        <FloatingNotificationButton />
      </div>
    </div>
  );
};