import React from 'react';
import styles from './Keypad.module.css';

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['Del', '0', 'Enter'],
];

const Keypad = ({ onKeyPress }) => (
  <div className={styles.keypad}>
    {keys.map((row, i) => (
      <div key={i} className={styles.row}>
        {row.map((key) => (
          <button
            key={key}
            className={styles.key}
            onClick={() => onKeyPress(key)}
            type="button"
          >
            {key}
          </button>
        ))}
      </div>
    ))}
  </div>
);

export default Keypad; 