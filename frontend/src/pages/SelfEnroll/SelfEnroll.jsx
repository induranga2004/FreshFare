import React, { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import styles from './SelfEnroll.module.css';
import Keypad from './Keypad';
import SelfEnrollLayout from './SelfEnrollLayout';
import { useSocket } from '../../context/SocketContext';

const SelfEnroll = () => {
  const [number, setNumber] = useState('07');
  const [loading, setLoading] = useState(false);
  const { socketService } = useSocket();
  const cashierId = 'cashier-1'; // This should come from your auth system

  const checkLoyalCustomer = async (mobileNumber) => {
    try {
      const response = await axios.get('http://localhost:5000/LCs');
      const loyalCustomers = response.data.LCs;
      return loyalCustomers.some(customer => customer.mobile === mobileNumber);
    } catch (error) {
      console.error('Error checking loyal customer:', error);
      return false;
    }
  };

  const handleKeypad = async (value) => {
    if (value === 'Del') {
      setNumber((prev) => prev.length > 2 ? prev.slice(0, -1) : prev);
    } else if (value === 'Enter') {
      if (number.length === 10) {
        setLoading(true);
        try {
          const isLoyalCustomer = await checkLoyalCustomer(number);
          if (isLoyalCustomer) {
            // Emit customer number to cashier's room
            if (socketService) {
              console.log('Emitting customer number:', number);
              socketService.emitCustomerNumber(cashierId, number);
            } else {
              console.error('Socket service not available');
            }
            
            toast.success(`Welcome back! You are a loyal customer.`, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            toast.error('This number is not registered as a loyal customer. Please register first.', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        } catch (error) {
          toast.error('Error checking customer status. Please try again.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } finally {
          setLoading(false);
        }
      } else {
        toast.error('Please enter a complete 10-digit number', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else if (number.length < 10) {
      setNumber((prev) => prev + value);
    }
  };

  return (
    <SelfEnrollLayout>
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <h2 className={styles.title}>Add Registered Number</h2>
          <div className={styles.display}>{number}</div>
          <div className={styles.numberInfo}>
            {number.length}/10 digits
          </div>
          {loading && (
            <div className={styles.loading}>
              Checking customer status...
            </div>
          )}
        </div>
        <div className={styles.rightPanel}>
          <Keypad onKeyPress={handleKeypad} />
        </div>
      </div>
    </SelfEnrollLayout>
  );
};

export default SelfEnroll; 