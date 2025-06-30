import React from 'react';
import './EmployeeModal.css';

const EmployeeModal = ({ employee, onClose, onGeneratePDF, salesData, cashierSalesData }) => {
  if (!employee) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Employee Details</h2>
        <div className="employee-modal-details">
          <div className="detail-item">
            <strong>First Name:</strong>
            <span>{employee.firstName}</span>
          </div>
          <div className="detail-item">
            <strong>Last Name:</strong>
            <span>{employee.lastName}</span>
          </div>
          <div className="detail-item">
            <strong>Gender:</strong>
            <span>{employee.gender}</span>
          </div>
          <div className="detail-item">
            <strong>Role:</strong>
            <span>{employee.role}</span>
          </div>
          <div className="detail-item">
            <strong>Date of Birth:</strong>
            <span>{employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}</span>
          </div>
          <div className="detail-item">
            <strong>Age:</strong>
            <span>{employee.age}</span>
          </div>
          <div className="detail-item">
            <strong>Email:</strong>
            <span>{employee.email}</span>
          </div>
          <div className="detail-item">
            <strong>Mobile Number:</strong>
            <span>{employee.mobile}</span>
          </div>
          <div className="detail-item full-width">
            <strong>Address:</strong>
            <span>{employee.address}</span>
          </div>
        </div>
        
        {/* Cashier-specific sales data */}
        {cashierSalesData && (
          <>
            <h3 className="sales-summary-title cashier-sales-title">Cashier Sales Performance</h3>
            <div className="sales-summary-container cashier-summary">
              <div className="sales-data-item">
                <strong>Total Transactions:</strong>
                <span>{cashierSalesData.transactions}</span>
              </div>
              <div className="sales-data-item">
                <strong>Total Sales Amount:</strong>
                <span>Rs. {cashierSalesData.totalAmount.toFixed(2)}</span>
              </div>
              <div className="sales-data-item">
                <strong>Cash Transactions:</strong>
                <span>{cashierSalesData.cashCount}</span>
              </div>
              <div className="sales-data-item">
                <strong>Card Transactions:</strong>
                <span>{cashierSalesData.cardCount}</span>
              </div>
              <div className="sales-data-item">
                <strong>Cash Revenue:</strong>
                <span>Rs. {cashierSalesData.cashAmount.toFixed(2)}</span>
              </div>
              <div className="sales-data-item">
                <strong>Card Revenue:</strong>
                <span>Rs. {cashierSalesData.cardAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
        
        {/* Overall sales summary */}
        {salesData && (
          <>
            <h3 className="sales-summary-title">Daily Sales Summary</h3>
            <div className="sales-summary-container">
              <div className="sales-data-item">
                <strong>Total Transactions:</strong>
                <span>{salesData.totalTransactions}</span>
              </div>
              <div className="sales-data-item">
                <strong>Total Revenue:</strong>
                <span>Rs. {salesData.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="sales-data-item">
                <strong>Cash Transactions:</strong>
                <span>{salesData.paymentMethods.cash.count}</span>
              </div>
              <div className="sales-data-item">
                <strong>Card Transactions:</strong>
                <span>{salesData.paymentMethods.card.count}</span>
              </div>
              <div className="sales-data-item">
                <strong>Cash Revenue:</strong>
                <span>Rs. {salesData.paymentMethods.cash.amount.toFixed(2)}</span>
              </div>
              <div className="sales-data-item">
                <strong>Card Revenue:</strong>
                <span>Rs. {salesData.paymentMethods.card.amount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
        
        <div className="modal-actions">
          <button className="modal-pdf-btn" onClick={() => onGeneratePDF(employee)}>Generate Individual Report</button>
          <button className="modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal; 