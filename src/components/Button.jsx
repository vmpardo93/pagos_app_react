import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled, ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
