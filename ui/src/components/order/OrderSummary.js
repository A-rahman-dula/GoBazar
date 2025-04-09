import React from 'react';

const OrderSummary = ({ cartTotal, tax }) => {
  const subtotal = parseFloat(cartTotal.toFixed(2));
  const cartTax = parseFloat(tax.toFixed(2));
  const total = (subtotal + cartTax).toFixed(2);

  return (
    <div className='card shadow-sm mb-4'>
      <div className='card-body'>
        <h5 className='card-title text-center text-primary mb-4'>
          Order Summary
        </h5>
        <hr />
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <span className='font-weight-bold'>Subtotal</span>
          <span className='font-weight-bold'>{`Rs ${subtotal}`}</span>
        </div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <span className='font-weight-bold'>Tax</span>
          <span className='font-weight-bold'>{`Rs ${cartTax}`}</span>
        </div>
        <div
          className='d-flex justify-content-between align-items-center p-3 rounded mt-3'
          style={{ backgroundColor: '#6050DC' }}
        >
          <span className='text-white font-weight-bold'>Total</span>
          <span className='text-white font-weight-bold'>{`Rs ${total}`}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
