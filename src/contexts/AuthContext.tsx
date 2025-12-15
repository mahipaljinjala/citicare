import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  citizen: {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'citizen@citicare.gov',
    role: 'citizen',
    ward: 'Ward 12',
  },
  officer: {
    id: '2',
    name: 'Amit Sharma',
    email: 'officer@citicare.gov',
    role: 'officer',
    ward: 'Ward 12',
    department: 'Roads & Infrastructure',
  },
  department_head: {
    id: '3',
    name: 'Dr. Vikram Singh',
    email: 'head@citicare.gov',
    role: 'department_head',
    department: 'Roads & Infrastructure',
  },
  admin: {
    id: '4',
    name: 'Municipal Admin',
    email: 'admin@citicare.gov',
    role: 'admin',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({
      id: Date.now().toString(),
      name,
      email,
      role: 'citizen',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
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
