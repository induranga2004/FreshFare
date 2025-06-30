import React, { useState } from 'react'
import axios from "axios"
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaCalculator, FaExchangeAlt, FaReceipt, FaUser } from "react-icons/fa";
import "./cash.css"

const Cash = () => {
  const navigate = useNavigate();
  const URL = "http://localhost:5000/transaction/add"
  const updateURL = "http://localhost:5000/product/update"
  const location = useLocation();
  const { total, items, emails } = location.state || { total: 0, items: [], emails: "" };
  const [amount, setamount] = useState(0);
  const balance = parseFloat(amount || 0) - parseFloat(total || 0);

  const handlesubmit = async(e) => {
    e.preventDefault();
    if(isNaN(amount) || !amount || amount < 0) {
      toast.error('Please enter a valid payment amount', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
      return
    }
    if(amount < total) {
      toast.error('Insufficient payment. Please enter a valid amount', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
      return
    }
    const token = localStorage.getItem("token");
    await axios.post(URL, {
      TotalPrice: total,
      Customer_payment: amount,
      Balance: `${balance}`,
      email: emails
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(() => {
      const updateproducts = async() => {
        await axios.post(updateURL, {
          items: items
        }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }).then(() => {
          navigate("/payment/successfull");
        })
      }
      updateproducts();
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== '') {
      setamount(parseFloat(value));
    } else {
      setamount(0);
    }
  };

  return (
    <div className="cash-payment-container">
      <div className="cash-payment-card">
        <div className="payment-header">
          <div className="header-content">
            <FaMoneyBillWave className="payment-icon" />
            <h1>Cash Payment</h1>
          </div>
          <div className="customer-info">
            <FaUser className="customer-icon" />
            <span>{emails}</span>
          </div>
        </div>

        <div className="receipt-preview">
          <div className="receipt-header">
            <FaReceipt className="receipt-icon" />
            <h2>Payment Receipt</h2>
          </div>
          <div className="receipt-items">
            {items.map((item, index) => (
              <div key={index} className="receipt-item">
                <span className="item-name">{item.productname}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">Rs. {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <form className="payment-form" onSubmit={handlesubmit}>
          <div className="payment-details">
            <div className="payment-row total-row">
              <div className="payment-label">
                <FaCalculator className="row-icon" />
                <span>Total Amount</span>
              </div>
              <div className="payment-value total-amount">Rs. {total.toFixed(2)}</div>
            </div>

            <div className="payment-row">
              <div className="payment-label">
                <FaMoneyBillWave className="row-icon" />
                <span>Customer Payment</span>
              </div>
              <input 
                type="number" 
                className="payment-input" 
                onChange={handleAmountChange}
                value={amount || ''}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="payment-row balance-row">
              <div className="payment-label">
                <FaExchangeAlt className="row-icon" />
                <span>Balance</span>
              </div>
              <div className="payment-value balance">
                Rs. {isNaN(balance) ? '0.00' : balance.toFixed(2)}
              </div>
            </div>
          </div>

          <button className="submit-payment" type="submit">
            Process Payment
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Cash
