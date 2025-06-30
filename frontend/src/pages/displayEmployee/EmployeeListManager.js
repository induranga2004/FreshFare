import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeListManager.css";
import { toast, Bounce } from 'react-toastify';
const EmployeeListManager = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    
      useEffect(() => {
        fetchEmployees();
      }, []);
    
      // Fetch employees from backend
      const fetchEmployees = () => {
        axios.get("http://localhost:5000/Employee/cashiers")
          .then(response => setEmployees(response.data))
          .catch(error => console.error("Error fetching employees", error));
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
      // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
      </div>
    <button className="add-btn" onClick={() => navigate("/addempManager")}>Add Employee</button>

    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Gender</th>
          <th>Date of Birth</th>
          <th>Role</th>
          <th>Address</th>
          <th>Email</th>
          <th>Age</th>
          <th>Mobile Number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredEmployees.map(emp => (
          <tr key={emp._id}>
            <td>{emp.firstName}</td>
            <td>{emp.lastName}</td>
            <td>{emp.gender}</td>
            <td>{emp.dob}</td>
            <td>{emp.role}</td>
            <td>{emp.address}</td>
            <td>{emp.email}</td>
            <td>{emp.age}</td>
            <td>{emp.mobile}</td>
            <td>
              <button className="view-btn" onClick={() => navigate(`/viewEmpManager/${emp._id}`)}>View</button>
              <button className="edit-btn" onClick={() => navigate(`/editEmpManager/${emp._id}`)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default EmployeeListManager