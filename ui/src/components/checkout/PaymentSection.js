import React from 'react';
import styles from './PaymentSection.module.css';
import { Link } from 'react-router-dom';

const PaymentSection = ({ Total, tax }) => {
  // Debugging before rendering
  console.log('Total before linking:', Total);
  console.log('Tax before linking:', tax);

  // Ensure values are valid
  const formattedTotal = Total || 0;
  const formattedTax = tax || 0;

  return (
    <div className='col-md-4'>
      <div className={`card ${styles.card}`}>
        <div
          className='card-header'
          style={{ backgroundColor: '#6050DC', color: 'white' }}
        >
          <h5>Payment Options</h5>
        </div>
        <div className='card-body'>
          {/* PayPal Button */}
          <button
            className={`btn btn-primary w-100 mb-3 ${styles.paypalButton}`}
            id='paypalButton'
          >
            <i className='bi bi-paypal'></i> Pay with PayPal
          </button>

          {/* Flutterwave Button - Pass Total & Tax using URL Query */}
          <Link to={`/order`}>
            <button className='btn btn-warning w-100' id='flutterwaveButton'>
              <i className='bi bi-credit-card'></i> Pay here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
