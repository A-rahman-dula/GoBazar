import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeCard.module.css';
import { BASE_URL } from '../../api'; // Import BASE_URL

const HomeCard = ({ product }) => {
  return (
    <div className={`col-md-3 ${styles.col}`}>
      <Link to={`/products/${product.slug}`} className={styles.link}>
        <div className={`${styles.card} shadow-lg rounded-lg`}>
          <div className={styles.cardImgWrapper}>
            <img
              src={`${BASE_URL}${product.image}`}
              className={`${styles.cardImgTop} rounded-top`}
              alt={`${product.name} Image`}
            />
          </div>
          <div className={`${styles.cardBody} p-3`}>
            <h5 className={`${styles.cardTitle} mb-2`}>{product.name}</h5>
            <h6 className={`${styles.cardPrice} mb-3`}>Rs {product.price}</h6>
            <div className={styles.cardFooter}>
              <button className='btn btn-primary btn-sm rounded-pill'>
                <i className='bi bi-cart-plus me-2'></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeCard;
