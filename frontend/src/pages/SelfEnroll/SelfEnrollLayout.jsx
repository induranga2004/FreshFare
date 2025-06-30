import React from 'react';
import styles from './SelfEnrollLayout.module.css';

const SelfEnrollLayout = ({ children }) => (
  <div className={styles.wrapper}>
    <header className={styles.header}>
      <h1>FreshFare Self Enroll</h1>
    </header>
    <main className={styles.main}>{children}</main>
    <footer className={styles.footer}>
      <p>© 2024 FreshFare POS</p>
    </footer>
  </div>
);

export default SelfEnrollLayout; 