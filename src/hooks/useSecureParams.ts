import { useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

// Whitelist of allowed parameter names and their validation patterns
const ALLOWED_PARAMS = {
  id: /^[0-9]+$/,           // Only numeric IDs
  status: /^(open|in_progress|resolved|closed)$/,
  priority: /^(low|medium|high|urgent)$/,
  category: /^[a-zA-Z0-9_-]+$/,
  assignee: /^[0-9]+$/,
  page: /^[0-9]+$/,
  limit: /^(10|20|50|100)$/,
  sort: /^(created_at|updated_at|priority|status)$/,
  order: /^(asc|desc)$/,
  role: /^(customer|staff|admin)$/,
  q: /^[a-zA-Z0-9\s\-_.@]{0,100}$/, // Search query with reasonable length limit
};

interface SecureParams {
  [key: string]: string | undefined;
}

interface SecureSearchParams {
  [key: string]: string | null;
}

export const useSecureParams = (): SecureParams => {
  const params = useParams();
  
  return useMemo(() => {
    const secureParams: SecureParams = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && ALLOWED_PARAMS[key as keyof typeof ALLOWED_PARAMS]) {
        const pattern = ALLOWED_PARAMS[key as keyof typeof ALLOWED_PARAMS];
        if (pattern.test(value)) {
          secureParams[key] = value;
        } else {
          console.warn(`Invalid parameter value for ${key}: ${value}`);
        }
      } else if (value) {
        console.warn(`Unauthorized parameter: ${key}`);
      }
    });
    
    return secureParams;
  }, [params]);
};

export const useSecureSearchParams = (): SecureSearchParams => {
  const [searchParams] = useSearchParams();
  
  return useMemo(() => {
    const secureSearchParams: SecureSearchParams = {};
    
    searchParams.forEach((value, key) => {
      if (ALLOWED_PARAMS[key as keyof typeof ALLOWED_PARAMS]) {
        const pattern = ALLOWED_PARAMS[key as keyof typeof ALLOWED_PARAMS];
        if (pattern.test(value)) {
          secureSearchParams[key] = value;
        } else {
          console.warn(`Invalid search parameter value for ${key}: ${value}`);
        }
      } else {
        console.warn(`Unauthorized search parameter: ${key}`);
      }
    });
    
    return secureSearchParams;
  }, [searchParams]);
};

// Helper function to validate individual parameter values
export const validateParamValue = (key: string, value: string): boolean => {
  const pattern = ALLOWED_PARAMS[key as keyof typeof ALLOWED_PARAMS];
  return pattern ? pattern.test(value) : false;
};

// Helper function to sanitize URLs for navigation
export const sanitizeNavigationPath = (path: string): string => {
  // Remove any potentially dangerous characters
  const sanitized = path.replace(/[<>'";&()]/g, '');
  
  // Ensure path starts with /
  if (!sanitized.startsWith('/')) {
    return '/';
  }
  
  // List of allowed path patterns
  const allowedPatterns = [
    /^\/login$/,
    /^\/signup$/,
    /^\/my\/tickets(\/[0-9]+)?$/,
    /^\/my\/tickets\/new$/,
    /^\/my\/marketplace$/,
    /^\/my\/notifications$/,
    /^\/staff\/tickets(\/[0-9]+)?$/,
    /^\/staff\/dashboard$/,
    /^\/staff\/ai-support$/,
    /^\/staff\/marketplace$/,
    /^\/staff\/leaderboard$/,
    /^\/staff\/notifications$/,
    /^\/admin\/categories$/,
    /^\/admin\/staff$/,
    /^\/admin\/slack$/,
    /^\/admin\/ai-support$/,
    /^\/admin\/marketplace$/,
    /^\/admin\/leaderboard$/,
    /^\/admin\/notifications$/,
  ];
  
  const isValidPath = allowedPatterns.some(pattern => pattern.test(sanitized));
  
  if (!isValidPath) {
    console.warn(`Invalid navigation path: ${path}`);
    return '/login';
  }
  
  return sanitized;
};