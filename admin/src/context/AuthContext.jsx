import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DEMO_USERS = [
  {
    id: 'usr_superadmin_001',
    email: 'admin@sahara.com',
    password: 'admin123',
    name: 'Super Admin',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  },
];

const TOKEN_KEY = 'sahara_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (raw) {
        const decoded = JSON.parse(atob(raw));
        const match = DEMO_USERS.find(u => u.id === decoded.id && u.email === decoded.email);
        if (match) {
          const { password: _pw, ...safeUser } = match;
          setUser(safeUser);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const match = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) throw new Error('Invalid email or password. Please try again.');
    const { password: _pw, ...safeUser } = match;
    const token = btoa(JSON.stringify({ id: safeUser.id, email: safeUser.email, role: safeUser.role }));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(safeUser);
    return safeUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export default AuthContext;
