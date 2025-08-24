import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Shield, AlertTriangle } from 'lucide-react';
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Authenticating your session...
          </p>
        </div>
      </div>
    );
  }
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
interface UnauthorizedPageProps {
  message?: string;
  redirectPath?: string;
  redirectLabel?: string;
}
export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  message = "You don't have permission to access this page.",
  redirectPath = '/login',
  redirectLabel = 'Sign In'
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const getDefaultRedirectPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'customer':
        return '/my/tickets';
      case 'staff':
        return '/staff/tickets';
      case 'admin':
        return '/admin/categories';
      default:
        return '/login';
    }
  };
  const finalRedirectPath = user ? getDefaultRedirectPath() : redirectPath;
  const finalRedirectLabel = user ? 'Go to Dashboard' : redirectLabel;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
