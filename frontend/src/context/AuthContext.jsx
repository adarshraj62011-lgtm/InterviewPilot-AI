import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user credentials exist in localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await API.post('/auth/login', { usernameOrEmail, password });
      const { token: jwt, role, id, username, email } = response.data;
      
      const userData = { id, username, email, role };
      
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwt);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data || error.message || 'Login failed';
    }
  };

  const register = async (username, email, password, role) => {
    try {
      const response = await API.post('/auth/register', { username, email, password, role });
      const { token: jwt, role: userRole, id, username: uName, email: uEmail } = response.data;
      
      const userData = { id, username: uName, email: uEmail, role: userRole };
      
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwt);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data || error.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
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
