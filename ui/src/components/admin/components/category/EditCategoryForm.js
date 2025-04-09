import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../../api';

const EditCategoryForm = ({
  show,
  handleClose,
  category,
  refreshCategories,
}) => {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    api
      .put(`update_category/${category.id}/`, { name: categoryName })
      .then(() => {
        refreshCategories();
        handleClose();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type='text'
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder='Enter category name'
              required
            />
          </Form.Group>

          <Button variant='primary' type='submit' className='mt-4 w-100'>
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCategoryForm;
