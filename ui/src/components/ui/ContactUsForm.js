import React, { useState } from 'react';
import axios from 'axios';

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/contact-messages/',
        formData,
      );

      setResponseMessage('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setResponseMessage('Failed to send message. Please try again.');
    }
  };

  return (
    <div className='container my-5'>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Name</label>
          <input
            type='text'
            name='name'
            className='form-control'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Email</label>
          <input
            type='email'
            name='email'
            className='form-control'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Message</label>
          <textarea
            name='message'
            className='form-control'
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>

      {responseMessage && (
        <div
          className={`alert mt-3 ${
            responseMessage.includes('successfully')
              ? 'alert-success'
              : 'alert-danger'
          }`}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default ContactUsForm;
