import React from 'react';

const Error = ({ error }) => {
  return (
    <div
      className='alert alert-danger my-5 text-center d-flex justify-content-center align-items-center'
      role='alert'
    >
      {error}
    </div>
  );
};

export default Error;
