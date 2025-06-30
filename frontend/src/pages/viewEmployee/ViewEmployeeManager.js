import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewEmployee.css";

const ViewEmployeeManager = () => {
    const { id } = useParams(); // Get employee ID from URL params
      const [employee, setEmployee] = useState(null);
      const navigate = useNavigate();
    
      useEffect(() => {
        fetchEmployeeDetails();
      }, []);
    
      // Fetch employee details from backend by ID
      const fetchEmployeeDetails = () => {
        axios.get(`http://localhost:5000/Employee/get/${id}`) // API call to fetch employee by ID
          .then(response => setEmployee(response.data))
          .catch(error => console.error("Error fetching employee details", error));
      };
    
      // Navigate back to Employee List
      const handleBack = () => {
        navigate("/emplistManager");
      };
    
      if (!employee) {
        return <div>Loading...</div>; // Show loading text while the employee data is being fetched
      }
    
  return (
    <div className="view-container">
      <h2>Employee Details</h2>
      <div className="employee-details">
        <p><strong>First Name:</strong> {employee.firstName}</p>
        <p><strong>Last Name:</strong> {employee.lastName}</p>
        <p><strong>Gender:</strong> {employee.gender}</p>
        <p><strong>Role:</strong>{employee.role}</p>
        <p><strong>Date of Birth:</strong> {new Date(employee.dob).toISOString().split('T')[0]}</p> {/* Format the date */}
        <p><strong>Age:</strong> {employee.age}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Mobile Number:</strong> {employee.mobile}</p>
        <p><strong>Address:</strong> {employee.address}</p>
      </div>
      <button className="back-btn" onClick={handleBack}>Back to Employee List</button>
    </div>
  )
}

export default ViewEmployeeManager
