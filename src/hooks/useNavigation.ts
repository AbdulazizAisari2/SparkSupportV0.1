import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sanitizeNavigationPath } from './useSecureParams';
import { useToast } from '../context/ToastContext';
export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigateTo = (path: string, options?: { replace?: boolean; showToast?: boolean; toastMessage?: string }) => {
    const { replace = false, showToast = false, toastMessage } = options || {};
    const safePath = sanitizeNavigationPath(path);
    console.log(`🧭 Navigation: ${location.pathname} → ${safePath}`);
    if (safePath !== path) {
      console.warn(`🔒 Path sanitized for security: ${path} → ${safePath}`);
    }
    navigate(safePath, { replace });
    if (showToast && toastMessage) {
      setTimeout(() => addToast(toastMessage, 'success'), 100);
    }
  };
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
  const goToDashboard = (showToast = false) => {
    const dashboardPath = getDashboardPath();
    navigateTo(dashboardPath, { 
      replace: true, 
      showToast, 
      toastMessage: showToast ? `Welcome to your ${user?.role} dashboard!` : undefined 
    });
  };
  const logoutAndRedirect = (logout: () => void) => {
    console.log('🔓 Logging out user:', user?.email);
    logout();
    setTimeout(() => {
      navigateTo('/login', { 
        replace: true, 
        showToast: true, 
        toastMessage: 'Successfully signed out. See you soon!' 
      });
    }, 50);
  };
  const isAuthorizedRoute = (allowedRoles?: string[]) => {
    if (!user) return false;
    if (!allowedRoles) return true;
    return allowedRoles.includes(user.role);
  };
  return {
    navigateTo,
    goToDashboard,
    logoutAndRedirect,
    getDashboardPath,
    isAuthorizedRoute,
    currentPath: location.pathname,
    user
  };
};