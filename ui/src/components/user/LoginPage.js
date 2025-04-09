import React, { useContext, useState } from 'react';
import api from '../../api';
import './LoginPage.css';
import Error from '../ui/Error';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userInfo = { username, password };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    api
      .post('login/', userInfo)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);

        const isStaff = response.data.is_staff;
        localStorage.setItem('is_staff', isStaff);

        setLoading(false);
        setUsername('');
        setPassword('');
        setIsAuthenticated(true);
        setError('');

        // Redirect based on is_staff status
        if (isStaff) {
          navigate('/admin', { replace: true });
          window.location.reload();
        } else {
          const from = location?.state?.from.pathname || '/';
          navigate(from, { replace: true });
          window.location.reload();
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error || error.message || 'Login failed';
        console.log(errorMessage);
        setError(errorMessage);
        setLoading(false);
      });
  }

  return (
    <div className='bg-image'>
      <div className='login-card shadow'>
        {error && <Error error={error} />}
        <h2 className='login-title'>Welcome Back</h2>
        <p className='login-subtitle'>Please login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              type='text'
              className='form-control'
              id='username'
              placeholder='Enter your username'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          <button
            type='submit'
            className='btn btn-primary w-100'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className='login-footer'>
          <p>
            <a href='#'>Forgot Password?</a>
          </p>
          <p>
            Don't have an account?<Link to='/register'>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
