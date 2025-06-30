import React from 'react';
import './Input.css';

const Input = ({
  label,
  error,
  icon: Icon,
  fullWidth = false,
  ...props
}) => (
  <div className={`ui-input-group${fullWidth ? ' ui-input-group--full' : ''}${error ? ' ui-input-group--error' : ''}`}>
    {label && <label className="ui-input-label">{label}</label>}
    <div className="ui-input-wrapper">
      {Icon && <span className="ui-input-icon"><Icon /></span>}
      <input className="ui-input" {...props} />
    </div>
    {error && <span className="ui-input-error">{error}</span>}
  </div>
);

export default Input; 