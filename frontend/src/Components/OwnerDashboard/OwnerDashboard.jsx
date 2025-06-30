import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { Link, useLocation } from "react-router-dom";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { toast } from "react-toastify";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Sidebar from '../Shared/Sidebar';
import {
  FaBoxes,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaChartLine,
  FaSync,
  FaChartBar,
  FaChartPie,
  FaWarehouse,
  FaUsers,
  FaTruck,
  FaClipboardList
} from 'react-icons/fa';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const OwnerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products/getAllProducts");
      if (response.data && response.data.product) {
        setProducts(response.data.product);
      } else {
        setError("Invalid data format received from server");
        toast.error("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.Quantity < 10).length;
  const totalStockValue = products.reduce((sum, product) => 
    sum + (product.Selling_Price * product.Quantity), 0
  );
  const totalProfit = products.reduce((sum, product) => 
    sum + ((product.Selling_Price - product.Purchase_Price) * product.Quantity), 0
  );

  // Prepare data for Stock Level Bar Chart
  const stockChartData = {
    labels: products.map(product => product.P_Name),
    datasets: [
      {
        label: "Stock Level",
        data: products.map(product => product.Quantity),
        backgroundColor: "rgba(41, 128, 185, 0.6)",
        borderColor: "rgba(41, 128, 185, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Category Distribution Pie Chart
  const categoryData = products.reduce((acc, product) => {
    acc[product.P_category] = (acc[product.P_category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(41, 128, 185, 0.6)',
          'rgba(22, 163, 74, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(139, 92, 246, 0.6)',
        ],
        borderColor: [
          'rgba(41, 128, 185, 1)',
          'rgba(22, 163, 74, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // New Chart: Profit Margin Analysis
  const profitMarginData = {
    labels: products.map(p => p.P_Name),
    datasets: [{
      label: 'Profit Margin (%)',
      data: products.map(p => 
        ((p.Selling_Price - p.Purchase_Price) / p.Purchase_Price * 100).toFixed(2)
      ),
      backgroundColor: 'rgba(22, 163, 74, 0.6)',
      borderColor: 'rgba(22, 163, 74, 1)',
      borderWidth: 1,
    }]
  };

  // New Chart: Stock Status Distribution
  const stockStatusData = {
    labels: ['Critical (0-5)', 'Low (6-10)', 'Normal (11-20)', 'High (>20)'],
    datasets: [{
      data: [
        products.filter(p => p.Quantity <= 5).length,
        products.filter(p => p.Quantity > 5 && p.Quantity <= 10).length,
        products.filter(p => p.Quantity > 10 && p.Quantity <= 20).length,
        products.filter(p => p.Quantity > 20).length
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(22, 163, 74, 0.6)',
        'rgba(41, 128, 185, 0.6)'
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(22, 163, 74, 1)',
        'rgba(41, 128, 185, 1)'
      ],
      borderWidth: 1,
    }]
  };

  // New Chart: Value Distribution
  const valueDistributionData = {
    labels: products.map(p => p.P_Name),
    datasets: [
      {
        label: 'Stock Value (Purchase)',
        data: products.map(p => p.Purchase_Price * p.Quantity),
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
      {
        label: 'Stock Value (Selling)',
        data: products.map(p => p.Selling_Price * p.Quantity),
        backgroundColor: 'rgba(41, 128, 185, 0.6)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1,
      }
    ]
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f6f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaSync className="animate-spin" style={{ fontSize: '24px', color: '#2980b9' }} />
          <span style={{ color: '#2980b9', fontSize: '18px' }}>Loading...</span>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ minWidth: 200, background: '#f7fbff', border: '1px solid #e3eaf3', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(41,128,185,0.04)' }}>
          <div style={{ fontWeight: 600, color: '#2980b9', fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaBoxes /> TOTAL PRODUCTS
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalProducts}</div>
        </div>
        <div style={{ minWidth: 200, background: '#f8fcf7', border: '1px solid #e3f3e6', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(22,163,74,0.04)' }}>
          <div style={{ fontWeight: 600, color: '#16a34a', fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaMoneyBillWave /> TOTAL PROFIT
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Rs. {totalProfit.toFixed(2)}</div>
        </div>
        <div style={{ minWidth: 200, background: '#fff9f6', border: '1px solid #ffe5d0', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(245,158,11,0.04)' }}>
          <div style={{ fontWeight: 600, color: '#d97706', fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaExclamationTriangle /> LOW STOCK ITEMS
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{lowStockProducts}</div>
        </div>
        <div style={{ minWidth: 200, background: '#f8f7ff', border: '1px solid #e3e0f3', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px rgba(139,92,246,0.04)' }}>
          <div style={{ fontWeight: 600, color: '#8b5cf6', fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaChartLine /> TOTAL STOCK VALUE
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Rs. {totalStockValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 4px rgba(41,128,185,0.08)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#222' }}>Stock Levels</h3>
          <Bar data={stockChartData} options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
            scales: {
              y: { beginAtZero: true }
            }
          }} />
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 4px rgba(41,128,185,0.08)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#222' }}>Category Distribution</h3>
          <Pie data={categoryChartData} options={{
            responsive: true,
            plugins: {
              legend: { position: "right" }
            }
          }} />
        </div>
      </div>
    </>
  );

  const renderAnalyticsTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 4px rgba(41,128,185,0.08)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#222' }}>Profit Margins</h3>
        <Bar data={profitMarginData} options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            y: { 
              beginAtZero: true,
              title: {
                display: true,
                text: 'Profit Margin (%)'
              }
            }
          }
        }} />
      </div>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 4px rgba(41,128,185,0.08)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#222' }}>Stock Status Distribution</h3>
        <Doughnut data={stockStatusData} options={{
          responsive: true,
          plugins: {
            legend: { position: "right" }
          }
        }} />
      </div>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, boxShadow: '0 1px 4px rgba(41,128,185,0.08)', gridColumn: '1 / -1' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#222' }}>Value Distribution</h3>
        <Bar data={valueDistributionData} options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            y: { 
              beginAtZero: true,
              title: {
                display: true,
                text: 'Value (Rs.)'
              }
            }
          }
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ 
        minHeight: '100vh', 
        background: '#f6f8fa', 
        padding: '2rem 0',
        marginLeft: '250px',
        width: 'calc(100% - 250px)'
      }}>
        <div style={{ maxWidth: 1200, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem' }}>
          <h1 style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: 0, color: '#222', textAlign: 'center', letterSpacing: 0.5 }}>Owner Dashboard</h1>
          <div style={{ textAlign: 'center', color: '#666', marginTop: 8, marginBottom: 16, fontSize: 16 }}>
            Last Updated: {new Date().toLocaleDateString()}
          </div>
          <div style={{ width: 120, height: 4, background: '#2980b9', margin: '0 auto 32px auto', borderRadius: 2 }}></div>

          {/* Refresh Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <Button 
              variant="primary" 
              onClick={fetchProducts} 
              style={{ minWidth: 180, fontWeight: 600, fontSize: 16, padding: '0.7em 1.5em', background: '#2980b9', border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <FaSync className={loading ? "animate-spin" : ""} /> Refresh Data
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e5e7eb', marginBottom: '2rem' }}>
            {[
              { id: 'overview', label: 'Overview', icon: FaChartBar },
              { id: 'analytics', label: 'Analytics', icon: FaChartPie }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: activeTab === tab.id ? '#2980b9' : '#666',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? '#2980b9' : 'transparent'}`,
                  marginBottom: '-2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard; 