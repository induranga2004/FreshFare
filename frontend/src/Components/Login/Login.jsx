import React, { useState } from 'react';
import axios from 'axios'
import {Link, useNavigate} from "react-router-dom"
import Button from '../UI/Button';
import Input from '../UI/Input';
import "./Login.css";
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        password: "",
        email:"",
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({...prevUser, [name]: value}));
    };

    const validate = () => {
        if (!user.email.match(/^\S+@\S+\.\S+$/)) {
            setError('Please enter a valid email address.');
            toast.error('Please enter a valid email address.');
            return false;
        }
        return true;
    };

    // Function to fetch user details after successful login
    const fetchUserDetails = async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            // Using the /api/auth/profile endpoint instead
            const response = await axios.get('http://localhost:5000/api/auth/profile', config);
            console.log("Employee details:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email: user.email,
                password: user.password,
            });

            console.log("Login response data:", response.data);

            if (response.data && response.data.token) {
                // Store token
                const token = response.data.token;
                localStorage.setItem("token", token);
                
                // Fetch user details
                const userDetails = await fetchUserDetails(token);
                
                if (userDetails) {
                    // Store user information
                    const userInfo = {
                        email: user.email,
                        role: response.data.role,
                        id: userDetails._id,
                        name: userDetails.employeeName || userDetails.name || userDetails.username || user.email
                    };

                    console.log("Storing user info:", userInfo);
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    
                    toast.success("Login successful");
                    
                    // Navigate based on role
                    if (response.data.role === "Cashier") {
                        navigate("/cashierdashboard");
                    } else if (response.data.role === "Owner" || response.data.role === "Manager") {
                        navigate("/owner-dashboard");
                    }
                } else {
                    // If we can't get user details, still proceed with basic info
                    const userInfo = {
                        email: user.email,
                        role: response.data.role,
                        name: user.email.split('@')[0] // Use email username as fallback
                    };
                    
                    console.log("Storing basic user info:", userInfo);
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    
                    toast.success("Login successful");
                    
                    // Navigate based on role
                    if (response.data.role === "Cashier") {
                        navigate("/cashierdashboard");
                    } else if (response.data.role === "Owner" || response.data.role === "Manager") {
                        navigate("/owner-dashboard");
                    }
                }
            } else {
                toast.error("Invalid email or password");
                setError("Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Invalid email or password");
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const navigatetoforgetpass = (e) =>{
        e.preventDefault();
        navigate("/email");
    }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
        <div className="login-logo">
          <FaUser />
        </div>
        <h1>Login</h1>
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          required
          fullWidth
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={user.password}
          onChange={handleInputChange}
          required
          fullWidth
          placeholder="Enter your password"
        />
        {error && <div className="login-error">{error}</div>}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={navigatetoforgetpass}>
          Forgot Password?
        </Button>
      </form>
    </div>
  )
}

export default Login