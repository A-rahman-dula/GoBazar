import React, { useState } from 'react';
import api, { BASE_URL } from '../../api';
import { toast } from 'react-toastify';

const CartItem = ({
  item,
  setCartTotal,
  setCartItems,
  cartitems,
  setNumCartItems,
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function updateCartItem() {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      setQuantity(1);
      return;
    }

    setLoading(true);
    const itemData = { quantity: quantity, item_id: item.id };

    api
      .patch('update_quantity/', itemData)
      .then((response) => {
        const updatedItem = response.data.data;
        const updatedCartItems = cartitems.map((cartitem) =>
          cartitem.id === item.id ? updatedItem : cartitem,
        );

        setCartTotal(
          updatedCartItems.reduce((acc, curr) => acc + curr.total, 0),
        );
        setNumCartItems(
          updatedCartItems.reduce((acc, curr) => acc + curr.quantity, 0),
        );
        toast.success('Cart item updated successfully');
      })
      .catch((error) => {
        console.log(error.message);
        toast.error('Failed to update cart item');
        setQuantity(item.quantity); // Reset to original quantity on error
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteCartItem() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this cart item?',
    );
    if (confirmDelete) {
      setDeleteLoading(true);
      const itemID = { item_id: item.id };

      api
        .post('delete_cartitem/', itemID)
        .then((response) => {
          const updatedCartItems = cartitems.filter(
            (cartitem) => cartitem.id !== item.id,
          );
          setCartItems(updatedCartItems);
          setCartTotal(
            updatedCartItems.reduce((acc, curr) => acc + curr.total, 0),
          );
          setNumCartItems(
            updatedCartItems.reduce((acc, curr) => acc + curr.quantity, 0),
          );
          toast.success('Cart item deleted successfully');
        })
        .catch((error) => {
          console.log(error.message);
          toast.error('Failed to delete cart item');
        })
        .finally(() => {
          setDeleteLoading(false);
        });
    }
  }

  return (
    <div className='col-md-12'>
      <div
        className='cart-item d-flex align-items-center mb-3 p-3'
        style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}
      >
        <img
          src={`${BASE_URL}${item.product.image}`}
          alt={item.product.name}
          className='img-fluid'
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
        />
        <div className='ms-3 flex-grow-1'>
          <h5 className='mb-1'>{item.product.name}</h5>
          <p className='mb-0 text-muted'>{`Rs ${item.product.price}`}</p>
        </div>
        <div className='d-flex align-items-center'>
          <input
            type='number'
            min='1'
            className='form-control me-3'
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            style={{ width: '70px' }}
          />
          <button
            className='btn btn-secondary btn-sm mx-2'
            onClick={updateCartItem}
            disabled={loading}
            style={{ background: '#6050dc' }}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            className='btn btn-danger btn-sm'
            onClick={deleteCartItem}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
