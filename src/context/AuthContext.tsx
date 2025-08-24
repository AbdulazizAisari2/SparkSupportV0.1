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
  refreshUser: () => Promise<void>;
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
      const response = await fetch('http:
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });
      const responseText = await response.text();
      if (!response.ok) {
        let errorMessage = `Token refresh failed with status ${response.status}`;
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            errorMessage = responseText;
          }
        }
        throw new Error(errorMessage);
      }
      if (!responseText) {
        throw new Error('Empty response from token refresh');
      }
      let refreshData;
      try {
        refreshData = JSON.parse(responseText);
      } catch {
        throw new Error('Invalid response format from server');
      }
      const { accessToken, refreshToken: newRefreshToken } = refreshData;
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
    localStorage.removeItem('sessionStartTime');
  }, []);
  const signup = useCallback((accessToken: string, refreshToken: string, user: User) => {
    const newState = { token: accessToken, refreshToken, user };
    setState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
    localStorage.removeItem('sessionStartTime');
  }, []);
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      if (!state.token) {
        return;
      }
      const response = await fetch('http:
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setState(prevState => {
        const newState = { 
          ...prevState, 
          user: userData.user 
        };
        localStorage.setItem('auth', JSON.stringify(newState));
        return newState;
      });
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [state.token]);
  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      signup, 
      logout, 
      isLoading, 
      refreshAccessToken,
      refreshUser
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