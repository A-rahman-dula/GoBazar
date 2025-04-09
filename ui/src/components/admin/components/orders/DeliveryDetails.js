import React from 'react';
import { ListGroup } from 'react-bootstrap';

const DeliveryDetails = ({ details }) => {
  console.log(details);

  if (!details) return <p>No delivery details available.</p>;

  return (
    <div>
      <h4 className='fw-bold mb-0'>Delivery Details</h4>
      <ListGroup variant='flush'>
        <ListGroup.Item className='bg-dark text-light'>
          <strong>Order ID:</strong> {details.order}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Customer:</strong> {details.first_name} {details.last_name}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Phone:</strong> {details.contact_number}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Email:</strong> {details.email}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Address:</strong> {details.delivery_address}, {details.city},{' '}
          {details.country}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Created At:</strong>{' '}
          {new Date(details.created_at).toLocaleString()}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Updated At:</strong>{' '}
          {new Date(details.updated_at).toLocaleString()}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default DeliveryDetails;
