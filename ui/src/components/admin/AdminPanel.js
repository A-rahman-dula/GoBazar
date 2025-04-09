import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faList,
  faUserCircle,
  faCartArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import Products from './components/product/Products';
import CategoriesPage from './components/category/CategoriesPage';
import OrderDetailPage from './components/orders/OrderDetailsPage';
import OrderViewPage from './components/orders/OrderViewPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import InventoryView from './components/product/InventoryView';
import ContactMessages from './components/ConatctMessages';

const AdminPanel = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isStaff = localStorage.getItem('is_staff') === 'true';

    if (!isStaff) {
      navigate('/login');
      return;
    }

    const username = localStorage.getItem('username');
    const cus_name = localStorage.getItem('cus_name');
    setUserData({ username, cus_name });
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='admin-panel d-flex'>
      {/* Sidebar */}
      <aside
        className='bg-dark text-light p-4'
        style={{ width: '250px', minHeight: '100vh' }}
      >
        <div className='mb-4'>
          <h2 className='mb-4'>Admin Panel</h2>
        </div>

        <nav>
          <ul className='list-unstyled'>
            <li className='mb-2'>
              <Link
                to='/admin/'
                className='text-light text-decoration-none d-flex align-items-center'
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className='me-2'
                  size='lg'
                />
                <strong>{userData.username || 'Admin'}</strong>
              </Link>
            </li>
            <li className='mb-2'>
              <Link
                to='/admin/products'
                className='text-light text-decoration-none d-flex align-items-center'
              >
                <FontAwesomeIcon icon={faBox} className='me-2' />
                Products
              </Link>
            </li>
            <li className='mb-2'>
              <Link
                to='/admin/categories'
                className='text-light text-decoration-none d-flex align-items-center'
              >
                <FontAwesomeIcon icon={faList} className='me-2' />
                Categories
              </Link>
            </li>
            <li className='mb-2'>
              <Link
                to='/admin/orders'
                className='text-light text-decoration-none d-flex align-items-center'
              >
                <FontAwesomeIcon icon={faCartArrowDown} className='me-2' />
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='content flex-grow-1 p-4'>
        <Routes>
          <Route path='/' element={<AdminDashboard />} />
          <Route path='products' element={<Products />} />
          <Route path='orders' element={<OrderDetailPage />} />
          <Route path='categories' element={<CategoriesPage />} />
          <Route path='contactmessages' element={<ContactMessages />} />

          <Route path='/order-details/:orderId' element={<OrderViewPage />} />
          <Route
            path='/product/:productId/inventories'
            element={<InventoryView />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
