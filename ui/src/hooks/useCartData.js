import React, { useEffect, useState } from 'react';
import api from '../api';

function useCartData() {
  const [cartitems, setCartItems] = useState([]); // Cart items
  const [cartTotal, setCartTotal] = useState(0.0); // Cart total amount
  const [loading, setLoading] = useState(false); // Loading state
  const tax = 0.05 * cartTotal; // Tax calculation based on total

  useEffect(() => {
    const cartCode = localStorage.getItem('cart_code'); // Fetch cart_code from localStorage

    if (!cartCode) {
      console.warn('Cart code is not available in localStorage');
      return;
    }

    setLoading(true); // Start loading
    api
      .get(`get_cart?cart_code=${cartCode}`) // Fetch cart data
      .then((response) => {
        console.log(response.data);
        setCartItems(response.data.items || []); // Set cart items
        setCartTotal(response.data.sum_total || 0.0); // Set cart total
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error.message); // Log error
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, []); // Empty dependency array as cart code won't change frequently

  return { cartitems, setCartItems, cartTotal, setCartTotal, loading, tax };
}

export default useCartData;
