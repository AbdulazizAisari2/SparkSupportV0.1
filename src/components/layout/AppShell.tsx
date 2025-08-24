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
  ShoppingBag,
  HelpCircle,
  Home,
  Search,
  X,
  BarChart,
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
    logoutAndRedirect(logout);
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
          { path: '/staff/ai-support', label: 'AI Support', icon: Bot, badge: 'NEW' },
          { path: '/staff/marketplace', label: 'Marketplace', icon: ShoppingBag },
          { path: '/staff/leaderboard', label: 'Leaderboard', icon: Trophy },
          { path: '/staff/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: Home },
          { path: '/admin/categories', label: 'Categories', icon: Tags },
          { path: '/admin/priorities', label: 'Priorities', icon: AlertTriangle },
          { path: '/admin/staff', label: 'Staff', icon: Users },
          { path: '/admin/slack', label: 'Slack Integration', icon: MessageCircle, badge: 'NEW' },
          { path: '/admin/ai-support', label: 'AI Support', icon: Bot, badge: 'NEW' },
          { path: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag },
          { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
          { path: '/admin/survey-analytics', label: 'Survey Analytics', icon: BarChart, badge: 'NEW' },
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
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">SparkSupport</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Support Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SimpleThemeToggle />
            </div>
          </div>

          {/* Enhanced User Profile */}
          <div className="relative p-6 border-b border-gray-200/50 dark:border-dark-700/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5 dark:from-primary-900/10 dark:via-purple-900/10 dark:to-pink-900/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/10 to-purple-400/10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="relative">
              {/* Main Profile Section */}
              <div 
                className="flex items-center space-x-4 cursor-pointer group"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {/* Enhanced Avatar */}
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
                  
                  {/* Avatar Container */}
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300 border-2 border-white/20">
                    <span className="text-xl font-black text-white drop-shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Role Icon */}
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

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                      {user.name}
                    </h3>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <RoleBadge role={user.role} />
                    {user.role === 'staff' && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs font-medium">
                        <Award className="w-3 h-3" />
                        <span>Level 8</span>
                      </div>
                    )}
                  </div>
                  
                  {user.department && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {user.department}
                    </p>
                  )}
                  
                  {/* Quick Stats for Staff */}
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

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="mt-4 space-y-2 animate-slide-down">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-dark-600 to-transparent"></div>
                  
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Navigate to profile settings
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-white/50 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 group"
                    >
                      <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Edit Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Navigate to settings
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-white/50 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 group"
                    >
                      <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Settings</span>
                    </button>
                    
                    {user.role === 'staff' && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/staff/leaderboard');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <Trophy className="w-4 h-4 group-hover:animate-bounce-gentle" />
                          <span>My Performance</span>
                        </div>
                        <div className="text-xs bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                          #1
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Level Progress Bar (for staff) */}
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

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-3 bg-gradient-to-b from-transparent to-white/20 dark:to-dark-800/20">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.path && (location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path)));

              const NavElement = item.path ? Link : 'button';
              const elementProps = item.path 
                ? { to: item.path }
                : { type: 'button' as const, onClick: item.onClick };

              return (
                <NavElement
                  key={item.path || `button-${index}`}
                  {...elementProps}
                  className={`
                    flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden w-full text-left
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
                  {item.badge && (
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-bold
                      ${typeof item.badge === 'string'
                        ? `animate-pulse ${isActive ? 'bg-white/20 text-white' : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'}`
                        : `animate-pulse ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white shadow-lg'}`
                      }
                    `}>
                      {typeof item.badge === 'string' ? item.badge : (item.badge > 9 ? '9+' : item.badge)}
                    </span>
                  )}
                </NavElement>
              );
            })}
          </nav>

          {/* Enhanced Footer */}
          <div className="relative p-6 border-t border-gray-200/50 dark:border-dark-700/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-pink-500/5 dark:from-red-900/10 dark:via-orange-900/10 dark:to-pink-900/10"></div>
            
            <div className="relative">
              <button
                onClick={handleLogout}
                className="relative w-full group overflow-hidden rounded-xl border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 hover:shadow-xl"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 group-hover:from-red-100 dark:group-hover:from-red-900/30 group-hover:to-orange-100 dark:group-hover:to-orange-900/30 transition-all duration-300"></div>
                
                {/* Content */}
                <div className="relative flex items-center justify-center px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200">
                  <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Sign Out</span>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Session expires in{' '}
                  <span className={`font-semibold ${
                    sessionTimeRemaining <= 300 // 5 minutes warning
                      ? 'text-red-600 dark:text-red-400 animate-pulse' 
                      : sessionTimeRemaining <= 600 // 10 minutes warning
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

      {/* Main Content */}
      <div className="ml-64">
        <main className="transition-all duration-300">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
        
        {/* Floating Notification Button */}
        <FloatingNotificationButton />
        <FloatingChatButton />
      </div>
    </div>
  );
};