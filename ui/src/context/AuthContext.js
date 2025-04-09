import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api'; // Ensure this is the correct API instance

// Create Authentication Context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const [username, setUsername] = useState('');

  const handleAuth = () => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiryDate = decoded.exp;
        const currentTime = Date.now() / 1000;

        if (expiryDate >= currentTime) {
          setIsAuthenticated(true);
          setUsername(decoded.username || 'User');

          // Check if the user is an admin
          const isStaff = localStorage.getItem('is_staff') === 'true';
          setIsAdmin(isStaff);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        await api.post('logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error(
        'Logout API failed:',
        error.response?.data || error.message,
      );
    } finally {
      // Clear local storage and reset state
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('is_staff');

      setIsAuthenticated(false);
      setIsAdmin(false);
      setUsername('');
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, username, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
