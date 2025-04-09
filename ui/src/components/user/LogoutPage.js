import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LogoutPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout().then(() => navigate('/'));
    } else {
      navigate(-1);
    }
  }, []); // Empty dependency array to ensure useEffect runs only once on mount

  return null;
};

export default LogoutPage;
