import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../../../api';
import DeliveryDetails from './DeliveryDetails';
import OrderItems from './OrderItems';

const OrderViewPage = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const [deliveryRes, itemsRes] = await Promise.all([
        api.get(`orderviewdeliverydetails/${orderId}`),
        api.get(`orderviewitems/${orderId}`),
      ]);
      setDeliveryDetails(deliveryRes.data);
      setOrderItems(itemsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching order details.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className='d-flex justify-content-center align-items-center my-5'>
        <Spinner animation='border' variant='primary' />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='my-5'>
        <Alert variant='danger' className='text-center'>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className='my-4'>
      <Row>
        <Col md={7}>
          <Card className='shadow-sm border-0'>
            <Card.Body>
              <OrderItems items={orderItems} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className='shadow-sm border-0 bg-dark text-light'>
            <Card.Body>
              <DeliveryDetails details={deliveryDetails} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderViewPage;
