import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSession } from '../../context/SessionContext';
import { useSmartNavigation } from '../../hooks/useNavigation';
import { 
  Ticket, 
  Users, 
  Settings, 
  LogOut, 
  Plus,
  MessageSquare,
  BarChart3,
  Tags,
  AlertTriangle,
  Bell,
  Trophy,
  ChevronDown,
  Edit3,
  Shield,
  Star,
  Zap,
  Award,
  Bot,
  MessageCircle,
  ShoppingBag
} from 'lucide-react';
import { RoleBadge } from '../ui/Badge';
import { SimpleThemeToggle } from '../ui/SimpleThemeToggle';
import { useNotifications } from '../../context/NotificationContext';
import { FloatingNotificationButton } from '../ui/FloatingNotificationButton';
import { FloatingChatButton } from '../ui/FloatingChatButton';
interface AppShellProps {
  children: ReactNode;
}
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { sessionTimeRemaining, formatTimeRemaining, extendSession } = useSession();
  const { addNotification, unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAndRedirect } = useSmartNavigation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  React.useEffect(() => {
    if (user) {
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
    logoutAndRedirect(logout);
  };
  const getNavItems = () => {
    switch (user.role) {
      case 'customer':
        return [
          { path: '/my/tickets', label: 'My Tickets', icon: Ticket },
          { path: '/my/tickets/new', label: 'New Ticket', icon: Plus },
          { path: '/my/marketplace', label: 'Marketplace', icon: ShoppingBag },
          { path: '/my/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        ];
      case 'staff':
        return [
          { path: '/staff/tickets', label: 'All Tickets', icon: Ticket },
          { path: '/staff/dashboard', label: 'Dashboard', icon: BarChart3 },
          { path: '/staff/ai-support', label: 'AI Support', icon: Bot, badge: 'NEW' },
          { path: '/staff/marketplace', label: 'Marketplace', icon: ShoppingBag },
          { path: '/staff/leaderboard', label: 'Leaderboard', icon: Trophy },
          { path: '/staff/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        ];
      case 'admin':
        return [
          { path: '/admin/categories', label: 'Categories', icon: Tags },
          { path: '/admin/staff', label: 'Staff', icon: Users },
          { path: '/admin/slack', label: 'Slack Integration', icon: MessageCircle, badge: 'NEW' },
          { path: '/admin/ai-support', label: 'AI Support', icon: Bot, badge: 'NEW' },
          { path: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag },
          { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
          { path: '/admin/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        ];
      default:
        return [];
    }
  };
  const navItems = getNavItems();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 transition-all duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-dark-700/50 bg-gradient-to-r from-primary-500/5 to-purple-500/5 dark:from-primary-900/20 dark:to-purple-900/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur opacity-75 animate-glow"></div>
                <div className="relative bg-white dark:bg-dark-800 p-2 rounded-xl shadow-lg">
                  <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">SparkSupport</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Support Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SimpleThemeToggle />
            </div>
          </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5 dark:from-primary-900/10 dark:via-purple-900/10 dark:to-pink-900/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/10 to-purple-400/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
                <div className="relative">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300 border-2 border-white/20">
                    <span className="text-xl font-black text-white drop-shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-dark-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-dark-600">
                    {user.role === 'admin' ? (
                      <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    ) : user.role === 'staff' ? (
                      <Star className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Users className="w-3 h-3 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>
                  {user.role === 'staff' && (
                    <div className="flex items-center space-x-3 mt-3 text-xs">
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <Zap className="w-3 h-3" />
                        <span>147 resolved</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                        <Star className="w-3 h-3" />
                        <span>4.8★</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {user.role === 'staff' && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Level 8 Progress</span>
                    <span>2,940 / 4,000 XP</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-1000 relative overflow-hidden animate-pulse" style={{ width: '73%' }}>
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">1,060 XP</span> to Level 9
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative p-6 border-t border-gray-200/50 dark:border-dark-700/50">
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 group-hover:from-red-100 dark:group-hover:from-red-900/30 group-hover:to-orange-100 dark:group-hover:to-orange-900/30 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Session expires in{' '}
                  <span className={`font-semibold ${
                    sessionTimeRemaining <= 300 
                      ? 'text-red-600 dark:text-red-400 animate-pulse' 
                      : sessionTimeRemaining <= 600 
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-primary-600 dark:text-primary-400'
                  }`}>
                    {formatTimeRemaining()}
                  </span>
                </p>
                {sessionTimeRemaining <= 600 && (
                  <button
                    onClick={extendSession}
                    className="mt-2 text-xs px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors duration-200"
                  >
                    Extend Session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
        <FloatingNotificationButton />
        <FloatingChatButton />
      </div>
    </div>
  );
};