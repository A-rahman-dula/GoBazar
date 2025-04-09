import React, { useState, useEffect } from 'react';
import api from '../../api';
import { jwtDecode } from 'jwt-decode';
import Spinner from './Spinner';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh');

    try {
      const res = await api.post('/token/refresh/', {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem('access', res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  }

  async function auth() {
    const token = localStorage.getItem('access');

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const expiryDate = decoded.exp;
    const currentTime = Date.now() / 1000;

    if (currentTime > expiryDate) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
      // Check if the user is an admin using `is_staff` from localStorage
      const isStaff = localStorage.getItem('is_staff') === 'true';
      setIsAdmin(isStaff);
    }
  }

  if (isAuthorized === null) {
    return <Spinner />;
  }

  if (!isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to='/unauthorized' replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
