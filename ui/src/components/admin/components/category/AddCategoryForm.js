import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../../api';

const AddCategoryForm = ({ show, handleClose, refreshCategories }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    api
      .post('add_category/', { name: categoryName })
      .then(() => {
        refreshCategories();
        setCategoryName('');
        handleClose();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
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
            Add Category
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryForm;
