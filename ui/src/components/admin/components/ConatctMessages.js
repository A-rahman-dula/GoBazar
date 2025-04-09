import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactMessages = () => {
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/contact-messages/',
        );
        setContactMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact messages:', error);
        setLoading(false);
      }
    };

    fetchContactMessages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Contact Messages</h3>
      {contactMessages.length === 0 ? (
        <p>No contact messages yet.</p>
      ) : (
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date Received</th>
            </tr>
          </thead>
          <tbody>
            {contactMessages.map((message) => (
              <tr key={message.id}>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.message}</td>
                <td>{new Date(message.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactMessages;
