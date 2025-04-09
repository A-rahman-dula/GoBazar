import React, { useState, useEffect } from 'react';
import {
  Table,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Card,
} from 'react-bootstrap';
import api from '../../../../api'; // Import API handler
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const OrderDetailsPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('orders/');
      setOrders(res.data);
      setLoading(false);

      const userIds = [
        ...new Set(res.data.map((order) => order.user).filter(Boolean)),
      ];
      fetchAllCustomers(userIds);
    } catch (err) {
      setError('Error fetching orders');
      setLoading(false);
      console.error('Error fetching orders:', err);
    }
  };

  const fetchAllCustomers = async (userIds) => {
    setLoadingCustomers(true);
    try {
      const customerRequests = userIds.map((userId) =>
        api.get(`user_details/${userId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }),
      );

      const responses = await Promise.all(customerRequests);
      const customerData = {};
      responses.forEach((res, index) => {
        customerData[userIds[index]] = res.data;
      });

      setCustomers(customerData);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Error fetching customer details');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      api
        .delete(`delete_order/${orderId}`)
        .then(() => {
          setOrders(orders.filter((order) => order.id !== orderId));
        })
        .catch((err) => {
          console.error('Error deleting order:', err);
          alert('Failed to delete order.');
        });
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    api
      .patch(
        `update_order_status/${orderId}/`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Ensure you're passing the token
          },
        },
      )
      .then((response) => {
        console.log('Response:', response.data); // Check the response here
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      })
      .catch((err) => {
        console.error('Error updating status:', err);
        alert('Failed to update status.');
      });
  };

  if (loading || loadingCustomers) {
    return (
      <Container className='d-flex flex-column align-items-center my-5'>
        <h2 className='mb-3'>Order Details</h2>
        <Spinner animation='border' variant='primary' />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='my-5'>
        <Row className='justify-content-center'>
          <Col md={6}>
            <Alert variant='danger' className='text-center'>
              {error}
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className='my-4'>
      <Row className='justify-content-between align-items-center mb-3'>
        <Col md='auto'>
          <h2 className='fw-bold'>Order Details</h2>
        </Col>
      </Row>

      <Card className='shadow-sm border-0'>
        <Card.Body>
          <Table striped bordered hover responsive='sm' className='mb-0'>
            <thead className='table-dark text-center'>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Price(Rs)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const customer = customers[order.user] || {
                  username: 'Unknown User',
                  phone: 'Not Provided',
                };
                return (
                  <tr key={order.id} className='text-center align-middle'>
                    <td>{index + 1}</td>
                    <td className='fw-bold'>{order.id}</td>
                    <td>{customer.username}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className='form-select form-select-sm'
                      >
                        <option value='PENDING'>Pending</option>
                        <option value='PROCESSING'>Processing</option>
                        <option value='SHIPPED'>Shipped</option>
                        <option value='DELIVERED'>Delivered</option>
                        <option value='CANCELLED'>Cancelled</option>
                      </select>
                    </td>
                    <td
                      style={{ textAlign: 'right' }}
                    >{`${order.total_amount}`}</td>
                    <td>
                      <div className='d-flex gap-2 justify-content-center'>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => handleDeleteOrder(order.id)}
                          className='d-flex align-items-center'
                        >
                          <FontAwesomeIcon icon={faTrash} className='me-2' />
                        </Button>
                        <Button
                          variant='outline-primary'
                          size='sm'
                          className='d-flex align-items-center'
                          onClick={() =>
                            navigate(`/admin/order-details/${order.id}`)
                          }
                        >
                          <FontAwesomeIcon icon={faListAlt} className='me-2' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetailsPage;
