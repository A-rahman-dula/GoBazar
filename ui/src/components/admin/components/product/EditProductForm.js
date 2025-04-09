import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../../api'; // Assuming api is your Axios instance
import './AddProductFormStyle.css'; // Use same styling as AddProductForm

const EditProductForm = ({ show, handleClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  // Populate form fields when editing a product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '', // Ensure category is set correctly
      });
      setImagePreview(product.image || ''); // Assuming product.image is a URL
    }
  }, [product]);

  // Fetch categories when the modal is opened
  useEffect(() => {
    if (show) {
      api
        .get('categories/')
        .then((res) => setCategories(res.data))
        .catch((err) => console.error(err));
    }
  }, [show]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Generate a preview of the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Block submission if price is negative
    if (formData.price < 0) {
      setError('Price cannot be negative.');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    if (image) submitData.append('image', image);

    api
      .put(`update_product/${product.id}/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        handleClose();
        refreshProducts(); // Refresh product list
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
        });
        setImage(null);
        setImagePreview('');
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError('An error occurred while updating the product.');
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className='modal-header'>
        <Modal.Title>Edit Product</Modal.Title>
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

          <Form.Group controlId='productDescription' className='mt-3'>
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter product description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
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
              min='0'
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
              <option value='' disabled>
                Select a category
              </option>
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
              name='image'
              accept='image/*'
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt='Preview'
                style={{
                  width: '100px',
                  height: '100px',
                  marginTop: '10px',
                  objectFit: 'cover',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                }}
              />
            )}
          </Form.Group>

          <Button variant='primary' type='submit' className='mt-4 w-100'>
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductForm;
