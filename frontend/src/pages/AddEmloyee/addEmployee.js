import { useForm} from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../AddEmloyee/AddEmployee.css"; 
import { ToastContainer, toast,Bounce } from 'react-toastify';
import { useState, useEffect } from "react";

const AddEmployee = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const navigate = useNavigate(); 
  const [dob, setDob] = useState("");
  const [calculatedYear, setCalculatedYear] = useState(null);
  const [possibleYears, setPossibleYears] = useState([]);
  const age = watch("age");

  // Function to calculate date of birth based on age
  const calculateDOB = (age) => {
    if (age && age >= 18) {
      const today = new Date();
      const birthYear = today.getFullYear() - age;
      setCalculatedYear(birthYear);
      
      // Calculate possible years (current year - age and one year before)
      setPossibleYears([birthYear - 1, birthYear]);
      
      // Set default date to January 1st of the calculated year
      const formattedDate = `${birthYear}-01-01`;
      setDob(formattedDate);
      setValue("dob", formattedDate);

      // Show possible birth years to user
      toast.info(`Based on age ${age}, possible birth years: ${birthYear - 1} or ${birthYear}`, {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  // Handle age change
  const handleAgeChange = (e) => {
    const newAge = parseInt(e.target.value);
    if (newAge) {
      if (newAge < 18) {
        toast.error('Employee must be at least 18 years old', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        calculateDOB(newAge);
      }
    }
  };

  // Validate date of birth
  const validateDOB = (date) => {
    if (!date || !calculatedYear) return true;
    const selectedYear = new Date(date).getFullYear();
    // Allow the calculated year or one year before
    const isValid = possibleYears.includes(selectedYear);
    if (!isValid) {
      toast.error(`Please select a birth year of either ${possibleYears[0]} or ${possibleYears[1]} based on the entered age`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    return isValid;
  };

  const onSubmit = (data) => {
    if (!validateDOB(data.dob)) {
      return;
    }
    axios.post("http://localhost:5000/Employee/add", data)
      .then(() => {
        toast.success('Employee added successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        reset();  
        navigate("/emplist");
      })
      .catch(error => {
        console.error("Error adding employee", error);
        toast.error('Error adding employee. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      });
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
          <input 
            type="number" 
            {...register("age", { 
              required: "Age is required", 
              min: { 
                value: 18, 
                message: "Employee must be at least 18 years old" 
              },
              onChange: handleAgeChange 
            })} 
          />
          {errors.age && <p className="error-text">{errors.age.message}</p>}
          {age >= 18 && possibleYears.length > 0 && (
            <p className="help-text">
              Based on age {age}, birth year should be {possibleYears[0]} or {possibleYears[1]}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select {...register("gender", { required: "Gender is required" })}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender.message}</p>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            {...register("role", { required: "Role is required" })}
            className="form-control"
          >
            <option value="" disabled>Select Role</option>
            <option value="Cashier">Cashier</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.role && <p className="error-text">{errors.role.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long"
              }
            })} 
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input 
            type="date" 
            {...register("dob", { 
              required: "Date of Birth is required",
              validate: validateDOB 
            })} 
            value={dob}
            className="dob-input"
            onChange={(e) => {
              const isValid = validateDOB(e.target.value);
              if (isValid) {
                setDob(e.target.value);
              }
            }}
          />
          {errors.dob && <p className="error-text">{errors.dob.message}</p>}
          {calculatedYear && (
            <p className="help-text">
              Please select a date in either {possibleYears[0]} or {possibleYears[1]}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea 
            {...register("address", { 
              required: "Address is required",
              minLength: {
                value: 10,
                message: "Please enter a complete address"
              }
            })}
          ></textarea>
          {errors.address && <p className="error-text">{errors.address.message}</p>}
        </div>

        <div className="form-group">
          <label>Mobile No</label>
          <input 
            type="tel" 
            {...register("mobile", { 
              required: "Mobile number is required", 
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit mobile number"
              }
            })} 
          />
          {errors.mobile && <p className="error-text">{errors.mobile.message}</p>}
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address"
              }
            })} 
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
       
        <button type="submit" className="submit-button">Add Employee</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddEmployee;
