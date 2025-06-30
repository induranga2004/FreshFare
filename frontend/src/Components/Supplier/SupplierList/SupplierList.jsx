import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaSpinner, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import SupplierCard from '../SupplierCard/SupplierCard';
import './SupplierList.css';

const SupplierList = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/api/suppliers/');
            setSuppliers(response.data);
        } catch (err) {
            setError('Failed to fetch suppliers. Please try again.');
            toast.error('Error loading suppliers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (supplierId) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`http://localhost:5000/api/suppliers/${supplierId}/`);
                toast.success('Supplier deleted successfully');
                fetchSuppliers();
            } catch (err) {
                toast.error('Failed to delete supplier');
            }
        }
    };

    const handleEdit = (supplier) => {
        navigate(`/editSupplier/${supplier._id}`);
    };

    const handleGenerateReport = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/suppliers/generate-report/', {
                filter: searchQuery
            }, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            window.open(url, '_blank');
        } catch (err) {
            toast.error('Failed to generate report');
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplierName && supplier.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="supplier-list-container">
            <div className="supplier-list-header">
                <div className="header-content">
                    <h1>Supplier Management</h1>
                    <p>Manage your suppliers and their information</p>
                </div>
                <div className="header-actions">
                    <Input
                        type="text"
                        placeholder="Search suppliers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={FaSearch}
                        className="search-input"
                    />
                    <Button
                        variant="primary"
                        onClick={() => navigate('/supplierForm')}
                        icon={FaPlus}
                    >
                        Add Supplier
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleGenerateReport}
                        icon={FaFilePdf}
                    >
                        Generate Report
                    </Button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <p>Loading suppliers...</p>
                </div>
            ) : (
                <div className="supplier-grid">
                    {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map(supplier => (
                            <SupplierCard
                                key={supplier._id}
                                supplier={supplier}
                                onEdit={() => handleEdit(supplier)}
                                onDelete={() => handleDelete(supplier._id)}
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No suppliers found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SupplierList; 