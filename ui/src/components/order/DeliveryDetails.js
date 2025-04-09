import React, { useState } from 'react';

const DeliveryDetails = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    delivery_address: '',
    city: '',
    country: '',
    contact_number: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Send data to parent component or API
  };

  return (
    <div className='col-md-10 mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='p-4 border rounded shadow-lg bg-light'
      >
        <h2 className='text-center text-primary mb-2'>Delivery Details</h2>
        <hr />
        <div className='row mb-3'>
          <div className='col-md-6'>
            <input
              type='text'
              name='first_name'
              placeholder='First Name'
              value={formData.first_name}
              onChange={handleChange}
              className='form-control'
              required
            />
          </div>
          <div className='col-md-6'>
            <input
              type='text'
              name='last_name'
              placeholder='Last Name'
              value={formData.last_name}
              onChange={handleChange}
              className='form-control'
              required
            />
          </div>
        </div>
        <div className='mb-3'>
          <textarea
            name='delivery_address'
            placeholder='Delivery Address'
            value={formData.delivery_address}
            onChange={handleChange}
            className='form-control'
            required
            rows='4'
          />
        </div>
        <div className='row mb-3'>
          <div className='col-md-6'>
            <input
              type='text'
              name='city'
              placeholder='City'
              value={formData.city}
              onChange={handleChange}
              className='form-control'
              required
            />
          </div>
          <div className='col-md-6'>
            <input
              type='text'
              name='country'
              placeholder='Country'
              value={formData.country}
              onChange={handleChange}
              className='form-control'
              required
            />
          </div>
        </div>
        <div className='mb-3'>
          <input
            type='text'
            name='contact_number'
            placeholder='Contact Number'
            value={formData.contact_number}
            onChange={handleChange}
            className='form-control'
            required
          />
        </div>
        <div className='mb-3'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            className='form-control'
            required
          />
        </div>
        <button
          type='submit'
          className='btn btn-primary w-100'
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default DeliveryDetails;
