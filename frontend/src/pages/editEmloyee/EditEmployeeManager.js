import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditEmployee.css";
import { toast,Bounce } from 'react-toastify'
const EditEmployeeManager = () => {
  const [password,setPassword] = useState("")
  const { id } = useParams(); // Get employee ID from URL params
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    role:"",
    password:"",
    address: "",
    email: "",
    age: "",
    mobile: ""
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchEmployeeDetails();
  }, []);

  // Fetch employee details from backend by ID
  const fetchEmployeeDetails = () => {
    axios.get(`http://localhost:5000/Employee/get/${id}`)
      .then(response => {
        setPassword(response.data.password)
        setEmployee(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching employee details", error);
        setLoading(false);
      });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  // Handle form submission to update employee
  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.put(`http://localhost:5000/Employee/update/${id}`, employee)
      .then(() => {
        toast.success("Employee updated successfully!", {
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
          if(password!=employee.password)
                    {
                        axios.post(`http://localhost:5000/password/reset`,{
                          password:employee.password
                          ,email:employee.email
                        })              
                    }
        navigate("/emplistManager"); // Redirect to Employee List
      })
      .catch(error => console.error("Error updating employee", error));
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading text while the employee data is being fetched
  }

  return (
    <div className="edit-container">
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            readOnly
            className="readonly-input"
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={employee.gender}
            readOnly
            className="readonly-input"
            disabled
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={employee.role}
            readOnly
            className="readonly-input"
            disabled
          >
            <option value="" disabled>Select Gender</option>
            <option value="Cashier">Cashier</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={employee.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={employee.dob}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={employee.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={employee.mobile}
            onChange={handleChange}
            required
            pattern="^[0-9]{10}$"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Update Employee</button>
      </form>
    </div>
  )
}

export default EditEmployeeManager