import React from 'react';
import { BASE_URL } from '../../api';

const OrderItem = ({ cartitem }) => {
  return (
    <div
      className='d-flex justify-content-between align-items-center mb-3'
      style={{ padding: '10px' }} // Define padding correctly here
    >
      <div className='d-flex align-items-center'>
        <img
          src={`${BASE_URL}${cartitem.product.image}`} // Replace with the product image URL
          alt='Product'
          className='img-fluid'
          style={{ width: '60px', objectFit: 'cover', borderRadius: '5px' }}
        />
        <div className='ms-3'>
          <h6 className='mb-0'>{cartitem.product.name}</h6>
          <small>{`Quantity:${cartitem.quantity}`}</small>
        </div>
      </div>
      <h6>{`Rs ${cartitem.product.price}`}</h6>
    </div>
  );
};

export default OrderItem;
