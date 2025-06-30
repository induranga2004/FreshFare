import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OTP.css';

function OTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Check if user data exists
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const mobile = localStorage.getItem('mobile');

    if (!name || !email || !mobile) {
      toast.error('Please complete registration first');
      navigate('/Register');
    }

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      const mobile = localStorage.getItem('mobile');

      const response = await axios.post('http://localhost:5000/LCs/verify-otp-add', {
        name,
        email,
        mobile,
        otp: otpValue
      });

      if (response.status === 200) {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/LoyalCustomers');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const mobile = localStorage.getItem('mobile');
      const response = await axios.post('http://localhost:5000/LCs/send-otp', { mobile });

      if (response.status === 200) {
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '']);
        toast.success('New OTP sent!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify OTP</h2>
        <p className="otp-instructions">
          Please enter the 4-digit OTP sent to your mobile number
        </p>

        <form className="otp-form" onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                disabled={loading}
              />
            ))}
          </div>

          <div className="timer">
            {!canResend ? (
              <span>Resend OTP in {timer}s</span>
            ) : (
              <button
                type="button"
                className="resend-btn"
                onClick={handleResend}
                disabled={loading}
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="submit"
            className="verify-btn"
            disabled={loading || otp.join('').length !== 4}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" transition={Bounce} />
    </div>
  );
}

export default OTP;
