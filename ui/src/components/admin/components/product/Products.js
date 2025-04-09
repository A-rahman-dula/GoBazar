import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Container,
  Row,
  Col,
  Form,
  Card,
  Badge,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddCategoryForm from '../category/AddCategoryForm';
import AddProductForm from '../product/AddProductForm';
import EditProductForm from './EditProductForm';
import api from '../../../../api';
import { BASE_URL } from '../../../../api';
import { FaPlus, FaEye, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [inventoryQuantity, setInventoryQuantity] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get('products/')
      .then((res) => {
        const productList = res.data;
        productList.forEach((product) => {
          fetchProductInventory(product.id);
        });
        setProducts(productList);
      })
      .catch((err) => console.error(err));
  };

  const fetchProductInventory = (productId) => {
    api
      .get(`inventory/${productId}/`)
      .then((res) => {
        const inventoryData = res.data;
        const totalQuantity = inventoryData.quantity || 0;
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? { ...product, totalQuantity } : product,
          ),
        );
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? { ...product, totalQuantity: 0 }
                : product,
            ),
          );
        } else {
          console.error(err);
        }
      });
  };

  const handleShowAddCategory = () => setShowAddCategory(true);
  const handleCloseAddCategory = () => setShowAddCategory(false);

  const handleShowAddProduct = () => setShowAddProduct(true);
  const handleCloseAddProduct = () => setShowAddProduct(false);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditProduct(true);
  };

  const handleCloseEditProduct = () => setShowEditProduct(false);

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      api
        .delete(`delete_product/${id}/`)
        .then(() => fetchProducts())
        .catch((err) => console.error(err));
    }
  };

  const handleShowInventoryView = (productId) => {
    navigate(`/admin/product/${productId}/inventories`);
  };

  const handleShowAddInventory = (productId) => {
    setSelectedProductId(productId);
    setShowAddInventory(true);
  };

  const handleCloseAddInventory = () => {
    setShowAddInventory(false);
    setInventoryQuantity(0);
  };

  const handleAddInventory = () => {
    if (inventoryQuantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    api
      .post('add_inventory/', {
        product: selectedProductId,
        quantity: inventoryQuantity,
      })
      .then((res) => {
        fetchProducts();
        handleCloseAddInventory();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container fluid className='p-4'>
      <Card className='shadow-sm'>
        <Card.Header className='bg-dark text-white'>
          <Row className='align-items-center'>
            <Col>
              <h4 className='mb-0'>Product Management</h4>
            </Col>
            <Col className='text-end'>
              <Button variant='light' onClick={handleShowAddProduct}>
                <FaPlus className='me-2' />
                Add Product
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive className='mb-0'>
            <thead className='thead-dark'>
              <tr>
                <th>#</th>
                <th>Product ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>
                    <Badge
                      bg={product.totalQuantity > 0 ? 'success' : 'danger'}
                    >
                      {product.totalQuantity || 0}
                    </Badge>
                  </td>
                  <td>{`Rs ${product.price}`}</td>
                  <td>
                    <img
                      src={`${BASE_URL}${product.image}`}
                      alt={product.name}
                      className='img-thumbnail'
                      style={{ width: '50px', height: '50px' }}
                    />
                  </td>
                  <td>
                    <Button
                      variant='outline-primary'
                      size='sm'
                      className='me-2'
                      onClick={() => handleEditProduct(product)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      className='me-2'
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FaTrash />
                    </Button>

                    <Button
                      variant='outline-success'
                      size='sm'
                      className='me-2'
                      onClick={() => handleShowAddInventory(product.id)}
                    >
                      <FaBoxOpen />
                    </Button>

                    <Button
                      variant='outline-info'
                      size='sm'
                      onClick={() => handleShowInventoryView(product.id)}
                    >
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddCategoryForm
        show={showAddCategory}
        handleClose={handleCloseAddCategory}
      />
      <AddProductForm
        show={showAddProduct}
        handleClose={handleCloseAddProduct}
        refreshProducts={fetchProducts}
      />
      <EditProductForm
        show={showEditProduct}
        handleClose={handleCloseEditProduct}
        product={editingProduct}
        refreshProducts={fetchProducts}
      />

      {/* Add Inventory Modal */}
      <Modal show={showAddInventory} onHide={handleCloseAddInventory}>
        <Modal.Header closeButton className='bg-primary text-white'>
          <Modal.Title>Add Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='quantity' className='mb-3'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type='number'
                value={inventoryQuantity}
                onChange={(e) => setInventoryQuantity(e.target.value)}
                min='1'
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseAddInventory}>
            Close
          </Button>
          <Button variant='primary' onClick={handleAddInventory}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Products;
