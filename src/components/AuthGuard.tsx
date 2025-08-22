import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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

  // Show beautiful loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:bg-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/30 to-cyan-500/20 animate-gradient-x"></div>
        </div>
        
        <div className="relative text-center z-10">
          <div className="relative mb-8">
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            
            {/* Main icon */}
            <div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/50">
              <div className="bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 p-4 rounded-2xl shadow-inner">
                <MessageSquare className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Loading SparkSupport...
          </h2>
          
          {/* Loading dots */}
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

  // Redirect unauthenticated users
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children if authenticated or auth not required
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
  
  // Auto-redirect based on user role if they have one
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
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-200 via-orange-200 to-yellow-200 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 via-orange-500/30 to-yellow-500/20 animate-gradient-x"></div>
      </div>
      
      <div className="relative text-center z-10 max-w-md mx-auto p-6">
        <div className="relative mb-8">
          {/* Warning glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          
          {/* Warning icon */}
          <div className="relative bg-gradient-to-br from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border-2 border-red-200 dark:border-orange-400/50">
            <div className="bg-gradient-to-br from-red-400 via-orange-500 to-yellow-400 p-4 rounded-2xl shadow-inner">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Access Restricted
        </h1>
        
        <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-orange-400/30 p-6 mb-6">
          <div className="flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
            <span className="text-orange-700 dark:text-orange-300 font-semibold">Unauthorized Access</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {message}
          </p>
        </div>
        
        <Navigate to={finalRedirectPath} replace />
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = finalRedirectPath}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {finalRedirectLabel}
          </button>
          
          {user && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Signed in as: <span className="font-medium">{user.name}</span> ({user.role})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};