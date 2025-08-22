import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { UnauthorizedPage } from './AuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true,
  fallbackPath
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication required but user not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    // If user has wrong role, redirect to their appropriate dashboard
    const userDashboard = getRoleBasedDashboard(user.role);
    
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }
    
    // Show unauthorized page with role-specific message
    const roleMessage = `This page is restricted. Your ${user.role} account doesn't have access to this section.`;
    
    return (
      <UnauthorizedPage 
        message={roleMessage}
        redirectPath={userDashboard}
        redirectLabel="Go to My Dashboard"
      />
    );
  }

  // Allow access if user is authenticated and has proper role
  return <>{children}</>;
};

// Helper function to get role-based dashboard paths
const getRoleBasedDashboard = (role: Role): string => {
  switch (role) {
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

// Enhanced route guard that prevents all unauthorized access
interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Allow access to public routes
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // If user is authenticated and tries to access login/signup, redirect to dashboard
  if (user && isPublicRoute) {
    const dashboard = getRoleBasedDashboard(user.role);
    return <Navigate to={dashboard} replace />;
  }

  // If user is not authenticated and tries to access protected route, redirect to login
  if (!isLoading && !user && !isPublicRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};