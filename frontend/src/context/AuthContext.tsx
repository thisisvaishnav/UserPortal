'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setToken(storedToken);
    }
  }, []);

  const login = (username: string, token: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  };

  const value = {
    isLoggedIn,
    username,
    login,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 