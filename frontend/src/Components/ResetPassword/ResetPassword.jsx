import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../UI/Button';
import Input from '../UI/Input';
import "./ResetPassword.css";
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';

function ResetPassword() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password)
    };

    return Object.values(requirements).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password does not meet the requirements');
      return;
    }

    setLoading(true);
    await axios.post("http://localhost:5000/api/auth/reset-password", {
      email: email,
      newPassword: password
    }).then((res) => {
      toast.success(res.data.message)
      navigate("/")
    }).catch((error) => {
      setError('Failed to reset password. Please try again.');
    }).finally(() => setLoading(false));
  }

  return (
    <div className="reset-password-container">
      <form className="reset-password-card" onSubmit={handleSubmit} autoComplete="off">
        <div className="reset-password-icon">
          <FaLock />
        </div>
        <h1>Reset Password</h1>
        <Input
          label="Enter Your New Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          placeholder="Enter a strong password"
        />
        <div className="password-requirements">
          <h3>Password Requirements:</h3>
          <ul>
            <li>At least 8 characters long</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one lowercase letter</li>
          </ul>
        </div>
        {error && <div className="reset-password-error">{error}</div>}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword
