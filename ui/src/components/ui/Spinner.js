import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const override = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'purple', // Customize color as needed
};

const Spinner = ({ loading, color = 'purple' }) => {
  return (
    <div>
      <ClipLoader
        color={color} // Default color is purple, can be customized via props
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
};

export default Spinner;
