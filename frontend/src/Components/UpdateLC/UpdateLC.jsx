import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './UpdateLC.css';
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function UpdateLC() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch existing customer details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/LCs/${id}`);
        if (response.status === 200) {
          setFormData(response.data.lc); // Update state with fetched data
        }
      } catch (error) {
        toast.error("Error fetching customer details.");
        navigate("/LoyalCustomers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
      newErrors.name = 'Name must only contain letters and spaces';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'mobile') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.put(`http://localhost:5000/LCs/${id}`, formData);
      if (response.status === 200) {
        toast.success('Customer updated successfully!');
        setTimeout(() => {
          navigate("/LoyalCustomers");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading customer data...</p>
      </div>
    );
  }

  return (
    <div className="update-container">
      <div className="update-card">
        <h2>Update Customer</h2>
        <form className="update-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              disabled={submitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={submitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              className={`${errors.mobile ? 'error' : ''} disabled-input`}
              disabled={true}
              readOnly
            />
            <span className="info-message">Mobile number cannot be modified</span>
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/LoyalCustomers')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="update-btn"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Customer'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" transition={Bounce} />
    </div>
  );
}

export default UpdateLC;
