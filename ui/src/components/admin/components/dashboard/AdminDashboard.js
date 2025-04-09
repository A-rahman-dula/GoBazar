import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in and is an admin using `is_staff` from localStorage
    const isStaff = localStorage.getItem('is_staff') === 'true';

    if (!isStaff) {
      navigate('/login');
      return;
    }

    // Fetch user data from localStorage
    const username = localStorage.getItem('username');
    const cus_name = localStorage.getItem('cus_name');
    setUserData({ username, cus_name });
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='d-flex'>
      {/* Main Content */}
      <main className='flex-grow-1 p-4'>
        <div className='container text-center'>
          <h1>Welcome, {userData.cus_name || 'Admin'}!</h1>
          <p className='lead mt-3'>
            You have successfully logged in as an <strong>Admin</strong>.
          </p>
          <p>Use the sidebar to manage your tasks</p>
        </div>
      </main>
    </div>
  );
};
