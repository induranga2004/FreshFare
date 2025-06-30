import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox } from 'react-icons/fa';
import './Supplier.css';

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/suppliers');
            setSuppliers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch suppliers');
            toast.error('Failed to fetch suppliers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`/api/suppliers/${id}`);
                toast.success('Supplier deleted successfully');
                fetchSuppliers();
            } catch (err) {
                toast.error('Failed to delete supplier');
            }
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="supplier-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="supplier-container">
            <div className="supplier-header">
                <div>
                    <h1 className="supplier-title">
                        <FaBox style={{ marginRight: '10px' }} />
                        Inventory Management
                    </h1>
                    <p className="header-subtitle">Manage and track your product inventory</p>
                </div>
                <Link to="/suppliers/add" className="add-supplier-btn">
                    <FaPlus /> Add Product
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-bar">
                <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by code, name, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <table className="supplier-table">
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Code</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Purchase Price</th>
                        <th>Selling Price</th>
                        <th>Supplier Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSuppliers.map((supplier) => (
                        <tr key={supplier._id}>
                            <td>
                                <img 
                                    src={supplier.image || 'default-product.png'} 
                                    alt={supplier.productName}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </td>
                            <td>{supplier.productCode}</td>
                            <td>{supplier.productName}</td>
                            <td>{supplier.quantity}</td>
                            <td>{supplier.category}</td>
                            <td>Rs. {supplier.purchasePrice}</td>
                            <td>Rs. {supplier.sellingPrice}</td>
                            <td>{supplier.name}</td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/suppliers/edit/${supplier._id}`)}
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(supplier._id)}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredSuppliers.length === 0 && !loading && (
                <div className="no-results">
                    No products found matching your search.
                </div>
            )}
        </div>
    );
};

export default Supplier; 