import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartPie, FaSpinner } from 'react-icons/fa';
import './PieChartPage.css';

const PieChartPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSuppliers, setTotalSuppliers] = useState(0);

  const COLORS = ['#10B981', '#EF4444']; // Green for Paid, Red for Unpaid
  const RADIAN = Math.PI / 180;

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/suppliers/');
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const suppliers = await response.json();
        
        const paidCount = suppliers.filter(supplier => supplier.paid).length;
        const unpaidCount = suppliers.length - paidCount;

        setData([
          { name: 'Paid', value: paidCount },
          { name: 'Unpaid', value: unpaidCount },
        ]);
        setTotalSuppliers(suppliers.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="chart-label"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="pie-chart-loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading payment statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pie-chart-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <div className="pie-chart-card">
        <div className="pie-chart-header">
          <div className="header-icon">
            <FaChartPie />
          </div>
          <div className="header-text">
            <h2>Supplier Payment Status</h2>
            <p>Overview of supplier payment distribution</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card total">
            <h3>Total Suppliers</h3>
            <p>{totalSuppliers}</p>
          </div>
          <div className="stat-card paid">
            <h3>Paid</h3>
            <p>{data[0]?.value || 0}</p>
          </div>
          <div className="stat-card unpaid">
            <h3>Unpaid</h3>
            <p>{data[1]?.value || 0}</p>
          </div>
        </div>

        <div className="pie-chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="pie-chart-cell"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PieChartPage;
