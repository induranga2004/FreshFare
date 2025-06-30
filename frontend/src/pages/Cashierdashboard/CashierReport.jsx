import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CashierReport.css';

const CashierReport = () => {
    const [cashiers, setCashiers] = useState([]);
    const [selectedCashier, setSelectedCashier] = useState('');
    const [reportData, setReportData] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [loadingCashiers, setLoadingCashiers] = useState(true);

    // Fetch all cashiers on component mount
    useEffect(() => {
        const fetchCashiers = async () => {
            setLoadingCashiers(true);
            try {
                console.log('Fetching cashiers...');
                const response = await axios.get('http://localhost:5000/api/getCashiers');
                console.log('Cashiers received:', response.data);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setCashiers(response.data);
                    toast.success(`${response.data.length} cashiers loaded successfully`);
                } else {
                    toast.warning('No cashiers found in the database');
                    setCashiers([]);
                }
            } catch (error) {
                console.error('Error fetching cashiers:', error);
                toast.error(`Error loading cashiers: ${error.message}`);
                setCashiers([]);
            } finally {
                setLoadingCashiers(false);
            }
        };
        fetchCashiers();
    }, []);

    const generateReport = async () => {
        if (!selectedCashier || !dateRange.startDate || !dateRange.endDate) {
            toast.error('Please select a cashier and date range');
            return;
        }

        setLoading(true);
        try {
            // Fetch sales data
            const salesResponse = await axios.get(`http://localhost:5000/api/sales/cashier/${selectedCashier}`, {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            });

            // Fetch login/logout data
            const activityResponse = await axios.get(`http://localhost:5000/api/activity/cashier/${selectedCashier}`, {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            });

            console.log('Activity data received:', activityResponse.data);

            // Format the activities data
            const formattedActivities = Array.isArray(activityResponse.data) 
                ? activityResponse.data.map(activity => ({
                    ...activity,
                    date: new Date(activity.date).toLocaleDateString(),
                    loginTime: new Date(`1970/01/01 ${activity.loginTime}`).toLocaleTimeString(),
                    logoutTime: activity.logoutTime 
                        ? new Date(`1970/01/01 ${activity.logoutTime}`).toLocaleTimeString()
                        : 'Active',
                    duration: activity.duration || 'N/A'
                }))
                : [];

            // Fetch cashier details - Using correct endpoint
            const cashierResponse = await axios.get(`http://localhost:5000/Employee/get/${selectedCashier}`);

            setReportData({
                cashierInfo: cashierResponse.data,
                sales: salesResponse.data,
                activities: formattedActivities
            });

            console.log('Formatted activities:', formattedActivities);
            toast.success('Report generated successfully');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error(`Error generating report: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cashier-report-container">
            <h2>Cashier Performance Report</h2>
            
            <div className="report-filters">
                <div className="filter-group">
                    <label>Select Cashier</label>
                    {loadingCashiers ? (
                        <div>Loading cashiers...</div>
                    ) : (
                        <select 
                            value={selectedCashier} 
                            onChange={(e) => setSelectedCashier(e.target.value)}
                        >
                            <option value="">Select a cashier</option>
                            {cashiers.length > 0 ? (
                                cashiers.map(cashier => (
                                    <option key={cashier._id} value={cashier._id}>
                                        {cashier.firstName} {cashier.lastName}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No cashiers available</option>
                            )}
                        </select>
                    )}
                </div>

                <div className="filter-group">
                    <label>Start Date</label>
                    <input 
                        type="date" 
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                </div>

                <div className="filter-group">
                    <label>End Date</label>
                    <input 
                        type="date" 
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                </div>

                <button 
                    className="generate-btn"
                    onClick={generateReport}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>

            {reportData && (
                <div className="report-content">
                    <div className="cashier-info">
                        <h3>Cashier Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Name:</label>
                                <span>{reportData.cashierInfo.firstName} {reportData.cashierInfo.lastName}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{reportData.cashierInfo.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Phone:</label>
                                <span>{reportData.cashierInfo.mobile}</span>
                            </div>
                        </div>
                    </div>

                    <div className="sales-summary">
                        <h3>Sales Summary</h3>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <label>Total Sales:</label>
                                <span>{reportData.sales.totalSales || 0}</span>
                            </div>
                            <div className="summary-item">
                                <label>Total Amount:</label>
                                <span>Rs. {reportData.sales.totalAmount?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="activity-log">
                        <h3>Activity Log</h3>
                        <div className="activity-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Login Time</th>
                                        <th>Logout Time</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.activities && reportData.activities.length > 0 ? (
                                        reportData.activities.map((activity, index) => (
                                            <tr key={index}>
                                                <td>{activity.date}</td>
                                                <td>{activity.loginTime}</td>
                                                <td>{activity.logoutTime}</td>
                                                <td>{activity.duration}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center' }}>No activity records found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashierReport; 