'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, AuthState, User } from './types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    // On mount, check if user is authenticated by calling /api/auth/me
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const { user } = await res.json();
          setState({
            user,
            token: null, // token is in cookie, not JS
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isAuthenticated: false, isLoading: false, user: null }));
        }
      } catch {
        setState(prev => ({ ...prev, isAuthenticated: false, isLoading: false, user: null }));
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      // After login, fetch user info
      const meRes = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (meRes.ok) {
        const { user } = await meRes.json();
        setState({
          user,
          token: null,
          isAuthenticated: true,
          isLoading: false,
        });
        router.push('/');
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        throw new Error('Failed to fetch user info after login');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    // Optionally, call a logout endpoint to clear the cookie
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setState(initialState);
    router.push('/login');
  };

  const googleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const value = {
    ...state,
    login,
    logout,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 