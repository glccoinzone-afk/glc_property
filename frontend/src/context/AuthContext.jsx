import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../mock';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('bp_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const u = { email: found.email, role: found.role, name: found.name };
      setUser(u);
      localStorage.setItem('bp_user', JSON.stringify(u));
      return { success: true, user: u };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (name, email, password, role = 'user') => {
    // Save to localStorage as mock
    const u = { name, email, role };
    setUser(u);
    localStorage.setItem('bp_user', JSON.stringify(u));
    return { success: true, user: u };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
