import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

interface AuthContextType extends AuthState {
  login: (accessToken: string, refreshToken: string, user: User) => void;
  signup: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = React.memo(({ children }) => {
  const [state, setState] = useState<AuthState>({ 
    token: null, 
    refreshToken: null, 
    user: null 
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setState({ token: null, refreshToken: null, user: null });
    localStorage.removeItem('auth');
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.refreshToken) {
        return false;
      }

      const response = await fetch('http://localhost:8000/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { accessToken, refreshToken: newRefreshToken } = await response.json();
      
      const newState = { 
        ...state, 
        token: accessToken, 
        refreshToken: newRefreshToken 
      };
      setState(newState);
      localStorage.setItem('auth', JSON.stringify(newState));
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [state.refreshToken, logout]);

  useEffect(() => {
    // Load auth state from localStorage on app start
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsedState = JSON.parse(stored);
        setState(parsedState);
      } catch (error) {
        console.error('Failed to parse auth state from localStorage:', error);
        localStorage.removeItem('auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string, user: User) => {
    const newState = { token: accessToken, refreshToken, user };
    setState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  }, []);

  const signup = useCallback((accessToken: string, refreshToken: string, user: User) => {
    const newState = { token: accessToken, refreshToken, user };
    setState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  }, []);

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      signup, 
      logout, 
      isLoading, 
      refreshAccessToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};