import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from './UI/Button';
import Input from './UI/Input';
function InventoryReport() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError('');
            const result = await axios.get("http://localhost:5000/api/products/getAllProducts");
            setProducts(result.data.product);
        } catch (error) {
            setError('Error loading products. ' + error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            product.P_Code.toLowerCase().includes(searchLower) ||
            product.P_Name.toLowerCase().includes(searchLower) ||
            product.P_category.toLowerCase().includes(searchLower)
        );
    });

    // Summary calculations
    const totalProducts = filteredProducts.length;
    const totalProfit = filteredProducts.reduce((sum, item) => sum + (item.Selling_Price - item.Purchase_Price) * item.Quantity, 0);
    const totalExpenses = filteredProducts.reduce((sum, item) => sum + item.Purchase_Price * item.Quantity, 0);
    const avgProfit = totalProducts > 0 ? totalProfit / totalProducts : 0;

    const generateReport = () => {
        const doc = new jsPDF();
        const dateStr = new Date().toLocaleDateString();
        doc.setFontSize(18);
        doc.text('FreshFare - Inventory Report', 14, 18);
        doc.setFontSize(11);
        doc.text(`Generated on: ${dateStr}`, 14, 28);
        doc.setFontSize(13);
        doc.text('Summary', 14, 38);
        doc.setFontSize(11);
        doc.text(`Total Products: ${totalProducts}`, 14, 46);
        doc.text(`Total Profit: Rs. ${totalProfit.toFixed(2)}`, 80, 46);
        doc.text(`Total Expenses: Rs. ${totalExpenses.toFixed(2)}`, 14, 54);
        doc.text(`Avg Profit/Product: Rs. ${avgProfit.toFixed(2)}`, 80, 54);
        doc.text(`Filter applied: "${searchQuery || 'None'}"`, 14, 62);
        // Table
        autoTable(doc, {
            startY: 70,
            head: [[
                'Product Code', 'Name', 'Quantity', 'Category', 'Purchase Price', 'Selling Price', 'Supplier Name', 'Profit', 'Expenses'
            ]],
            body: filteredProducts.map(item => [
                item.P_Code,
                item.P_Name,
                item.Quantity,
                item.P_category,
                item.Purchase_Price,
                item.Selling_Price,
                item.Suplier_Name,
                ((item.Selling_Price - item.Purchase_Price) * item.Quantity).toFixed(2),
                (item.Purchase_Price * item.Quantity).toFixed(2)
            ]),
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 2 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 14, right: 14 },
            tableWidth: 'auto',
        });
        doc.save('inventory_report.pdf');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: '2rem 0' }}>
            <div style={{ maxWidth: 1200, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem' }}>
                <h1 style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: 0, color: '#222', textAlign: 'center', letterSpacing: 0.5 }}>Inventory Report</h1>
                <div style={{ textAlign: 'center', color: '#666', marginTop: 8, marginBottom: 16, fontSize: 16 }}>Generated on: {new Date().toLocaleDateString()}</div>
                <div style={{ width: 120, height: 4, background: '#2980b9', margin: '0 auto 32px auto', borderRadius: 2 }}></div>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ minWidth: 200, background: '#f7fbff', border: '1px solid #e3eaf3', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(41,128,185,0.04)' }}>
                        <div style={{ fontWeight: 600, color: '#2980b9', fontSize: 13, marginBottom: 6 }}>TOTAL PRODUCTS</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{totalProducts}</div>
                    </div>
                    <div style={{ minWidth: 200, background: '#f8fcf7', border: '1px solid #e3f3e6', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(22,163,74,0.04)' }}>
                        <div style={{ fontWeight: 600, color: '#16a34a', fontSize: 13, marginBottom: 6 }}>TOTAL PROFIT</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>Rs. {totalProfit.toFixed(2)}</div>
                    </div>
                    <div style={{ minWidth: 200, background: '#fff9f6', border: '1px solid #ffe5d0', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(245,158,11,0.04)' }}>
                        <div style={{ fontWeight: 600, color: '#d97706', fontSize: 13, marginBottom: 6 }}>TOTAL EXPENSES</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>Rs. {totalExpenses.toFixed(2)}</div>
                    </div>
                    <div style={{ minWidth: 200, background: '#f8f7ff', border: '1px solid #e3e0f3', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(139,92,246,0.04)' }}>
                        <div style={{ fontWeight: 600, color: '#8b5cf6', fontSize: 13, marginBottom: 6 }}>AVG PROFIT/PRODUCT</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{avgProfit.toFixed(2)}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Input
                        label={null}
                        placeholder="Search by code, name, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, minWidth: 260, maxWidth: 400 }}
                    />
                    <Button variant="danger" onClick={generateReport} style={{ minWidth: 180, fontWeight: 600, fontSize: 16, padding: '0.7em 1.5em', background: '#ef4444', border: 'none', borderRadius: 8 }}>
                        Download PDF Report
                    </Button>
                </div>
                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div style={{ overflowX: 'auto', borderRadius: 8, boxShadow: '0 1px 4px rgba(41,128,185,0.08)', background: '#fff' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900, fontSize: 15 }}>
                            <thead>
                                <tr style={{ background: '#f3f6fa', color: '#222', borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Product Code</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Quantity</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Category</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Purchase Price</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Selling Price</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Supplier Name</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Profit</th>
                                    <th style={{ padding: '14px 8px', fontWeight: 700, textAlign: 'left' }}>Expenses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((item, idx) => {
                                    const profit = (item.Selling_Price - item.Purchase_Price) * item.Quantity;
                                    const expenses = item.Purchase_Price * item.Quantity;
                                    return (
                                        <tr key={item.P_Code} style={{ background: idx % 2 === 0 ? '#fff' : '#f7fbff', borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '12px 8px' }}>{item.P_Code}</td>
                                            <td style={{ padding: '12px 8px' }}>{item.P_Name}</td>
                                            <td style={{ padding: '12px 8px' }}>{item.Quantity}</td>
                                            <td style={{ padding: '12px 8px' }}>{item.P_category}</td>
                                            <td style={{ padding: '12px 8px' }}>{item.Purchase_Price}</td>
                                            <td style={{ padding: '12px 8px' }}>{item.Selling_Price}</td>
                                            <td style={{ padding: '12px 8px' }}>{item.Suplier_Name}</td>
                                            <td style={{ padding: '12px 8px' }}>{profit.toFixed(2)}</td>
                                            <td style={{ padding: '12px 8px' }}>{expenses.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InventoryReport; 