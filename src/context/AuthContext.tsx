import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  fullName: string | null;
  login: (token: string, role: string, fullName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [fullName, setFullName] = useState<string | null>(localStorage.getItem('fullName'));

  const login = (newToken: string, newRole: string, newFullName: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('fullName', newFullName);
    setToken(newToken);
    setRole(newRole);
    setFullName(newFullName);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    setToken(null);
    setRole(null);
    setFullName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, fullName, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
