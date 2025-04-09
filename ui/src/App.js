import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './components/home/HomePage';
import NotFoundPage from './components/ui/NotFoundPage';
import ProductPage from './components/product/ProductPage';
import api from './api';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import LoginPage from './components/user/LoginPage';
import ProtectedRoute from './components/ui/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminPanel from './components/admin/AdminPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './components/user/RegisterPage';
import LogoutPage from './components/user/LogoutPage';
import ProtectedAdminRoute from './components/ui/ProtectedAdminRoute';
import OrderPage from './components/order/OrderPage';
import ContactUsForm from './components/ui/ContactUsForm';

const App = () => {
  const [numCartItems, setNumCartItems] = useState(0);
  const cart_code = localStorage.getItem('cart_code');

  useEffect(function () {
    if (cart_code) {
      api
        .get(`get_cart_stat?cart_code=${cart_code}`)
        .then((response) => {
          console.log(response.data);
          setNumCartItems(response.data.num_of_items);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout numCartItems={numCartItems} />}>
            <Route index element={<HomePage />} />
            <Route
              path='products/:slug'
              element={<ProductPage setNumCartItems={setNumCartItems} />}
            />
            <Route
              path='cart'
              element={<CartPage setNumCartItems={setNumCartItems} />}
            />
            <Route
              path='checkout'
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='admin/*'
              element={
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              }
            />
            <Route path='login' element={<LoginPage />} />
            <Route path='contactus' element={<ContactUsForm />} />
            <Route path='logout' element={<LogoutPage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route path='order' element={<OrderPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
