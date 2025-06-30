import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeList.css";
import { toast, Bounce } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import EmployeeModal from "./EmployeeModal";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [salesData, setSalesData] = useState(null);
  const [cashierSalesData, setCashierSalesData] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchTransactions();
  }, []);

  // Fetch employees from backend
  const fetchEmployees = () => {
    axios.get("http://localhost:5000/Employee")
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees", error));
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/transaction/daily');
      const allTransactions = response.data;
      setTransactions(allTransactions);
      
      // Calculate overall sales data
      calculateOverallSalesData(allTransactions);
      
      // Calculate per-cashier sales data
      calculateCashierSalesData(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Calculate overall sales data
  const calculateOverallSalesData = (transactions) => {
    const summary = transactions.reduce((acc, transaction) => {
      // Payment method tracking
      const isCardPayment = transaction.payment_method === 'Credit Card';
      if (isCardPayment) {
        acc.paymentMethods.card.count += 1;
        acc.paymentMethods.card.amount += transaction.TotalPrice;
      } else {
        acc.paymentMethods.cash.count += 1;
        acc.paymentMethods.cash.amount += transaction.TotalPrice;
      }

      // Total revenue
      acc.totalRevenue += transaction.TotalPrice;
      acc.totalTransactions += 1;

      return acc;
    }, {
      paymentMethods: {
        cash: { count: 0, amount: 0 },
        card: { count: 0, amount: 0 }
      },
      totalRevenue: 0,
      totalTransactions: 0
    });

    setSalesData(summary);
  };

  // Calculate per-cashier sales data based on the transaction creator
  const calculateCashierSalesData = (transactions) => {
    try {
      // Get token to extract current user info
      const token = localStorage.getItem("token");
      if (!token) return;
      
      // Parse the token (assuming JWT format: header.payload.signature)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return;
      
      // Extract and parse payload
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Group transactions by cashier
      const cashierData = {};
      
      employees.forEach(emp => {
        if (emp.role === "Cashier") {
          // Initialize data for each cashier
          cashierData[emp._id] = {
            employeeId: emp._id,
            name: `${emp.firstName} ${emp.lastName}`,
            transactions: 0,
            totalAmount: 0,
            cashAmount: 0,
            cardAmount: 0,
            cashCount: 0,
            cardCount: 0
          };
        }
      });
      
      // Process transactions
      // Note: Since we don't have cashierId in transactions from backend,
      // we'll assume the currently logged-in user for today's transactions
      // This would need to be improved with proper backend integration
      transactions.forEach(transaction => {
        const cashierId = payload?.id || null;
        
        if (cashierId && cashierData[cashierId]) {
          cashierData[cashierId].transactions += 1;
          cashierData[cashierId].totalAmount += transaction.TotalPrice;
          
          const isCardPayment = transaction.payment_method === 'Credit Card';
          if (isCardPayment) {
            cashierData[cashierId].cardCount += 1;
            cashierData[cashierId].cardAmount += transaction.TotalPrice;
          } else {
            cashierData[cashierId].cashCount += 1;
            cashierData[cashierId].cashAmount += transaction.TotalPrice;
          }
        }
      });
      
      setCashierSalesData(cashierData);
    } catch (error) {
      console.error("Error calculating cashier sales data:", error);
    }
  };

  // Handle employee deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios.delete(`http://localhost:5000/Employee/delete/${id}`)
        .then(() => {
          toast.success('Employee deleted successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
          fetchEmployees(); // Refresh list
        })
        .catch(error => console.error("Error deleting employee", error));
    }
  };

  // View employee details
  const viewEmployeeDetails = (emp) => {
    setSelectedEmployee(emp);
  };

  // Close employee modal
  const closeModal = () => {
    setSelectedEmployee(null);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate PDF report for all employees
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Employee Report', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Add search term if it exists
    if (searchTerm) {
      doc.text(`Search Term: ${searchTerm}`, 14, 35);
    }

    // Add sales summary if available
    if (salesData) {
      doc.setFontSize(12);
      doc.text('Daily Sales Summary', 14, searchTerm ? 45 : 35);
      doc.setFontSize(10);
      doc.text(`Total Transactions: ${salesData.totalTransactions}`, 14, searchTerm ? 55 : 45);
      doc.text(`Total Revenue: Rs. ${salesData.totalRevenue.toFixed(2)}`, 14, searchTerm ? 65 : 55);
      doc.text(`Cash Transactions: ${salesData.paymentMethods.cash.count}`, 14, searchTerm ? 75 : 65);
      doc.text(`Card Transactions: ${salesData.paymentMethods.card.count}`, 14, searchTerm ? 85 : 75);
      doc.text(`Cash Revenue: Rs. ${salesData.paymentMethods.cash.amount.toFixed(2)}`, 14, searchTerm ? 95 : 85);
      doc.text(`Card Revenue: Rs. ${salesData.paymentMethods.card.amount.toFixed(2)}`, 14, searchTerm ? 105 : 95);
    }
    
    // Prepare data for the table
    const tableData = filteredEmployees.map(emp => {
      // Get cashier-specific sales data if available
      const empSales = emp.role === "Cashier" && cashierSalesData[emp._id] 
        ? cashierSalesData[emp._id] 
        : { transactions: 0, totalAmount: 0 };
        
      return [
        emp.firstName,
        emp.lastName,
        emp.gender,
        emp.dob,
        emp.role,
        emp.address,
        emp.email,
        emp.age,
        emp.mobile,
        emp.role === "Cashier" ? empSales.transactions : "N/A",
        emp.role === "Cashier" ? `Rs. ${empSales.totalAmount.toFixed(2)}` : "N/A"
      ];
    });
    
    // Add the table with additional columns for cashier data
    autoTable(doc, {
      head: [['First Name', 'Last Name', 'Gender', 'DOB', 'Role', 'Address', 'Email', 'Age', 'Mobile', 'Sales Count', 'Sales Amount']],
      body: tableData,
      startY: salesData ? (searchTerm ? 115 : 105) : (searchTerm ? 45 : 35),
      theme: 'grid',
      headStyles: { fillColor: [66, 153, 225] },
      styles: { fontSize: 8, cellPadding: 2 }
    });
    
    // Save the PDF
    doc.save('employee_report.pdf');
  };

  // Generate individual employee PDF report
  const generateIndividualPDF = (employee) => {
    const doc = new jsPDF();
    
    // Add title and header
    doc.setFontSize(22);
    doc.text('Employee Profile', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add employee name as subtitle
    doc.setFontSize(16);
    doc.setTextColor(66, 153, 225);
    doc.text(`${employee.firstName} ${employee.lastName}`, 14, 45);
    doc.setTextColor(0, 0, 0);
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 50, 196, 50);
    
    // Add employee details
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    
    const startY = 60;
    const lineHeight = 10;
    
    doc.text('Personal Information', 14, startY);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Add personal information
    doc.text(`Full Name: ${employee.firstName} ${employee.lastName}`, 20, startY + lineHeight);
    doc.text(`Gender: ${employee.gender}`, 20, startY + lineHeight * 2);
    doc.text(`Date of Birth: ${employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}`, 20, startY + lineHeight * 3);
    doc.text(`Age: ${employee.age}`, 20, startY + lineHeight * 4);
    
    // Add contact information
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.text('Contact Information', 14, startY + lineHeight * 6);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Email: ${employee.email}`, 20, startY + lineHeight * 7);
    doc.text(`Mobile: ${employee.mobile}`, 20, startY + lineHeight * 8);
    doc.text(`Address: ${employee.address}`, 20, startY + lineHeight * 9);
    
    // Add employment information
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.text('Employment Information', 14, startY + lineHeight * 11);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Role: ${employee.role}`, 20, startY + lineHeight * 12);
    doc.text(`Employee ID: ${employee._id}`, 20, startY + lineHeight * 13);
    
    // Add cashier-specific sales data if employee is a cashier
    const empSales = employee.role === "Cashier" && cashierSalesData[employee._id]
      ? cashierSalesData[employee._id]
      : null;
    
    if (empSales) {
      // Add horizontal line to separate sections
      doc.setDrawColor(200, 200, 200);
      doc.line(14, startY + lineHeight * 15, 196, startY + lineHeight * 15);
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(12);
      doc.text('Cashier Sales Performance', 14, startY + lineHeight * 16);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Create a box with light background for cashier data
      doc.setFillColor(248, 250, 252); // Light background
      doc.rect(14, startY + lineHeight * 17, 182, lineHeight * 7, 'F');
      doc.setDrawColor(226, 232, 240); // Light border
      doc.rect(14, startY + lineHeight * 17, 182, lineHeight * 7, 'S');
      
      // Add cashier sales data with slightly darker text
      doc.setTextColor(45, 55, 72);
      doc.text(`Total Transactions: ${empSales.transactions}`, 20, startY + lineHeight * 18);
      doc.text(`Total Sales Amount: Rs. ${empSales.totalAmount.toFixed(2)}`, 20, startY + lineHeight * 19);
      doc.text(`Cash Transactions: ${empSales.cashCount}`, 20, startY + lineHeight * 20);
      doc.text(`Card Transactions: ${empSales.cardCount}`, 20, startY + lineHeight * 21);
      doc.text(`Cash Revenue: Rs. ${empSales.cashAmount.toFixed(2)}`, 20, startY + lineHeight * 22);
      doc.text(`Card Revenue: Rs. ${empSales.cardAmount.toFixed(2)}`, 20, startY + lineHeight * 23);
    }
    
    // Add sales data summary if available
    if (salesData) {
      // Add horizontal line to separate sections
      const additionalY = empSales ? 9 : 0;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, startY + lineHeight * (15 + additionalY), 196, startY + lineHeight * (15 + additionalY));
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(12);
      doc.text('Daily Sales Summary', 14, startY + lineHeight * (16 + additionalY));
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Create a box with light background for sales data
      doc.setFillColor(248, 250, 252); // Light background
      doc.rect(14, startY + lineHeight * (17 + additionalY), 182, lineHeight * 7, 'F');
      doc.setDrawColor(226, 232, 240); // Light border
      doc.rect(14, startY + lineHeight * (17 + additionalY), 182, lineHeight * 7, 'S');
      
      // Add sales data with slightly darker text
      doc.setTextColor(45, 55, 72);
      doc.text(`Total Transactions: ${salesData.totalTransactions}`, 20, startY + lineHeight * (18 + additionalY));
      doc.text(`Total Revenue: Rs. ${salesData.totalRevenue.toFixed(2)}`, 20, startY + lineHeight * (19 + additionalY));
      doc.text(`Cash Transactions: ${salesData.paymentMethods.cash.count}`, 20, startY + lineHeight * (20 + additionalY));
      doc.text(`Card Transactions: ${salesData.paymentMethods.card.count}`, 20, startY + lineHeight * (21 + additionalY));
      doc.text(`Cash Revenue: Rs. ${salesData.paymentMethods.cash.amount.toFixed(2)}`, 20, startY + lineHeight * (22 + additionalY));
      doc.text(`Card Revenue: Rs. ${salesData.paymentMethods.card.amount.toFixed(2)}`, 20, startY + lineHeight * (23 + additionalY));
    }
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a confidential document. Please handle with care.', 14, 280);
    
    // Save the PDF
    doc.save(`employee_${employee.firstName}_${employee.lastName}.pdf`);
  };

  return (
    <div className="list-container">
      <h2>Employee Management</h2>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by first name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="generate-report-btn" onClick={generatePDF}>
          Generate Report
        </button>
      </div>
      <button className="add-btn" onClick={() => navigate("/empadd")}>Add Employee</button>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Age</th>
            {/* Show sales columns only if we have data */}
            {Object.keys(cashierSalesData).length > 0 && (
              <>
                <th>Sales Count</th>
                <th>Sales Amount</th>
              </>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => {
            // Get cashier-specific sales data if available
            const empSales = emp.role === "Cashier" && cashierSalesData[emp._id] 
              ? cashierSalesData[emp._id] 
              : { transactions: 0, totalAmount: 0 };
              
            return (
              <tr key={emp._id}>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.gender}</td>
                <td>{emp.role}</td>
                <td>{emp.email}</td>
                <td>{emp.mobile}</td>
                <td>{emp.age}</td>
                {/* Show sales data only if we have cashier data */}
                {Object.keys(cashierSalesData).length > 0 && (
                  <>
                    <td className={emp.role === "Cashier" ? "sales-count" : "non-cashier"}>
                      {emp.role === "Cashier" ? empSales.transactions : "N/A"}
                    </td>
                    <td className={emp.role === "Cashier" ? "sales-amount" : "non-cashier"}>
                      {emp.role === "Cashier" ? `Rs. ${empSales.totalAmount.toFixed(2)}` : "N/A"}
                    </td>
                  </>
                )}
                <td>
                  <button className="view-btn" onClick={() => viewEmployeeDetails(emp)}>View</button>
                  <button className="edit-btn" onClick={() => navigate(`/empedit/${emp._id}`)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Employee Details Modal */}
      {selectedEmployee && (
        <EmployeeModal 
          employee={selectedEmployee} 
          onClose={closeModal} 
          onGeneratePDF={generateIndividualPDF}
          salesData={salesData}
          cashierSalesData={selectedEmployee.role === "Cashier" ? cashierSalesData[selectedEmployee._id] : null}
        />
      )}
    </div>
  );
};

export default EmployeeList;
