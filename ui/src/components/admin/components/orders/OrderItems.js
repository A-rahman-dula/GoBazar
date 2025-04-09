import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import api from '../../../../api'; // Make sure this is correctly imported from your project structure

const OrderItems = ({ items }) => {
  const [productNames, setProductNames] = useState({}); // State to store product names

  // Function to fetch product name by product_id
  const fetchProductName = async (productId) => {
    try {
      const res = await api.get(`product_detail_id/${productId}/`);
      return res.data.name; // Assuming the product API returns {name: "Product Name"}
    } catch (error) {
      console.error('Error fetching product name:', error);
      return 'Unknown Product'; // Return a default value in case of an error
    }
  };

  useEffect(() => {
    // Fetch product names for each item in the order
    const fetchNames = async () => {
      const names = {};
      for (const item of items) {
        if (!names[item.product_id]) {
          const name = await fetchProductName(item.product_id);
          names[item.product_id] = name;
        }
      }
      setProductNames(names);
    };

    if (items.length > 0) {
      fetchNames();
    }
  }, [items]);

  return (
    <div>
      <h4 className='fw-bold mb-3'>Order Items</h4>
      <Table striped bordered hover responsive='sm'>
        <thead className='table-dark text-center'>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price (Rs)</th>
            <th>Total (Rs)</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {items.length === 0 ? (
            <tr>
              <td colSpan='5'>No items found.</td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{productNames[item.product_id] || 'Loading...'}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.quantity * item.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderItems;
