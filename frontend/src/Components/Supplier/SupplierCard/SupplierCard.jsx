import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaTrash, FaBuilding, FaBox, FaMoneyBillWave } from 'react-icons/fa';
import Button from '../../UI/Button';
import './SupplierCard.css';

const SupplierCard = ({ supplier, onEdit, onDelete }) => {
    return (
        <div className="supplier-card">
            <div className="supplier-info">
                <div className="supplier-name">
                    <FaUser className="icon" />
                    <h3>{supplier.supplierName}</h3>
                </div>
                <div className="supplier-detail">
                    <FaBuilding className="icon" />
                    <span>{supplier.companyName}</span>
                </div>
                <div className="supplier-detail">
                    <FaEnvelope className="icon" />
                    <span>{supplier.email}</span>
                </div>
                <div className="supplier-detail">
                    <FaPhone className="icon" />
                    <span>{supplier.phoneNum}</span>
                </div>
                <div className="supplier-detail">
                    <FaBox className="icon" />
                    <span>{supplier.pName}</span>
                </div>
                <div className="supplier-detail">
                    <FaMoneyBillWave className="icon" />
                    <span>Unit Price: LKR {supplier.unitPrice}</span>
                </div>
                <div className="supplier-detail">
                    <FaBox className="icon" />
                    <span>Quantity: {supplier.quantity}</span>
                </div>
                <div className="supplier-detail">
                    <FaMoneyBillWave className="icon" />
                    <span>Total Amount: LKR {supplier.totAmount}</span>
                </div>
                <div className="supplier-detail">
                    <span className={`status ${supplier.paid ? 'paid' : 'unpaid'}`}>
                        {supplier.paid ? 'Payment Completed' : 'Payment Pending'}
                    </span>
                </div>
            </div>
            <div className="supplier-actions">
                <Button
                    variant="primary"
                    onClick={onEdit}
                    icon={FaEdit}
                >
                    Edit
                </Button>
                <Button
                    variant="danger"
                    onClick={onDelete}
                    icon={FaTrash}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default SupplierCard; 