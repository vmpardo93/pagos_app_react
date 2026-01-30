import React from 'react';

const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick} aria-hidden="true" />;
};

export default Backdrop;
