import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaUser, FaBuilding, FaEnvelope, FaPhone, FaBox, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import '../Components/Supplier/SupplierForm/SupplierForm.css';

const SuppliersDetails = ({ supplier, onDelete }) => {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await onDelete();
            } catch (error) {
                console.error('Error in handleDelete:', error);
            }
        }
    };

    return (
        <div className="supplier-form">
            <div className="supplier-form__container">
                <div className="supplier-form__header">
                    <div className="supplier-form__name">
                        <FaUser className="supplier-form__icon" />
                        <h3>{supplier.name}</h3>
                    </div>
                    <div className={`supplier-form__status ${supplier.paid ? 'supplier-form__status--paid' : 'supplier-form__status--unpaid'}`}>
                        {supplier.paid ? 'Paid' : 'Unpaid'}
                    </div>
                </div>

                <div className="supplier-form__grid">
                    <div className="supplier-form__item">
                        <FaBuilding className="supplier-form__icon" />
                        <div className="supplier-form__content">
                            <label className="supplier-form__label">Company</label>
                            <span className="supplier-form__value">{supplier.companyName}</span>
                        </div>
                    </div>

                    <div className="supplier-form__item">
                        <FaEnvelope className="supplier-form__icon" />
                        <div className="supplier-form__content">
                            <label className="supplier-form__label">Email</label>
                            <span className="supplier-form__value">{supplier.email}</span>
                        </div>
                    </div>

                    <div className="supplier-form__item">
                        <FaPhone className="supplier-form__icon" />
                        <div className="supplier-form__content">
                            <label className="supplier-form__label">Phone</label>
                            <span className="supplier-form__value">{supplier.phoneNumber}</span>
                        </div>
                    </div>

                    <div className="supplier-form__item">
                        <FaBox className="supplier-form__icon" />
                        <div className="supplier-form__content">
                            <label className="supplier-form__label">Product</label>
                            <span className="supplier-form__value">{supplier.productName}</span>
                        </div>
                    </div>

                    <div className="supplier-form__item">
                        <FaDollarSign className="supplier-form__icon" />
                        <div className="supplier-form__content">
                            <label className="supplier-form__label">Unit Price</label>
                            <span className="supplier-form__value">LKR {supplier.unitPrice}</span>
                        </div>
                    </div>

                    <div className="supplier-form__item">
                        <FaShoppingCart className="supplier-form__icon" />
                        <div className="supplier-form__content">
                            <label className="supplier-form__label">Quantity</label>
                            <span className="supplier-form__value">{supplier.quantity}</span>
                        </div>
                    </div>
                </div>

                <div className="supplier-form__actions">
                    <Link to={`/editSupplier/${supplier._id}`} className="supplier-form__button supplier-form__button--edit">
                        <FaEdit className="supplier-form__button-icon" />
                        Edit Supplier
                    </Link>
                    <button onClick={handleDelete} className="supplier-form__button supplier-form__button--delete">
                        <FaTrash className="supplier-form__button-icon" />
                        Delete Supplier
                    </button>
                </div>
            </div>
        </div>
    );
};
    
export default SuppliersDetails;