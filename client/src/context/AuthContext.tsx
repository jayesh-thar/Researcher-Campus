import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAccessToken, getAccessToken } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  persona?: string;
  primaryDomain?: string;
  targetVenuePreference?: any;
  isCompletedOnboarding?: boolean;
  googleDriveConnected?: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setTokenState] = useState<string | null>(() => getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize user to localStorage whenever it changes
  const updateUser = useCallback((updatedFields: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const login = useCallback((newToken: string, newUser: UserProfile) => {
    setAccessToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    setAccessToken(null);
    setTokenState(null);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }, []);

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const res = await api.get('/user/profile');
      if (res.data.user) {
        const u: UserProfile = res.data.user;
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
        return u;
      }
    } catch (err: any) {
      // If 401 and refresh fails, clear invalid session
      if (err.response?.status === 401) {
        setUser(null);
        setAccessToken(null);
        setTokenState(null);
        localStorage.removeItem('user');
      }
    }
    return null;
  }, []);

  // Hydrate session on app boot
  useEffect(() => {
    let isMounted = true;
    const currentToken = getAccessToken();

    if (currentToken) {
      refreshProfile().finally(() => {
        if (isMounted) setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [refreshProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUser,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

