import React, { useContext, useState } from 'react';
import api from '../../api';
import './LoginPage.css'; // You can reuse the same styles or create RegisterPage.css
import Error from '../ui/Error';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RegisterPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    city: '',
    state: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    api
      .post('register/', formData)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('access', response.data.tokens.access);
        localStorage.setItem('refresh', response.data.tokens.refresh);
        if (response.data.tokens.is_staff !== undefined) {
          localStorage.setItem('is_staff', response.data.tokens.is_staff);
        }
        setLoading(false);
        setIsAuthenticated(true);
        setError('');
        navigate('/');
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error || error.message || 'Registration failed';
        console.log(errorMessage);
        setError(errorMessage);
        setLoading(false);
      });
  }

  return (
    <div className='login-card shadow'>
      {error && <Error error={error} />}
      <h2 className='login-title'>Create Account</h2>
      <p className='login-subtitle'>Please fill in your details</p>
      <form onSubmit={handleSubmit}>
        {/* Required Fields */}
        <div className='row'>
          <div className='col-6'>
            <div className='mb-1'>
              <label htmlFor='first_name' className='form-label'>
                First Name*
              </label>
              <input
                type='text'
                className='form-control'
                id='first_name'
                placeholder='Enter your first name'
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='col-6'>
            <div className='mb-1'>
              <label htmlFor='last_name' className='form-label'>
                Last Name*
              </label>
              <input
                type='text'
                className='form-control'
                id='last_name'
                placeholder='Enter your last name'
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        <div className='mb-1'>
          <label htmlFor='email' className='form-label'>
            Email*
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='mb-1'>
              <label htmlFor='username' className='form-label'>
                Username*
              </label>
              <input
                type='text'
                className='form-control'
                id='username'
                placeholder='Choose a username'
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='col-6'>
            <div className='mb-1'>
              <label htmlFor='password' className='form-label'>
                Password*
              </label>
              <input
                type='password'
                className='form-control'
                id='password'
                placeholder='Create a password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className='mb-1'>
          <label htmlFor='address' className='form-label'>
            Address
          </label>
          <textarea
            className='form-control'
            id='address'
            placeholder='Enter your address'
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className='row'>
          <div className='col-6'>
            <div className='mb-1'>
              <label htmlFor='city' className='form-label'>
                City
              </label>
              <input
                type='text'
                className='form-control'
                id='city'
                placeholder='Enter your city'
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='col-6'>
            <div className='mb-1'>
              <label htmlFor='state' className='form-label'>
                State
              </label>
              <input
                type='text'
                className='form-control'
                id='state'
                placeholder='Enter your state'
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className='mb-1'>
          <label htmlFor='phone' className='form-label'>
            Phone
          </label>
          <input
            type='tel'
            className='form-control'
            id='phone'
            placeholder='Enter your phone number'
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <button
          type='submit'
          className='btn btn-primary w-100'
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <div className='login-footer'>
        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
