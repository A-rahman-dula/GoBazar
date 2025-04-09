import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Banner1 from '../images/Banner1.png';
import Banner2 from '../images/Banner2.jpg';
import Banner3 from '../images/Banner3.jpg';
import Banner4 from '../images/Banner4.jpg';
import './Header.css'; // Import the CSS file

const Header = () => {
  const [index, setIndex] = useState(0);

  // Auto-change slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 10000); // 10 seconds interval

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <header>
      {/* Carousel Slider */}
      <div
        className='slider-container'
        style={{ width: '100%', maxWidth: '100%' }}
      >
        <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
          <Carousel.Item>
            <img
              className='d-block w-100'
              src={Banner1}
              alt='First slide'
              style={{ objectFit: 'cover', height: 'auto', maxHeight: '600px' }}
            />
            <Carousel.Caption>
              <h3>Welcome to Our Store</h3>
              <p>Shop the best products for unbeatable prices.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className='d-block w-100'
              src={Banner2}
              alt='Second slide'
              style={{ objectFit: 'cover', height: 'auto', maxHeight: '600px' }}
            />
            <Carousel.Caption>
              <h3>Exclusive Discounts</h3>
              <p>Save big on our limited-time offers.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className='d-block w-100'
              src={Banner3}
              alt='Third slide'
              style={{ objectFit: 'cover', height: 'auto', maxHeight: '600px' }}
            />
            <Carousel.Caption>
              <h3>New Arrivals</h3>
              <p>Explore our newest collection of products.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className='d-block w-100'
              src={Banner4}
              alt='Fourth slide'
              style={{ objectFit: 'cover', height: 'auto', maxHeight: '600px' }}
            />
            <Carousel.Caption>
              <h3>Free Delivery</h3>
              <p>Enjoy free delivery on all orders in island</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </header>
  );
};

export default Header;
