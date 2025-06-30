import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../Chatbot/Chatbot';
import styles from './Layout.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Layout = ({ children }) => {
  const [cashier, setCashier] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfoString = localStorage.getItem('userInfo');
      console.log('Raw userInfo from localStorage:', userInfoString);
      
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        console.log("Parsed userInfo:", userInfo);
        
        if (userInfo && userInfo.name && userInfo.role) {
          // Get the ID from the correct property
          const userId = userInfo._id || userInfo.id;
          console.log("Setting cashier with ID:", userId);
          
          setCashier({
            id: userId,
            name: userInfo.name,
            role: userInfo.role
          });
          
          // Record login activity only for cashiers
          if (userInfo.role === 'Cashier' && userId) {
            console.log('Recording login activity for cashier:', userId);
            recordLoginActivity(userId);
          } else {
            console.log('Not recording login - not a cashier or no ID');
          }
        } else {
          console.log("Invalid or incomplete user info");
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      navigate('/');
    }
  }, [navigate]);

  const recordLoginActivity = async (cashierId) => {
    if (!cashierId) {
      console.error('No cashier ID provided');
      return;
    }

    try {
      console.log('Attempting to record login activity with cashierId:', cashierId);
      const response = await axios.post('http://localhost:5000/api/activity/login', {
        cashierId: cashierId
      });
      console.log('Login activity response:', response.data);
      setActivityId(response.data._id);
      toast.success('Login activity recorded');
    } catch (error) {
      console.error('Error recording login activity:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Failed to record login: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      if (cashier?.role === 'Cashier' && activityId) {
        console.log('Recording logout for activity:', activityId);
        // Record logout activity
        const response = await axios.put(`http://localhost:5000/api/activity/logout/${activityId}`);
        console.log('Logout activity response:', response.data);
      }
    } catch (error) {
      console.error('Error recording logout activity:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Error recording logout time');
    } finally {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>FreshFare POS</div>
        <div className={styles.navLinks}>
          <Link to="/cashierdashboard" className={styles.navLink}>Dashboard</Link>
          <Link to="/LoyalCustomers" className={styles.navLink}>Loyal Customers</Link>
          <Link to="/Register" className={styles.navLink}>Register Customer</Link>
          {cashier?.role === 'Manager' && (
            <>
              <Link to="/loyal-customers-report" className={styles.navLink}>Loyal customer Reports</Link>
              <Link to="/cashier/report" className={styles.navLink}>sales Reports</Link>
            </>
          )}
        </div>
        <div className={styles.userInfo}>
          {cashier && cashier.name && (
            <>
              <span className={styles.cashierName}>
                Welcome, {cashier.name} ({cashier.role})
              </span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <main className={styles.mainContent}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© 2024 FreshFare POS</p>
      </footer>
      <Chatbot />
    </div>
  );
}

export default Layout; 