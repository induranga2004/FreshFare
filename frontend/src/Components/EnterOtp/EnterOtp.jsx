import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import Button from '../UI/Button';
import './EnterOtp.css';
import { toast } from 'react-toastify';
import { FaKey } from 'react-icons/fa';

function EnterOtp() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      setLoading(false);
      return;
    }

    axios.post("http://localhost:5000/api/auth/verifyotp", {
      email: email,
      otp: otpValue
    }).then((res) => {
      toast.success(res.data.message);
      navigate(`/password/${email}`);
    }).catch((error) => {
      setError('Invalid OTP. Please try again.');
    }).finally(() => setLoading(false));
  }

  return (
    <div className="enter-otp-container">
      <form className="enter-otp-card" onSubmit={handleSubmit} autoComplete="off">
        <div className="enter-otp-icon">
          <FaKey />
        </div>
        <h1>Enter OTP</h1>
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '1rem' }}>
          Please enter the 6-digit code sent to your email
        </p>
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          ))}
        </div>
        {error && <div className="enter-otp-error">{error}</div>}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>
    </div>
  )
}

export default EnterOtp
