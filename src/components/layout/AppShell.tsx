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
  AlertTriangle
} from 'lucide-react';
import { RoleBadge } from '../ui/Badge';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationBell } from '../../context/NotificationContext';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
        ];
      case 'staff':
        return [
          { path: '/staff/tickets', label: 'All Tickets', icon: Ticket },
          { path: '/staff/dashboard', label: 'Dashboard', icon: BarChart3 },
        ];
      case 'admin':
        return [
          { path: '/admin/categories', label: 'Categories', icon: Tags },
          { path: '/admin/priorities', label: 'Priorities', icon: AlertTriangle },
          { path: '/admin/staff', label: 'Staff', icon: Users },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Support Desk</h1>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};