import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5000';

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token is still valid
      fetchProfile().catch(() => {
        logout();
      });
    }
    setLoading(false);
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(user.profile);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(user.profile);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/profile', profileData);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    token,
    login,
    register,
    logout,
    updateProfile,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}