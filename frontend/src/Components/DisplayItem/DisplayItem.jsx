import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../UI/Button';
import Input from '../UI/Input';
import "./DisplayItem.css";
import { toast } from 'react-toastify';
import { FaBox, FaSearch, FaExclamationTriangle, FaEdit, FaTrash, FaClipboard } from 'react-icons/fa';

function DisplayItem() {
    const [product, setProduct] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(50);
    
    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setIsLoading(true);
            setError('');
            const result = await axios.get("http://localhost:5000/api/products/getAllProducts")
            setProduct(result.data.product);
        } catch (error) {
            setError("Error loading inventory." +error);
        } finally {
            setIsLoading(false);
        }
    }

    const update = (P_Code) => {
        window.location.href = `/updateProduct/${P_Code}`;
    }

    const deleteItem = async (P_Code) => {
        const confirmationMessage = window.confirm(
            "Are you sure you want to delete this item?"
        )
        if (confirmationMessage) {
            try {
                await axios.delete(`http://localhost:5000/api/products/deleteProduct/${P_Code}`)
                loadInventory();
                toast.success("Product deleted successfully");
            } catch (error) {
                toast.error("Error" + error.message);
            }
        }
    }

    const filteredProducts = product.filter((product) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            product.P_Code.toLowerCase().includes(searchLower) ||
            product.P_Name.toLowerCase().includes(searchLower) ||
            product.P_category.toLowerCase().includes(searchLower)
        );
    });

    return (
        <main className="display-item-container">
            <div className="content-wrapper">
                <header className="display-item-header">
                    <div className="header-content">
                        <div className="title-icon">
                            <FaBox size={40} color="#667eea" />
                        </div>
                        <h1 className="display-item-title">Inventory Management</h1>
                        <p className="subtitle">Manage and track your product inventory</p>
                    </div>
                    <div className="search-container">
                        <div className="input-container">
                            <label className="search-label">Search Products</label>
                            <div className="search-wrapper">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by code, name, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-container">
                            <label className="threshold-label">Low Stock Alert</label>
                            <div className="threshold-wrapper">
                                <FaExclamationTriangle className="threshold-icon" />
                                <input
                                    type="number"
                                    min={1}
                                    value={lowStockThreshold}
                                    onChange={e => setLowStockThreshold(Number(e.target.value))}
                                    placeholder="Enter threshold value"
                                />
                            </div>
                        </div>
                        <div className="input-container add-product-container">
                            <Button 
                                variant="primary"
                                className="add-product-button"
                                onClick={() => window.location.href = '/additem'}
                            >
                                <FaBox className="button-icon" /> Add Product
                            </Button>
                            <Button 
                                variant="secondary"
                                className="report-button"
                                onClick={() => window.location.href = '/inventory-report'}
                            >
                                <FaClipboard className="button-icon" /> Inventory Report
                            </Button>
                        </div>
                    </div>
                </header>

                <section className="table-section">
                    <div className="table-header">
                        <h2 className="table-title">Product List</h2>
                        <div className="table-actions">
                            <span className="total-items">
                                <FaBox className="total-icon" />
                                {filteredProducts.length} items
                            </span>
                        </div>
                    </div>
                    <div className="table-container">
                        {error && <div className="display-item-error">{error}</div>}
                        {isLoading ? (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>Loading inventory...</p>
                            </div>
                        ) : (
                            <table className="display-item-table">
                                <thead>
                                    <tr>
                                        <th>Product image</th>
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
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <tr key={product.P_Code}>
                                                <td>
                                                    <img className="productimage" src={product.image}></img>
                                                </td>
                                                <td>
                                                    <span className="product-code" title={product.P_Code}>
                                                        {product.P_Code}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="name" title={product.P_Name}>
                                                        {product.P_Name}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`quantity ${product.Quantity < lowStockThreshold ? 'low-stock' : ''}`}>
                                                        {product.Quantity < lowStockThreshold && <FaExclamationTriangle className="warning-icon" />}
                                                        {product.Quantity}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="category-tag" title={product.P_category}>
                                                        {product.P_category}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="price" title={`Rs. ${product.Purchase_Price}`}>
                                                        Rs. {product.Purchase_Price}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="price" title={`Rs. ${product.Selling_Price}`}>
                                                        Rs. {product.Selling_Price}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="name" title={product.Suplier_Name}>
                                                        {product.Suplier_Name}
                                                    </span>
                                                </td>
                                                <td className="action-buttons">
                                                    <Button 
                                                        variant="primary"
                                                        className="primary"
                                                        onClick={() => update(product.P_Code)}
                                                    >
                                                        <FaEdit className="button-icon" />
                                                        Update
                                                    </Button>
                                                    <Button 
                                                        variant="danger"
                                                        className="danger"
                                                        onClick={() => deleteItem(product.P_Code)}
                                                    >
                                                        <FaTrash className="button-icon" />
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="no-results">
                                            <td colSpan="8">
                                                <div className="empty-state">
                                                    <svg className="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <p>No products found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default DisplayItem
