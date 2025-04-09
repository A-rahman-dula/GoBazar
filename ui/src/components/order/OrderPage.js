import React, { useState } from 'react';
import { toast } from 'react-toastify';
import OrderSummary from './OrderSummary';
import DeliveryDetails from './DeliveryDetails';
import useCartData from '../../hooks/useCartData';
import api from '../../api';

const OrderPage = () => {
  const { cartitems, setCartItems, cartTotal, setCartTotal, loading, tax } =
    useCartData();

  const [isLoading, setLoading] = useState(false);

  const handleDeliverySubmit = (deliveryData) => {
    setLoading(true);

    // Compute total_amount and ensure it meets the backend's validation constraints
    let totalAmount = parseFloat(cartTotal) + parseFloat(tax);

    // Ensure total_amount does not exceed 10 digits, and round to 2 decimal places
    totalAmount = parseFloat(totalAmount.toFixed(2));

    // Prepare order items for the API request
    const orderItems = cartitems.map((item) => {
      console.log('product', item.product.id); // Use item.product.id, not item.id
      console.log('quantity', item.quantity);
      console.log('price', item.product.price);

      // Ensure price is a number, not a string
      const price = parseFloat(item.product.price);

      return {
        product_id: item.product.id, // Use item.product.id for the product ID
        quantity: item.quantity,
        price: price, // Make sure this is a number
      };
    });

    // Prepare the request payload
    const requestData = {
      order: {
        total_amount: totalAmount, // Ensure this is rounded and validated
        // Add user ID if required by the backend
        user: 1, // Replace with the actual user ID (e.g., from authentication)
      },
      order_items: orderItems, // List of order items
      delivery_details: deliveryData, // Delivery details
    };

    console.log('Sending Data:', requestData);

    // Send the request to create the order
    api
      .post('create_order/', requestData)
      .then((response) => {
        toast.success('Order created successfully');

        // Remove cart data from localStorage
        localStorage.removeItem('cart_code');

        // Delay the redirect to ensure toast is shown
        setTimeout(() => {
          window.location.href = '/'; // Redirect to home page
        }, 1500); // 1.5 second delay
      })
      .catch((error) => {
        // Check if error.response is defined
        const errorMessage = error.response?.data || error.message;
        console.error('Error creating order:', errorMessage);

        // Log and display the error to the user
        toast.error(
          `Failed to create order: ${JSON.stringify(errorMessage.error)}`,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='container mt-5 mb-5'>
      <div className='row justify-content-center'>
        <div className='col-md-10'>
          <div className='card shadow-sm rounded-lg'>
            <div className='card-body'>
              <h2 className='text-center text-primary mb-4'>Order Details</h2>
              <div className='row'>
                <div className='col-md-4'>
                  <OrderSummary
                    cartitems={cartitems}
                    cartTotal={cartTotal}
                    tax={tax}
                  />
                </div>
                <div className='col-md-8'>
                  <DeliveryDetails
                    onSubmit={handleDeliverySubmit}
                    loading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
