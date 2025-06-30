import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SupplierForm.css';

const SupplierForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        paymentStatus: 'pending',
        unitPrice: '',
        quantity: '',
        productName: ''
    });

    useEffect(() => {
        if (id) {
            fetchSupplierData();
        }
    }, [id]);

    const fetchSupplierData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/suppliers/${id}`);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to fetch supplier data');
            toast.error('Failed to fetch supplier data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
        const unitPrice = parseFloat(formData.unitPrice) || 0;
        const quantity = parseFloat(formData.quantity) || 0;
        return (unitPrice * quantity).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            if (id) {
                await axios.put(`/api/suppliers/${id}`, formData);
                setSuccess('Supplier updated successfully');
                toast.success('Supplier updated successfully');
            } else {
                await axios.post('/api/suppliers', formData);
                setSuccess('Supplier created successfully');
                toast.success('Supplier created successfully');
            }

            setTimeout(() => {
                navigate('/suppliers');
            }, 1500);
        } catch (err) {
            setError('Failed to save supplier data');
            toast.error('Failed to save supplier data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="supplier-form">
            <div className="supplier-form__container">
                <h1 className="supplier-form__header">
                    {id ? 'Edit Supplier' : 'Add New Supplier'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="supplier-form__section">
                        <h2 className="supplier-form__section-title">Basic Information</h2>
                        <div className="supplier-form__group">
                            <label className="supplier-form__label" htmlFor="name">Name</label>
                            <input
                                className="supplier-form__input"
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter supplier name"
                                required
                            />
                        </div>

                        <div className="supplier-form__group">
                            <label className="supplier-form__label" htmlFor="companyName">Company Name</label>
                            <input
                                className="supplier-form__input"
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Enter company name"
                                required
                            />
                        </div>

                        <div className="supplier-form__group">
                            <label className="supplier-form__label" htmlFor="phoneNumber">Phone Number</label>
                            <input
                                className="supplier-form__input"
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div className="supplier-form__group">
                            <label className="supplier-form__label" htmlFor="email">Email</label>
                            <input
                                className="supplier-form__input"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                    </div>

                    <div className="supplier-form__section">
                        <h2 className="supplier-form__section-title">Product Details</h2>
                        <div className="supplier-form__group">
                            <label className="supplier-form__label" htmlFor="productName">Product Name</label>
                            <input
                                className="supplier-form__input"
                                type="text"
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="supplier-form__row">
                            <div className="supplier-form__group">
                                <label className="supplier-form__label" htmlFor="unitPrice">Unit Price ($)</label>
                                <input
                                    className="supplier-form__input"
                                    type="number"
                                    id="unitPrice"
                                    name="unitPrice"
                                    value={formData.unitPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className="supplier-form__group">
                                <label className="supplier-form__label" htmlFor="quantity">Quantity</label>
                                <input
                                    className="supplier-form__input"
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    min="1"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="supplier-form__total">
                            <span className="supplier-form__total-label">Total Amount:</span>
                            <span className="supplier-form__total-value">${calculateTotal()}</span>
                        </div>
                    </div>

                    <div className="supplier-form__section">
                        <h2 className="supplier-form__section-title">Payment Information</h2>
                        <div className="supplier-form__group">
                            <label className="supplier-form__label" htmlFor="paymentStatus">Payment Status</label>
                            <select
                                className="supplier-form__select"
                                id="paymentStatus"
                                name="paymentStatus"
                                value={formData.paymentStatus}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="supplier-form__error">{error}</div>}
                    {success && <div className="supplier-form__success">{success}</div>}

                    <button 
                        type="submit" 
                        className={`supplier-form__submit ${loading ? 'supplier-form__submit--loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (id ? 'Update Supplier' : 'Add Supplier')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupplierForm; 