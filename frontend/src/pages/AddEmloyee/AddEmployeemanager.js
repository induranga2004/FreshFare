import React from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast,Bounce } from 'react-toastify';
import { useNavigate } from "react-router-dom"; 
import "../AddEmloyee/AddEmployee.css"; 
import { useState } from "react";
const AddEmployeemanager = () => {
      const { register, handleSubmit, formState: { errors }, reset, setValue, watch  } = useForm();
      const navigate = useNavigate(); 
      const [dob, setDob] = useState("");
      const [calculatedYear, setCalculatedYear] = useState(null);
      // Watch for age changes
      const age = watch("age");
      // Function to calculate date of birth based on age
  const calculateDOB = (age) => {
    if (age && age >= 18) {
      const today = new Date();
      const birthYear = today.getFullYear() - age;
      setCalculatedYear(birthYear);
      // Set only the year, with month and day as 01-01
      const formattedDate = `${birthYear}-01-01`;
      setDob(formattedDate);
      setValue("dob", formattedDate);
    }
  };

  // Handle age change
  const handleAgeChange = (e) => {
    const newAge = parseInt(e.target.value);
    if (newAge >= 18) {
      calculateDOB(newAge);
    }
  };

  // Validate date of birth
  const validateDOB = (date) => {
    if (!date || !calculatedYear) return true;
    const selectedYear = new Date(date).getFullYear();
    // Allow the calculated year or one year before/after
    return Math.abs(selectedYear - calculatedYear) <= 1;
  };

      const onSubmit = (data) => {
        if (!validateDOB(data.dob)) {
          toast.error('Please select a valid date of birth year based on the age', {
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
          return;
        }
        axios.post("http://localhost:5000/Employee/add", data) // ✅ Correct API URL
          .then(() => {
            toast.success('New employee added successfully', {
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
            reset();  
            navigate("/emplistManager"); // ✅ Redirect to Employee List
          })
          .catch(error => console.error("Error adding employee", error));
      };
      return (
        <div className="container">
          <h2>Add Employee</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>First Name</label>
              <input 
      type="text" 
      {...register("firstName", { 
        required: "First name is required", 
        pattern: {
          value: /^[A-Za-z]+$/,
          message: "First name should contain only letters"
        }
      })} 
    />
    {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
      type="text" 
      {...register("lastName", { 
        required: "Last name is required", 
        pattern: {
          value: /^[A-Za-z]+$/,
          message: "Last name should contain only letters"
        }
      })} 
          />
          {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}  
            </div>
    
            <div className="form-group">
              <label>Age</label>
              <input type="number" {...register("age", { required: true, min: 18 })} />
              {errors.age && <p className="error-text">Valid age (18+) is required</p>}
            </div>
    
            <div className="form-group">
              <label>Gender</label>
              <select {...register("gender", { required: true })}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="error-text">Gender is required</p>}
            </div>
            <div className="form-group">
              <label>Role</label>
                <select
                      {...register("role", { required: "Role is required" })}
                        className="form-control"
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="Cashier">Cashier</option>
                  {/* Add more roles as needed */}
                </select>
                {errors.role && <p className="error-text">{errors.role.message}</p>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="text" {...register("password", { required: true })} />
              {errors.password && <p className="error-text">Password is required</p>}
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" {...register("dob", { required: true, validate: validateDOB })} value={dob}
            className="dob-input"
            onChange={(e) => {
              if (!validateDOB(e.target.value)) {
                toast.error('Please select a valid date of birth year based on the age', {
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
                return;
              }
              setDob(e.target.value);
            }}/>
              {errors.dob && <p className="error-text">Date of Birth is required</p>}
            </div>
    
            <div className="form-group">
              <label>Address</label>
              <textarea {...register("address", { required: true })}></textarea>
              {errors.address && <p className="error-text">Address is required</p>}
            </div>
    
            <div className="form-group">
              <label>Mobile No</label>
              <input type="tel" {...register("mobile", { required: true, pattern: /^[0-9]{10}$/ })} />
              {errors.mobile && <p className="error-text">Valid 10-digit mobile number is required</p>}
            </div>
    
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" {...register("email", { required: true })} />
              {errors.email && <p className="error-text">Valid email is required</p>}
            </div>
           
            <button type="submit" className="submit-button">Add Employee</button>
           
          </form>
        </div>
      );
}

export default AddEmployeemanager
