import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Spinner from '../ui/Spinner';
import useCartData from '../../hooks/useCartData';

const CartPage = ({ setNumCartItems }) => {
  const { cartitems, setCartItems, cartTotal, setCartTotal, loading, tax } =
    useCartData();

  if (loading) {
    <Spinner loading={loading} />;
  }

  if (cartitems.length < 1) {
    return (
      <div className='alert alert-primary py-5' role='alert'>
        You haven't add any items to you card
      </div>
    );
  }

  return (
    <div
      className='container my-3 py-3'
      style={{ height: '80vh', overflow: 'scroll' }}
    >
      <h5 className='mb-4'>Shopping Cart</h5>
      <div className='row'>
        <div className='col-md-8'>
          {cartitems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              cartitems={cartitems}
              setCartTotal={setCartTotal}
              setNumCartItems={setNumCartItems}
              setCartItems={setCartItems}
            />
          ))}
        </div>
        <CartSummary cartTotal={cartTotal} tax={tax} />
      </div>
    </div>
  );
};

export default CartPage;
