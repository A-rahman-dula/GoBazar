import React, { useEffect, useState } from 'react';
import RelatedProducts from './RelatedProducts';
import ProductPagePlaceHolder from './ProductPagePlaceHolder';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { BASE_URL } from '../../api';
import { toast } from 'react-toastify';
import './ProductPage.css'; // Import the external CSS file

const ProductPage = ({ setNumCartItems }) => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const cart_code = localStorage.getItem('cart_code');

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    api
      .get(`product_details/${slug}`)
      .then((response) => {
        setProduct(response.data);
        setSimilarProducts(response.data.similar_products || []);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Failed to fetch product details');
      });
  }, [slug]);

  // Check if the product is in cart
  useEffect(() => {
    if (product && cart_code) {
      api
        .get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
        .then((response) => {
          setInCart(response.data.product_in_cart);
        })
        .catch((error) => {
          toast.error('Error checking cart status');
        });
    }
  }, [product, cart_code]);

  function add_item() {
    if (!product) {
      return;
    }

    const newItem = { cart_code: cart_code, product_id: product.id };

    api
      .post('add_item/', newItem)
      .then((response) => {
        setInCart(true);
        toast.success('Product added to cart');
        setNumCartItems((current) => current + 1);
      })
      .catch((error) => {
        toast.error('Error adding product to cart');
      });
  }

  if (loading) {
    return <ProductPagePlaceHolder />;
  }

  if (!product) {
    return <div className='text-center py-5'>Product not found</div>;
  }

  return (
    <div className='product-page'>
      <section className='product-section py-5'>
        <div className='container px-4 px-lg-5'>
          <div className='row align-items-center'>
            <div className='col-md-6'>
              <img
                className='product-image mb-4 rounded shadow-lg'
                src={
                  product.image
                    ? `${BASE_URL}${product.image}`
                    : 'https://dummyimage.com/600x400/000/fff'
                }
                alt={product.name || 'Product Image'}
              />
            </div>
            <div className='col-md-6'>
              <div className='small text-muted mb-2'>
                SKU: {product.sku || 'N/A'}
              </div>
              <h1 className='product-title display-4 font-weight-bold text-dark'>
                {product.name}
              </h1>
              <div className='product-price fs-4 text-primary mb-4'>
                <span>Rs {product.price}</span>
              </div>
              <p className='product-description text-muted mb-4'>
                {product.description || 'No description available'}
              </p>
              <div className='d-flex justify-content-start'>
                <button
                  className={`btn ${
                    inCart ? 'btn-secondary' : 'btn-primary'
                  } add-to-cart-btn shadow-sm`}
                  type='button'
                  onClick={add_item}
                  disabled={inCart}
                >
                  <i
                    className={`bi-cart-fill me-2 ${
                      inCart ? 'text-muted' : ''
                    }`}
                  ></i>
                  {inCart ? 'Product added to cart' : 'Add to cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='related-products py-5'>
        <div className='container'>
          <h2 className='text-center mb-4'>Similar Products</h2>
          <RelatedProducts products={similarProducts} />
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
