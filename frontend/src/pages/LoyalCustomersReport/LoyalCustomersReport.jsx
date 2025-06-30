import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './LoyalCustomersReport.module.css';

const LoyalCustomersReport = () => {
  const [customers, setCustomers] = useState([]);
  const [customersWithTransactions, setCustomersWithTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('totalSpent');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/LCs');
        setCustomers(response.data.LCs);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load customer data');
      }
    };

    fetchCustomers();
  }, []);

  // Fetch transaction data for each customer
  useEffect(() => {
    const fetchTransactionData = async () => {
      if (customers.length === 0) return;
      
      try {
        const customersWithData = await Promise.all(
          customers.map(async (customer) => {
            try {
              // Fetch transaction history for each customer
              const response = await axios.get(`http://localhost:5000/LCs/${customer._id}/transactions`);
              const transactions = response.data.transactions || [];
              
              // Calculate additional metrics
              const transactionCount = transactions.length;
              const avgTransactionValue = transactionCount > 0 
                ? (customer.totalSpent / transactionCount).toFixed(2) 
                : 0;
                
              return {
                ...customer,
                transactionCount,
                avgTransactionValue,
                lastTransactionDate: customer.lastTransactionDate 
                  ? new Date(customer.lastTransactionDate).toLocaleDateString() 
                  : 'N/A',
                registeredDate: customer.registeredDate 
                  ? new Date(customer.registeredDate).toLocaleDateString() 
                  : 'N/A'
              };
            } catch (error) {
              console.error(`Error fetching data for customer ${customer._id}:`, error);
              return {
                ...customer,
                transactionCount: 0,
                avgTransactionValue: 0,
                lastTransactionDate: customer.lastTransactionDate 
                  ? new Date(customer.lastTransactionDate).toLocaleDateString() 
                  : 'N/A',
                registeredDate: customer.registeredDate 
                  ? new Date(customer.registeredDate).toLocaleDateString() 
                  : 'N/A'
              };
            }
          })
        );
        
        setCustomersWithTransactions(customersWithData);
        setLoading(false);
      } catch (error) {
        console.error('Error processing customer data:', error);
        toast.error('Error loading transaction data');
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [customers]);

  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort data
  const filteredAndSortedData = customersWithTransactions
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm)
    )
    .sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle dates
      if (sortField === 'registeredDate' || sortField === 'lastTransactionDate') {
        valueA = a[sortField] !== 'N/A' ? new Date(a[sortField]) : new Date(0);
        valueB = b[sortField] !== 'N/A' ? new Date(b[sortField]) : new Date(0);
      }
      
      // Handle numbers
      if (['totalPoints', 'totalSpent', 'transactionCount', 'avgTransactionValue'].includes(sortField)) {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Summary statistics
  const customerSummary = {
    totalCustomers: customers.length,
    totalPoints: customers.reduce((sum, customer) => sum + (customer.totalPoints || 0), 0),
    totalSpent: customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0).toFixed(2),
    avgPointsPerCustomer: customers.length > 0 
      ? (customers.reduce((sum, customer) => sum + (customer.totalPoints || 0), 0) / customers.length).toFixed(0)
      : 0
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('FreshFare - Loyal Customers Report', 14, 20);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add summary
    doc.setFontSize(12);
    doc.text('Summary', 14, 40);
    
    doc.setFontSize(10);
    doc.text(`Total Customers: ${customerSummary.totalCustomers}`, 14, 50);
    doc.text(`Total Points: ${customerSummary.totalPoints}`, 80, 50);
    doc.text(`Total Spent: Rs. ${customerSummary.totalSpent}`, 14, 60);
    doc.text(`Avg Points/Customer: ${customerSummary.avgPointsPerCustomer}`, 80, 60);
    
    // Table headers
    const tableHeaders = [
      ['Name', 'Mobile', 'Email', 'Total Points', 'Total Spent (Rs.)', 'Transactions', 'Member Since', 'Last Transaction']
    ];
    
    // Table data (use filtered and sorted data)
    const tableData = filteredAndSortedData.map(customer => [
      customer.name,
      customer.mobile,
      customer.email,
      customer.totalPoints || '0',
      (customer.totalSpent || 0).toFixed(2),
      customer.transactionCount,
      customer.registeredDate,
      customer.lastTransactionDate
    ]);
    
    // Create table
    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 70,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219], textColor: 255 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 22 },
        2: { cellWidth: 40 },
        3: { cellWidth: 18 },
        4: { cellWidth: 22 },
        5: { cellWidth: 20 },
        6: { cellWidth: 22 },
        7: { cellWidth: 22 }
      }
    });
    
    // Add search term if filtering was applied
    if (searchTerm) {
      const finalY = doc.lastAutoTable.finalY || 70;
      doc.text(`Filter applied: "${searchTerm}"`, 14, finalY + 10);
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text('FreshFare Loyalty Program', 14, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    doc.save('LoyalCustomersReport.pdf');
    
    toast.success('PDF report generated successfully!');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading customer data...</p>
      </div>
    );
  }

  return (
    <div className={styles.reportContainer}>
      <ToastContainer position="top-right" />
      
      <div className={styles.reportHeader}>
        <h1>Loyal Customers Report</h1>
        <p className={styles.reportDate}>Generated on: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <h3>Total Customers</h3>
          <p>{customerSummary.totalCustomers}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Points</h3>
          <p>{customerSummary.totalPoints}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Spent</h3>
          <p>Rs. {customerSummary.totalSpent}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Avg Points/Customer</h3>
          <p>{customerSummary.avgPointsPerCustomer}</p>
        </div>
      </div>
      
      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button 
          onClick={generatePDF} 
          className={styles.pdfButton}
          disabled={filteredAndSortedData.length === 0}
        >
          Download PDF Report
        </button>
      </div>
      
      {paginatedData.length === 0 ? (
        <div className={styles.noDataMessage}>
          <p>No customers found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('mobile')}>
                    Mobile {sortField === 'mobile' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')}>
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('totalPoints')}>
                    Total Points {sortField === 'totalPoints' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('totalSpent')}>
                    Total Spent {sortField === 'totalSpent' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('transactionCount')}>
                    Transactions {sortField === 'transactionCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('registeredDate')}>
                    Member Since {sortField === 'registeredDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('lastTransactionDate')}>
                    Last Transaction {sortField === 'lastTransactionDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.mobile}</td>
                    <td>{customer.email}</td>
                    <td>{customer.totalPoints || 0}</td>
                    <td>Rs. {(customer.totalSpent || 0).toFixed(2)}</td>
                    <td>{customer.transactionCount}</td>
                    <td>{customer.registeredDate}</td>
                    <td>{customer.lastTransactionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoyalCustomersReport; 