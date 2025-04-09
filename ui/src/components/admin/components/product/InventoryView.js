import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Container, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import api from '../../../../api'; // Import API handler
import { useParams, useNavigate } from 'react-router-dom';

const InventoryView = () => {
  const { productId } = useParams();
  const [inventories, setInventories] = useState([]);
  const [showUpdateInventory, setShowUpdateInventory] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventories();
  }, [productId]);

  const fetchInventories = () => {
    api
      .get(`inventories/?product_id=${productId}`)
      .then((res) => {
        setInventories(res.data);
      })
      .catch((err) => console.error('Error fetching inventories:', err));
  };

  const handleDeleteInventory = (id) => {
    if (!id) {
      console.error('Invalid inventory ID for deletion');
      return;
    }
    if (window.confirm('Are you sure you want to delete this inventory?')) {
      api
        .delete(`delete_inventory/${id}/`)
        .then(() => fetchInventories())
        .catch((err) => console.error('Error deleting inventory:', err));
    }
  };

  const handleShowUpdateInventory = (inventory) => {
    if (!inventory || !inventory.id) {
      console.error('Selected inventory is invalid or missing id');
      return;
    }
    setSelectedInventory({ ...inventory });
    setShowUpdateInventory(true);
  };

  const handleCloseUpdateInventory = () => {
    setShowUpdateInventory(false);
    setSelectedInventory(null);
  };

  const handleUpdateInventory = () => {
    if (!selectedInventory || !selectedInventory.id) {
      console.error('Selected inventory is invalid or missing id');
      return;
    }
    api
      .put(`update_inventory/${selectedInventory.id}/`, {
        quantity: selectedInventory.quantity,
      })
      .then(() => {
        fetchInventories();
        handleCloseUpdateInventory();
      })
      .catch((err) => console.error('Error updating inventory:', err));
  };

  return (
    <Container className='mt-4'>
      <Button variant='secondary' className='mb-3' onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </Button>
      <Card className='shadow-lg p-4'>
        <h2 className='text-center text-primary mb-4'>Product Inventories</h2>
        <Table striped bordered hover responsive='sm' className='text-center'>
          <thead className='table-dark'>
            <tr>
              <th>#</th>
              <th>Quantity</th>
              <th>Date Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((inventory, index) => (
              <tr key={inventory.id || `temp-${index}`}>
                <td>{index + 1}</td>
                <td>{inventory.quantity}</td>
                <td>{inventory.date_updated}</td>
                <td>
                  <Button
                    variant='warning'
                    size='sm'
                    className='me-2'
                    onClick={() => handleShowUpdateInventory(inventory)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => handleDeleteInventory(inventory.id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Update Inventory Modal */}
      <Modal
        show={showUpdateInventory}
        onHide={handleCloseUpdateInventory}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='quantity'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type='number'
                value={selectedInventory?.quantity || ''}
                onChange={(e) =>
                  setSelectedInventory((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseUpdateInventory}>
            Close
          </Button>
          <Button variant='primary' onClick={handleUpdateInventory}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InventoryView;
