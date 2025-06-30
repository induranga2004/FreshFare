import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaChartBar,
  FaUsers,
  FaTruck,
  FaClipboardList
} from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Admin Panel</h2>
        <div className={styles.divider}></div>
      </div>
      
      <nav>
        <Link 
          to="/owner-dashboard" 
          className={`${styles.navLink} ${location.pathname === '/owner-dashboard' ? styles.navLinkActive : ''}`}
        >
          <FaChartBar />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/displayitem" 
          className={`${styles.navLink} ${location.pathname === '/displayitem' ? styles.navLinkActive : ''}`}
        >
          <FaClipboardList />
          <span>Inventory Management</span>
        </Link>
        
        <Link 
          to="/emplist" 
          className={`${styles.navLink} ${location.pathname === '/emplist' ? styles.navLinkActive : ''}`}
        >
          <FaUsers />
          <span>Employee Management</span>
        </Link>
        
        <Link 
          to="/supplier" 
          className={`${styles.navLink} ${location.pathname === '/supplier' ? styles.navLinkActive : ''}`}
        >
          <FaTruck />
          <span>Supplier Management</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar; 