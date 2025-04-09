import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../../api';
import './AddProductFormStyle.css'; // Import the CSS file

const AddProductForm = ({ show, handleClose, refreshProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  // Fetch categories when the modal is opened
  useEffect(() => {
    if (show) {
      api
        .get('categories/')
        .then((res) => setCategories(res.data))
        .catch((err) => console.error(err));
    }
  }, [show]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate price to ensure it's not negative
    if (name === 'price' && value < 0) {
      setError('Price cannot be negative.');
    } else {
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Block submission if price is negative
    if (formData.price < 0) {
      setError('Price cannot be negative.');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('slug', formData.slug);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    if (image) submitData.append('image', image);

    api
      .post('add_products/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        handleClose(); // Close the modal
        refreshProducts(); // Refresh the product list
        setFormData({
          name: '',
          slug: '',
          description: '',
          price: '',
          category: '',
        });
        setImage(null);
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError('An error occurred while adding the product.');
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className='modal-header'>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='productName'>
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter product name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId='productSlug' className='mt-3'>
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter product slug'
              name='slug'
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId='productDescription' className='mt-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter product description'
              name='description'
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId='productPrice' className='mt-3'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              step='0.01'
              placeholder='Enter product price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              required
              min='0' // Ensures the price cannot be negative
            />
            {error && <div className='error-message'>{error}</div>}
          </Form.Group>

          <Form.Group controlId='productCategory' className='mt-3'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as='select'
              name='category'
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value=''>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='productImage' className='mt-3'>
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type='file'
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </Form.Group>

          <Button variant='primary' type='submit' className='mt-4 w-100'>
            Add Product
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductForm;
