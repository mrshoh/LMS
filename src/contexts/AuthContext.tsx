import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/lms';
import { storage } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    storage.initializeData();
    if (storage.isLoggedIn()) {
      setUser(storage.getUser());
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in real app, validate against backend
    if (email && password.length >= 4) {
      const userData = storage.getUser();
      userData.email = email;
      storage.setUser(userData);
      storage.setLoggedIn(true);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    storage.setLoggedIn(false);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: User) => {
    storage.setUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
