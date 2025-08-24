import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect based on user authentication status
          const redirectPath = user 
            ? user.role === 'customer' ? '/my/tickets'
            : user.role === 'staff' ? '/staff/tickets'
            : '/admin/categories'
            : '/login';
          
          navigate(redirectPath, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  const getDashboardPath = () => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:bg-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-blue-500/30 to-cyan-500/20 animate-gradient-x"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-float blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative text-center z-10 max-w-2xl mx-auto p-6">
        <div className="relative mb-8">
          {/* 404 Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          
          {/* 404 Icon */}
          <div className="relative bg-gradient-to-br from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50">
            <div className="bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 p-6 rounded-2xl shadow-inner">
              <Search className="w-16 h-16 text-white mx-auto mb-2" />
              <div className="text-6xl font-black text-white drop-shadow-2xl">404</div>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-100 dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
            Page Not Found
          </span>
        </h1>
        
        <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/30 p-6 mb-6">
          <div className="flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
            <span className="text-orange-700 dark:text-orange-300 font-semibold">Route Not Found</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Auto-redirect countdown */}
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                Auto-redirecting in {countdown} seconds...
              </span>
            </div>
          </div>
          
          {user && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Signed in as: <span className="font-medium text-indigo-600 dark:text-indigo-400">{user.name}</span> ({user.role})
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="space-y-3">
          <Link
            to={getDashboardPath()}
            className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>{user ? 'Go to Dashboard' : 'Sign In'}</span>
          </Link>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};