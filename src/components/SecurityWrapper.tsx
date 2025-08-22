import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export const SecurityWrapper: React.FC<SecurityWrapperProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // Security monitoring for direct URL access attempts
    const handleUnauthorizedAccess = () => {
      const protectedPaths = [
        '/my/', '/staff/', '/admin/', 
        '/tickets', '/categories', '/users',
        '/dashboard', '/settings', '/reports'
      ];

      const isProtectedPath = protectedPaths.some(path => 
        location.pathname.startsWith(path)
      );

      if (isProtectedPath && !isLoading && !user) {
        // Log security event
        console.warn('🛡️ Security: Unauthorized access attempt to', location.pathname);
        
        // Show security toast
        addToast('🔐 Access denied. Please sign in to continue.', 'error');
        
        // Redirect to login with original destination
        navigate('/login', { 
          replace: true, 
          state: { from: location } 
        });
      }
    };

    // Check on route change
    handleUnauthorizedAccess();

    // Security: Prevent users from accessing wrong role pages
    if (user && !isLoading) {
      const roleRestrictions = {
        customer: ['/staff/', '/admin/'],
        staff: ['/admin/'],
        admin: [] // Admin can access everything
      };

      const restrictedPaths = roleRestrictions[user.role] || [];
      const isRestricted = restrictedPaths.some(path => 
        location.pathname.startsWith(path)
      );

      if (isRestricted) {
        console.warn(`🛡️ Security: ${user.role} attempted to access restricted path:`, location.pathname);
        
        addToast(`🚫 Access denied. This section is not available for ${user.role} accounts.`, 'error');
        
        // Redirect to appropriate dashboard
        const dashboards = {
          customer: '/my/tickets',
          staff: '/staff/tickets',
          admin: '/admin/categories'
        };
        
        navigate(dashboards[user.role], { replace: true });
      }
    }
  }, [location.pathname, user, isLoading, navigate, addToast]);

  // Security: Block access during authentication checks
  useEffect(() => {
    const protectedPaths = ['/my/', '/staff/', '/admin/'];
    const isProtectedPath = protectedPaths.some(path => 
      location.pathname.startsWith(path)
    );

    if (isProtectedPath && isLoading) {
      // Show loading for protected routes during auth check
      return;
    }
  }, [location.pathname, isLoading]);

  return <>{children}</>;
};

// Hook for security monitoring
export const useSecurityMonitor = () => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log all route access for security audit
    console.log(`🔍 Route Access: ${location.pathname} by ${user ? `${user.role}:${user.email}` : 'anonymous'}`);
  }, [location.pathname, user]);

  const checkAccess = (requiredRole?: string | string[]) => {
    if (!user) return false;
    
    if (!requiredRole) return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  return { checkAccess, user, isAuthenticated: !!user };
};