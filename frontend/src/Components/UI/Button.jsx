import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon: Icon,
  ...props
}) => {
  return (
    <button
      className={`ui-btn ui-btn--${variant}${fullWidth ? ' ui-btn--full' : ''}`}
      {...props}
    >
      {Icon && <span className="ui-btn__icon"><Icon /></span>}
      {children}
    </button>
  );
};

export default Button; 