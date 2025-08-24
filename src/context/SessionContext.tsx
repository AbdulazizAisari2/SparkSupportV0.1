import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface SessionContextType {
  sessionTimeRemaining: number; // in seconds
  isSessionExpired: boolean;
  extendSession: () => void;
  formatTimeRemaining: () => string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

const SESSION_DURATION = 60 * 60; // 1 hour in seconds
const WARNING_THRESHOLD = 5 * 60; // 5 minutes warning

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(SESSION_DURATION);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Initialize session when user logs in
  useEffect(() => {
    if (user && !sessionStartTime) {
      const now = Date.now();
      setSessionStartTime(now);
      setSessionTimeRemaining(SESSION_DURATION);
      setIsSessionExpired(false);
      
      // Store session start time in localStorage for persistence
      localStorage.setItem('sessionStartTime', now.toString());
    } else if (!user) {
      // Reset session when user logs out
      setSessionStartTime(null);
      setSessionTimeRemaining(SESSION_DURATION);
      setIsSessionExpired(false);
      localStorage.removeItem('sessionStartTime');
    }
  }, [user, sessionStartTime]);

  // Restore session from localStorage on app start
  useEffect(() => {
    if (user && !sessionStartTime) {
      const storedStartTime = localStorage.getItem('sessionStartTime');
      if (storedStartTime) {
        const startTime = parseInt(storedStartTime);
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, SESSION_DURATION - elapsed);
        
        if (remaining > 0) {
          setSessionStartTime(startTime);
          setSessionTimeRemaining(remaining);
        } else {
          // Session already expired
          setIsSessionExpired(true);
          logout();
        }
      }
    }
  }, [user, sessionStartTime, logout]);

  // Timer countdown
  useEffect(() => {
    if (!user || !sessionStartTime || isSessionExpired) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - sessionStartTime) / 1000);
      const remaining = Math.max(0, SESSION_DURATION - elapsed);
      
      setSessionTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setIsSessionExpired(true);
        logout();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, sessionStartTime, isSessionExpired, logout]);

  const extendSession = useCallback(() => {
    if (user && !isSessionExpired) {
      const now = Date.now();
      setSessionStartTime(now);
      setSessionTimeRemaining(SESSION_DURATION);
      localStorage.setItem('sessionStartTime', now.toString());
    }
  }, [user, isSessionExpired]);

  const formatTimeRemaining = useCallback(() => {
    if (sessionTimeRemaining <= 0) return '0:00';
    
    const hours = Math.floor(sessionTimeRemaining / 3600);
    const minutes = Math.floor((sessionTimeRemaining % 3600) / 60);
    const seconds = sessionTimeRemaining % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, [sessionTimeRemaining]);

  return (
    <SessionContext.Provider value={{
      sessionTimeRemaining,
      isSessionExpired,
      extendSession,
      formatTimeRemaining
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};