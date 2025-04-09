import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is a regular user (not admin)
    const userType = sessionStorage.getItem("user_type");
    const userId = sessionStorage.getItem("user_id");

    console.log('User Type:', userType);  // Debugging: Check if userType is set
    console.log('User ID:', userId);      // Debugging: Check if user ID is set

    if (userType !== "user" || !userId) {
      navigate("/login"); // Redirect to login if not a regular user or user is not logged in
      return;
    }

    // Fetch user data from sessionStorage
    const username = sessionStorage.getItem("username");
    const cus_name = sessionStorage.getItem("cus_name");
    const email = sessionStorage.getItem("email");

    console.log('Username from sessionStorage:', username); // Debugging: Check username
    console.log('Customer Name from sessionStorage:', cus_name); // Debugging: Check cus_name
    console.log('Email from sessionStorage:', email); // Debugging: Check email

    // Set user data to state
    const user = {
      username,
      cus_name,
      email,
      userType: userType
    };

    setUserData(user); // Set user data to state
  }, [navigate]);

  const handleLogout = () => {
    // Clear session data
    sessionStorage.removeItem("user_type");
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("cus_name");
    sessionStorage.removeItem("email");

    // Redirect to login page after logout
    navigate("/login");
  };

  if (!userData) {
    return <div>Loading...</div>;  // Show loading message while fetching data
  }

  return (
    <div className="container mt-5">
      <h3>User Dashboard</h3>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User Details</h5>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Name:</strong> {userData.cus_name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>User Type:</strong> {userData.userType}</p>
          <button onClick={handleLogout} className="btn btn-danger mt-3">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
