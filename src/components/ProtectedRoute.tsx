import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSession } from '../context/SessionContext';
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
  const { isSessionExpired } = useSession();
  const location = useLocation();
  const allowedPaths = [
    '/my/tickets', '/my/tickets/new', '/my/tickets/', '/my/marketplace', '/my/notifications',
    '/staff/tickets', '/staff/tickets/', '/staff/dashboard', '/staff/ai-support', 
    '/staff/marketplace', '/staff/leaderboard', '/staff/notifications',
    '/admin/categories', '/admin/staff', '/admin/slack', '/admin/ai-support',
    '/admin/marketplace', '/admin/leaderboard', '/admin/notifications'
  ];
  const currentPath = location.pathname;
  const isValidPath = allowedPaths.some(path => 
    currentPath === path || 
    (path.endsWith('/') && currentPath.startsWith(path)) ||
    currentPath.startsWith(path + '/')
  );
  if (!isValidPath && requireAuth) {
    return <Navigate to="/login" replace />;
  }
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
  if (requireAuth && (!user || isSessionExpired)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    const userDashboard = getRoleBasedDashboard(user.role);
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }
    const roleMessage = `This page is restricted. Your ${user.role} account doesn't have access to this section.`;
    return (
      <UnauthorizedPage 
        message={roleMessage}
        redirectPath={userDashboard}
        redirectLabel="Go to My Dashboard"
      />
    );
  }
  return <>{children}</>;
};
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
interface RouteGuardProps {
  children: React.ReactNode;
}
export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { isSessionExpired } = useSession();
  const location = useLocation();
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  if (isLoading) {
    return <>{children}</>;
  }
  if (user && isPublicRoute) {
    const dashboard = getRoleBasedDashboard(user.role);
    return <Navigate to={dashboard} replace />;
  }
  if ((!user || isSessionExpired) && !isPublicRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};