import React, { useEffect } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft, FaReceipt } from "react-icons/fa";
import "./Sucessfullpayment.css"

const SuccessfullPayment = () => {
  const toasting = () => {
    toast.success('Payment successful', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  useEffect(() => {
    toasting();
  }, [])

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        
        <div className="success-content">
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Thank you for your purchase! Your payment has been successfully processed.
          </p>
          <div className="success-details">
            <div className="detail-item">
              <FaReceipt className="detail-icon" />
              <span>A receipt has been sent to your email</span>
            </div>
          </div>
        </div>

        <Link to="/cashierdashboard" className="back-button">
          <FaArrowLeft />
          <span>Return to Dashboard</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  )
}

export default SuccessfullPayment
