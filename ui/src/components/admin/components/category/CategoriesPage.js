import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Icons for better UI
import AddCategoryForm from './AddCategoryForm';
import EditCategoryForm from './EditCategoryForm';
import api from '../../../../api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    api
      .get('categories/')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  const handleShowAddCategory = () => setShowAddCategory(true);
  const handleCloseAddCategory = () => setShowAddCategory(false);

  const handleShowEditCategory = (category) => {
    setEditingCategory(category);
    setShowEditCategory(true);
  };

  const handleCloseEditCategory = () => setShowEditCategory(false);

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      api
        .delete(`delete_category/${id}/`)
        .then(() => fetchCategories())
        .catch((err) => console.error(err));
    }
  };

  return (
    <Container>
      <Row className='my-4'>
        <Col md={6}>
          <h2 className='text-dark fw-bold'>Category Management</h2>
        </Col>
        <Col md={6} className='text-md-end'>
          <Button
            variant='success'
            className='me-2 shadow'
            onClick={handleShowAddCategory}
          >
            <FaPlus className='me-1' /> Add Category
          </Button>
        </Col>
      </Row>

      <Card className='shadow-lg border-0'>
        <Card.Body>
          <Table
            striped
            bordered
            hover
            responsive='sm'
            className='text-center align-middle'
          >
            <thead className='table-dark'>
              <tr>
                <th>#</th>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.id}</td>
                    <td className='fw-bold'>{category.name}</td>
                    <td>
                      <Button
                        variant='primary'
                        size='sm'
                        className='me-2'
                        onClick={() => handleShowEditCategory(category)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant='danger'
                        size='sm'
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='text-muted'>
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddCategoryForm
        show={showAddCategory}
        handleClose={handleCloseAddCategory}
        refreshCategories={fetchCategories}
      />
      <EditCategoryForm
        show={showEditCategory}
        handleClose={handleCloseEditCategory}
        category={editingCategory}
        refreshCategories={fetchCategories}
      />
    </Container>
  );
};

export default CategoriesPage;
