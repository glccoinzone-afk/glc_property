import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('glc_user');
    const token = localStorage.getItem('glc_token');
    if (saved && token) {
      try {
        setUser(JSON.parse(saved));
        // Verify token validity
        authAPI.me().catch(() => {
          localStorage.removeItem('glc_token');
          localStorage.removeItem('glc_user');
          setUser(null);
        });
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: u } = res.data;
      localStorage.setItem('glc_token', token);
      localStorage.setItem('glc_user', JSON.stringify(u));
      setUser(u);
      return { success: true, user: u };
    } catch (e) {
      return { success: false, error: e?.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (name, email, password, role = 'user', phone = '') => {
    try {
      const res = await authAPI.register({ name, email, password, role, phone });
      const { token, user: u } = res.data;
      localStorage.setItem('glc_token', token);
      localStorage.setItem('glc_user', JSON.stringify(u));
      setUser(u);
      return { success: true, user: u };
    } catch (e) {
      return { success: false, error: e?.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('glc_token');
    localStorage.removeItem('glc_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
